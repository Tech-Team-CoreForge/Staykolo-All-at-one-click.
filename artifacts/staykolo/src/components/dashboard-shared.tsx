import { type ReactNode, useState, createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { Logo } from './staykolo-ui';

/* ── Shared context for admin module toggles ── */
type ModuleState = Record<string, boolean>;
const ModuleCtx = createContext<{ modules: ModuleState; toggle: (key: string) => void }>({ modules: {}, toggle: () => {} });
export function useModules() { return useContext(ModuleCtx); }

const defaultModules: ModuleState = {
  rooms: true, water: true, electricity: true, food: true,
  'staff-attendance': true, 'visitor-log': true, furniture: true,
  wifi: true, amenities: true, notices: true, payments: true, agreements: true,
};
export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState(defaultModules);
  const toggle = (key: string) => setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  return <ModuleCtx.Provider value={{ modules, toggle }}>{children}</ModuleCtx.Provider>;
}

/* ── Loading skeleton ── */
export function DashSkeleton({ rows = 4 }: { rows?: number }) {
  return <div className="space-y-3" aria-label="Loading">{Array.from({ length: rows }).map((_, i) => <div key={i} className="sk-sheen h-4 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />)}</div>;
}

/* ── Empty state ── */
export function DashEmpty({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="sk-card p-8 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#edf1f3] text-[#526a78]">{icon}</div><h3 className="sk-display mt-4 text-[17px] font-bold text-[#18364a]">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[#6d7e88]">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

/* ── Error state ── */
export function DashError({ onRetry }: { onRetry: () => void }) {
  return <div className="sk-card p-8 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1e8] text-[#b55b25]"><X size={18} /></div><h3 className="sk-display mt-4 text-[17px] font-bold text-[#18364a]">Something went wrong</h3><p className="mt-2 text-[13px] leading-6 text-[#6d7e88]">We could not load this data. Please try again.</p><button type="button" className="sk-button sk-button-secondary mt-5" onClick={onRetry}>Try again</button></div>;
}

/* ── Status badge ── */
const badgeColors: Record<string, string> = {
  Paid: 'bg-[#e4f4f7] text-[#176d73]', Due: 'bg-[#fff8e6] text-[#8a6d1b]', Overdue: 'bg-[#fff1e8] text-[#b55b25]',
  Pending: 'bg-[#fff8e6] text-[#8a6d1b]', 'In Progress': 'bg-[#e5f3f8] text-[#0878b0]', Resolved: 'bg-[#e4f4f7] text-[#176d73]',
  Active: 'bg-[#e4f4f7] text-[#176d73]', Suspended: 'bg-[#fff1e8] text-[#b55b25]',
  Approved: 'bg-[#e4f4f7] text-[#176d73]', 'Pending Review': 'bg-[#fff8e6] text-[#8a6d1b]',
  Signed: 'bg-[#e4f4f7] text-[#176d73]', Published: 'bg-[#e4f4f7] text-[#176d73]', Draft: 'bg-[#edf1f3] text-[#506875]',
  Available: 'bg-[#e4f4f7] text-[#176d73]', Low: 'bg-[#fff8e6] text-[#8a6d1b]', Unavailable: 'bg-[#fff1e8] text-[#b55b25]',
  On: 'bg-[#e4f4f7] text-[#176d73]', Outage: 'bg-[#fff1e8] text-[#b55b25]', Online: 'bg-[#e4f4f7] text-[#176d73]', Down: 'bg-[#fff1e8] text-[#b55b25]',
  Occupied: 'bg-[#e5f3f8] text-[#0878b0]', Vacant: 'bg-[#edf1f3] text-[#506875]',
  Present: 'bg-[#e4f4f7] text-[#176d73]', Absent: 'bg-[#fff1e8] text-[#b55b25]', 'Half-day': 'bg-[#fff8e6] text-[#8a6d1b]',
  Good: 'bg-[#e4f4f7] text-[#176d73]', Damaged: 'bg-[#fff8e6] text-[#8a6d1b]', Missing: 'bg-[#fff1e8] text-[#b55b25]',
  High: 'bg-[#fff1e8] text-[#b55b25]', Medium: 'bg-[#fff8e6] text-[#8a6d1b]',
};
export function StatusBadge({ status }: { status: string }) {
  const color = badgeColors[status] ?? 'bg-[#edf1f3] text-[#506875]';
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${color}`}>{status}</span>;
}

/* ── Stat card ── */
export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return <div className="sk-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#81909a]">{label}</p><p className="sk-display mt-2 text-[26px] font-bold text-[#18364a]">{value}</p>{sub && <p className="mt-1 text-[12px] text-[#6d7e88]">{sub}</p>}</div>;
}

/* ── Data table ── */
export function DataTable({ headers, rows, emptyMessage = 'No records' }: { headers: string[]; rows: ReactNode[][]; emptyMessage?: string }) {
  if (rows.length === 0) return <p className="py-6 text-center text-[13px] text-[#81909a]">{emptyMessage}</p>;
  return <div className="overflow-x-auto"><table className="w-full text-left text-[13px]"><thead><tr className="border-b border-[#e1e8ed]">{headers.map((h) => <th key={h} className="px-3 py-3 text-[11px] font-bold uppercase tracking-[.08em] text-[#81909a]">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-b border-[#edf1f3] last:border-0">{row.map((cell, j) => <td key={j} className="px-3 py-3 text-[#355364]">{cell}</td>)}</tr>)}</tbody></table></div>;
}

/* ── Page heading ── */
export function DashHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="sk-eyebrow">{eyebrow}</p><h1 className="sk-display mt-1 text-[26px] font-bold text-[#18364a] sm:text-[32px]">{title}</h1></div>{action}</div>;
}

/* ── Mobile bottom tab bar (tenant) ── */
type TabItem = { href: string; icon: ReactNode; label: string };
export function MobileTabBar({ tabs }: { tabs: TabItem[] }) {
  const [loc] = useLocation();
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#e1e8ed] bg-white py-1.5 md:hidden" aria-label="Dashboard navigation">{tabs.map((t) => {
    const active = loc.startsWith(t.href.replace(/\/$/, ''));
    return <Link key={t.href} href={t.href} className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold ${active ? 'text-[#0878b0]' : 'text-[#81909a]'}`}>{t.icon}<span>{t.label}</span></Link>;
  })}</nav>;
}

/* ── Desktop sidebar (admin/superadmin) ── */
type SidebarItem = { href: string; icon: ReactNode; label: string; hidden?: boolean };
type SidebarGroup = { title: string; items: SidebarItem[] };
export function DashSidebar({ groups, header, footer }: { groups: SidebarGroup[]; header?: ReactNode; footer?: ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const scrollPosRef = useRef(0);

  // Save scroll position before navigation causes re-render
  const handleNavClick = useCallback((isMobile: boolean) => {
    if (navRef.current) {
      scrollPosRef.current = navRef.current.scrollTop;
    }
    if (isMobile) setOpen(false);
  }, []);

  // Restore scroll position after render (#48 fix)
  useEffect(() => {
    if (navRef.current && scrollPosRef.current > 0) {
      navRef.current.scrollTop = scrollPosRef.current;
    }
  });

  return <>
    {/* Mobile hamburger */}
    <button type="button" className="fixed left-3 top-3 z-50 rounded-md border border-[#d8e3e7] bg-white p-2 text-[#355364] shadow-sm md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={19} /> : <Menu size={19} />}</button>
    {open && <div className="fixed inset-0 z-40 bg-[#18364a]/30 md:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed left-0 top-0 z-40 flex h-[100dvh] w-[250px] flex-col border-r border-[#e1e8ed] bg-white transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[60px] items-center border-b border-[#e1e8ed] px-5"><Logo /></div>
      {header && <div className="border-b border-[#e1e8ed] px-4 py-3">{header}</div>}
      <nav ref={navRef} className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard sidebar">
        {groups.map((g) => <div key={g.title} className="mb-5"><p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#81909a]">{g.title}</p>{g.items.filter((i) => !i.hidden).map((i) => {
          const active = loc === i.href || (i.href !== '/' && loc.startsWith(i.href));
          return <Link key={i.href} href={i.href} onClick={() => handleNavClick(open)} className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors ${active ? 'bg-[#edf7fa] text-[#0878b0]' : 'text-[#506875] hover:bg-[#f5f8f9]'}`}>{i.icon}<span>{i.label}</span></Link>;
        })}</div>)}
      </nav>
      {footer && <div className="border-t border-[#e1e8ed] px-4 py-3">{footer}</div>}
    </aside>
  </>;
}

/* ── Layout wrappers ── */
export function TenantLayout({ children, tabs }: { children: ReactNode; tabs: TabItem[] }) {
  return <div className="min-h-[100dvh] bg-[#fbfcfd] pb-[70px] md:pb-0">
    {/* Desktop sidebar */}
    <div className="hidden md:block"><DashSidebar groups={[{ title: 'Menu', items: tabs.map((t) => ({ ...t })) }]} footer={<Link href="/" className="flex items-center gap-2 text-[12px] font-semibold text-[#b55b25]"><LogOut size={14} /> Sign out</Link>} /></div>
    <main className="md:ml-[250px]"><div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 md:py-8">{children}</div></main>
    <MobileTabBar tabs={tabs} />
  </div>;
}

export function AdminLayout({ children, sidebarGroups, header }: { children: ReactNode; sidebarGroups: SidebarGroup[]; header?: ReactNode }) {
  return <div className="min-h-[100dvh] bg-[#fbfcfd]">
    <DashSidebar groups={sidebarGroups} header={header} footer={<Link href="/" className="flex items-center gap-2 text-[12px] font-semibold text-[#b55b25]"><LogOut size={14} /> Sign out</Link>} />
    <main className="md:ml-[250px]"><div className="mx-auto max-w-[1200px] px-4 py-6 pt-14 sm:px-6 md:py-8 md:pt-8">{children}</div></main>
  </div>;
}

/* ── Property switcher ── */
export function PropertySwitcher({ properties, selectedId, onSelect }: { properties: { id: string; name: string }[]; selectedId: string; onSelect: (id: string) => void }) {
  return <label className="block"><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.1em] text-[#81909a]">Property</span><div className="sk-field min-h-[36px] text-[12px]"><select value={selectedId} onChange={(e) => onSelect(e.target.value)} className="text-[12px] font-semibold">{properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select><ChevronDown size={13} /></div></label>;
}

/* ── Helper for simulated async loading ── */
export function useSimulatedLoad(ms = 400) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useState(() => { setTimeout(() => setLoading(false), ms); });
  const retry = () => { setError(false); setLoading(true); setTimeout(() => setLoading(false), ms); };
  return { loading, error, setError, retry };
}
