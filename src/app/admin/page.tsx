'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, FileText, Inbox, Wrench, Plus, ArrowUpRight, Phone, MessageCircle, ChevronRight,
  PenSquare, ImageIcon, Settings, TrendingUp,
} from 'lucide-react';
import { PageHead, Card, Empty, StatusBadge, Skeleton, refCode } from '@/components/admin/ui/adm';
import { ContentDatabaseCard } from '@/components/admin/ContentDatabaseCard';

type Stats = {
  totalProjects: number; totalBlogPosts: number; draftBlogPosts: number; totalEnquiries: number;
  newEnquiriesCount: number; enquiriesLast30Days: number; totalServices: number; publishedServices: number;
};
type Charts = {
  enquiriesByMonth: { label: string; count: number }[];
  enquiriesByStatus: Record<string, number>;
  enquiriesByService: { label: string; count: number }[];
  projectsByCategory: Record<string, number>;
};
type Lead = { id: string; name: string; phone: string; service: string; date: string; status: string };
type ProjectRow = { id: string; slug: string; title: string; category: string; city?: string; location?: string; year?: string; mainImage?: string };
type ArticleRow = { id: string; slug: string; title: string; category: string; date: string; status?: string };

const CATEGORY_LABEL: Record<string, string> = { gates: 'Gates', staircases: 'Staircases', railings: 'Railings', pergolas: 'Pergolas', roofing: 'Roofing', elevations: 'Elevations', other: 'Other' };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [articles, setArticles] = useState<ArticleRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetch('/api/admin/dashboard', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d.success) throw new Error(d.error || 'Could not load dashboard');
        setStats(d.stats); setCharts(d.charts); setLeads(d.recentEnquiries || []);
      })
      .catch((e) => alive && setError(e.message));
    fetch('/api/admin/projects', { cache: 'no-store' }).then((r) => r.json()).then((d) => alive && setProjects((d.projects || []).slice(0, 4))).catch(() => alive && setProjects([]));
    fetch('/api/admin/blog', { cache: 'no-store' }).then((r) => r.json()).then((d) => alive && setArticles((d.articles || []).slice(0, 4))).catch(() => alive && setArticles([]));
    return () => { alive = false; };
  }, []);

  const maxMonth = useMemo(() => Math.max(1, ...(charts?.enquiriesByMonth.map((m) => m.count) ?? [1])), [charts]);
  const maxService = useMemo(() => Math.max(1, ...(charts?.enquiriesByService.map((m) => m.count) ?? [1])), [charts]);
  const categories = useMemo(() => Object.entries(charts?.projectsByCategory ?? {}).sort((a, b) => b[1] - a[1]), [charts]);
  const totalCat = categories.reduce((a, [, n]) => a + n, 0) || 1;
  const waNumber = (p: string) => { const d = p.replace(/[^0-9]/g, ''); return d.length === 10 ? `91${d}` : d; };

  const tiles = [
    { label: 'New enquiries', value: stats?.newEnquiriesCount, foot: <><b>{stats?.enquiriesLast30Days ?? 0}</b> in the last 30 days</>, href: '/admin/enquiries', icon: Inbox, accent: true },
    { label: 'Projects', value: stats?.totalProjects, foot: 'In the portfolio', href: '/admin/projects', icon: Briefcase },
    { label: 'Articles', value: stats?.totalBlogPosts, foot: stats?.draftBlogPosts ? `${stats.draftBlogPosts} draft${stats.draftBlogPosts > 1 ? 's' : ''}` : 'All published', href: '/admin/blog', icon: FileText },
    { label: 'Services', value: stats?.totalServices, foot: `${stats?.publishedServices ?? 0} visible on the site`, href: '/admin/services', icon: Wrench },
  ];

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <PageHead
        eyebrow={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        title={`${greeting()} — here's Veldex today`}
        description="Live leads from the website, plus everything published in your portfolio and blog."
        actions={
          <>
            <Link href="/admin/blog/new" className="adm-btn adm-btn-ghost"><PenSquare size={15} /> New article</Link>
            <Link href="/admin/projects/new" className="adm-btn adm-btn-signal"><Plus size={16} /> Add project</Link>
          </>
        }
      />

      {error && <div className="adm-card" style={{ padding: 16, borderColor: '#F3C1BB', background: 'var(--adm-bad-tint)', color: 'var(--adm-bad)', fontSize: 14 }}>{error}</div>}

      {/* KPI tiles */}
      <div className="adm-stats">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.label} href={t.href} className={`adm-card adm-stat ${t.accent ? 'is-accent' : ''}`}>
              <div className="adm-stat-top">
                <span className="adm-stat-label">{t.label}</span>
                <span className="adm-stat-ico"><Icon size={18} /></span>
              </div>
              <div className="adm-stat-value">{stats ? t.value ?? 0 : <Skeleton h={32} w={64} />}</div>
              <div className="adm-stat-foot">{stats ? t.foot : <Skeleton h={12} w={120} />}<ArrowUpRight size={13} style={{ marginLeft: 'auto' }} /></div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginBottom: 24 }}><ContentDatabaseCard /></div>

      {/* Charts */}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
        <Card title="Enquiries per month" subtitle="Website leads over the last six months" action={<span className="adm-badge is-new"><TrendingUp size={12} /> {stats?.totalEnquiries ?? 0} total</span>}>
          {charts ? (
            stats?.totalEnquiries ? (
              <div className="adm-bars" role="img" aria-label={`Enquiries per month: ${charts.enquiriesByMonth.map((m) => `${m.label} ${m.count}`).join(', ')}`}>
                {charts.enquiriesByMonth.map((m, i) => (
                  <div key={m.label + i} className={`adm-bar ${i === charts.enquiriesByMonth.length - 1 ? 'is-current' : ''}`}>
                    <span className="adm-bar-val">{m.count}</span>
                    <div className="adm-bar-col" style={{ height: `${(m.count / maxMonth) * 100}%`, animationDelay: `${i * 60}ms` }} />
                    <span className="adm-bar-label">{m.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={Inbox} title="No enquiries yet">The chart fills in as quote requests arrive from the website.</Empty>
            )
          ) : <Skeleton h={180} />}
        </Card>

        <Card title="Leads by service" subtitle="What customers are asking for">
          {charts ? (
            charts.enquiriesByService.length ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {charts.enquiriesByService.map((s, i) => (
                  <div key={s.label} className="adm-hbar">
                    <span style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>{s.count}</span>
                    <div className="adm-hbar-track"><div className="adm-hbar-fill" style={{ width: `${(s.count / maxService) * 100}%`, background: i === 0 ? 'var(--adm-signal)' : undefined, animationDelay: `${i * 70}ms` }} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={Wrench} title="Nothing to chart yet">Shows which services leads mention once enquiries come in.</Empty>
            )
          ) : <Skeleton h={180} />}
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', alignItems: 'start' }}>
        {/* Recent leads */}
        <Card title="Latest enquiries" subtitle="Newest first" action={<Link href="/admin/enquiries" className="adm-link">View all <ChevronRight size={14} /></Link>} bodyClass="">
          {!stats ? (
            <div style={{ padding: 20, display: 'grid', gap: 12 }}>{[0, 1, 2].map((i) => <Skeleton key={i} h={48} />)}</div>
          ) : leads.length === 0 ? (
            <Empty icon={Inbox} title="No enquiries yet">When a visitor submits the quote or contact form, it lands here.</Empty>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {leads.map((l) => (
                <li key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--adm-line-2)' }}>
                  <span className="adm-avatar" style={{ background: 'var(--adm-bg)', color: 'var(--adm-text)' }}>{l.name.slice(0, 1).toUpperCase()}</span>
                  <Link href={`/admin/enquiries?q=${encodeURIComponent(refCode(l.id))}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)' }}>{l.service} · {l.date}</div>
                  </Link>
                  <StatusBadge status={l.status} />
                  {l.phone && (
                    <span style={{ display: 'flex', gap: 4 }}>
                      <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`tel:${l.phone.replace(/[^0-9+]/g, '')}`} aria-label={`Call ${l.name}`}><Phone size={14} /></a>
                      <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`https://wa.me/${waNumber(l.phone)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${l.name}`}><MessageCircle size={14} /></a>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Portfolio mix + shortcuts */}
        <div style={{ display: 'grid', gap: 24 }}>
          <Card title="Portfolio by category" subtitle={`${stats?.totalProjects ?? '—'} projects published`}>
            {charts ? (
              <>
                <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', background: 'var(--adm-line-2)' }} role="img" aria-label={categories.map(([c, n]) => `${CATEGORY_LABEL[c] ?? c} ${n}`).join(', ')}>
                  {categories.map(([c, n], i) => (
                    <div key={c} style={{ width: `${(n / totalCat) * 100}%`, background: i === 0 ? 'var(--adm-signal)' : `hsl(40 6% ${18 + i * 11}%)` }} />
                  ))}
                </div>
                <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '10px 16px' }}>
                  {categories.map(([c, n], i) => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: i === 0 ? 'var(--adm-signal)' : `hsl(40 6% ${18 + i * 11}%)`, flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{CATEGORY_LABEL[c] ?? c}</span>
                      <b style={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>{n}</b>
                    </li>
                  ))}
                </ul>
              </>
            ) : <Skeleton h={90} />}
          </Card>

          <Card title="Shortcuts">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
              {[
                { href: '/admin/projects/new', label: 'Add project', icon: Briefcase },
                { href: '/admin/blog/new', label: 'Write article', icon: FileText },
                { href: '/admin/media', label: 'Media library', icon: ImageIcon },
                { href: '/admin/settings', label: 'Site settings', icon: Settings },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="adm-btn adm-btn-ghost" style={{ justifyContent: 'flex-start', height: 48 }}>
                  <Icon size={16} style={{ color: 'var(--adm-signal-ink)' }} /> {label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent content */}
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', alignItems: 'start' }}>
        <Card title="Recent projects" action={<Link href="/admin/projects" className="adm-link">All projects <ChevronRight size={14} /></Link>} bodyClass="">
          {!projects ? <div style={{ padding: 20 }}><Skeleton h={120} /></div> : projects.length === 0 ? <Empty icon={Briefcase} title="No projects yet" /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {projects.map((p) => (
                <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--adm-line-2)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.mainImage || '/images/gate.jpg'} alt="" width={56} height={42} style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: 'var(--adm-bg)' }} loading="lazy" />
                  <Link href={`/admin/projects/${p.id}/edit`} style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)' }}>{p.category}{p.city ? ` · ${p.city}` : ''}</div>
                  </Link>
                  <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} on the website`}><ArrowUpRight size={14} /></a>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recent articles" action={<Link href="/admin/blog" className="adm-link">All articles <ChevronRight size={14} /></Link>} bodyClass="">
          {!articles ? <div style={{ padding: 20 }}><Skeleton h={120} /></div> : articles.length === 0 ? <Empty icon={FileText} title="No articles yet" /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {articles.map((a) => (
                <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--adm-line-2)' }}>
                  <Link href={`/admin/blog/${a.id}/edit`} style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)' }}>{a.category} · {a.date}</div>
                  </Link>
                  <StatusBadge status={a.status === 'draft' ? 'Draft' : 'Published'} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
