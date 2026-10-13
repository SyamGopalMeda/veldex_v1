'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, Trash2, Phone, Mail, MessageCircle, X, Inbox, Save, RefreshCw, ChevronRight, CalendarDays, Globe } from 'lucide-react';
import type { AdminEnquiry } from '@/lib/adminStore';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, StatusBadge, refCode, useInitialQuery, Skeleton } from '@/components/admin/ui/adm';

type Enquiry = AdminEnquiry & { createdAt?: string | null };
const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'] as const;

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useInitialQuery();
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | (typeof STATUSES)[number]>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const fetchEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load enquiries');
      setEnquiries(data.enquiries);
      setLoadError('');
    } catch (err) {
      if (!silent) setLoadError((err as Error).message);
    } finally {
      setLoaded(true);
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load + quiet refresh every 30 s while the tab is visible
  useEffect(() => {
    fetchEnquiries();
    const t = setInterval(() => { if (document.visibilityState === 'visible') fetchEnquiries(true); }, 30000);
    return () => clearInterval(t);
  }, [fetchEnquiries]);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const services = useMemo(() => Array.from(new Set(enquiries.map((e) => e.service))).sort(), [enquiries]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: enquiries.length };
    for (const s of STATUSES) c[s] = enquiries.filter((e) => e.status === s).length;
    return c;
  }, [enquiries]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (selectedService !== 'all' && e.service !== selectedService) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      if (!q) return true;
      return [e.name, e.phone, e.email, e.service, e.message, refCode(e.id)].some((v) => v.toLowerCase().includes(q));
    });
  }, [enquiries, searchQuery, selectedService, selectedStatus]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
  };

  const handleUpdateStatus = async (id: string, status: AdminEnquiry['status']) => {
    const before = enquiries;
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await patch(id, { status });
      notify(`Marked as ${status}.`);
    } catch (err) {
      setEnquiries(before);
      notify(`Couldn't update status — ${(err as Error).message}`, 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    const before = enquiries;
    setEnquiries((list) => list.map((e) => (e.id === selected.id ? { ...e, notes } : e)));
    try {
      await patch(selected.id, { notes });
      notify('Notes saved.');
    } catch (err) {
      setEnquiries(before);
      notify(`Couldn't save notes — ${(err as Error).message}`, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(null);
    const before = enquiries;
    setEnquiries((list) => list.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed');
      notify('Enquiry deleted.', 'info');
    } catch (err) {
      setEnquiries(before);
      notify(`Couldn't delete — ${(err as Error).message}`, 'error');
    }
  };

  const open = (e: Enquiry) => { setSelectedId(e.id); setNotes(e.notes || ''); };
  const digits = (p: string) => p.replace(/[^0-9]/g, '');
  const waNumber = (p: string) => { const d = digits(p); return d.length === 10 ? `91${d}` : d; };
  const resetFilters = () => { setSearchQuery(''); setSelectedService('all'); setSelectedStatus('all'); };

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete this enquiry?"
        description="The lead and its notes are permanently removed from Firestore. This can't be undone."
        confirmLabel="Delete enquiry"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <PageHead
        eyebrow="Leads"
        title="Enquiries"
        description="Every quote and contact request submitted on the website. Open a lead to call, WhatsApp or email the customer and track its progress."
        actions={
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => fetchEnquiries()} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        }
      />

      {/* Status filter with live counts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div className="adm-seg" role="group" aria-label="Filter by status">
          {(['all', ...STATUSES] as const).map((s) => (
            <button key={s} type="button" aria-pressed={selectedStatus === s} onClick={() => setSelectedStatus(s)}>
              {s === 'all' ? 'All' : s} <span>{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 14, borderBottom: '1px solid var(--adm-line-2)' }}>
          <label style={{ position: 'relative', flex: '1 1 260px' }}>
            <span className="sr-only">Search enquiries</span>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
            <input className="adm-input" style={{ paddingLeft: 38 }} placeholder="Search name, phone, email, message or #ref…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </label>
          <select className="adm-select" style={{ flex: '0 1 220px', width: 'auto' }} value={selectedService} onChange={(e) => setSelectedService(e.target.value)} aria-label="Filter by service">
            <option value="all">All services</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {(searchQuery || selectedService !== 'all' || selectedStatus !== 'all') && (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={resetFilters}>Clear filters</button>
          )}
        </div>

        {!loaded ? (
          <div style={{ padding: 20, display: 'grid', gap: 12 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={44} />)}</div>
        ) : loadError ? (
          <Empty icon={Inbox} title="Couldn't load enquiries" action={<button className="adm-btn adm-btn-primary" onClick={() => fetchEnquiries()}>Try again</button>}>{loadError}</Empty>
        ) : enquiries.length === 0 ? (
          <Empty icon={Inbox} title="No enquiries yet">New quote and contact requests from the website will appear here automatically.</Empty>
        ) : filtered.length === 0 ? (
          <Empty icon={Search} title="No matching enquiries" action={<button className="adm-btn adm-btn-ghost" onClick={resetFilters}>Reset filters</button>}>Try a different search or filter.</Empty>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="adm-table-wrap hidden md:block">
              <table className="adm-table">
                <thead>
                  <tr><th>Customer</th><th>Service</th><th>Phone</th><th>Received</th><th>Status</th><th style={{ textAlign: 'right' }}><span className="sr-only">Actions</span></th></tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} onClick={() => open(e)} style={{ cursor: 'pointer' }}>
                      <td>
                        <button type="button" onClick={(ev) => { ev.stopPropagation(); open(e); }} style={{ textAlign: 'left', cursor: 'pointer' }}>
                          <div style={{ fontWeight: 600 }}>{e.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}><span className="adm-mono">{refCode(e.id)}</span>{e.email ? ` · ${e.email}` : ''}</div>
                        </button>
                      </td>
                      <td>{e.service}</td>
                      <td className="adm-mono" style={{ color: 'var(--adm-text-2)' }}>{e.phone || '—'}</td>
                      <td style={{ color: 'var(--adm-text-2)', whiteSpace: 'nowrap' }}>{e.date}</td>
                      <td><StatusBadge status={e.status} /></td>
                      <td style={{ textAlign: 'right' }} onClick={(ev) => ev.stopPropagation()}>
                        <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setDeleteConfirmId(e.id)} aria-label={`Delete enquiry from ${e.name}`} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <ul className="md:hidden" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filtered.map((e) => (
                <li key={e.id} style={{ borderBottom: '1px solid var(--adm-line-2)' }}>
                  <button type="button" onClick={() => open(e)} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                        <b style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</b>
                        <StatusBadge status={e.status} />
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--adm-muted)', marginTop: 4 }}>{e.service} · {e.date}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--adm-muted)', flexShrink: 0 }} />
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--adm-muted)', borderTop: '1px solid var(--adm-line-2)' }}>
              Showing {filtered.length} of {enquiries.length} enquiries
            </div>
          </>
        )}
      </div>

      {/* Lead drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 65, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="adm-drawer-back" style={{ zIndex: 0 }} onClick={() => setSelectedId(null)} aria-hidden="true" />
          <aside role="dialog" aria-modal="true" aria-labelledby="lead-title" style={{ position: 'relative', width: 'min(520px, 100vw)', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-30px 0 60px -30px rgba(0,0,0,.35)', animation: 'admPop .22s var(--adm-ease)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--adm-line-2)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div className="adm-eyebrow" style={{ marginBottom: 4 }}>Lead {refCode(selected.id)}</div>
                <h2 id="lead-title" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>{selected.name}</h2>
                <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--adm-muted)', marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><CalendarDays size={13} /> {selected.date}</span>
                  <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><Globe size={13} /> {selected.source || 'Website'}</span>
                </div>
              </div>
              <button type="button" className="adm-iconbtn" onClick={() => setSelectedId(null)} aria-label="Close lead"><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'grid', gap: 20, alignContent: 'start' }}>
              <div>
                <div className="adm-label" style={{ marginBottom: 8 }}>Status</div>
                <div className="adm-seg" role="group" aria-label="Lead status" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {STATUSES.map((s) => (
                    <button key={s} type="button" aria-pressed={selected.status === s} onClick={() => selected.status !== s && handleUpdateStatus(selected.id, s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
                <a className="adm-btn adm-btn-primary" href={selected.phone ? `tel:${selected.phone.replace(/[^0-9+]/g, '')}` : undefined} aria-disabled={!selected.phone}><Phone size={15} /> Call</a>
                <a className="adm-btn adm-btn-ghost" target="_blank" rel="noopener noreferrer" href={selected.phone ? `https://wa.me/${waNumber(selected.phone)}?text=${encodeURIComponent(`Hi ${selected.name}, thank you for contacting Veldex Fabrications about your ${selected.service} requirement.`)}` : undefined}><MessageCircle size={15} style={{ color: '#1DA851' }} /> WhatsApp</a>
                <a className="adm-btn adm-btn-ghost" href={selected.email ? `mailto:${selected.email}?subject=${encodeURIComponent(`Veldex Fabrications — your ${selected.service} enquiry`)}` : undefined}><Mail size={15} /> Email</a>
              </div>

              <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 16px', margin: 0, fontSize: 13.5, padding: 16, background: 'var(--adm-bg)', borderRadius: 12 }}>
                <dt style={{ color: 'var(--adm-muted)' }}>Service</dt><dd style={{ margin: 0, fontWeight: 600 }}>{selected.service}</dd>
                <dt style={{ color: 'var(--adm-muted)' }}>Phone</dt><dd style={{ margin: 0 }} className="adm-mono">{selected.phone || '—'}</dd>
                <dt style={{ color: 'var(--adm-muted)' }}>Email</dt><dd style={{ margin: 0, wordBreak: 'break-all' }}>{selected.email || '—'}</dd>
              </dl>

              <div>
                <div className="adm-label" style={{ marginBottom: 8 }}>Customer message</div>
                <div style={{ padding: 14, border: '1px solid var(--adm-line)', borderRadius: 12, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.message || <span style={{ color: 'var(--adm-muted)' }}>No message provided.</span>}</div>
              </div>

              <label className="adm-field">
                <span>Internal notes</span>
                <textarea className="adm-textarea" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Site visit date, measurements, quoted amount, follow-up…" />
              </label>
            </div>

            <div style={{ padding: 16, borderTop: '1px solid var(--adm-line-2)', display: 'flex', justifyContent: 'space-between', gap: 8, background: '#FBFAF7' }}>
              <button type="button" className="adm-btn adm-btn-ghost" style={{ color: 'var(--adm-bad)' }} onClick={() => setDeleteConfirmId(selected.id)}><Trash2 size={15} /> Delete</button>
              <button type="button" className="adm-btn adm-btn-primary" onClick={handleSaveNotes} disabled={notes === (selected.notes || '')}><Save size={15} /> Save notes</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
