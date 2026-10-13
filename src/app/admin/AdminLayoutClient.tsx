'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Inbox,
  Wrench,
  Image as ImageIcon,
  Settings,
  User,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ChevronDown,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  CornerDownLeft,
  GalleryHorizontal,
} from 'lucide-react';
import { signOut } from '@/lib/authActions';

interface AdminLayoutClientProps {
  children: ReactNode;
}

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard | typeof InstagramIcon; exact?: boolean; group: string; searchable?: boolean };

const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true, group: 'Overview' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox, group: 'Overview', searchable: true },
  { label: 'Hero slider', href: '/admin/hero', icon: GalleryHorizontal, group: 'Content' },
  { label: 'Projects', href: '/admin/projects', icon: Briefcase, group: 'Content', searchable: true },
  { label: 'Blog', href: '/admin/blog', icon: FileText, group: 'Content', searchable: true },
  { label: 'Social posts', href: '/admin/social-posts', icon: InstagramIcon, group: 'Content' },
  { label: 'Services', href: '/admin/services', icon: Wrench, group: 'Content' },
  { label: 'Media library', href: '/admin/media', icon: ImageIcon, group: 'Content', searchable: true },
  { label: 'Website settings', href: '/admin/settings', icon: Settings, group: 'Account' },
  { label: 'Profile', href: '/admin/profile', icon: User, group: 'Account' },
];

function pageTitle(pathname: string): { title: string; section: string } {
  if (pathname === '/admin') return { title: 'Dashboard', section: 'Overview' };
  if (pathname.startsWith('/admin/projects/new')) return { title: 'New project', section: 'Projects' };
  if (pathname.startsWith('/admin/projects') && pathname.includes('/edit')) return { title: 'Edit project', section: 'Projects' };
  if (pathname.startsWith('/admin/blog/new')) return { title: 'New article', section: 'Blog' };
  if (pathname.startsWith('/admin/blog') && pathname.includes('/edit')) return { title: 'Edit article', section: 'Blog' };
  const hit = NAV.find((n) => !n.exact && pathname.startsWith(n.href));
  return hit ? { title: hit.label, section: hit.group } : { title: 'Admin', section: 'Veldex' };
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeHit, setActiveHit] = useState(0);
  const [email, setEmail] = useState('');
  const [newLeads, setNewLeads] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const isLogin = pathname.startsWith('/admin/login');

  // Real signed-in account + live count of new enquiries for the sidebar badge
  useEffect(() => {
    if (isLogin) return;
    let alive = true;
    fetch('/api/admin/profile', { cache: 'no-store' }).then((r) => r.json()).then((d) => alive && d?.profile && setEmail(d.profile.email)).catch(() => {});
    fetch('/api/admin/dashboard', { cache: 'no-store' }).then((r) => r.json()).then((d) => alive && setNewLeads(d?.stats?.newEnquiriesCount ?? 0)).catch(() => {});
    return () => { alive = false; };
  }, [isLogin, pathname]);

  // Close overlays on navigation
  useEffect(() => { setMobileMenuOpen(false); setProfileOpen(false); }, [pathname]);

  // Keyboard: "/" or Ctrl/Cmd+K focuses search; Escape closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setMobileMenuOpen(false); setProfileOpen(false); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => { if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [profileOpen]);

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

  // Search suggestions: jump to a page, or search inside a section
  const hits = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const lc = q.toLowerCase();
    const pages = NAV.filter((n) => n.label.toLowerCase().includes(lc)).map((n) => ({ key: `go-${n.href}`, label: <>Go to <b>{n.label}</b></>, href: n.href }));
    const inside = NAV.filter((n) => n.searchable).map((n) => ({ key: `q-${n.href}`, label: <>Search <b>{n.label.toLowerCase()}</b> for “{q}”</>, href: `${n.href}?q=${encodeURIComponent(q)}` }));
    return [...pages, ...inside].slice(0, 7);
  }, [query]);

  const go = (href: string) => { router.push(href); setQuery(''); setSearchFocus(false); searchRef.current?.blur(); };

  if (isLogin) {
    return <div className="admin-root min-h-screen antialiased">{children}</div>;
  }

  const { title, section } = pageTitle(pathname);
  const initials = (email || 'admin').slice(0, 2).toUpperCase();

  const navList = (onNavigate?: () => void, isCollapsed = false) => {
    let lastGroup = '';
    return NAV.map((item) => {
      const Icon = item.icon;
      const showGroup = item.group !== lastGroup;
      lastGroup = item.group;
      const count = item.href === '/admin/enquiries' && newLeads > 0 ? newLeads : 0;
      return (
        <div key={item.href}>
          {showGroup && !isCollapsed && <div className="adm-nav-label">{item.group}</div>}
          {showGroup && isCollapsed && item.group !== 'Overview' && <div style={{ height: 1, background: 'var(--adm-ink-line)', margin: '10px 8px' }} />}
          <Link
            href={item.href}
            onClick={onNavigate}
            className="adm-nav-link"
            aria-current={isActive(item) ? 'page' : undefined}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon size={18} />
            <span className="adm-hide-collapsed">{item.label}</span>
            {count > 0 && <span className="adm-nav-count" aria-label={`${count} new`}>{count}</span>}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="admin-root adm-shell antialiased">
      {/* ── Sidebar (desktop) ── */}
      <aside className={`adm-sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-label="Admin navigation">
        <Link href="/admin" className="adm-brand" aria-label="Veldex admin dashboard">
          <img src="/images/logo-128.png" alt="" />
          <div className="adm-hide-collapsed">
            <div className="adm-brand-name">VELDEX</div>
            <div className="adm-brand-sub">Admin console</div>
          </div>
        </Link>
        <nav className="adm-nav">{navList(undefined, collapsed)}</nav>
        <div className="adm-sidebar-foot">
          <Link href="/" target="_blank" className="adm-nav-link" title={collapsed ? 'View live website' : undefined}>
            <ExternalLink size={17} />
            <span className="adm-hide-collapsed">View live website</span>
          </Link>
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="adm-nav-link" style={{ width: '100%' }} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
            <span className="adm-hide-collapsed">Collapse</span>
          </button>
        </div>
      </aside>

      {/* ── Drawer (mobile / tablet) ── */}
      {mobileMenuOpen && (
        <>
          <div className="adm-drawer-back" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div className="adm-drawer" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <div className="adm-brand" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/images/logo-128.png" alt="" />
                <div>
                  <div className="adm-brand-name">VELDEX</div>
                  <div className="adm-brand-sub">Admin console</div>
                </div>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="adm-iconbtn" style={{ color: '#fff' }} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="adm-nav">{navList(() => setMobileMenuOpen(false))}</nav>
            <div className="adm-sidebar-foot">
              <Link href="/" target="_blank" className="adm-nav-link"><ExternalLink size={17} /> View live website</Link>
              <form action={signOut}>
                <button type="submit" className="adm-nav-link" style={{ width: '100%' }}><LogOut size={17} /> Sign out</button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── Main ── */}
      <div className="adm-main">
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button type="button" onClick={() => setMobileMenuOpen(true)} className="adm-iconbtn adm-only-mobile" aria-label="Open navigation" aria-expanded={mobileMenuOpen}>
              <Menu size={20} />
            </button>
            <img src="/images/logo-128.png" alt="" className="adm-only-mobile" style={{ width: 30, height: 30, borderRadius: 8 }} />
            <div style={{ minWidth: 0 }}>
              <div className="adm-crumb">{section}</div>
              <div className="adm-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <form
              className="adm-search"
              role="search"
              onSubmit={(e) => { e.preventDefault(); if (hits[activeHit]) go(hits[activeHit].href); }}
            >
              <Search size={16} />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search projects, leads, posts…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveHit(0); }}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setTimeout(() => setSearchFocus(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActiveHit((i) => Math.min(i + 1, hits.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActiveHit((i) => Math.max(i - 1, 0)); }
                }}
                aria-label="Search the admin console"
                aria-expanded={searchFocus && hits.length > 0}
                aria-controls="adm-search-menu"
              />
              {!query && <kbd>Ctrl K</kbd>}
              {searchFocus && hits.length > 0 && (
                <div className="adm-search-menu" id="adm-search-menu" role="listbox">
                  {hits.map((h, i) => (
                    <button key={h.key} type="button" role="option" aria-selected={i === activeHit} data-active={i === activeHit} onMouseDown={(e) => { e.preventDefault(); go(h.href); }}>
                      <CornerDownLeft size={14} style={{ color: 'var(--adm-muted)' }} />
                      <span>{h.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <Link href="/admin/enquiries" className="adm-iconbtn" aria-label={newLeads ? `${newLeads} new enquiries` : 'Enquiries'} title={newLeads ? `${newLeads} new enquiries` : 'No new enquiries'}>
              <Bell size={18} />
              {newLeads > 0 && <span className="adm-dot" />}
            </Link>

            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="adm-iconbtn"
                style={{ width: 'auto', padding: '0 6px', gap: 8 }}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Account menu"
              >
                <span className="adm-avatar">{initials}</span>
                <ChevronDown size={14} style={{ color: 'var(--adm-muted)' }} />
              </button>
              {profileOpen && (
                <div className="adm-menu" role="menu">
                  <div style={{ padding: '10px 10px 12px', borderBottom: '1px solid var(--adm-line-2)', marginBottom: 4 }}>
                    <div style={{ fontWeight: 650, fontSize: 13.5 }}>Administrator</div>
                    <div style={{ fontSize: 12, color: 'var(--adm-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email || '—'}</div>
                  </div>
                  <Link href="/admin/profile" role="menuitem"><User size={15} /> Profile &amp; security</Link>
                  <Link href="/admin/settings" role="menuitem"><Settings size={15} /> Website settings</Link>
                  <Link href="/" target="_blank" role="menuitem"><ExternalLink size={15} /> View live website</Link>
                  <div style={{ height: 1, background: 'var(--adm-line-2)', margin: '4px 0' }} />
                  <form action={signOut}>
                    <button type="submit" className="is-danger" role="menuitem"><LogOut size={15} /> Sign out</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="adm-content" key={pathname}>{children}</main>
      </div>
    </div>
  );
}
