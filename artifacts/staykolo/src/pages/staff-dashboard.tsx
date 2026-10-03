import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bed, Bell, Check, CheckCircle, ChevronRight, CircleAlert,
  Clock, DoorOpen, LogOut, MessageSquarePlus, Phone, Plus, Search, Send, Settings, ShieldCheck,
  Sparkles, Ticket, User, UserCheck, Users, Utensils, Wifi, Wrench, X, Volume2,
} from 'lucide-react';
import { DashHeading, DashSkeleton, DashEmpty, StatusBadge, StatCard, DataTable } from '@/components/dashboard-shared';
import data from '../../mock-data/dashboard.json';
import { playNotificationSound } from '@/lib/sound';

type StaffNavTab = { href: string; icon: ReactNode; label: string };

const staffTabs: StaffNavTab[] = [
  { href: '/staff/overview', icon: <UserCheck size={18} />, label: 'Overview' },
  { href: '/staff/visitors', icon: <DoorOpen size={18} />, label: 'Visitors' },
  { href: '/staff/issues', icon: <Wrench size={18} />, label: 'Issues' },
  { href: '/staff/food', icon: <Utensils size={18} />, label: 'Food' },
  { href: '/staff/tenants', icon: <Users size={18} />, label: 'Tenants' },
  { href: '/staff/changes-log', icon: <Clock size={18} />, label: 'Log' },
  { href: '/staff/settings', icon: <Settings size={18} />, label: 'Settings' },
];

function StaffShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [soundAlert, setSoundAlert] = useState<string | null>(null);

  const triggerMockNotification = () => {
    playNotificationSound();
    setSoundAlert('New maintenance issue logged by Tenant: Room 202 - Tap leaking');
    setTimeout(() => setSoundAlert(null), 5000);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f5f8f9] pb-20 md:pb-0">
      {/* Mobile-first Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#dfe9ee] bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf7fa] text-[#0878b0] font-bold text-sm">
            SK
          </span>
          <div>
            <h1 className="text-sm font-bold text-[#18364a] leading-none">Staff Portal</h1>
            <span className="text-[10px] text-[#70818b]">Orchid House · Mobile First</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerMockNotification}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf7fa] text-[#0878b0] hover:bg-[#e0eff5]"
            title="Test notification chime sound"
          >
            <Bell size={15} />
          </button>
          <Link
            href="/auth/login"
            className="flex items-center gap-1 text-[11px] font-semibold text-[#647782] hover:text-[#b55b25]"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign out</span>
          </Link>
        </div>
      </header>

      {/* Sound Notification Banner (#37) */}
      {soundAlert && (
        <div className="fixed top-16 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-[#0878b0]/30 bg-[#edf7fa] p-3 shadow-lg transition-all animate-bounce">
          <div className="flex items-start gap-2.5">
            <Volume2 className="h-5 w-5 text-[#0878b0] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-[#18364a]">Live Notification</p>
              <p className="text-[#476772] mt-0.5">{soundAlert}</p>
            </div>
            <button
              onClick={() => setSoundAlert(null)}
              className="text-[#647782] hover:text-black text-xs font-bold"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop + Tablet Sidebar + Main Content Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
        <aside className="hidden w-60 shrink-0 border-r border-[#dfe9ee] bg-white p-4 md:block">
          <div className="mb-4 px-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#81909a]">Staff Duty Menu</p>
          </div>
          <nav className="space-y-1">
            {staffTabs.map((tab) => {
              const active = location.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#edf7fa] text-[#0878b0]'
                      : 'text-[#506875] hover:bg-[#f5f8f9] hover:text-[#18364a]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile-First Bottom Navigation Bar (#11) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#dfe9ee] bg-white px-2 shadow-lg md:hidden">
        {staffTabs.slice(0, 5).map((tab) => {
          const active = location.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 text-[10px] font-bold transition-colors ${
                active ? 'text-[#0878b0]' : 'text-[#70818b] hover:text-[#18364a]'
              }`}
            >
              <div className={`p-1 rounded-md ${active ? 'bg-[#edf7fa]' : ''}`}>{tab.icon}</div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* ========== 1. STAFF OVERVIEW (FIRST - #47) ========== */
function StaffOverview() {
  const [loading, setLoading] = useState(true);
  const pendingIssues = data.issues.filter((i) => i.status !== 'Resolved');
  const staff = data.staff[0]; // Ramesh Kumar

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <StaffShell>
        <DashSkeleton rows={4} />
      </StaffShell>
    );
  }

  return (
    <StaffShell>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <DashHeading eyebrow="Staff Dashboard" title={`Welcome, ${staff.name}`} />
          <p className="text-xs text-[#6d7e88] mt-1">
            Role: <span className="font-semibold text-[#18364a]">{staff.role}</span> · Shift: Morning/Evening Duty
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4f4f7] px-3 py-1 text-xs font-bold text-[#176d73]">
            <span className="h-2 w-2 rounded-full bg-[#168aad] animate-pulse" /> On Duty
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pending Tasks" value={pendingIssues.length} sub="Maintenance issues" />
        <StatCard label="Today's Visitors" value={data.visitors.length} sub="Logged entries" />
        <StatCard label="Food Attendance" value="6 / 7" sub="Dinner confirmed" />
        <StatCard label="Duty Status" value="Active" sub="Orchid House" />
      </div>

      {/* Priority Action Items */}
      <div className="mt-6 space-y-4">
        <div className="sk-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1f3]">
            <h3 className="text-sm font-bold text-[#18364a]">High Priority Maintenance</h3>
            <Link href="/staff/issues" className="text-xs font-bold text-[#0878b0]">
              View all ({pendingIssues.length})
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {pendingIssues.slice(0, 3).map((iss) => (
              <div
                key={iss.id}
                className="flex items-center justify-between rounded-lg border border-[#edf1f3] p-3 hover:bg-[#f8fbfc]"
              >
                <div>
                  <p className="text-xs font-bold text-[#18364a]">{iss.description}</p>
                  <p className="text-[11px] text-[#70818b]">
                    {iss.raisedBy} · Category: {iss.category}
                  </p>
                </div>
                <StatusBadge status={iss.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/staff/visitors/new"
            className="sk-card flex items-center gap-3 p-4 hover:bg-[#edf7fa] transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf7fa] text-[#0878b0]">
              <DoorOpen size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18364a]">Log Visitor</p>
              <p className="text-[10px] text-[#70818b]">+ Add Entry</p>
            </div>
          </Link>
          <Link
            href="/staff/food"
            className="sk-card flex items-center gap-3 p-4 hover:bg-[#edf7fa] transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf7fa] text-[#0878b0]">
              <Utensils size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#18364a]">Daily Meals</p>
              <p className="text-[10px] text-[#70818b]">View Attendance</p>
            </div>
          </Link>
        </div>
      </div>
    </StaffShell>
  );
}

/* ========== 2. VISITOR LOG ENTRY (#12, #13) ========== */
function StaffVisitors() {
  const [visitors, setVisitors] = useState(data.visitors);
  const [adding, setAdding] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [resident, setResident] = useState('');
  const [purpose, setPurpose] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddVisitor = (e: FormEvent) => {
    e.preventDefault();
    if (!visitorName || !resident) return;
    const newEntry = {
      id: `v_${Date.now()}`,
      visitorName,
      residentVisited: resident,
      entryTime: new Date().toISOString(),
      exitTime: null,
      purpose: purpose || 'Visit',
    };
    setVisitors([newEntry, ...visitors]);
    setSuccess(true);
    setTimeout(() => {
      setAdding(false);
      setSuccess(false);
      setVisitorName('');
      setResident('');
      setPurpose('');
      setPhone('');
    }, 1200);
  };

  const markExit = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, exitTime: new Date().toISOString() } : v))
    );
  };

  return (
    <StaffShell>
      <DashHeading
        eyebrow="Operations"
        title="Visitor Log"
        action={
          <button
            type="button"
            className="sk-button sk-button-primary text-xs"
            onClick={() => setAdding(true)}
          >
            <Plus size={14} /> Add Entry
          </button>
        }
      />
      <p className="text-xs text-[#6d7e88] mt-1">
        Staff can record visitor arrivals and exits in real time. Updated entries are synced to the Admin panel.
      </p>

      {/* Visitor List */}
      <div className="mt-5 space-y-3">
        {visitors.map((v) => (
          <div key={v.id} className="sk-card p-4 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#18364a]">{v.visitorName}</span>
                <span className="rounded bg-[#edf7fa] px-1.5 py-0.5 text-[10px] font-semibold text-[#0878b0]">
                  Visiting {v.residentVisited}
                </span>
              </div>
              <p className="text-[11px] text-[#70818b] mt-1">
                Purpose: {v.purpose} · Entry:{' '}
                {new Date(v.entryTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              {v.exitTime ? (
                <span className="text-[11px] font-semibold text-[#81909a]">
                  Exited ({new Date(v.exitTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => markExit(v.id)}
                  className="rounded-lg border border-[#0878b0] px-2.5 py-1 text-[11px] font-bold text-[#0878b0] hover:bg-[#edf7fa]"
                >
                  Mark Out
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Visitor Modal Dialog */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {success ? (
              <div className="py-6 text-center">
                <CheckCircle size={32} className="mx-auto text-[#176d73]" />
                <p className="mt-3 text-sm font-bold text-[#18364a]">Visitor Entry Logged</p>
              </div>
            ) : (
              <form onSubmit={handleAddVisitor} className="space-y-4">
                <h3 className="text-base font-bold text-[#18364a]">New Visitor Entry</h3>
                <div>
                  <label className="block text-xs font-bold text-[#405966] mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#405966] mb-1">Visitor Phone (UID)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#405966] mb-1">Resident Visited</label>
                  <input
                    type="text"
                    required
                    value={resident}
                    onChange={(e) => setResident(e.target.value)}
                    placeholder="e.g. Priya Sharma (Room 201)"
                    className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#405966] mb-1">Purpose of Visit</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Delivery / Family / Friend"
                    className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="flex-1 rounded-lg border border-[#d3e0e4] p-2.5 text-xs font-bold text-[#506875]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-[#0878b0] p-2.5 text-xs font-bold text-white hover:bg-[#076899]"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </StaffShell>
  );
}

/* ========== 3. ISSUES / MAINTENANCE MANAGEMENT ========== */
function StaffIssues() {
  const [issues, setIssues] = useState(data.issues);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved') => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const filtered = filter === 'all' ? issues : issues.filter((i) => i.status === filter);

  return (
    <StaffShell>
      <DashHeading eyebrow="Maintenance" title="Tenant Issues" />
      <div className="mt-4 flex gap-2">
        {['all', 'Pending', 'In Progress', 'Resolved'].map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              filter === s ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'
            }`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All Issues' : s}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((iss) => (
          <div key={iss.id} className="sk-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded bg-[#edf7fa] px-2 py-0.5 text-[10px] font-bold text-[#0878b0]">
                  {iss.category}
                </span>
                <h4 className="mt-1 text-xs font-bold text-[#18364a]">{iss.description}</h4>
                <p className="text-[11px] text-[#70818b] mt-0.5">
                  Raised by {iss.raisedBy} · {new Date(iss.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <StatusBadge status={iss.status} />
            </div>

            {/* Quick Action Buttons for Staff */}
            <div className="mt-3 flex items-center gap-2 border-t border-[#edf1f3] pt-3">
              <span className="text-[10px] font-bold text-[#81909a]">Update:</span>
              <button
                type="button"
                onClick={() => updateStatus(iss.id, 'In Progress')}
                className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                  iss.status === 'In Progress' ? 'bg-[#0878b0] text-white' : 'bg-[#edf1f3] text-[#506875]'
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => updateStatus(iss.id, 'Resolved')}
                className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                  iss.status === 'Resolved' ? 'bg-[#176d73] text-white' : 'bg-[#edf1f3] text-[#506875]'
                }`}
              >
                Resolved ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </StaffShell>
  );
}

/* ========== 4. FOOD & ATTENDANCE (#9) ========== */
function StaffFood() {
  const f = data.food;
  const [menu, setMenu] = useState(f.todayMenu);

  return (
    <StaffShell>
      <DashHeading eyebrow="Daily Ops" title="Food & Attendance" />
      <p className="text-xs text-[#6d7e88] mt-1">
        Staff can review tenant meal attendance counts for breakfast, lunch, and dinner preparation.
      </p>

      <div className="mt-5 space-y-3">
        {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
          const m = menu[meal];
          return (
            <div key={meal} className="sk-card p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold capitalize text-[#18364a]">{meal}</h4>
                <span className="text-[11px] text-[#70818b]">{m.time}</span>
              </div>
              <p className="mt-1.5 text-xs text-[#506875]">{m.items}</p>
              <div className="mt-3 flex items-center justify-between border-t border-[#edf1f3] pt-2 text-xs">
                <span className="text-[11px] font-semibold text-[#176d73]">✓ 6 Confirmed</span>
                <span className="text-[11px] text-[#81909a]">1 Absent</span>
              </div>
            </div>
          );
        })}
      </div>
    </StaffShell>
  );
}

/* ========== 5. ASSIGNED TENANTS ========== */
function StaffTenants() {
  return (
    <StaffShell>
      <DashHeading eyebrow="Directory" title="Assigned Tenants" />
      <p className="text-xs text-[#6d7e88] mt-1">
        Tenants residing in your assigned floors at Orchid House.
      </p>
      <div className="mt-5 space-y-3">
        {data.allTenantPayments.map((t) => (
          <div key={t.tenantId} className="sk-card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#18364a]">{t.tenantName}</p>
              <p className="text-[11px] text-[#70818b]">
                Room {t.room} · Orchid House
              </p>
            </div>
            <a
              href="tel:+919800000000"
              className="flex items-center gap-1.5 rounded-lg border border-[#dfe9ee] px-3 py-1.5 text-xs font-bold text-[#0878b0] hover:bg-[#edf7fa]"
            >
              <Phone size={13} /> Call
            </a>
          </div>
        ))}
      </div>
    </StaffShell>
  );
}

/* ========== 6. CHANGES LOG (#45, #49) ========== */
function StaffChangesLog() {
  const staffLogs = [
    { id: '1', action: 'Marked visitor Ramesh OUT', timestamp: '2025-03-01T15:20:00Z' },
    { id: '2', action: 'Resolved Room 102 Light issue', timestamp: '2025-03-01T12:10:00Z' },
    { id: '3', action: 'Logged delivery visitor for Room 301', timestamp: '2025-03-01T10:45:00Z' },
    { id: '4', action: 'Checked morning water supply levels', timestamp: '2025-03-01T07:30:00Z' },
  ];

  return (
    <StaffShell>
      <DashHeading eyebrow="Audit & Activity" title="Changes Log" />
      <p className="text-xs text-[#6d7e88] mt-1">
        All duty actions recorded with universal timestamps.
      </p>
      <div className="mt-5 space-y-2">
        {staffLogs.map((l) => (
          <div key={l.id} className="sk-card p-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#18364a]">{l.action}</span>
            <span className="text-[10px] text-[#81909a]">
              {new Date(l.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </StaffShell>
  );
}

/* ========== 7. SETTINGS (LAST - #14) ========== */
function StaffSettings() {
  return (
    <StaffShell>
      <DashHeading eyebrow="Account" title="Staff Settings" />
      <div className="mt-5 sk-card p-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-[#405966]">Duty Profile</p>
          <p className="text-xs text-[#18364a] font-semibold mt-1">Ramesh Kumar</p>
          <p className="text-[11px] text-[#70818b]">UID (Phone): +91 98450 11223</p>
        </div>
        <div className="pt-3 border-t border-[#edf1f3]">
          <p className="text-xs font-bold text-[#405966]">Assigned Property</p>
          <p className="text-xs text-[#18364a] mt-0.5">Orchid House, HSR Layout</p>
        </div>
      </div>
    </StaffShell>
  );
}

/* ========== STAFF ROUTER ========== */
export function StaffDashboard() {
  return (
    <Switch>
      <Route path="/staff/overview" component={StaffOverview} />
      <Route path="/staff/visitors/new" component={StaffVisitors} />
      <Route path="/staff/visitors" component={StaffVisitors} />
      <Route path="/staff/issues" component={StaffIssues} />
      <Route path="/staff/food" component={StaffFood} />
      <Route path="/staff/tenants" component={StaffTenants} />
      <Route path="/staff/changes-log" component={StaffChangesLog} />
      <Route path="/staff/settings" component={StaffSettings} />
      <Route path="/staff" component={StaffOverview} />
      <Route>
        {() => {
          const [, setLoc] = useLocation();
          useEffect(() => {
            setLoc('/staff/overview');
          }, []);
          return null;
        }}
      </Route>
    </Switch>
  );
}
