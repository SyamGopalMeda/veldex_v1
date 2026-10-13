'use client';

import { useActionState, useState, useEffect, useRef, type FormEvent } from 'react';
import { submitEnquiry, EnquiryResult } from '@/lib/enquiryActions';
import {
  Home,
  Building,
  UploadCloud,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
} from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'gate-automation', label: 'Gate Fabrication & Automation' },
  { value: 'railings', label: 'Railings & Balustrades' },
  { value: 'staircases', label: 'Custom Staircases' },
  { value: 'pergolas-gazebos', label: 'Pergolas & Gazebos' },
  { value: 'sheds-roofing', label: 'Terrace Sheds & Roofing' },
  { value: 'elevations-facades', label: 'Elevations & Metalwork' },
  { value: 'other', label: 'Other Custom Fabrication' },
];

type Field = 'clientName' | 'email' | 'phone' | 'serviceRequested' | 'location' | 'message';
type Values = Record<Field, string>;

/** DOM order — first invalid field receives focus on submit. */
const FIELD_ORDER: Field[] = ['clientName', 'email', 'phone', 'serviceRequested', 'location', 'message'];

/** Mirrors the server-side rules in submitEnquiry (plus the required location) so problems show inline. */
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

  if (!v.serviceRequested) e.serviceRequested = 'Please select the service you need.';
  if (!v.location.trim()) e.location = 'Please enter the project location.';

  const msg = v.message.trim();
  if (!msg) e.message = 'Please describe your project.';
  else if (msg.length < 10 || msg.length > 1000) e.message = 'Message must be between 10 and 1000 characters.';
  return e;
}

const STEPS: { n: string; title: string; sub: string; fields: Field[] }[] = [
  { n: '01', title: 'Your details', sub: 'So our estimation team can reach you.', fields: ['clientName', 'email', 'phone'] },
  { n: '02', title: 'The project', sub: 'What you need and where it will be installed.', fields: ['serviceRequested', 'location'] },
  { n: '03', title: 'Requirements', sub: 'Dimensions, design preferences and any drawings.', fields: ['message'] },
];

export function QuoteFormClient() {
  const [state, formAction, isPending] = useActionState<EnquiryResult | null, FormData>(
    submitEnquiry,
    null
  );

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceRequested, setServiceRequested] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [projectType, setProjectType] = useState<'residential' | 'commercial'>('residential');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
      setLocation('');
      setMessage('');
      setSelectedFileName(null);
      setAttempted(false);
      setTouched({});
    }
    if (state) statusRef.current?.focus();
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const values: Values = { clientName, email, phone, serviceRequested, location, message };
  const errors = validate(values);
  const show = (f: Field) => ((attempted || touched[f]) ? errors[f] : undefined);
  const blur = (f: Field) => () => {
    if (values[f].trim()) setTouched((t) => ({ ...t, [f]: true }));
  };
  const describe = (f: Field, help?: string) =>
    [show(f) ? `${f}-error` : null, help].filter(Boolean).join(' ') || undefined;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      e.preventDefault();
      setAttempted(true);
      document.getElementById(first)?.focus();
    }
  };

  const stepDone = STEPS.map((s) => s.fields.every((f) => !errors[f]));
  const doneCount = stepDone.filter(Boolean).length;
  const errorCount = attempted ? FIELD_ORDER.filter((f) => errors[f]).length : 0;
  const serviceLabel = SERVICE_OPTIONS.find((o) => o.value === serviceRequested)?.label;
  const msgLen = message.trim().length;

  const sheet: [string, string | null][] = [
    ['Client', clientName.trim() || null],
    ['Service', serviceLabel ?? null],
    ['Type', projectType === 'residential' ? 'Residential' : 'Commercial'],
    ['Location', location.trim() || null],
    ['Brief', msgLen ? `${msgLen} characters` : null],
    ['Drawing', selectedFileName],
  ];

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="vx-quote-form">
      <input type="hidden" name="projectType" value={projectType} />

      <div className="vx-quote-steps">
        <div ref={statusRef} tabIndex={-1} className="vx-quote-status">
          {state && !state.success && (
            <div className="vx-alert is-error" role="alert">
              <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
              <span>{state.error}</span>
            </div>
          )}

          {state && state.success && (
            <div className="vx-alert is-success vx-quote-success" role="status">
              <CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />
              <div>
                <strong>Quote request submitted successfully!</strong>
                <p>
                  Thank you for providing your project details. Our engineering estimation team is reviewing your specifications and will send you a customized transparent quotation shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── STEP 01 · DETAILS ─────────────────────────────────────────── */}
        <fieldset className={`vx-quote-step ${stepDone[0] ? 'is-done' : ''}`} disabled={isPending}>
          <legend className="vx-quote-sr">{STEPS[0].title}</legend>
          <StepHead step={STEPS[0]} done={stepDone[0]} />
          <div className="vx-form">
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
                placeholder="Enter your full name"
                className="vx-input"
                aria-invalid={show('clientName') ? true : undefined}
                aria-describedby={describe('clientName')}
                disabled={isPending}
              />
              {show('clientName') && <p id="clientName-error" className="vx-error">{show('clientName')}</p>}
            </div>
            <div className="vx-form-row cols-2">
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
                  placeholder="Enter your email"
                  className="vx-input"
                  aria-invalid={show('email') ? true : undefined}
                  aria-describedby={describe('email')}
                  disabled={isPending}
                />
                {show('email') && <p id="email-error" className="vx-error">{show('email')}</p>}
              </div>
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
            </div>
          </div>
        </fieldset>

        {/* ── STEP 02 · PROJECT ─────────────────────────────────────────── */}
        <fieldset className={`vx-quote-step ${stepDone[1] ? 'is-done' : ''}`} disabled={isPending}>
          <legend className="vx-quote-sr">{STEPS[1].title}</legend>
          <StepHead step={STEPS[1]} done={stepDone[1]} />
          <div className="vx-form">
            <fieldset
              className="vx-field vx-quote-group"
              aria-describedby={show('serviceRequested') ? 'serviceRequested-error' : undefined}
            >
              <legend className="vx-label">Select service <b>*</b></legend>
              <div className="vx-quote-options">
                {SERVICE_OPTIONS.map((o, i) => (
                  <label key={o.value} className="vx-quote-option">
                    <input
                      id={i === 0 ? 'serviceRequested' : undefined}
                      type="radio"
                      name="serviceRequested"
                      value={o.value}
                      required
                      checked={serviceRequested === o.value}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      aria-invalid={show('serviceRequested') ? true : undefined}
                      disabled={isPending}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {show('serviceRequested') && <p id="serviceRequested-error" className="vx-error">{show('serviceRequested')}</p>}
            </fieldset>

            <div className="vx-form-row cols-2">
              <div className="vx-field">
                <span className="vx-label" id="projectType-label">Project type <b>*</b></span>
                <div className="vx-seg vx-quote-seg" role="group" aria-labelledby="projectType-label">
                  <button
                    type="button"
                    aria-pressed={projectType === 'residential'}
                    onClick={() => setProjectType('residential')}
                  >
                    <Home size={16} aria-hidden="true" />
                    <span>Residential</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={projectType === 'commercial'}
                    onClick={() => setProjectType('commercial')}
                  >
                    <Building size={16} aria-hidden="true" />
                    <span>Commercial</span>
                  </button>
                </div>
              </div>

              <div className="vx-field">
                <label htmlFor="location" className="vx-label">Project location <b>*</b></label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onBlur={blur('location')}
                  placeholder="e.g. Vijayawada, Guntur"
                  className="vx-input"
                  aria-invalid={show('location') ? true : undefined}
                  aria-describedby={describe('location')}
                  disabled={isPending}
                />
                {show('location') && <p id="location-error" className="vx-error">{show('location')}</p>}
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── STEP 03 · REQUIREMENTS ────────────────────────────────────── */}
        <fieldset className={`vx-quote-step ${stepDone[2] ? 'is-done' : ''}`} disabled={isPending}>
          <legend className="vx-quote-sr">{STEPS[2].title}</legend>
          <StepHead step={STEPS[2]} done={stepDone[2]} />
          <div className="vx-form">
            <div className="vx-field">
              <div className="vx-quote-labelrow">
                <label htmlFor="message" className="vx-label">Project description / requirements <b>*</b></label>
                <span className="vx-quote-count">{msgLen} / 1000</span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={blur('message')}
                placeholder="Describe your project, requirements, dimensions, design preferences, etc."
                className="vx-textarea"
                aria-invalid={show('message') ? true : undefined}
                aria-describedby={describe('message', 'message-help')}
                disabled={isPending}
              />
              {show('message') && <p id="message-error" className="vx-error">{show('message')}</p>}
              <p id="message-help" className="vx-help">Between 10 and 1000 characters.</p>
            </div>

            <div className="vx-field">
              <span className="vx-label">Upload drawings / reference <em>(optional)</em></span>
              <label htmlFor="fileUpload" className={`vx-quote-drop ${selectedFileName ? 'has-file' : ''}`}>
                <input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="vx-quote-file"
                  onChange={handleFileChange}
                  disabled={isPending}
                />
                <span className="vx-box-icon" aria-hidden="true">
                  {selectedFileName ? <FileCheck size={18} /> : <UploadCloud size={18} />}
                </span>
                {selectedFileName ? (
                  <span className="vx-quote-drop-text">
                    <strong>{selectedFileName}</strong>
                    <small>Click to choose a different file</small>
                  </span>
                ) : (
                  <span className="vx-quote-drop-text">
                    <strong>Click to upload <span>or drag and drop</span></strong>
                    <small>JPG, PNG, PDF up to 10MB</small>
                  </span>
                )}
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* ── LIVE SPEC SHEET + SUBMIT ────────────────────────────────────── */}
      <aside className="vx-quote-sheet" aria-label="Project brief summary">
        <div className="vx-quote-sheet-inner">
          <div className="vx-quote-sheet-top">
            <span>Project brief</span>
            <span className="vx-quote-sheet-count">{doneCount}/3 steps</span>
          </div>
          <div className="vx-quote-meter" aria-hidden="true">
            <span style={{ transform: `scaleX(${doneCount / 3})` }} />
          </div>
          <dl className="vx-quote-sheet-list">
            {sheet.map(([k, v]) => (
              <div key={k} className="vx-quote-sheet-row">
                <dt>{k}</dt>
                <dd className={v ? undefined : 'is-empty'}>{v || (k === 'Drawing' ? 'Optional' : '—')}</dd>
              </div>
            ))}
          </dl>

          <button
            type="submit"
            disabled={isPending}
            className="vx-btn vx-btn-signal vx-quote-submit"
            aria-busy={isPending || undefined}
          >
            {isPending ? (
              <>
                <span>Transmitting specifications…</span>
                <span className="vx-btn-ico"><Loader2 size={18} className="vx-quote-spin" aria-hidden="true" /></span>
              </>
            ) : (
              <>
                <span>Submit quote request</span>
                <span className="vx-btn-ico"><ArrowUpRight size={18} aria-hidden="true" /></span>
              </>
            )}
          </button>
          <p className="vx-quote-sheet-note" aria-live="polite">
            {errorCount > 0
              ? <span className="is-error">Please check the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`}.</span>
              : <>Fields marked <b>*</b> are required.</>}
          </p>
        </div>
      </aside>
    </form>
  );
}

function StepHead({ step, done }: { step: (typeof STEPS)[number]; done: boolean }) {
  return (
    <div className="vx-quote-step-head" aria-hidden="true">
      <span className="vx-quote-step-num">{done ? <CheckCircle2 size={16} /> : step.n}</span>
      <div>
        <h3 className="vx-h3">{step.title}</h3>
        <p>{step.sub}</p>
      </div>
    </div>
  );
}
