'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, KeyRound, LogOut, Save, Eye, EyeOff, Mail, CalendarClock, BadgeCheck } from 'lucide-react';
import { signOut } from '@/lib/authActions';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Card, Skeleton } from '@/components/admin/ui/adm';

type Profile = { uid: string; email: string; displayName: string; emailVerified: boolean; createdAt: string | null; lastSignInAt: string | null; providers: string[] };

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');

function strength(p: string) {
  let s = 0;
  if (p.length >= 12) s++;
  if (p.length >= 16) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [changing, setChanging] = useState(false);
  const [pwError, setPwError] = useState('');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    fetch('/api/admin/profile', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); setProfile(d.profile); setName(d.profile.displayName || ''); })
      .catch((e) => setError(e.message || 'Could not load your profile'));
  }, []);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    try {
      const res = await fetch('/api/admin/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName: name }) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error);
      setProfile((p) => (p ? { ...p, displayName: d.displayName } : p));
      notify('Display name saved.');
    } catch (err) {
      notify(`Couldn't save — ${(err as Error).message || 'try again'}`, 'error');
    } finally {
      setSavingName(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (next !== confirm) return setPwError("The new passwords don't match.");
    if (next.length < 12) return setPwError('Use at least 12 characters.');
    setChanging(true);
    try {
      const res = await fetch('/api/admin/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: current, newPassword: next }) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not change the password');
      notify('Password changed. Please sign in with your new password.');
      setTimeout(() => { window.location.href = '/admin/login'; }, 1400);
    } catch (err) {
      setPwError((err as Error).message);
    } finally {
      setChanging(false);
    }
  };

  const s = strength(next);
  const initials = (profile?.displayName || profile?.email || 'A').slice(0, 2).toUpperCase();

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <PageHead eyebrow="Account" title="Profile & security" description="Your administrator account for the Veldex console." />

      {error && <div className="adm-card" style={{ padding: 16, marginBottom: 20, background: 'var(--adm-bad-tint)', color: 'var(--adm-bad)' }}>{error}</div>}

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <section className="adm-card" style={{ overflow: 'hidden' }}>
            <div style={{ background: 'var(--adm-ink)', padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="adm-avatar" style={{ width: 56, height: 56, fontSize: 18, borderRadius: 14 }}>{initials}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#fff', fontWeight: 650, fontSize: 17 }}>{profile ? profile.displayName || 'Administrator' : <Skeleton h={18} w={140} />}</div>
                <div style={{ color: 'var(--adm-on-ink-mute)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email}</div>
              </div>
              <span className="adm-badge is-new" style={{ marginLeft: 'auto', background: 'var(--adm-signal)', color: 'var(--adm-ink)' }}><ShieldCheck size={12} /> Admin</span>
            </div>
            <dl style={{ margin: 0, padding: 20, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 16px', fontSize: 13.5 }}>
              <dt style={{ color: 'var(--adm-muted)', display: 'flex', gap: 6, alignItems: 'center' }}><Mail size={14} /> Email</dt>
              <dd style={{ margin: 0, wordBreak: 'break-all' }}>{profile?.email ?? '—'} {profile?.emailVerified && <BadgeCheck size={14} style={{ color: 'var(--adm-ok)', verticalAlign: '-2px' }} aria-label="verified" />}</dd>
              <dt style={{ color: 'var(--adm-muted)', display: 'flex', gap: 6, alignItems: 'center' }}><CalendarClock size={14} /> Last sign-in</dt>
              <dd style={{ margin: 0 }}>{fmt(profile?.lastSignInAt ?? null)}</dd>
              <dt style={{ color: 'var(--adm-muted)', display: 'flex', gap: 6, alignItems: 'center' }}><CalendarClock size={14} /> Account created</dt>
              <dd style={{ margin: 0 }}>{fmt(profile?.createdAt ?? null)}</dd>
            </dl>
          </section>

          <Card title="Display name" subtitle="Shown in the admin console">
            <form onSubmit={saveName} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input className="adm-input" style={{ flex: '1 1 220px' }} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="e.g. Ravi — Veldex Fabrications" aria-label="Display name" />
              <button type="submit" className="adm-btn adm-btn-primary" disabled={savingName || !profile || name === (profile.displayName || '')}><Save size={15} /> {savingName ? 'Saving…' : 'Save'}</button>
            </form>
          </Card>

          <Card title="Sessions" subtitle="Signing out ends this session and revokes every other signed-in device.">
            <form action={signOut}>
              <button type="submit" className="adm-btn adm-btn-ghost" style={{ color: 'var(--adm-bad)' }}><LogOut size={15} /> Sign out everywhere</button>
            </form>
          </Card>
        </div>

        <Card title="Change password" subtitle="You'll be signed out on all devices and asked to sign in again.">
          <form onSubmit={changePassword} style={{ display: 'grid', gap: 16 }}>
            <input type="email" autoComplete="username" value={profile?.email ?? ''} readOnly hidden />
            <label className="adm-field"><span>Current password</span><input className="adm-input" type={show ? 'text' : 'password'} autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} /></label>
            <label className="adm-field">
              <span>New password</span>
              <input className="adm-input" type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={12} value={next} onChange={(e) => setNext(e.target.value)} aria-describedby="pw-strength" />
              <div id="pw-strength" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                  {[1, 2, 3, 4].map((i) => <span key={i} style={{ height: 4, borderRadius: 4, background: next && s >= i ? (s >= 3 ? 'var(--adm-ok)' : 'var(--adm-signal)') : 'var(--adm-line)' }} />)}
                </div>
                <span className="adm-help" style={{ minWidth: 64, textAlign: 'right' }}>{next ? STRENGTH[next.length < 12 ? 0 : s] : '12+ characters'}</span>
              </div>
            </label>
            <label className="adm-field"><span>Confirm new password</span><input className="adm-input" type={show ? 'text' : 'password'} autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label>
            <button type="button" onClick={() => setShow((v) => !v)} className="adm-link" style={{ justifySelf: 'start', cursor: 'pointer' }}>{show ? <EyeOff size={14} /> : <Eye size={14} />} {show ? 'Hide passwords' : 'Show passwords'}</button>
            {pwError && <div role="alert" style={{ fontSize: 13, color: 'var(--adm-bad)', background: 'var(--adm-bad-tint)', padding: '10px 12px', borderRadius: 10 }}>{pwError}</div>}
            <button type="submit" className="adm-btn adm-btn-primary" disabled={changing || !current || !next || !confirm}><KeyRound size={15} /> {changing ? 'Changing…' : 'Change password'}</button>
          </form>
        </Card>
      </div>
    </div>
  );
}
