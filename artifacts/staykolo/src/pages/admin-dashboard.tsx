import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bed, Bell, BellPlus, Building2, CalendarDays, Check, CheckCircle,
  ChevronDown, CircleAlert, ClipboardList, CreditCard, Droplets, FileText, Home, Lightbulb, MessageSquarePlus,
  PenLine, Plus, ScrollText, Send, Settings, ShieldCheck, Ticket, Trash2, Users, Utensils, Wifi, Wrench,
  Eye, X, UserCheck, Clock, DoorOpen, Armchair, ToggleLeft,
} from 'lucide-react';
import { AdminLayout, DashHeading, DashSkeleton, DashEmpty, DashError, StatusBadge, StatCard, DataTable, PropertySwitcher, ModuleProvider, useModules } from '@/components/dashboard-shared';
import pgsJson from '../../mock-data/pgs.json';
import data from '../../mock-data/dashboard.json';

const pgs = pgsJson as (typeof pgsJson)[number][];
const ownerProperties = [{ id: 'pg_001', name: 'Orchid House' }];

function AdminShell({ children }: { children: ReactNode }) {
  const { modules } = useModules();
  const [selectedProperty, setSelectedProperty] = useState(ownerProperties[0].id);
  const groups = [
    { title: 'Dashboard', items: [
      { href: '/admin/overview', icon: <Home size={16} />, label: 'Overview' },
      { href: '/admin/settings/modules', icon: <Settings size={16} />, label: 'Settings' },
    ]},
    { title: 'Property', items: [
      { href: '/admin/rooms', icon: <Bed size={16} />, label: 'Rooms', hidden: !modules.rooms },
      { href: '/admin/water', icon: <Droplets size={16} />, label: 'Water', hidden: !modules.water },
      { href: '/admin/electricity', icon: <Lightbulb size={16} />, label: 'Electricity', hidden: !modules.electricity },
      { href: '/admin/food', icon: <Utensils size={16} />, label: 'Food', hidden: !modules.food },
      { href: '/admin/staff-attendance', icon: <UserCheck size={16} />, label: 'Staff', hidden: !modules['staff-attendance'] },
      { href: '/admin/visitor-log', icon: <DoorOpen size={16} />, label: 'Visitors', hidden: !modules['visitor-log'] },
      { href: '/admin/furniture', icon: <Armchair size={16} />, label: 'Furniture', hidden: !modules.furniture },
      { href: '/admin/wifi', icon: <Wifi size={16} />, label: 'WiFi', hidden: !modules.wifi },
      { href: '/admin/amenities', icon: <Settings size={16} />, label: 'Amenities', hidden: !modules.amenities },
    ]},
    { title: 'Operations', items: [
      { href: '/admin/issues', icon: <Wrench size={16} />, label: 'Issues' },
      { href: '/admin/notices', icon: <Bell size={16} />, label: 'Notices', hidden: !modules.notices },
      { href: '/admin/payments', icon: <CreditCard size={16} />, label: 'Payments', hidden: !modules.payments },
      { href: '/admin/agreements', icon: <FileText size={16} />, label: 'Agreements', hidden: !modules.agreements },
    ]},
    { title: 'Support', items: [
      { href: '/admin/support-tickets', icon: <Ticket size={16} />, label: 'Support Tickets' },
      { href: '/admin/properties', icon: <Building2 size={16} />, label: 'Properties' },
    ]},
  ];
  return <AdminLayout sidebarGroups={groups} header={<PropertySwitcher properties={ownerProperties} selectedId={selectedProperty} onSelect={setSelectedProperty} />}>{children}</AdminLayout>;
}

/* ========== OVERVIEW ========== */
function AdminOverview() {
  const rooms = data.rooms;
  const totalBeds = rooms.reduce((sum, r) => sum + r.beds.length, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.beds.filter(b => b.status === 'Occupied').length, 0);
  const vacantBeds = totalBeds - occupiedBeds;
  const pendingIssues = data.issues.filter(i => i.status !== 'Resolved').length;
  const paidCount = data.allTenantPayments.filter(p => p.status === 'Paid').length;
  const totalTenants = data.allTenantPayments.length;
  const staffOnDuty = data.staff.filter(s => s.onDuty).length;
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 350); return () => clearTimeout(id); }, []);

  return <AdminShell>
    <DashHeading eyebrow="Owner dashboard" title="Overview" />
    {loading ? <div className="mt-6"><DashSkeleton rows={5} /></div> : <>
    <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
      <StatCard label="Occupancy" value={`${Math.round((occupiedBeds / totalBeds) * 100)}%`} sub={`${occupiedBeds}/${totalBeds} beds`} />
      <StatCard label="Vacant beds" value={vacantBeds} />
      <StatCard label="Pending issues" value={pendingIssues} />
      <StatCard label="Payments" value={`${paidCount}/${totalTenants}`} sub="paid this month" />
      <StatCard label="Staff on duty" value={staffOnDuty} sub={`of ${data.staff.length} total`} />
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <div className="sk-card p-5"><p className="sk-eyebrow">Recent issues</p><div className="mt-3 space-y-2">{data.issues.filter(i=>i.status!=='Resolved').slice(0,3).map(i=><Link key={i.id} href={`/admin/issues/${i.id}`} className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2 hover:bg-[#f5f8f9]"><div><p className="text-[12px] font-semibold text-[#355364]">{i.description.slice(0,50)}…</p><p className="text-[10px] text-[#81909a]">{i.raisedBy} · {i.category}</p></div><StatusBadge status={i.status} /></Link>)}</div></div>
      <div className="sk-card p-5"><p className="sk-eyebrow">Latest notices</p><div className="mt-3 space-y-2">{data.notices.slice(0,3).map(n=><div key={n.id} className="rounded-lg border border-[#edf1f3] px-3 py-2"><p className="text-[12px] font-semibold text-[#355364]">{n.title}</p><p className="text-[10px] text-[#81909a]">{new Date(n.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p></div>)}</div></div>
    </div></>}
  </AdminShell>;
}

/* ========== SETTINGS → MODULES ========== */
function AdminModules() {
  const { modules, toggle } = useModules();
  const moduleList = [
    { key: 'rooms', label: 'Rooms', desc: 'Room and bed management for the property.' },
    { key: 'water', label: 'Water', desc: 'Track and update drinking and bathing water supply status.' },
    { key: 'electricity', label: 'Electricity', desc: 'Log outages and update power status for tenants.' },
    { key: 'food', label: 'Food', desc: 'Manage daily menus and track meal attendance.' },
    { key: 'staff-attendance', label: 'Staff Attendance', desc: 'Mark daily attendance for property staff.' },
    { key: 'visitor-log', label: 'Visitor Log', desc: 'Record visitor entries and exits.' },
    { key: 'furniture', label: 'Furniture', desc: 'Track furniture inventory and repair requests.' },
    { key: 'wifi', label: 'WiFi', desc: 'Monitor network status and log connectivity issues.' },
    { key: 'amenities', label: 'Amenities', desc: 'Enable or disable amenities shown to tenants.' },
    { key: 'notices', label: 'Notices', desc: 'Post notices visible to all tenants.' },
    { key: 'payments', label: 'Payments', desc: 'View and manage tenant rent payments.' },
    { key: 'agreements', label: 'Agreements', desc: 'Manage tenant rental agreements and e-sign status.' },
  ];
  return <AdminShell>
    <DashHeading eyebrow="Settings" title="Modules" />
    <p className="mt-3 text-[13px] text-[#6d7e88]">Toggle modules on or off. Disabled modules are hidden from the sidebar and tenant-facing screens.</p>
    <div className="mt-6 space-y-2">{moduleList.map(m => <div key={m.key} className={`sk-card flex items-center justify-between p-4 ${!modules[m.key] ? 'opacity-50' : ''}`}>
      <div><p className="text-[13px] font-bold text-[#355364]">{m.label}</p><p className="text-[11px] text-[#6d7e88]">{m.desc}</p></div>
      <button type="button" className={`relative h-6 w-11 rounded-full transition-colors ${modules[m.key] ? 'bg-[#0878b0]' : 'bg-[#c7d8de]'}`} onClick={() => toggle(m.key)} aria-label={`Toggle ${m.label}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${modules[m.key] ? 'left-[22px]' : 'left-0.5'}`} /></button>
    </div>)}</div>
  </AdminShell>;
}

/* ========== ROOMS ========== */
function AdminRooms() {
  const [rooms, setRooms] = useState(data.rooms);
  const [adding, setAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  return <AdminShell>
    <DashHeading eyebrow="Property" title="Rooms" action={<button type="button" className="sk-button sk-button-primary" onClick={() => setAdding(true)}><Plus size={15} /> Add room</button>} />
    <div className="mt-6 sk-card overflow-hidden">
      <DataTable headers={['Room', 'Type', 'Floor', 'Beds', 'Tenants', 'Status', '']} rows={rooms.map(r => [
        <span className="font-semibold">{r.number}</span>,
        r.type,
        `Floor ${r.floor}`,
        <span>{r.beds.filter(b=>b.status==='Occupied').length}/{r.beds.length} occupied</span>,
        <span>{r.beds.filter(b=>b.tenant).map(b=>b.tenant).join(', ') || '—'}</span>,
        <span>{r.beds.some(b=>b.status==='Vacant') ? <StatusBadge status="Vacant" /> : <StatusBadge status="Occupied" />}</span>,
        <button type="button" className="text-[11px] font-bold text-[#0878b0]" onClick={() => setEditingRoom(r.number)}>Edit</button>,
      ])} />
    </div>
    {(adding || editingRoom) && <RoomModal room={editingRoom ? rooms.find(r=>r.number===editingRoom) : undefined} onClose={() => { setAdding(false); setEditingRoom(null); }} />}
  </AdminShell>;
}

function RoomModal({ room, onClose }: { room?: (typeof data.rooms)[number]; onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={onClose}>
    <div className="w-full max-w-[480px] rounded-[16px] bg-white p-6 shadow-lg" onClick={e=>e.stopPropagation()}>
      {saved ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">{room ? 'Room updated' : 'Room added'}</h3><button type="button" className="sk-button sk-button-primary mt-4" onClick={onClose}>Done</button></div>
      : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">{room ? `Edit ${room.number}` : 'Add room'}</h3>
        <div className="mt-4 space-y-4">
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Room number</span><input defaultValue={room?.number??''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Room type</span><select defaultValue={room?.type??''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"><option>Private room</option><option>Twin sharing</option><option>Triple sharing</option><option>Four sharing</option></select></label>
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Floor</span><input type="number" defaultValue={room?.floor??1} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
        </div>
        <div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={onClose}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setSaved(true)}>Save</button></div></>}
    </div>
  </div>;
}

/* ========== WATER (admin) ========== */
function AdminWater() {
  const [drinking, setDrinking] = useState(data.water.drinking.status);
  const [bathing, setBathing] = useState(data.water.bathing.status);
  const statuses = ['Available', 'Low', 'Unavailable'];
  return <AdminShell>
    <DashHeading eyebrow="Utilities" title="Water management" />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {[{ label: 'Drinking water', value: drinking, set: setDrinking }, { label: 'Bathing water', value: bathing, set: setBathing }].map(w => <div key={w.label} className="sk-card p-5">
        <p className="text-[13px] font-bold text-[#18364a]">{w.label}</p>
        <div className="mt-3 flex gap-2">{statuses.map(s => <button key={s} type="button" className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${w.value === s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'}`} onClick={() => w.set(s)}>{s}</button>)}</div>
      </div>)}
    </div>
    <div className="mt-6"><p className="sk-eyebrow">Supply issue log</p><div className="mt-3 space-y-2">{data.issues.filter(i=>i.category==='Water').map(i=><div key={i.id} className="sk-card p-4"><div className="flex justify-between"><span className="text-[12px] font-semibold text-[#355364]">{i.description.slice(0,60)}</span><StatusBadge status={i.status} /></div><p className="mt-1 text-[10px] text-[#81909a]">{i.raisedBy} · {new Date(i.raisedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p></div>)}</div></div>
  </AdminShell>;
}

/* ========== ELECTRICITY (admin) ========== */
function AdminElectricity() {
  const [status, setStatus] = useState(data.electricity.status);
  const [logging, setLogging] = useState(false);
  return <AdminShell>
    <DashHeading eyebrow="Utilities" title="Electricity management" />
    <div className="mt-6 sk-card p-5">
      <p className="text-[13px] font-bold text-[#18364a]">Current status</p>
      <div className="mt-3 flex gap-2">{['On', 'Outage'].map(s => <button key={s} type="button" className={`rounded-md px-4 py-2 text-[12px] font-bold ${status === s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'}`} onClick={() => setStatus(s)}>{s}</button>)}</div>
    </div>
    <button type="button" className="sk-button sk-button-secondary mt-4" onClick={() => setLogging(true)}><Plus size={15} /> Log an outage</button>
    <div className="mt-6"><p className="sk-eyebrow">Outage history</p><div className="mt-3 space-y-2">{data.electricity.outageHistory.map(o=><div key={o.id} className="sk-card p-4"><div className="flex justify-between"><span className="text-[12px] font-semibold text-[#355364]">{o.date} at {o.startTime}</span><span className="text-[11px] text-[#81909a]">{o.duration}</span></div><p className="mt-1 text-[11px] text-[#6d7e88]">{o.reason}</p></div>)}</div></div>
    {logging && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setLogging(false)}><div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-lg" onClick={e=>e.stopPropagation()}><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Log an outage</h3><div className="mt-4 space-y-3"><label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Start time</span><input type="datetime-local" className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label><label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Reason</span><input className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" placeholder="e.g. BESCOM maintenance" /></label><label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Expected resolution</span><input className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" placeholder="e.g. 2 hours" /></label></div><div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={() => setLogging(false)}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setLogging(false)}>Save</button></div></div></div>}
  </AdminShell>;
}

/* ========== FOOD (admin) ========== */
function AdminFood() {
  const f = data.food;
  const [editing, setEditing] = useState(false);
  return <AdminShell>
    <DashHeading eyebrow="Daily life" title="Food management" action={<button type="button" className="sk-button sk-button-secondary" onClick={() => setEditing(!editing)}><PenLine size={14} /> {editing ? 'Done editing' : 'Edit menu'}</button>} />
    <div className="mt-6 space-y-3">{(['breakfast','lunch','dinner'] as const).map(meal=>{
      const m = f.todayMenu[meal];
      return <div key={meal} className="sk-card p-5"><div className="flex justify-between"><h3 className="text-[14px] font-bold capitalize text-[#18364a]">{meal}</h3><span className="text-[11px] text-[#81909a]">{m.time}</span></div>{editing ? <textarea defaultValue={m.items} className="mt-2 w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] text-[#18364a]" rows={2} /> : <p className="mt-2 text-[13px] text-[#6d7e88]">{m.items}</p>}</div>;
    })}</div>
    <div className="mt-6"><p className="sk-eyebrow">Today's meal attendance</p><div className="mt-3 sk-card overflow-hidden"><DataTable headers={['Meal','Attending','Not attending']} rows={[['Breakfast','5','2'],['Lunch','4','3'],['Dinner','6','1']].map(r=>r.map(c=><span>{c}</span>))} /></div></div>
    <div className="mt-6"><p className="sk-eyebrow">Food issues</p><div className="mt-3 space-y-2">{data.issues.filter(i=>i.category==='Food').map(i=><div key={i.id} className="sk-card p-4 flex justify-between"><span className="text-[12px] text-[#355364]">{i.description.slice(0,60)}</span><StatusBadge status={i.status} /></div>)}</div></div>
  </AdminShell>;
}

/* ========== STAFF ATTENDANCE ========== */
function AdminStaff() {
  const [staff, setStaff] = useState(data.staff);
  const cycleAttendance = (id: string) => {
    const cycle: Record<string, string> = { Present: 'Absent', Absent: 'Half-day', 'Half-day': 'Present' };
    setStaff(prev => prev.map(s => s.id === id ? { ...s, attendance: cycle[s.attendance] || 'Present' } : s));
  };
  return <AdminShell>
    <DashHeading eyebrow="Operations" title="Staff attendance" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Name','Role','Attendance','On duty','Phone']} rows={staff.map(s=>[
      <span className="font-semibold">{s.name}</span>,
      s.role,
      <button type="button" onClick={() => cycleAttendance(s.id)}><StatusBadge status={s.attendance} /></button>,
      s.onDuty ? <StatusBadge status="On duty" /> : <span className="text-[11px] text-[#81909a]">Off duty</span>,
      <span className="text-[11px] text-[#81909a]">{s.phone}</span>,
    ])} /></div>
  </AdminShell>;
}

/* ========== VISITOR LOG ========== */
function AdminVisitors() {
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const filtered = data.visitors.filter(v => `${v.visitorName} ${v.residentVisited} ${v.purpose}`.toLowerCase().includes(search.toLowerCase()));
  return <AdminShell>
    <DashHeading eyebrow="Operations" title="Visitor log" action={<button type="button" className="sk-button sk-button-primary" onClick={() => { setAdding(true); setAdded(false); }}><Plus size={15} /> Add entry</button>} />
    <div className="mt-4"><label className="sk-field max-w-[340px]"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search visitors…" className="text-[13px]" /></label></div>
    <div className="mt-4 sk-card overflow-hidden"><DataTable headers={['Visitor','Resident','Entry','Exit','Purpose']} rows={filtered.map(v=>[
      <span className="font-semibold">{v.visitorName}</span>,
      v.residentVisited,
      new Date(v.entryTime).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}),
      v.exitTime ? new Date(v.exitTime).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—',
      v.purpose,
    ])} emptyMessage="No visitors match your search" /></div>
    {adding && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setAdding(false)}><div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-lg" onClick={e=>e.stopPropagation()}>
      {added ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">Entry recorded</h3><button type="button" className="sk-button sk-button-primary mt-4" onClick={() => setAdding(false)}>Done</button></div>
      : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Add visitor entry</h3><div className="mt-4 space-y-3">{[['Visitor name',''],['Resident visited',''],['Purpose','']].map(([l])=><label key={l} className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">{l}</span><input className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>)}</div><div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={() => setAdding(false)}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setAdded(true)}>Save</button></div></>}
    </div></div>}
  </AdminShell>;
}

/* ========== FURNITURE ========== */
function AdminFurniture() {
  return <AdminShell>
    <DashHeading eyebrow="Property" title="Furniture inventory" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Room','Item','Condition','Flagged','Repair status']} rows={data.furniture.map(f=>[
      <span className="font-semibold">{f.room}</span>,
      f.item,
      <StatusBadge status={f.condition} />,
      f.flagged ? <span className="text-[11px] font-bold text-[#b55b25]">Yes</span> : <span className="text-[11px] text-[#81909a]">No</span>,
      f.repairStatus ?? <span className="text-[11px] text-[#81909a]">—</span>,
    ])} /></div>
  </AdminShell>;
}

/* ========== WIFI (admin) ========== */
function AdminWifi() {
  const [wifiStatus, setWifiStatus] = useState(data.wifi.status);
  return <AdminShell>
    <DashHeading eyebrow="Utilities" title="WiFi management" />
    <div className="mt-6 sk-card p-5"><p className="text-[13px] font-bold text-[#18364a]">Network status</p><div className="mt-3 flex gap-2">{['Online','Down'].map(s=><button key={s} type="button" className={`rounded-md px-4 py-2 text-[12px] font-bold ${wifiStatus===s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'}`} onClick={() => setWifiStatus(s)}>{s}</button>)}</div></div>
    <div className="mt-6"><p className="sk-eyebrow">Speed test records</p><div className="mt-3 sk-card overflow-hidden"><DataTable headers={['Date','Download','Upload']} rows={[[data.wifi.lastSpeedTest.date, data.wifi.lastSpeedTest.download, data.wifi.lastSpeedTest.upload], ['2025-02-20','45 Mbps','20 Mbps'], ['2025-02-13','42 Mbps','19 Mbps']].map(r=>r.map(c=><span>{c}</span>))} /></div></div>
    <div className="mt-6"><p className="sk-eyebrow">Connectivity issues</p><div className="mt-3 space-y-2">{data.issues.filter(i=>i.category==='WiFi').map(i=><div key={i.id} className="sk-card p-4 flex justify-between"><span className="text-[12px] text-[#355364]">{i.description.slice(0,60)}</span><StatusBadge status={i.status} /></div>)}</div></div>
  </AdminShell>;
}

/* ========== AMENITIES (admin) ========== */
function AdminAmenities() {
  const [amenities, setAmenities] = useState(data.amenities);
  const toggleAmenity = (id: string) => setAmenities(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  return <AdminShell>
    <DashHeading eyebrow="Property" title="Amenities management" />
    <div className="mt-6 space-y-2">{amenities.map(a=><div key={a.id} className={`sk-card flex items-center justify-between p-4 ${!a.enabled ? 'opacity-50' : ''}`}>
      <div className="flex-1"><p className="text-[13px] font-bold text-[#355364]">{a.name}</p><p className="text-[11px] text-[#6d7e88]">{a.note}</p></div>
      <button type="button" className={`relative h-6 w-11 rounded-full transition-colors ${a.enabled ? 'bg-[#0878b0]' : 'bg-[#c7d8de]'}`} onClick={() => toggleAmenity(a.id)}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${a.enabled ? 'left-[22px]' : 'left-0.5'}`} /></button>
    </div>)}</div>
  </AdminShell>;
}

/* ========== ISSUES (admin) ========== */
function AdminIssues() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? data.issues : data.issues.filter(i => i.status === filter);
  return <AdminShell>
    <DashHeading eyebrow="Operations" title="Issue management" />
    <div className="mt-4 flex flex-wrap gap-2">{['all','Pending','In Progress','Resolved'].map(s=><button key={s} type="button" className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${filter===s ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'}`} onClick={() => setFilter(s)}>{s === 'all' ? 'All' : s}</button>)}</div>
    <div className="mt-4 sk-card overflow-hidden"><DataTable headers={['Category','Tenant','Description','Priority','Status','Date','']} rows={filtered.map(i=>[
      i.category,
      <span className="font-semibold">{i.raisedBy}</span>,
      <span className="max-w-[200px] truncate block">{i.description}</span>,
      <StatusBadge status={i.priority} />,
      <StatusBadge status={i.status} />,
      new Date(i.raisedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'}),
      <Link href={`/admin/issues/${i.id}`} className="text-[11px] font-bold text-[#0878b0]">View</Link>,
    ])} /></div>
  </AdminShell>;
}

function AdminIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = data.issues.find(i => i.id === id);
  if (!issue) return <AdminShell><DashEmpty icon={<CircleAlert size={18} />} title="Issue not found" description="This issue may have been removed." action={<Link href="/admin/issues" className="sk-button sk-button-secondary">Back to issues</Link>} /></AdminShell>;
  const [status, setStatus] = useState(issue.status);
  const [note, setNote] = useState('');
  return <AdminShell>
    <Link href="/admin/issues" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> All issues</Link>
    <div className="mt-4 flex items-center gap-2"><StatusBadge status={status} /><StatusBadge status={issue.priority} /></div>
    <h1 className="sk-display mt-3 text-[20px] font-bold text-[#18364a]">{issue.description}</h1>
    <p className="mt-2 text-[12px] text-[#81909a]">Raised by {issue.raisedBy} · {issue.category} · {new Date(issue.raisedDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="sk-card p-4"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Assigned staff</p><p className="mt-1 text-[13px] font-semibold text-[#355364]">{issue.assignedStaff ?? 'Not assigned'}</p>{!issue.assignedStaff && <select className="mt-2 w-full rounded-lg border border-[#d3e0e4] p-2 text-[12px]"><option>Select staff</option>{data.staff.map(s=><option key={s.id}>{s.name}</option>)}</select>}</div>
      <div className="sk-card p-4"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Update status</p><div className="mt-2 flex gap-2">{['Pending','In Progress','Resolved'].map(s=><button key={s} type="button" className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${status===s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'}`} onClick={() => setStatus(s)}>{s}</button>)}</div></div>
    </div>
    <div className="mt-5"><p className="sk-eyebrow">Internal note</p><textarea value={note} onChange={e=>setNote(e.target.value)} className="mt-2 w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]" rows={3} placeholder="Add an internal note…" /></div>
    <div className="mt-5"><p className="sk-eyebrow">Timeline</p><div className="mt-3 space-y-0">{issue.timeline.map((t,i)=><div key={i} className="relative flex gap-3 pb-5 last:pb-0"><div className="flex flex-col items-center"><div className={`h-3 w-3 rounded-full border-2 ${i===issue.timeline.length-1 ? 'border-[#0878b0] bg-[#0878b0]' : 'border-[#c7d8de] bg-white'}`} />{i<issue.timeline.length-1 && <div className="w-px flex-1 bg-[#dfe9ee]" />}</div><div className="-mt-0.5"><p className="text-[12px] font-bold text-[#355364]">{t.status}</p><p className="text-[11px] text-[#6d7e88]">{t.note}</p></div></div>)}</div></div>
  </AdminShell>;
}

/* ========== NOTICES (admin) ========== */
function AdminNotices() {
  return <AdminShell>
    <DashHeading eyebrow="Communication" title="Notices" action={<Link href="/admin/notices/new" className="sk-button sk-button-primary"><BellPlus size={15} /> New notice</Link>} />
    <div className="mt-6 space-y-2">{data.notices.map(n=><div key={n.id} className="sk-card p-4"><div className="flex justify-between"><h3 className="text-[13px] font-bold text-[#355364]">{n.title}</h3><span className="text-[11px] text-[#81909a]">{new Date(n.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span></div><p className="mt-1 text-[12px] text-[#6d7e88]">{n.body}</p></div>)}</div>
  </AdminShell>;
}

function AdminNewNotice() {
  const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [target, setTarget] = useState('all'); const [sent, setSent] = useState(false);
  if (sent) return <AdminShell><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Notice sent</h2><p className="mt-2 text-[13px] text-[#6d7e88]">All tenants have been notified.</p><Link href="/admin/notices" className="sk-button sk-button-primary mt-6">Back to notices</Link></div></AdminShell>;
  return <AdminShell>
    <Link href="/admin/notices" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> Notices</Link>
    <DashHeading eyebrow="Communication" title="Compose notice" />
    <div className="mt-6 space-y-4">
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Send to</span><select value={target} onChange={e=>setTarget(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"><option value="all">All tenants</option><option value="floor2">Floor 2 tenants</option><option value="floor3">Floor 3 tenants</option></select></label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Title</span><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" placeholder="Notice title" /></label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Body</span><textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} className="w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]" placeholder="Write the notice content…" /></label>
      <button type="button" disabled={!title||!body} className="sk-button sk-button-primary disabled:opacity-40" onClick={() => setSent(true)}><Send size={15} /> Send notice</button>
    </div>
  </AdminShell>;
}

/* ========== PAYMENTS (admin) ========== */
function AdminPayments() {
  const [payments, setPayments] = useState(data.allTenantPayments);
  const markPaid = (id: string) => setPayments(prev => prev.map(p => p.tenantId === id ? { ...p, status: 'Paid' } : p));
  return <AdminShell>
    <DashHeading eyebrow="Billing" title="Payments" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Tenant','Room','Rent','Due date','Status','Deposit','']} rows={payments.map(p=>[
      <span className="font-semibold">{p.tenantName}</span>,
      p.room,
      <span>₹{p.rentAmount.toLocaleString('en-IN')}</span>,
      p.dueDate,
      <StatusBadge status={p.status} />,
      <span>₹{p.depositOnRecord.toLocaleString('en-IN')}</span>,
      p.status !== 'Paid' ? <button type="button" className="text-[11px] font-bold text-[#0878b0]" onClick={() => markPaid(p.tenantId)}>Mark paid</button> : <span className="text-[11px] text-[#176d73]">Paid</span>,
    ])} /></div>
  </AdminShell>;
}

/* ========== AGREEMENTS ========== */
function AdminAgreements() {
  return <AdminShell>
    <DashHeading eyebrow="Billing" title="Agreements" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Tenant','Start','End','Status','Signed']} rows={data.agreements.map(a=>[
      <span className="font-semibold">{a.tenantName}</span>,
      a.startDate,
      a.endDate,
      <StatusBadge status={a.signStatus} />,
      a.signedDate ?? <span className="text-[11px] text-[#81909a]">—</span>,
    ])} /></div>
  </AdminShell>;
}

/* ========== SUPPORT TICKETS ========== */
function AdminSupportTickets() {
  return <AdminShell>
    <DashHeading eyebrow="Support" title="Support tickets" action={<Link href="/admin/support-tickets/new" className="sk-button sk-button-primary"><Ticket size={15} /> New ticket</Link>} />
    {data.supportTickets.length === 0 ? <div className="mt-6"><DashEmpty icon={<Ticket size={18} />} title="No support tickets" description="You haven't raised any tickets with Staykolo." /></div>
    : <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Subject','Status','Priority','Date']} rows={data.supportTickets.map(t=>[
      <span className="font-semibold">{t.subject}</span>,
      <StatusBadge status={t.status} />,
      <StatusBadge status={t.priority} />,
      new Date(t.raisedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'}),
    ])} /></div>}
  </AdminShell>;
}

function AdminNewSupportTicket() {
  const [subject, setSubject] = useState(''); const [desc, setDesc] = useState(''); const [sent, setSent] = useState(false);
  if (sent) return <AdminShell><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Ticket submitted</h2><p className="mt-2 text-[13px] text-[#6d7e88]">Our team will review and respond shortly.</p><Link href="/admin/support-tickets" className="sk-button sk-button-primary mt-6">Back to tickets</Link></div></AdminShell>;
  return <AdminShell>
    <Link href="/admin/support-tickets" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> Support tickets</Link>
    <DashHeading eyebrow="Support" title="New support ticket" />
    <div className="mt-6 space-y-4">
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Subject</span><input value={subject} onChange={e=>setSubject(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Description</span><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={5} className="w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]" /></label>
      <button type="button" disabled={!subject||!desc} className="sk-button sk-button-primary disabled:opacity-40" onClick={() => setSent(true)}><Send size={15} /> Submit ticket</button>
    </div>
  </AdminShell>;
}

/* ========== PROPERTIES ========== */
function AdminProperties() {
  const ownerPgs = pgs.filter(p => p.id === 'pg_001');
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  return <AdminShell>
    <DashHeading eyebrow="Management" title="My properties" action={<button type="button" className="sk-button sk-button-primary" onClick={() => { setAdding(true); setSaved(false); }}><Plus size={15} /> Add property</button>} />
    <div className="mt-6 space-y-3">{ownerPgs.map(p=><div key={p.id} className="sk-card p-5">
      <div className="flex items-start justify-between"><div><h3 className="text-[16px] font-bold text-[#18364a]">{p.name}</h3><p className="mt-1 text-[12px] text-[#6d7e88]">{p.address}</p></div><StatusBadge status="Approved" /></div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[#506875]"><span>{p.roomTypes.join(', ')}</span><span>·</span><span>{p.genderPolicy}</span><span>·</span><span>From ₹{p.startingRent.toLocaleString('en-IN')}/mo</span></div>
    </div>)}</div>
    {adding && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setAdding(false)}><div className="max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-[16px] bg-white p-6 shadow-lg" onClick={e=>e.stopPropagation()}>
      {saved ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">Property submitted for review</h3><button type="button" className="sk-button sk-button-primary mt-4" onClick={() => setAdding(false)}>Done</button></div>
      : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Add a new property</h3><div className="mt-4 space-y-3">{[['Property name','text','e.g. Sunshine Villa'],['Address','text','Full address'],['Area','text','e.g. Koramangala'],['Starting rent (₹)','number',''],['Deposit (₹)','number',''],['Gender policy','text','e.g. Women only']].map(([l,t,p])=><label key={l as string} className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">{l}</span><input type={t as string} placeholder={p as string} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>)}</div>
        <div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={() => setAdding(false)}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setSaved(true)}>Submit</button></div></>}
    </div></div>}
  </AdminShell>;
}

/* ========== ROUTER ========== */
export function AdminDashboard() {
  return <ModuleProvider><Switch>
    <Route path="/admin/overview" component={AdminOverview} />
    <Route path="/admin/settings/modules" component={AdminModules} />
    <Route path="/admin/settings" component={AdminModules} />
    <Route path="/admin/rooms/:id" component={AdminRooms} />
    <Route path="/admin/rooms" component={AdminRooms} />
    <Route path="/admin/water" component={AdminWater} />
    <Route path="/admin/electricity" component={AdminElectricity} />
    <Route path="/admin/food" component={AdminFood} />
    <Route path="/admin/staff-attendance" component={AdminStaff} />
    <Route path="/admin/staff" component={AdminStaff} />
    <Route path="/admin/visitor-log" component={AdminVisitors} />
    <Route path="/admin/furniture" component={AdminFurniture} />
    <Route path="/admin/assets" component={AdminFurniture} />
    <Route path="/admin/wifi" component={AdminWifi} />
    <Route path="/admin/amenities" component={AdminAmenities} />
    <Route path="/admin/issues/:id" component={AdminIssueDetail} />
    <Route path="/admin/issues" component={AdminIssues} />
    <Route path="/admin/notices/new" component={AdminNewNotice} />
    <Route path="/admin/notices" component={AdminNotices} />
    <Route path="/admin/payments" component={AdminPayments} />
    <Route path="/admin/agreements" component={AdminAgreements} />
    <Route path="/admin/support-tickets/new" component={AdminNewSupportTicket} />
    <Route path="/admin/support-tickets" component={AdminSupportTickets} />
    <Route path="/admin/properties" component={AdminProperties} />
    <Route path="/admin/tenants/:id" component={AdminPayments} />
    <Route path="/admin/tenants" component={AdminPayments} />
    <Route path="/admin" component={AdminOverview} />
    <Route>{() => { const [, setLoc] = useLocation(); useEffect(() => { setLoc('/admin/overview'); }, []); return null; }}</Route>
  </Switch></ModuleProvider>;
}
