'use client';

import { useActionState, useState } from 'react';
import { signIn } from '@/lib/authActions';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<{ error?: string } | null, FormData>(signIn, null);

  return (
    <form action={formAction} style={{ display: 'grid', gap: 18 }} noValidate={false}>
      {state?.error && (
        <div role="alert" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'var(--adm-bad-tint)', color: 'var(--adm-bad)', fontSize: 13.5, fontWeight: 500 }}>
          <AlertCircle size={17} style={{ flexShrink: 0 }} /> {state.error}
        </div>
      )}

      <label className="adm-field" htmlFor="email">
        <span>Email</span>
        <div style={{ position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
          <input id="email" name="email" type="email" required autoComplete="username" inputMode="email" className="adm-input" style={{ paddingLeft: 42, minHeight: 48 }} placeholder="you@veldexfabrications.com" disabled={isPending} />
        </div>
      </label>

      <label className="adm-field" htmlFor="password">
        <span>Password</span>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" className="adm-input" style={{ paddingLeft: 42, paddingRight: 48, minHeight: 48 }} placeholder="Your password" disabled={isPending} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="adm-iconbtn" style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </label>

      <button type="submit" disabled={isPending} className="adm-btn adm-btn-primary" style={{ height: 50, fontSize: 15, marginTop: 6 }}>
        {isPending ? <><Loader2 size={17} className="animate-spin" style={{ color: 'var(--adm-signal)' }} /> Signing in…</> : <>Sign in <ArrowRight size={17} style={{ color: 'var(--adm-signal)' }} /></>}
      </button>
    </form>
  );
}
