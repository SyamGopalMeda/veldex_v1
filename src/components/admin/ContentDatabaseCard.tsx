'use client';

import { useCallback, useEffect, useState } from 'react';
import { Database, Download, RefreshCw } from 'lucide-react';
import { Card, Skeleton } from '@/components/admin/ui/adm';
import type { MigrationStatus } from '@/lib/contentMigration';

/** Shows whether all website content lives in the database, with backup + one-click copy. */
export function ContentDatabaseCard() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/migrate', { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not read the database');
      setStatus(d.status); setError('');
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const migrate = async () => {
    setBusy(true); setMsg(''); setError('');
    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Migration failed');
      const n = Object.values(d.written as Record<string, number>).reduce((a, b) => a + b, 0);
      setStatus(d.status);
      setMsg(n ? `${n} items copied to the database. The website looks exactly the same.` : 'Everything was already in the database.');
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  const parts = status ? Object.values(status.parts) : [];
  return (
    <Card
      title="Content database"
      subtitle={status?.complete ? 'All website content is stored in the database and editable here.' : 'Built-in website content that is not yet stored in the database.'}
      action={<a className="adm-btn adm-btn-ghost" href="/api/admin/backup" download><Download size={15} /> Download backup</a>}
    >
      {error && <p role="alert" style={{ margin: '0 0 12px', color: 'var(--adm-bad)', fontSize: 13.5 }}>{error}</p>}
      {!status ? (error ? null : <Skeleton h={90} />) : (
        <div style={{ display: 'grid', gap: 14 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
            {parts.map((p) => (
              <li key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--adm-line-2)', borderRadius: 10, fontSize: 13.5 }}>
                <span>{p.label}</span>
                <span className={`adm-badge ${p.missing.length ? 'is-warn' : 'is-ok'}`}>{p.inDatabase}/{p.total}</span>
              </li>
            ))}
          </ul>
          {msg && <p role="status" style={{ margin: 0, color: 'var(--adm-ok)', fontSize: 13.5 }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {!status.complete && (
              <button type="button" className="adm-btn adm-btn-signal" onClick={migrate} disabled={busy}>
                <Database size={15} /> {busy ? 'Copying…' : 'Copy content to database'}
              </button>
            )}
            <button type="button" className="adm-btn adm-btn-ghost" onClick={load} disabled={busy}><RefreshCw size={14} /> Recheck</button>
            <span className="adm-help">Copies only missing items — existing edits are never overwritten.</span>
          </div>
        </div>
      )}
    </Card>
  );
}
