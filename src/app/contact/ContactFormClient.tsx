'use client';

import { useActionState, useState, useEffect, useRef, type FormEvent } from 'react';
import { submitEnquiry, EnquiryResult } from '@/lib/enquiryActions';
import { CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';

type Field = 'clientName' | 'email' | 'phone' | 'serviceRequested' | 'message';
type Values = Record<Field, string>;

const FIELD_ORDER: Field[] = ['clientName', 'email', 'phone', 'serviceRequested', 'message'];

/** Mirrors the server-side rules in submitEnquiry so problems show inline before sending. */
function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  const name = v.clientName.trim();
  if (!name) e.clientName = 'Please enter your name.';
  else if (name.length < 2 || name.length > 80) e.clientName = 'Please enter a valid name (2–80 characters).';

  const email = v.email.trim();
  if (!email) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) e.email = 'Please enter a valid email address.';

  let phone = v.phone.trim().replace(/[\s\-\(\)\+]/g, '');
  if (phone.startsWith('91') && phone.length === 12) phone = phone.slice(2);
  else if (phone.startsWith('0') && phone.length === 11) phone = phone.slice(1);
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.';
  else if (!/^\d{10,15}$/.test(phone)) e.phone = 'Please enter a valid 10-digit mobile number.';

  if (!v.serviceRequested) e.serviceRequested = 'Please select a service.';

  const msg = v.message.trim();
  if (!msg) e.message = 'Please tell us a little about your project.';
  else if (msg.length < 10 || msg.length > 1000) e.message = 'Message must be between 10 and 1000 characters.';
  return e;
}

export function ContactFormClient() {
  const [state, formAction, isPending] = useActionState<EnquiryResult | null, FormData>(
    submitEnquiry,
    null
  );

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceRequested, setServiceRequested] = useState('');
  const [message, setMessage] = useState('');

  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const statusRef = useRef<HTMLDivElement>(null);

  // Clear inputs ONLY on successful submission
  useEffect(() => {
    if (state?.success) {
      setClientName('');
      setEmail('');
      setPhone('');
      setServiceRequested('');
      setMessage('');
      setAttempted(false);
      setTouched({});
    }
    if (state) statusRef.current?.focus();
  }, [state]);

  const values: Values = { clientName, email, phone, serviceRequested, message };
  const errors = validate(values);
  const show = (f: Field) => ((attempted || touched[f]) ? errors[f] : undefined);
  const blur = (f: Field) => () => {
    if (values[f].trim()) setTouched((t) => ({ ...t, [f]: true }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      e.preventDefault();
      setAttempted(true);
      document.getElementById(first)?.focus();
    }
  };

  const describe = (f: Field, help?: string) =>
    [show(f) ? `${f}-error` : null, help].filter(Boolean).join(' ') || undefined;

  const errorCount = attempted ? FIELD_ORDER.filter((f) => errors[f]).length : 0;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="vx-form vx-contact-form">
      <div ref={statusRef} tabIndex={-1} className="vx-contact-status">
        {state && !state.success && (
          <div className="vx-alert is-error" role="alert">
            <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        {state && state.success && (
          <div className="vx-alert is-success vx-contact-success" role="status">
            <CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />
            <div>
              <strong>Message sent successfully!</strong>
              <p>
                Thank you for reaching out to Veldex Fabrications. Our team will review your requirements and get in touch with you shortly.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="vx-form-row cols-2">
        {/* Your Name */}
        <div className="vx-field">
          <label htmlFor="clientName" className="vx-label">Your name <b>*</b></label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            required
            autoComplete="name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onBlur={blur('clientName')}
            placeholder="Full name"
            className="vx-input"
            aria-invalid={show('clientName') ? true : undefined}
            aria-describedby={describe('clientName')}
            disabled={isPending}
          />
          {show('clientName') && <p id="clientName-error" className="vx-error">{show('clientName')}</p>}
        </div>

        {/* Your Email */}
        <div className="vx-field">
          <label htmlFor="email" className="vx-label">Your email <b>*</b></label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={blur('email')}
            placeholder="name@example.com"
            className="vx-input"
            aria-invalid={show('email') ? true : undefined}
            aria-describedby={describe('email')}
            disabled={isPending}
          />
          {show('email') && <p id="email-error" className="vx-error">{show('email')}</p>}
        </div>
      </div>

      <div className="vx-form-row cols-2">
        {/* Your Phone */}
        <div className="vx-field">
          <label htmlFor="phone" className="vx-label">Your phone <b>*</b></label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={blur('phone')}
            placeholder="e.g. 9876543210"
            className="vx-input"
            aria-invalid={show('phone') ? true : undefined}
            aria-describedby={describe('phone')}
            disabled={isPending}
          />
          {show('phone') && <p id="phone-error" className="vx-error">{show('phone')}</p>}
        </div>

        {/* Select Service */}
        <div className="vx-field">
          <label htmlFor="serviceRequested" className="vx-label">Select service <b>*</b></label>
          <select
            id="serviceRequested"
            name="serviceRequested"
            required
            value={serviceRequested}
            onChange={(e) => setServiceRequested(e.target.value)}
            className="vx-select"
            aria-invalid={show('serviceRequested') ? true : undefined}
            aria-describedby={describe('serviceRequested')}
            disabled={isPending}
          >
            <option value="" disabled>Select Service *</option>
            <option value="gate-automation">Gate Fabrication & Automation</option>
            <option value="railings">Railings & Balustrades</option>
            <option value="staircases">Custom Staircases</option>
            <option value="pergolas-gazebos">Pergolas & Gazebos</option>
            <option value="sheds-roofing">Terrace Sheds & Roofing</option>
            <option value="elevations-facades">Elevations & Metalwork</option>
            <option value="other">Other Custom Fabrication</option>
          </select>
          {show('serviceRequested') && <p id="serviceRequested-error" className="vx-error">{show('serviceRequested')}</p>}
        </div>
      </div>

      {/* Your Message */}
      <div className="vx-field">
        <div className="vx-contact-labelrow">
          <label htmlFor="message" className="vx-label">Your message <b>*</b></label>
          <span id="message-count" className="vx-contact-count" aria-live="off">{message.trim().length} / 1000</span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={blur('message')}
          placeholder="Tell us what you need — site, sizes, finish, timeline."
          className="vx-textarea"
          aria-invalid={show('message') ? true : undefined}
          aria-describedby={describe('message', 'message-help')}
          disabled={isPending}
        />
        {show('message') ? (
          <p id="message-error" className="vx-error">{show('message')}</p>
        ) : null}
        <p id="message-help" className="vx-help">Between 10 and 1000 characters.</p>
      </div>

      {/* Submit */}
      <div className="vx-contact-submit">
        <button type="submit" disabled={isPending} className="vx-btn vx-btn-ink vx-contact-btn" aria-busy={isPending || undefined}>
          {isPending ? (
            <>
              <span>Sending message…</span>
              <span className="vx-btn-ico"><Loader2 size={18} className="vx-contact-spin" aria-hidden="true" /></span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <span className="vx-btn-ico"><ArrowUpRight size={18} aria-hidden="true" /></span>
            </>
          )}
        </button>
        <p className="vx-help" aria-live="polite">
          {errorCount > 0
            ? <span className="vx-error">Please check the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`}.</span>
            : <>Fields marked <b className="vx-contact-req">*</b> are required.</>}
        </p>
      </div>
    </form>
  );
}
