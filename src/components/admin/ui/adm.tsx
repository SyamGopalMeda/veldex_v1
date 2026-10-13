'use client';

/** Small building blocks for the Veldex admin design system (styles: app/admin/admin.css). */
import { ReactNode, useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHead({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="adm-page-head">
      <div>
        {eyebrow && <div className="adm-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

export function Card({ title, subtitle, action, children, bodyClass = 'adm-card-body', style }: { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; bodyClass?: string; style?: React.CSSProperties }) {
  return (
    <section className="adm-card" style={style}>
      {(title || action) && (
        <div className="adm-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

export function Empty({ icon: Icon, title, children, action }: { icon: LucideIcon; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="adm-empty">
      <Icon size={36} />
      <b>{title}</b>
      {children && <div style={{ maxWidth: 420, margin: '0 auto' }}>{children}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

const STATUS_CLASS: Record<string, string> = {
  New: 'is-new', Contacted: 'is-info', 'In Progress': 'is-warn', Completed: 'is-ok', Closed: 'is-mute',
  published: 'is-ok', draft: 'is-mute', Published: 'is-ok', Draft: 'is-mute', Hidden: 'is-mute',
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`adm-badge ${STATUS_CLASS[status] ?? ''}`}>{status}</span>;
}

/** Short human reference for a Firestore id, e.g. "#K3F9". */
export const refCode = (id: string) => `#${id.replace(/^#/, '').slice(-4).toUpperCase()}`;

/** Reads ?q= once on mount (set by the top-bar search) without needing a Suspense boundary. */
export function useInitialQuery(): [string, (v: string) => void] {
  const [q, setQ] = useState('');
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('q');
    if (v) setQ(v);
  }, []);
  return [q, setQ];
}

export function Skeleton({ h = 16, w = '100%', style }: { h?: number; w?: number | string; style?: React.CSSProperties }) {
  return <div className="adm-skel" style={{ height: h, width: w, ...style }} />;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
