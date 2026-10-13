import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { findEnquiryRef, listEnquiries } from '@/lib/adminData';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'];

/**
 * GET /api/admin/enquiries
 * Real leads from Firestore only (newest first). `id` is the Firestore doc id.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, enquiries: await listEnquiries() });
  } catch (err: unknown) {
    console.error('[Enquiries API] Read error:', err);
    return NextResponse.json({ success: false, error: 'Could not load enquiries', enquiries: [] }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/enquiries
 * Updates status and/or notes for an existing enquiry. Never creates documents.
 */
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Enquiry ID required' }, { status: 400 });
    if (status !== undefined && !STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Unknown status' }, { status: 400 });
    }
    const ref = await findEnquiryRef(String(id));
    if (!ref) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status) updates.status = status;
    if (typeof notes === 'string') updates.notes = notes;
    await ref.set(updates, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[Enquiries API] Update error:', err);
    return NextResponse.json({ success: false, error: 'Could not update the enquiry' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/enquiries?id=
 */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const ref = await findEnquiryRef(id);
    if (!ref) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[Enquiries API] Delete error:', err);
    return NextResponse.json({ success: false, error: 'Could not delete the enquiry' }, { status: 500 });
  }
}
