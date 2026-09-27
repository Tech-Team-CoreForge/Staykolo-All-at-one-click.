import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bell, CalendarDays, Check, CheckCircle, ChevronRight, CircleAlert, Clock, CreditCard,
  Droplets, FileText, Home, ImagePlus, Lightbulb, MessageSquarePlus, ScrollText, Send, ShowerHead,
  Trash2, Upload, User, Utensils, Wifi, Wrench, X, Bed, WashingMachine, Tv, Dumbbell, Car, Sparkles, Shield,
} from 'lucide-react';
import { TenantLayout, DashHeading, DashSkeleton, DashEmpty, DashError, StatusBadge, StatCard, DataTable } from '@/components/dashboard-shared';
import data from '../../mock-data/dashboard.json';

const tabs = [
  { href: '/user/home', icon: <Home size={18} />, label: 'Home' },
  { href: '/user/notices', icon: <Bell size={18} />, label: 'Notices' },
  { href: '/user/payments', icon: <CreditCard size={18} />, label: 'Payments' },
  { href: '/user/issues', icon: <Wrench size={18} />, label: 'Issues' },
  { href: '/user/profile', icon: <User size={18} />, label: 'Profile' },
];

function Wrap({ children }: { children: ReactNode }) {
  return <TenantLayout tabs={tabs}>{children}</TenantLayout>;
}

function QuickLink({ href, icon, label, sub }: { href: string; icon: ReactNode; label: string; sub: string }) {
  return <Link href={href} className="sk-card flex items-center gap-3 p-4 transition-colors hover:bg-[#f5f8f9]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf7fa] text-[#0878b0]">{icon}</div><div className="min-w-0 flex-1"><p className="text-[13px] font-bold text-[#355364]">{label}</p><p className="truncate text-[11px] text-[#6d7e88]">{sub}</p></div><ChevronRight size={15} className="shrink-0 text-[#b0bec5]" /></Link>;
}

/* ========== HOME ========== */
function UserHome() {
  const t = data.tenant;
  const pendingIssues = data.issues.filter((i) => i.raisedByTenantId === t.id && i.status !== 'Resolved').length;
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 350); return () => clearTimeout(id); }, []);

  if (loading) return <Wrap><div className="space-y-4"><div className="sk-sheen h-8 w-48 rounded" /><div className="sk-sheen h-5 w-64 rounded" /><div className="grid gap-3 mt-6 grid-cols-2 sm:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="sk-sheen h-20 rounded-lg" />)}</div></div></Wrap>;

  return <Wrap>
    <div className="mb-6">
      <h1 className="sk-display text-[24px] font-bold text-[#18364a] sm:text-[28px]">Good afternoon, {t.name.split(' ')[0]}</h1>
      <p className="mt-1 text-[13px] text-[#6d7e88]">{t.propertyName} · Room {t.roomNumber} · Bed {t.bedNumber}</p>
    </div>

    {/* Quick glance row */}
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      <QuickLink href="/user/water" icon={<Droplets size={17} />} label="Water" sub={data.water.drinking.status} />
      <QuickLink href="/user/electricity" icon={<Lightbulb size={17} />} label="Power" sub={data.electricity.status} />
      <QuickLink href="/user/wifi" icon={<Wifi size={17} />} label="WiFi" sub={data.wifi.status} />
      <QuickLink href="/user/issues" icon={<Wrench size={17} />} label="Issues" sub={pendingIssues ? `${pendingIssues} pending` : 'All resolved'} />
      <QuickLink href="/user/payments" icon={<CreditCard size={17} />} label="Payment" sub={`Due ${data.payments.dueDate}`} />
    </div>

    {/* Latest notices */}
    <div className="mt-8">
      <div className="flex items-center justify-between"><p className="sk-eyebrow">Latest notices</p><Link href="/user/notices" className="text-[12px] font-bold text-[#0878b0]">View all</Link></div>
      <div className="mt-3 space-y-2">
        {data.notices.slice(0, 3).map((n) => <Link key={n.id} href="/user/notices" className="sk-card block p-4 transition-colors hover:bg-[#f5f8f9]">
          <div className="flex items-start justify-between gap-3"><h3 className="text-[13px] font-bold text-[#355364]">{n.title}</h3><span className="shrink-0 text-[10px] text-[#81909a]">{new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#6d7e88]">{n.body}</p>
        </Link>)}
      </div>
    </div>

    {/* Quick actions */}
    <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-3">
      <QuickLink href="/user/room" icon={<Bed size={17} />} label="My Room" sub={t.roomType} />
      <QuickLink href="/user/food" icon={<Utensils size={17} />} label="Food" sub="Today's menu" />
      <QuickLink href="/user/amenities" icon={<Sparkles size={17} />} label="Amenities" sub={`${data.amenities.filter(a=>a.enabled).length} available`} />
    </div>
  </Wrap>;
}

/* ========== MY ROOM ========== */
function UserRoom() {
  const t = data.tenant;
  const room = data.rooms.find((r) => r.number === t.roomNumber)!;
  return <Wrap>
    <DashHeading eyebrow="My room" title={`Room ${t.roomNumber}`} />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="sk-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Room type</p><p className="mt-2 text-[15px] font-bold text-[#18364a]">{room.type}</p><p className="mt-1 text-[12px] text-[#6d7e88]">Floor {room.floor} · {t.propertyName}</p></div>
      <div className="sk-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Your bed</p><p className="mt-2 text-[15px] font-bold text-[#18364a]">Bed {t.bedNumber}</p><p className="mt-1 text-[12px] text-[#6d7e88]">Occupied since {new Date(t.moveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
    </div>
    {t.roommates.length > 0 && <div className="mt-4 sk-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Roommates</p>
      <div className="mt-3 space-y-2">{t.roommates.map((name) => <div key={name} className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf7fa] text-[#0878b0] text-[12px] font-bold">{name[0]}</div><span className="text-[13px] font-semibold text-[#355364]">{name}</span></div>)}</div>
    </div>}
    <div className="mt-4 sk-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Bed availability</p>
      <div className="mt-3 space-y-2">{room.beds.map((b) => <div key={b.id} className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2"><span className="text-[12px] font-semibold text-[#355364]">Bed {b.label}</span><StatusBadge status={b.status} /></div>)}</div>
    </div>
  </Wrap>;
}

/* ========== WATER ========== */
function UserWater() {
  const w = data.water;
  return <Wrap>
    <DashHeading eyebrow="Utilities" title="Water supply" />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {[{ label: 'Drinking water', icon: <Droplets size={18} />, ...w.drinking }, { label: 'Bathing water', icon: <ShowerHead size={18} />, ...w.bathing }].map((item) => (
        <div key={item.label} className="sk-card p-5">
          <div className="flex items-center gap-3">{item.icon}<p className="text-[14px] font-bold text-[#18364a]">{item.label}</p></div>
          <div className="mt-3 flex items-center gap-2"><StatusBadge status={item.status} /><span className="text-[11px] text-[#81909a]">Updated {new Date(item.lastUpdated).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span></div>
        </div>
      ))}
    </div>
    <Link href="/user/issues/new?category=Water" className="sk-button sk-button-secondary mt-6"><AlertTriangle size={15} /> Report a supply issue</Link>
  </Wrap>;
}

/* ========== ELECTRICITY ========== */
function UserElectricity() {
  const e = data.electricity;
  return <Wrap>
    <DashHeading eyebrow="Utilities" title="Electricity" />
    <div className="mt-6 sk-card p-5">
      <div className="flex items-center gap-3"><Lightbulb size={20} className="text-[#0878b0]" /><div><p className="text-[14px] font-bold text-[#18364a]">Current status</p><StatusBadge status={e.status} /></div></div>
    </div>
    <div className="mt-5"><p className="sk-eyebrow">Outage history</p>
      <div className="mt-3 space-y-2">{e.outageHistory.map((o) => <div key={o.id} className="sk-card p-4"><div className="flex items-center justify-between"><span className="text-[12px] font-bold text-[#355364]">{o.date}</span><span className="text-[11px] text-[#81909a]">{o.duration}</span></div><p className="mt-1 text-[12px] text-[#6d7e88]">{o.reason}</p></div>)}</div>
    </div>
    <Link href="/user/issues/new?category=Electricity" className="sk-button sk-button-secondary mt-6"><AlertTriangle size={15} /> Report an electrical issue</Link>
  </Wrap>;
}

/* ========== FOOD ========== */
function UserFood() {
  const f = data.food;
  const [attendance, setAttendance] = useState(f.attendance);
  const toggleMeal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setAttendance((prev) => ({ ...prev, [meal]: { ...prev[meal], marked: true, attending: !prev[meal].attending } }));
  };
  return <Wrap>
    <DashHeading eyebrow="Daily life" title="Food menu" />
    <div className="mt-6 space-y-3">
      {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
        const menu = f.todayMenu[meal];
        const att = attendance[meal];
        return <div key={meal} className="sk-card p-5">
          <div className="flex items-center justify-between"><h3 className="text-[14px] font-bold capitalize text-[#18364a]">{meal}</h3><span className="text-[11px] text-[#81909a]">{menu.time}</span></div>
          <p className="mt-2 text-[13px] text-[#6d7e88]">{menu.items}</p>
          <div className="mt-3 flex items-center justify-between border-t border-[#edf1f3] pt-3">
            <span className="text-[11px] text-[#81909a]">Cutoff: {att.cutoff}</span>
            <div className="flex items-center gap-2">
              <button type="button" className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${att.attending ? 'bg-[#e4f4f7] text-[#176d73]' : 'bg-[#edf1f3] text-[#506875]'}`} onClick={() => toggleMeal(meal)}>{att.attending ? '✓ Attending' : 'Not attending'}</button>
            </div>
          </div>
        </div>;
      })}
    </div>
    <Link href="/user/issues/new?category=Food" className="sk-button sk-button-secondary mt-6"><AlertTriangle size={15} /> Report a food-related issue</Link>
  </Wrap>;
}

/* ========== WIFI ========== */
function UserWifi() {
  const w = data.wifi;
  return <Wrap>
    <DashHeading eyebrow="Utilities" title="WiFi" />
    <div className="mt-6 sk-card p-5">
      <div className="flex items-center gap-3"><Wifi size={20} className="text-[#0878b0]" /><div><p className="text-[14px] font-bold text-[#18364a]">{w.networkName}</p><StatusBadge status={w.status} /></div></div>
    </div>
    <div className="mt-4 sk-card p-5">
      <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Last speed test</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#edf1f3] p-3 text-center"><p className="text-[18px] font-bold text-[#18364a]">{w.lastSpeedTest.download}</p><p className="text-[10px] text-[#81909a]">Download</p></div>
        <div className="rounded-lg border border-[#edf1f3] p-3 text-center"><p className="text-[18px] font-bold text-[#18364a]">{w.lastSpeedTest.upload}</p><p className="text-[10px] text-[#81909a]">Upload</p></div>
      </div>
      <p className="mt-2 text-[11px] text-[#81909a]">Tested on {w.lastSpeedTest.date}</p>
    </div>
    <Link href="/user/issues/new?category=WiFi" className="sk-button sk-button-secondary mt-6"><AlertTriangle size={15} /> Report a connectivity issue</Link>
  </Wrap>;
}

/* ========== AMENITIES ========== */
const amenityIcons: Record<string, ReactNode> = { Laundry: <WashingMachine size={18} />, Television: <Tv size={18} />, Gym: <Dumbbell size={18} />, Parking: <Car size={18} />, Housekeeping: <Sparkles size={18} />, Security: <Shield size={18} /> };
function UserAmenities() {
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  return <Wrap>
    <DashHeading eyebrow="Daily life" title="Amenities" />
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {data.amenities.map((a) => <div key={a.id} className={`sk-card p-5 ${!a.enabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-3">{amenityIcons[a.name] ?? <Sparkles size={18} />}<h3 className="text-[14px] font-bold text-[#18364a]">{a.name}</h3>{!a.enabled && <StatusBadge status="Unavailable" />}</div>
        <p className="mt-2 text-[12px] text-[#6d7e88]">{a.note}</p>
        {a.bookable && a.enabled && <button type="button" className="sk-button sk-button-secondary mt-3 text-[12px]" onClick={() => { setBookingSlot(a.id); setBooked(false); }}>Book a slot</button>}
      </div>)}
    </div>
    {bookingSlot && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setBookingSlot(null)}>
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#d7e3e8] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        {booked ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">Slot booked</h3><p className="mt-2 text-[12px] text-[#6d7e88]">Your laundry slot is confirmed for today.</p><button type="button" className="sk-button sk-button-primary mt-4" onClick={() => setBookingSlot(null)}>Done</button></div>
        : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Book a laundry slot</h3><p className="mt-2 text-[12px] text-[#6d7e88]">Select a 1-hour window for today.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">{['6:00 – 7:00 AM', '8:00 – 9:00 AM', '10:00 – 11:00 AM', '2:00 – 3:00 PM', '4:00 – 5:00 PM', '7:00 – 8:00 PM'].map((s) => <button key={s} type="button" className="rounded-lg border border-[#d8e3e7] p-2.5 text-[12px] font-semibold text-[#355364] hover:border-[#168aad] hover:bg-[#edf7fa]" onClick={() => setBooked(true)}>{s}</button>)}</div>
          <button type="button" className="mt-4 text-[12px] font-semibold text-[#81909a]" onClick={() => setBookingSlot(null)}>Cancel</button></>}
      </div>
    </div>}
  </Wrap>;
}

/* ========== RAISE AN ISSUE ========== */
function UserNewIssue() {
  const [loc] = useLocation();
  const preCategory = new URLSearchParams(loc.split('?')[1] ?? '').get('category') ?? '';
  const [category, setCategory] = useState(preCategory);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!category) { setError('Select a category.'); return; }
    if (description.trim().length < 10) { setError('Describe the issue in at least 10 characters.'); return; }
    setError(''); setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 600);
  };

  if (success) return <Wrap><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Issue submitted</h2><p className="mt-2 text-[13px] text-[#6d7e88]">We have logged your report. The property team will review it shortly.</p><Link href="/user/issues" className="sk-button sk-button-primary mt-6">View my issues <ArrowRight size={15} /></Link></div></Wrap>;

  return <Wrap>
    <Link href="/user/issues" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> My issues</Link>
    <DashHeading eyebrow="Report" title="Raise an issue" />
    <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Category</span>
        <div className="sk-field"><select value={category} onChange={(e) => setCategory(e.target.value)} className="text-[13px]"><option value="">Select a category</option>{['Room', 'Water', 'Electricity', 'Food', 'WiFi', 'Furniture', 'Staff', 'Other'].map((c) => <option key={c}>{c}</option>)}</select></div>
      </label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-[#d3e0e4] bg-white p-3 text-[13px] text-[#18364a] outline-none focus:border-[#168aad] focus:ring-2 focus:ring-[#168aad]/15" placeholder="Describe the issue in detail" /></label>
      <div><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Photo <span className="font-normal text-[#81909a]">(optional)</span></span>
        {photo ? <div className="relative inline-block"><div className="h-24 w-24 rounded-lg bg-[#edf7fa] border border-[#d3e0e4] flex items-center justify-center text-[#0878b0]"><ImagePlus size={24} /></div><button type="button" className="absolute -right-2 -top-2 rounded-full bg-white border border-[#d3e0e4] p-0.5" onClick={() => setPhoto(null)}><X size={12} /></button></div>
        : <button type="button" className="flex items-center gap-2 rounded-lg border border-dashed border-[#c7d8de] bg-[#f9fbfc] px-4 py-3 text-[12px] font-semibold text-[#506875]" onClick={() => setPhoto('mock')}><Upload size={15} /> Attach a photo</button>}
      </div>
      {error && <p className="text-[11px] text-[#b55b25]" role="alert">{error}</p>}
      <button type="submit" disabled={submitting} className="sk-button sk-button-primary w-full disabled:opacity-50"><Send size={15} /> {submitting ? 'Submitting…' : 'Submit issue'}</button>
    </form>
  </Wrap>;
}

/* ========== MY ISSUES LIST ========== */
function UserIssuesList() {
  const myIssues = data.issues.filter((i) => i.raisedByTenantId === data.tenant.id);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 300); return () => clearTimeout(id); }, []);

  return <Wrap>
    <DashHeading eyebrow="Support" title="My issues" action={<Link href="/user/issues/new" className="sk-button sk-button-primary"><MessageSquarePlus size={15} /> Raise an issue</Link>} />
    {loading ? <div className="mt-6"><DashSkeleton /></div>
    : myIssues.length === 0 ? <div className="mt-6"><DashEmpty icon={<Wrench size={18} />} title="No issues raised yet" description="Everything working well? Great. You can report a problem anytime." action={<Link href="/user/issues/new" className="sk-button sk-button-secondary">Raise an issue</Link>} /></div>
    : <div className="mt-6 space-y-3">{myIssues.map((iss) => <Link key={iss.id} href={`/user/issues/${iss.id}`} className="sk-card block p-4 transition-colors hover:bg-[#f5f8f9]">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><StatusBadge status={iss.status} /><span className="text-[11px] text-[#81909a]">{iss.category}</span></div><span className="text-[11px] text-[#81909a]">{new Date(iss.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
        <p className="mt-2 text-[13px] font-semibold text-[#355364]">{iss.description}</p>
      </Link>)}</div>}
  </Wrap>;
}

/* ========== ISSUE DETAIL ========== */
function UserIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = data.issues.find((i) => i.id === id);
  if (!issue) return <Wrap><DashEmpty icon={<CircleAlert size={18} />} title="Issue not found" description="This issue may have been removed." action={<Link href="/user/issues" className="sk-button sk-button-secondary">Back to issues</Link>} /></Wrap>;
  return <Wrap>
    <Link href="/user/issues" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> My issues</Link>
    <div className="mt-4"><div className="flex items-center gap-2"><StatusBadge status={issue.status} /><StatusBadge status={issue.priority} /><span className="text-[11px] text-[#81909a]">{issue.category}</span></div>
      <h1 className="sk-display mt-3 text-[20px] font-bold text-[#18364a]">{issue.description}</h1>
      <p className="mt-2 text-[12px] text-[#81909a]">Raised on {new Date(issue.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
    {issue.assignedStaff && <div className="mt-4 sk-card p-4"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Assigned staff</p><p className="mt-1 text-[13px] font-semibold text-[#355364]">{issue.assignedStaff}</p></div>}
    <div className="mt-5"><p className="sk-eyebrow">Status timeline</p>
      <div className="mt-3 space-y-0">{issue.timeline.map((t, i) => <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
        <div className="flex flex-col items-center"><div className={`h-3 w-3 rounded-full border-2 ${i === issue.timeline.length - 1 ? 'border-[#0878b0] bg-[#0878b0]' : 'border-[#c7d8de] bg-white'}`} />{i < issue.timeline.length - 1 && <div className="w-px flex-1 bg-[#dfe9ee]" />}</div>
        <div className="-mt-0.5"><p className="text-[12px] font-bold text-[#355364]">{t.status}</p><p className="text-[11px] text-[#6d7e88]">{t.note}</p><p className="mt-0.5 text-[10px] text-[#81909a]">{new Date(t.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
      </div>)}</div>
    </div>
  </Wrap>;
}

/* ========== NOTICES ========== */
function UserNotices() {
  const [seen, setSeen] = useState<Set<string>>(new Set([data.notices[0]?.id]));
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 300); return () => clearTimeout(id); }, []);

  return <Wrap>
    <DashHeading eyebrow="Communication" title="Notices" />
    {loading ? <div className="mt-6"><DashSkeleton /></div>
    : data.notices.length === 0 ? <div className="mt-6"><DashEmpty icon={<Bell size={18} />} title="No notices yet" description="The property team has not posted any notices." /></div>
    : <div className="mt-6 space-y-3">{data.notices.map((n) => {
      const isSeen = seen.has(n.id);
      return <button key={n.id} type="button" className="sk-card block w-full p-4 text-left transition-colors hover:bg-[#f5f8f9]" onClick={() => setSeen((prev) => new Set(prev).add(n.id))}>
        <div className="flex items-start gap-3">{!isSeen && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0878b0]" />}<div className="flex-1"><div className="flex items-center justify-between gap-3"><h3 className={`text-[13px] font-bold ${isSeen ? 'text-[#506875]' : 'text-[#18364a]'}`}>{n.title}</h3><span className="shrink-0 text-[10px] text-[#81909a]">{new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div><p className="mt-1 text-[12px] leading-5 text-[#6d7e88]">{n.body}</p><p className="mt-2 text-[10px] text-[#81909a]">Posted by {n.postedBy}</p></div></div>
      </button>;
    })}</div>}
  </Wrap>;
}

/* ========== PAYMENTS ========== */
function UserPayments() {
  const p = data.payments;
  return <Wrap>
    <DashHeading eyebrow="Billing" title="Payments" />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <StatCard label="Current rent" value={`₹${p.currentRent.toLocaleString('en-IN')}`} sub="per month" />
      <div className="sk-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Payment status</p><div className="mt-2 flex items-center gap-2"><StatusBadge status={p.status} /><span className="text-[13px] font-semibold text-[#355364]">Due by {p.dueDate}</span></div></div>
    </div>
    <div className="mt-4 sk-card p-5"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Deposit on record</p><p className="mt-2 text-[18px] font-bold text-[#18364a]">₹{p.depositOnRecord.toLocaleString('en-IN')}</p></div>
    <div className="mt-5"><p className="sk-eyebrow">Payment history</p>
      <div className="mt-3 space-y-2">{p.history.map((h) => <div key={h.id} className="sk-card flex items-center justify-between p-4"><div><p className="text-[13px] font-semibold text-[#355364]">{h.month}</p><p className="text-[11px] text-[#81909a]">Paid on {h.paidDate}</p></div><div className="text-right"><p className="text-[13px] font-bold text-[#18364a]">₹{h.amount.toLocaleString('en-IN')}</p><StatusBadge status={h.status} /></div></div>)}</div>
    </div>
    <Link href="/user/payments/agreement" className="sk-button sk-button-secondary mt-6"><FileText size={15} /> View rental agreement</Link>
  </Wrap>;
}

/* ========== AGREEMENT VIEWER ========== */
function UserAgreement() {
  return <Wrap>
    <Link href="/user/payments" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> Payments</Link>
    <DashHeading eyebrow="Document" title="Rental Agreement" />
    <div className="mt-6 sk-card overflow-hidden">
      <div className="bg-[#f5f8f9] p-5 border-b border-[#e1e8ed]"><p className="text-[11px] font-bold text-[#81909a]">Agreement Preview</p></div>
      <div className="p-6 space-y-4 text-[13px] leading-6 text-[#506875]">
        <p className="text-center text-[16px] font-bold text-[#18364a]">RENTAL AGREEMENT</p>
        <p className="text-center text-[12px] text-[#81909a]">Between Orchid House (Owner: Meera Nair) and {data.tenant.name}</p>
        <hr className="border-[#edf1f3]" />
        <p><strong>Property:</strong> {data.tenant.propertyName}, HSR Layout, Bengaluru</p>
        <p><strong>Room:</strong> {data.tenant.roomNumber}, Bed {data.tenant.bedNumber} ({data.tenant.roomType})</p>
        <p><strong>Lease Period:</strong> 20 Jan 2025 – 19 Jan 2026</p>
        <p><strong>Monthly Rent:</strong> ₹{data.tenant.rentAmount.toLocaleString('en-IN')}</p>
        <p><strong>Security Deposit:</strong> ₹{data.tenant.depositAmount.toLocaleString('en-IN')}</p>
        <p><strong>Notice Period:</strong> 30 days written notice required from either party.</p>
        <p><strong>House Rules:</strong> As communicated in the property handbook and notice board.</p>
        <hr className="border-[#edf1f3]" />
        <div className="flex items-center gap-2 text-[#176d73]"><Check size={15} /> <span className="text-[12px] font-bold">Signed by {data.tenant.name} on 15 Jan 2025</span></div>
        <div className="flex items-center gap-2 text-[#176d73]"><Check size={15} /> <span className="text-[12px] font-bold">Signed by Meera Nair on 15 Jan 2025</span></div>
      </div>
    </div>
  </Wrap>;
}

/* ========== PROFILE ========== */
function UserProfile() {
  const t = data.tenant;
  const [editing, setEditing] = useState(false);
  const [editSubmitted, setEditSubmitted] = useState(false);
  const [editName, setEditName] = useState(t.name);
  const [editPhone, setEditPhone] = useState(t.phone);

  return <Wrap>
    <DashHeading eyebrow="Account" title="Profile" />
    <div className="mt-6 sk-card p-5">
      <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf7fa] text-[20px] font-bold text-[#0878b0]">{t.name[0]}</div><div><p className="text-[16px] font-bold text-[#18364a]">{t.name}</p><p className="text-[12px] text-[#6d7e88]">{t.role} · Joined {new Date(t.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p></div></div>
    </div>
    <div className="mt-4 space-y-3">
      {[['Email', t.email], ['Phone', t.phone], ['ID Proof', t.idProof], ['Emergency Contact', `${t.emergencyContact.name} (${t.emergencyContact.relation}) — ${t.emergencyContact.phone}`]].map(([label, value]) => <div key={label} className="sk-card flex items-center justify-between p-4"><div><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">{label}</p><p className="mt-1 text-[13px] text-[#355364]">{value}</p></div></div>)}
    </div>
    <button type="button" className="sk-button sk-button-secondary mt-5" onClick={() => { setEditing(true); setEditSubmitted(false); }}>Request profile edit</button>

    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setEditing(false)}>
      <div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        {editSubmitted ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">Change request submitted</h3><p className="mt-2 text-[12px] text-[#6d7e88]">Your request will be reviewed by the property team. Changes require verification.</p><button type="button" className="sk-button sk-button-primary mt-4" onClick={() => setEditing(false)}>Done</button></div>
        : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Request profile changes</h3><p className="mt-2 text-[12px] text-[#6d7e88]">Changes are submitted as a request and require verification before they take effect.</p>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Name</span><input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] bg-white p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
            <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Phone</span><input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] bg-white p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
          </div>
          <div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={() => setEditing(false)}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setEditSubmitted(true)}>Submit request</button></div></>}
      </div>
    </div>}

    <div className="mt-8 border-t border-[#e1e8ed] pt-6">
      <Link href="/user/profile/delete-account" className="flex items-center gap-2 text-[13px] font-semibold text-[#b55b25]"><Trash2 size={15} /> Delete my account</Link>
    </div>
  </Wrap>;
}

/* ========== DELETE ACCOUNT ========== */
function UserDeleteAccount() {
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <Wrap><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Deletion request submitted</h2><p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-6 text-[#6d7e88]">Your account deletion request has been logged. You will receive confirmation within 72 hours.</p><Link href="/" className="sk-button sk-button-primary mt-6">Return to home</Link></div></Wrap>;

  return <Wrap>
    <Link href="/user/profile" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> Profile</Link>
    <DashHeading eyebrow="Account" title="Delete my account" />
    <div className="mt-6 sk-card p-5">
      <h3 className="text-[14px] font-bold text-[#18364a]">What happens when you delete your account</h3>
      <div className="mt-4 space-y-3 text-[13px] leading-6 text-[#506875]">
        <div className="rounded-lg border border-[#fff1e8] bg-[#fffbf8] p-4">
          <p className="font-bold text-[#b55b25]">Deleted immediately:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your profile information (name, email, phone)</li>
            <li>Your saved preferences and shortlists</li>
            <li>Login credentials and session data</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[#e1e8ed] bg-[#f9fbfc] p-4">
          <p className="font-bold text-[#506875]">May be retained as required by law:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Transaction records and payment history (as required under applicable tax and commercial law)</li>
            <li>Records of consent given and withdrawn (as required under the DPDP Act)</li>
            <li>Anonymised or aggregated data that can no longer identify you</li>
          </ul>
        </div>
        <p className="text-[12px] text-[#81909a]">You can request deletion by contacting us at privacy@staykolo.in or through this interface. We will process your request within 72 hours and confirm via email.</p>
      </div>
    </div>
    <div className="mt-5">
      <label className="flex items-start gap-2 text-[12px] leading-5 text-[#506875]"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" /> I understand that deleting my account is permanent and my profile data will be removed.</label>
      <button type="button" disabled={!confirmed} className="sk-button mt-4 border border-[#b55b25] bg-[#b55b25] text-white disabled:opacity-40" onClick={() => setDone(true)}><Trash2 size={15} /> Delete my account</button>
    </div>
  </Wrap>;
}

/* ========== ROUTER ========== */
export function UserDashboard() {
  return <Switch>
    <Route path="/user/home" component={UserHome} />
    <Route path="/user/room" component={UserRoom} />
    <Route path="/user/water" component={UserWater} />
    <Route path="/user/electricity" component={UserElectricity} />
    <Route path="/user/food" component={UserFood} />
    <Route path="/user/wifi" component={UserWifi} />
    <Route path="/user/amenities" component={UserAmenities} />
    <Route path="/user/issues/new" component={UserNewIssue} />
    <Route path="/user/issues/:id" component={UserIssueDetail} />
    <Route path="/user/issues" component={UserIssuesList} />
    <Route path="/user/notices" component={UserNotices} />
    <Route path="/user/payments/agreement" component={UserAgreement} />
    <Route path="/user/payments" component={UserPayments} />
    <Route path="/user/profile/delete-account" component={UserDeleteAccount} />
    <Route path="/user/profile" component={UserProfile} />
    <Route>{() => { const [, setLoc] = useLocation(); useEffect(() => { setLoc('/user/home'); }, []); return null; }}</Route>
  </Switch>;
}
