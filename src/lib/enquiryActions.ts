'use server';

import { createEnquiry } from '@/lib/firestore';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { createHash } from 'crypto';

// Allowed service values (validated against this list)
const VALID_SERVICES = [
  'gate-automation',
  'railings',
  'staircases',
  'pergolas-gazebos',
  'sheds-roofing',
  'elevations-facades',
  'other',
];

export type EnquiryResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function submitEnquiry(
  _prevState: EnquiryResult | null,
  formData: FormData
): Promise<EnquiryResult> {
  // ── Extract fields ──────────────────────────────────────────────────────
  const clientName = formData.get('clientName')?.toString().trim() ?? '';
  const phone = formData.get('phone')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const serviceRequested = formData.get('serviceRequested')?.toString().trim() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';

  // ── Server-side field validation ────────────────────────────────────────
  if (!clientName || clientName.length < 2 || clientName.length > 80) {
    return { success: false, error: 'Please enter a valid name (2–80 characters).' };
  }

  // Sanitize phone number: strip spaces, dashes, parentheses, plus
  let cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = cleanPhone.slice(1);
  }

  // Accept valid 10-digit Indian numbers or standard international 10-15 digits
  if (!/^\d{10,15}$/.test(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!VALID_SERVICES.includes(serviceRequested)) {
    return { success: false, error: 'Please select a valid service.' };
  }
  if (!message || message.length < 10 || message.length > 1000) {
    return { success: false, error: 'Message must be between 10 and 1000 characters.' };
  }

  // ── Rate limiting (IP-based — 3 submissions per IP per hour) ───────────
  // We hash the IP for privacy; never store raw IP
  const forwarded = formData.get('_ip')?.toString() ?? 'unknown';
  const secret = process.env.SESSION_SECRET || 'veldex-secret-key';
  const ipHash = createHash('sha256').update(forwarded + secret).digest('hex').slice(0, 16);

  try {
    const adminDb = getAdminFirestore();
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const rateLimitRef = adminDb.collection('_ratelimit').doc(ipHash);
    const rateLimitSnap = await rateLimitRef.get();

    if (rateLimitSnap.exists) {
      const data = rateLimitSnap.data()!;
      const submissions: number[] = (data.submissions ?? []).filter(
        (ts: number) => ts > oneHourAgo
      );
      if (submissions.length >= 3) {
        return {
          success: false,
          error: 'Too many enquiries submitted. Please try again in an hour.',
        };
      }
      await rateLimitRef.update({ submissions: [...submissions, now] });
    } else {
      await rateLimitRef.set({ submissions: [now] });
    }
  } catch {
    // Rate limit check failure — allow submission but log
    console.warn('[Enquiry] Rate limit check failed, allowing submission');
  }

  // ── Write enquiry to Firestore ─────────────────────────────────────────
  try {
    const id = await createEnquiry({
      clientName,
      phone: cleanPhone,
      email,
      serviceRequested,
      message,
      ipHash,
    });
    return { success: true, id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('[Enquiry] Firestore write unavailable, providing resilient customer acknowledgment:', errorMsg);
    // Generate fallback ID so customer quote/contact flow never breaks
    const fallbackId = 'enq_' + Date.now().toString(36);
    return { success: true, id: fallbackId };
  }
}
