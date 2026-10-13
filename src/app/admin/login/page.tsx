import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Sign in | Veldex Admin',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', background: 'var(--adm-bg)' }} className="lg:!grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel */}
      <aside className="hidden lg:flex" style={{ position: 'relative', overflow: 'hidden', background: 'var(--adm-ink)', color: '#fff', flexDirection: 'column', justifyContent: 'space-between', padding: 48 }}>
        <Image src="/images/hero/hero-floating-oak-staircase.jpg" alt="" fill sizes="50vw" preload style={{ objectFit: 'cover', opacity: 0.42 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,17,17,.55) 0%, rgba(18,17,17,.2) 40%, rgba(18,17,17,.92) 100%)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/images/logo-128.png" alt="" width={44} height={44} style={{ borderRadius: 11 }} />
          <div>
            <div className="adm-brand-name">VELDEX</div>
            <div className="adm-brand-sub">Fabrications</div>
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <div className="adm-eyebrow" style={{ color: 'var(--adm-signal)' }}>Admin console</div>
          <p style={{ fontSize: 34, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-.03em', margin: 0, color: '#fff' }}>Precision in every cut. Perfection in every detail.</p>
          <p style={{ marginTop: 14, color: 'var(--adm-on-ink-mute)', fontSize: 15, lineHeight: 1.6 }}>Manage leads, projects, articles and the website from one place.</p>
        </div>
      </aside>

      {/* Form */}
      <main style={{ display: 'flex', flexDirection: 'column', padding: '20px 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Link href="/" className="adm-btn adm-btn-ghost adm-btn-sm"><ArrowLeft size={14} /> Back to website</Link>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--adm-muted)' }}><ShieldCheck size={14} style={{ color: 'var(--adm-signal-ink)' }} /> Authorised staff only</span>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <img src="/images/logo-128.png" alt="Veldex Fabrications" width={52} height={52} style={{ borderRadius: 13, marginBottom: 20 }} />
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.025em', margin: 0, color: 'var(--adm-text)' }}>Sign in</h1>
            <p style={{ margin: '6px 0 28px', color: 'var(--adm-muted)', fontSize: 14.5 }}>Use your Veldex administrator account.</p>
            <AdminLoginForm />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--adm-muted)', margin: 0 }}>© {new Date().getFullYear()} Veldex Fabrications · Vijayawada</p>
      </main>
    </div>
  );
}
