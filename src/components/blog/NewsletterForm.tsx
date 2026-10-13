'use client';

import { useId, useState } from 'react';
import { ArrowUpRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  layout?: 'horizontal' | 'sidebar';
}

export function NewsletterForm({ layout = 'horizontal' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Structured for clean API integration
    try {
      // Simulate API verification/submission
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
    }
  };

  const isSidebar = layout === 'sidebar';

  return (
    <div className={`vx-blog-news ${isSidebar ? 'is-sidebar' : 'is-horizontal'}`}>
      <div className="vx-blog-news-copy">
        <span className="vx-kicker"><i />Newsletter</span>
        <h3 className="vx-blog-news-title">Stay updated</h3>
        <p>Subscribe to our newsletter for the latest updates and insights.</p>
      </div>

      <div className="vx-blog-news-action" aria-live="polite">
        {status === 'success' ? (
          <div className="vx-alert is-success vx-blog-news-alert" role="status">
            <CheckCircle size={18} aria-hidden="true" />
            <span>
              {isSidebar ? 'Thank you for subscribing!' : 'Thank you for subscribing! Stay tuned for updates.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="vx-blog-news-form">
            <label htmlFor={fieldId} className="vx-label">Email address</label>
            <div className="vx-blog-news-row">
              <input
                id={fieldId}
                type="email"
                name="email"
                autoComplete="email"
                placeholder={isSidebar ? 'Enter your email' : 'Enter your email address'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? errorId : undefined}
                className="vx-input vx-blog-news-input"
              />
              <button type="submit" disabled={status === 'loading'} className="vx-btn vx-btn-signal vx-blog-news-btn">
                {status === 'loading' ? (
                  <>
                    Subscribing…
                    <span className="vx-btn-ico"><Loader2 size={18} className="animate-spin" aria-hidden="true" /></span>
                  </>
                ) : (
                  <>
                    Subscribe
                    <span className="vx-btn-ico"><ArrowUpRight size={18} aria-hidden="true" /></span>
                  </>
                )}
              </button>
            </div>
            {status === 'error' && (
              <p id={errorId} className="vx-blog-news-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errorMessage}</span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
