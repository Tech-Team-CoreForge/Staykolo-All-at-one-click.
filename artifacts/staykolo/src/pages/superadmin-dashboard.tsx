import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  ArrowLeft, ArrowRight, BarChart3, Building2, Check, CheckCircle, CircleAlert, CreditCard,
  Eye, FileText, Globe, LayoutDashboard, MapPin, PenLine, Plus, ScrollText, Send, Shield, Ticket, Trash2, User, Users, X,
} from 'lucide-react';
import { AdminLayout, DashHeading, DashSkeleton, DashEmpty, DashError, StatusBadge, StatCard, DataTable } from '@/components/dashboard-shared';
import { MapView } from '@/components/map-view';
import pgsJson from '../../mock-data/pgs.json';
import data from '../../mock-data/dashboard.json';

const pgs = pgsJson as (typeof pgsJson)[number][];

function SAShell({ children }: { children: ReactNode }) {
  const groups = [
    { title: 'Platform', items: [
      { href: '/superadmin/overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
      { href: '/superadmin/listings', icon: <Building2 size={16} />, label: 'Listings' },
      { href: '/superadmin/users', icon: <Users size={16} />, label: 'Users' },
    ]},
    { title: 'Operations', items: [
      { href: '/superadmin/support-tickets', icon: <Ticket size={16} />, label: 'Support Tickets' },
      { href: '/superadmin/billing', icon: <CreditCard size={16} />, label: 'Billing' },
    ]},
    { title: 'Content', items: [
      { href: '/superadmin/chronicles-cms', icon: <ScrollText size={16} />, label: 'Chronicles CMS' },
      { href: '/superadmin/legal-docs', icon: <FileText size={16} />, label: 'Legal Docs' },
    ]},
    { title: 'Insights', items: [
      { href: '/superadmin/analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
    ]},
  ];
  return <AdminLayout sidebarGroups={groups}>{children}</AdminLayout>;
}

/* ========== OVERVIEW ========== */
function SAOverview() {
  const totalProps = pgs.length;
  const totalTenants = data.allUsers.filter(u => u.role === 'Tenant').length;
  const totalOwners = data.allUsers.filter(u => u.role === 'Owner').length;
  const openTickets = data.supportTickets.filter(t => t.status !== 'Resolved').length;
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 350); return () => clearTimeout(id); }, []);

  return <SAShell>
    <DashHeading eyebrow="Super admin" title="Platform overview" />
    {loading ? <div className="mt-6"><DashSkeleton rows={5} /></div> : <>
    <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
      <StatCard label="Properties" value={totalProps} />
      <StatCard label="Active tenants" value={totalTenants} />
      <StatCard label="Owners" value={totalOwners} />
      <StatCard label="Open tickets" value={openTickets} />
      <StatCard label="Avg resolution" value="18h" sub="last 30 days" />
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <div className="sk-card p-5"><p className="sk-eyebrow">Recent listings</p><div className="mt-3 space-y-2">{pgs.slice(0,4).map(p=><Link key={p.id} href={`/superadmin/listings/${p.id}/edit`} className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2 hover:bg-[#f5f8f9]"><div><p className="text-[12px] font-semibold text-[#355364]">{p.name}</p><p className="text-[10px] text-[#81909a]">{p.area}</p></div><StatusBadge status={(data.listingStatuses as Record<string, string>)[p.id] ?? 'Pending Review'} /></Link>)}</div></div>
      <div className="sk-card p-5"><p className="sk-eyebrow">Recent tickets</p>{data.supportTickets.length === 0 ? <p className="mt-3 text-[12px] text-[#81909a]">No tickets</p> : <div className="mt-3 space-y-2">{data.supportTickets.map(t=><div key={t.id} className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2"><div><p className="text-[12px] font-semibold text-[#355364]">{t.subject}</p><p className="text-[10px] text-[#81909a]">{t.raisedBy}</p></div><StatusBadge status={t.status} /></div>)}</div>}</div>
    </div></>}
  </SAShell>;
}

/* ========== LISTINGS ========== */
function SAListings() {
  const [statuses, setStatuses] = useState(data.listingStatuses as Record<string, string>);
  const updateStatus = (id: string, status: string) => setStatuses(prev => ({ ...prev, [id]: status }));
  return <SAShell>
    <DashHeading eyebrow="Platform" title="All listings" action={<Link href="/superadmin/listings/new" className="sk-button sk-button-primary"><Plus size={15} /> Create listing</Link>} />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Property','Area','Owner','Rent','Status','Actions']} rows={pgs.map(p=>[
      <Link href={`/superadmin/listings/${p.id}/edit`} className="font-semibold text-[#0878b0]">{p.name}</Link>,
      p.area,
      p.contact.ownerName,
      <span>₹{p.startingRent.toLocaleString('en-IN')}</span>,
      <StatusBadge status={statuses[p.id] ?? 'Pending Review'} />,
      <div className="flex gap-1">{statuses[p.id] !== 'Approved' && <button type="button" className="rounded border border-[#176d73] px-2 py-0.5 text-[10px] font-bold text-[#176d73]" onClick={() => updateStatus(p.id, 'Approved')}>Approve</button>}{statuses[p.id] !== 'Suspended' && <button type="button" className="rounded border border-[#b55b25] px-2 py-0.5 text-[10px] font-bold text-[#b55b25]" onClick={() => updateStatus(p.id, 'Suspended')}>Suspend</button>}</div>,
    ])} /></div>
  </SAShell>;
}

/* ========== CREATE/EDIT LISTING WITH MAP ========== */
function SAListingEdit() {
  const { id } = useParams<{ id: string }>();
  const property = pgs.find(p => p.id === id);
  const [lat, setLat] = useState(property?.coordinates.lat ?? 12.95);
  const [lng, setLng] = useState(property?.coordinates.lng ?? 77.6);
  const [address, setAddress] = useState(property?.address ?? '');
  const [saved, setSaved] = useState(false);

  return <SAShell>
    <Link href="/superadmin/listings" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> All listings</Link>
    <DashHeading eyebrow="Listing" title={property ? `Edit: ${property.name}` : 'Edit listing'} />
    {saved && <div className="mt-4 rounded-lg bg-[#e4f4f7] p-3 text-[12px] font-semibold text-[#176d73]">Changes saved. The updated coordinates will appear on the public search map.</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Property name</span><input defaultValue={property?.name ?? ''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Address</span><input value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" placeholder="Search address…" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e => setLat(Number(e.target.value))} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Longitude</span><input type="number" step="0.0001" value={lng} onChange={e => setLng(Number(e.target.value))} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>
        </div>
        <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Area</span><input defaultValue={property?.area ?? ''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Starting rent (₹)</span><input type="number" defaultValue={property?.startingRent ?? ''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Gender policy</span><select defaultValue={property?.genderPolicy ?? ''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"><option>Women only</option><option>Men only</option><option>Co-living</option></select></label>
        <button type="button" className="sk-button sk-button-primary w-full" onClick={() => setSaved(true)}>Save changes</button>
      </div>
      <div>
        <p className="mb-2 text-[12px] font-bold text-[#405966]">Pin location on map</p>
        <p className="mb-3 text-[11px] text-[#81909a]">Drag the pin or update lat/lng fields. This exact position powers the public search map and property detail page.</p>
        <MapView pins={[{ id: property?.id ?? 'new', name: property?.name ?? 'New property', lat, lng }]} selectedId={property?.id ?? 'new'} center={[lng, lat]} className="h-[400px]" />
      </div>
    </div>
  </SAShell>;
}

function SAListingNew() {
  const [lat, setLat] = useState(12.95);
  const [lng, setLng] = useState(77.6);
  const [saved, setSaved] = useState(false);

  if (saved) return <SAShell><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Listing created</h2><p className="mt-2 text-[13px] text-[#6d7e88]">The property has been submitted for review and will appear on the public search map once approved.</p><Link href="/superadmin/listings" className="sk-button sk-button-primary mt-6">Back to listings</Link></div></SAShell>;

  return <SAShell>
    <Link href="/superadmin/listings" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> All listings</Link>
    <DashHeading eyebrow="Listing" title="Create new listing" />
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        {[['Property name','text',''],['Address','text',''],['Area','text','e.g. HSR Layout'],['Starting rent (₹)','number',''],['Deposit (₹)','number',''],['Description','text','']].map(([l,t,p])=><label key={l as string} className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">{l}</span><input type={t as string} placeholder={p as string} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]" /></label>)}
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Latitude</span><input type="number" step="0.0001" value={lat} onChange={e => setLat(Number(e.target.value))} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
          <label className="block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Longitude</span><input type="number" step="0.0001" value={lng} onChange={e => setLng(Number(e.target.value))} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
        </div>
        <button type="button" className="sk-button sk-button-primary w-full" onClick={() => setSaved(true)}>Create listing</button>
      </div>
      <div>
        <p className="mb-2 text-[12px] font-bold text-[#405966]">Pin location on map</p>
        <MapView pins={[{ id: 'new', name: 'New property', lat, lng }]} selectedId="new" center={[lng, lat]} className="h-[400px]" />
      </div>
    </div>
  </SAShell>;
}

/* ========== USERS ========== */
function SAUsers() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const users = data.allUsers.filter(u => (roleFilter === 'all' || u.role === roleFilter) && (statusFilter === 'all' || u.status === statusFilter));
  return <SAShell>
    <DashHeading eyebrow="Platform" title="Users" />
    <div className="mt-4 flex flex-wrap gap-2">
      {['all','Tenant','Owner'].map(r=><button key={r} type="button" className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${roleFilter===r ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'}`} onClick={() => setRoleFilter(r)}>{r === 'all' ? 'All roles' : r}</button>)}
      {['all','Active','Suspended'].map(s=><button key={s} type="button" className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusFilter===s ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'}`} onClick={() => setStatusFilter(s)}>{s === 'all' ? 'All status' : s}</button>)}
    </div>
    <div className="mt-4 sk-card overflow-hidden"><DataTable headers={['Name','Email','Role','Property','Status','Joined','Actions']} rows={users.map(u=>[
      <Link href={`/superadmin/users/${u.id}`} className="font-semibold text-[#0878b0]">{u.name}</Link>,
      <span className="text-[11px]">{u.email}</span>,
      u.role,
      u.propertyName,
      <StatusBadge status={u.status} />,
      u.joinedDate,
      <span className="text-[11px] font-bold text-[#0878b0]">View</span>,
    ])} /></div>
  </SAShell>;
}

function SAUserDetail() {
  const { id } = useParams<{ id: string }>();
  const user = data.allUsers.find(u => u.id === id);
  if (!user) return <SAShell><DashEmpty icon={<User size={18} />} title="User not found" description="This user account may have been removed." action={<Link href="/superadmin/users" className="sk-button sk-button-secondary">Back to users</Link>} /></SAShell>;
  const [status, setStatus] = useState(user.status);
  return <SAShell>
    <Link href="/superadmin/users" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> All users</Link>
    <div className="mt-4 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf7fa] text-[20px] font-bold text-[#0878b0]">{user.name[0]}</div><div><h1 className="sk-display text-[22px] font-bold text-[#18364a]">{user.name}</h1><p className="text-[12px] text-[#6d7e88]">{user.role} · {user.propertyName}</p></div></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[['Email', user.email], ['Role', user.role], ['Property', user.propertyName], ['Joined', user.joinedDate], ['Status', '']].map(([l, v]) => <div key={l} className="sk-card p-4"><p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">{l}</p>{l === 'Status' ? <div className="mt-1"><StatusBadge status={status} /></div> : <p className="mt-1 text-[13px] text-[#355364]">{v}</p>}</div>)}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      <button type="button" className="sk-button sk-button-secondary text-[12px]"><Eye size={14} /> Support login (UI only)</button>
      {status === 'Active' ? <button type="button" className="sk-button border border-[#b55b25] bg-white text-[12px] text-[#b55b25]" onClick={() => setStatus('Suspended')}>Suspend account</button>
      : <button type="button" className="sk-button border border-[#176d73] bg-white text-[12px] text-[#176d73]" onClick={() => setStatus('Active')}>Reinstate account</button>}
    </div>
  </SAShell>;
}

/* ========== SUPPORT TICKETS ========== */
function SASupportTickets() {
  const allTickets = [...data.supportTickets, ...data.issues.filter(i => i.priority === 'High').map(i => ({ id: i.id, subject: i.description.slice(0, 50), description: i.description, status: i.status, priority: i.priority, raisedBy: i.raisedBy, raisedByRole: 'Tenant' as const, propertyId: i.propertyId, raisedDate: i.raisedDate, assignedTo: i.assignedStaff }))];
  return <SAShell>
    <DashHeading eyebrow="Operations" title="Support tickets" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Subject','From','Role','Property','Priority','Status','Date']} rows={allTickets.map(t=>[
      <span className="font-semibold max-w-[200px] truncate block">{t.subject}</span>,
      t.raisedBy,
      t.raisedByRole,
      t.propertyId,
      <StatusBadge status={t.priority} />,
      <StatusBadge status={t.status} />,
      new Date(t.raisedDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'}),
    ])} /></div>
  </SAShell>;
}

/* ========== BILLING ========== */
function SABilling() {
  return <SAShell>
    <DashHeading eyebrow="Operations" title="Subscriptions & billing" />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Owner','Property','Plan','Status','Promo','Monthly fee','Note']} rows={data.ownerBilling.map(b=>[
      <span className="font-semibold">{b.ownerName}</span>,
      b.propertyName,
      b.plan,
      <StatusBadge status={b.planStatus} />,
      b.promoFlag ? <span className="text-[11px] font-bold text-[#8a6d1b]">Yes</span> : <span className="text-[11px] text-[#81909a]">No</span>,
      <span>₹{b.monthlyFee.toLocaleString('en-IN')}</span>,
      <span className="text-[10px] text-[#81909a] max-w-[180px] block">{b.note}</span>,
    ])} /></div>
  </SAShell>;
}

/* ========== CHRONICLES CMS ========== */
function SAChronicles() {
  return <SAShell>
    <DashHeading eyebrow="Content" title="Chronicles CMS" action={<Link href="/superadmin/chronicles-cms/new" className="sk-button sk-button-primary"><Plus size={15} /> New post</Link>} />
    <div className="mt-6 sk-card overflow-hidden"><DataTable headers={['Title','Tag','Status','Date','Actions']} rows={data.chronicles.map(c=>[
      <span className="font-semibold">{c.title}</span>,
      <span className="text-[11px] font-bold text-[#0878b0]">{c.tag}</span>,
      <StatusBadge status={c.status} />,
      c.date,
      <span className="text-[11px] font-bold text-[#0878b0]">Edit</span>,
    ])} /></div>
  </SAShell>;
}

function SAChronicleNew() {
  const [title, setTitle] = useState(''); const [tag, setTag] = useState('#tenant-tips'); const [content, setContent] = useState(''); const [published, setPublished] = useState(false); const [saved, setSaved] = useState(false);
  if (saved) return <SAShell><div className="py-12 text-center"><CheckCircle className="mx-auto text-[#176d73]" size={32} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">{published ? 'Post published' : 'Draft saved'}</h2><p className="mt-2 text-[13px] text-[#6d7e88]">{published ? 'The post is now visible on the public Chronicles page.' : 'Your draft has been saved.'}</p><Link href="/superadmin/chronicles-cms" className="sk-button sk-button-primary mt-6">Back to CMS</Link></div></SAShell>;
  return <SAShell>
    <Link href="/superadmin/chronicles-cms" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"><ArrowLeft size={14} /> Chronicles CMS</Link>
    <DashHeading eyebrow="Content" title="New chronicle post" />
    <div className="mt-6 space-y-4">
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Title</span><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" placeholder="Post title" /></label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Tag</span><select value={tag} onChange={e=>setTag(e.target.value)} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"><option>#tenant-tips</option><option>#owner-guides</option><option>#staykolo-updates</option></select></label>
      <label className="block"><span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Content</span><textarea value={content} onChange={e=>setContent(e.target.value)} rows={8} className="w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]" placeholder="Write the chronicle content…" /></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} /><span className="text-[12px] font-semibold text-[#405966]">Publish immediately</span></label>
      <div className="flex gap-2"><button type="button" disabled={!title||!content} className="sk-button sk-button-primary disabled:opacity-40" onClick={() => setSaved(true)}>{published ? 'Publish' : 'Save draft'}</button></div>
    </div>
  </SAShell>;
}

/* ========== LEGAL DOCS ========== */
function SALegalDocs() {
  const [publishing, setPublishing] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  return <SAShell>
    <DashHeading eyebrow="Content" title="Legal document control" />
    <div className="mt-6 space-y-3">{data.legalDocs.map(d=><div key={d.id} className="sk-card p-5">
      <div className="flex items-center justify-between"><h3 className="text-[14px] font-bold text-[#18364a]">{d.document}</h3><StatusBadge status={d.status} /></div>
      <div className="mt-2 text-[12px] text-[#6d7e88]"><span>Version {d.version}</span><span className="mx-2">·</span><span>Effective {d.effectiveDate}</span></div>
      <div className="mt-3 flex gap-2"><Link href={d.document === 'Terms of Service' ? '/legal/terms' : d.document === 'Privacy Policy' ? '/legal/privacy' : '/legal/data-deletion'} className="text-[11px] font-bold text-[#0878b0]">View public page</Link><button type="button" className="text-[11px] font-bold text-[#506875]" onClick={() => { setPublishing(d.id); setPublished(false); }}>Publish new version</button></div>
    </div>)}</div>
    {publishing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18364a]/35 p-4" onClick={() => setPublishing(null)}><div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-lg" onClick={e=>e.stopPropagation()}>
      {published ? <div className="text-center py-4"><CheckCircle className="mx-auto text-[#176d73]" size={28} /><h3 className="sk-display mt-3 text-[18px] font-bold text-[#18364a]">New version published</h3><p className="mt-2 text-[12px] text-[#6d7e88]">The updated document is now live on the public legal pages.</p><button type="button" className="sk-button sk-button-primary mt-4" onClick={() => setPublishing(null)}>Done</button></div>
      : <><h3 className="sk-display text-[18px] font-bold text-[#18364a]">Publish new version</h3><p className="mt-2 text-[12px] text-[#6d7e88]">This will update the public-facing legal page. All users will be notified of the change.</p>
        <label className="mt-4 block"><span className="mb-1 block text-[12px] font-bold text-[#405966]">Effective date</span><input type="date" className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" /></label>
        <div className="mt-5 flex gap-2"><button type="button" className="sk-button sk-button-secondary flex-1" onClick={() => setPublishing(null)}>Cancel</button><button type="button" className="sk-button sk-button-primary flex-1" onClick={() => setPublished(true)}>Publish</button></div></>}
    </div></div>}
  </SAShell>;
}

/* ========== ANALYTICS ========== */
function SAAnalytics() {
  const snapshots = [
    { period: 'Feb 2025', properties: 6, tenants: 28, owners: 6, occupancy: '82%', avgResolution: '18h' },
    { period: 'Jan 2025', properties: 5, tenants: 22, owners: 5, occupancy: '78%', avgResolution: '22h' },
    { period: 'Dec 2024', properties: 4, tenants: 16, owners: 4, occupancy: '71%', avgResolution: '26h' },
    { period: 'Nov 2024', properties: 3, tenants: 10, owners: 3, occupancy: '65%', avgResolution: '32h' },
  ];
  return <SAShell>
    <DashHeading eyebrow="Insights" title="Platform analytics" />
    <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard label="Properties (current)" value={6} />
      <StatCard label="Active tenants" value={28} />
      <StatCard label="Platform occupancy" value="82%" />
      <StatCard label="Avg ticket resolution" value="18h" />
    </div>
    <div className="mt-6"><p className="sk-eyebrow">Monthly snapshots</p>
      <div className="mt-3 sk-card overflow-hidden"><DataTable headers={['Period','Properties','Tenants','Owners','Occupancy','Avg resolution']} rows={snapshots.map(s=>[s.period, String(s.properties), String(s.tenants), String(s.owners), s.occupancy, s.avgResolution])} /></div>
    </div>
    <div className="mt-6"><p className="sk-eyebrow">Properties over time</p>
      <div className="mt-3 sk-card p-5"><div className="flex items-end gap-3 h-[140px]">{snapshots.slice().reverse().map(s=><div key={s.period} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t bg-[#0878b0]" style={{ height: `${(s.properties / 6) * 100}%` }} /><span className="text-[10px] text-[#81909a]">{s.period.split(' ')[0]}</span></div>)}</div></div>
    </div>
  </SAShell>;
}

/* ========== ROUTER ========== */
export function SuperAdminDashboard() {
  return <Switch>
    <Route path="/superadmin/overview" component={SAOverview} />
    <Route path="/superadmin/listings/new" component={SAListingNew} />
    <Route path="/superadmin/listings/:id/edit" component={SAListingEdit} />
    <Route path="/superadmin/listings" component={SAListings} />
    <Route path="/superadmin/users/:id" component={SAUserDetail} />
    <Route path="/superadmin/users" component={SAUsers} />
    <Route path="/superadmin/support-tickets" component={SASupportTickets} />
    <Route path="/superadmin/billing" component={SABilling} />
    <Route path="/superadmin/chronicles-cms/new" component={SAChronicleNew} />
    <Route path="/superadmin/chronicles-cms" component={SAChronicles} />
    <Route path="/superadmin/legal-docs" component={SALegalDocs} />
    <Route path="/superadmin/analytics" component={SAAnalytics} />
    <Route path="/superadmin" component={SAOverview} />
    <Route>{() => { const [, setLoc] = useLocation(); useEffect(() => { setLoc('/superadmin/overview'); }, []); return null; }}</Route>
  </Switch>;
}
