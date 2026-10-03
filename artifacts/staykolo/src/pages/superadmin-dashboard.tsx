import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  ArrowLeft, ArrowRight, BarChart3, Building2, Check, CheckCircle, CircleAlert, CreditCard,
  Eye, FileText, Gift, Globe, LayoutDashboard, MapPin, PenLine, Plus, RotateCcw, ScrollText,
  Search, Send, Shield, ShieldCheck, Ticket, Trash2, TrendingUp, User, UserCheck, Users, X,
} from 'lucide-react';
import {
  AdminLayout, DashHeading, DashSkeleton, DashEmpty, DashError, StatusBadge, StatCard, DataTable,
} from '@/components/dashboard-shared';
import { MapView } from '@/components/map-view';
import pgsJson from '../../mock-data/pgs.json';
import data from '../../mock-data/dashboard.json';

const pgs = pgsJson as (typeof pgsJson)[number][];

function SAShell({ children }: { children: ReactNode }) {
  const groups = [
    {
      title: 'Platform',
      items: [
        { href: '/superadmin/overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
        { href: '/superadmin/analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
        { href: '/superadmin/listings', icon: <Building2 size={16} />, label: 'Properties' },
        { href: '/superadmin/users', icon: <Users size={16} />, label: 'Users / Leads' },
        { href: '/superadmin/tenants', icon: <User size={16} />, label: 'Tenants' },
        { href: '/superadmin/staff', icon: <Shield size={16} />, label: 'Staff' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { href: '/superadmin/raise-concern', icon: <Ticket size={16} />, label: 'Raise Concern' },
        { href: '/superadmin/billing', icon: <CreditCard size={16} />, label: 'Billing' },
        { href: '/superadmin/changes-log', icon: <FileText size={16} />, label: 'Changes Log' },
      ],
    },
    {
      title: 'Content',
      items: [
        { href: '/superadmin/chronicles-cms', icon: <ScrollText size={16} />, label: 'Chronicles CMS' },
        { href: '/superadmin/legal-docs', icon: <FileText size={16} />, label: 'Legal Docs' },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { href: '/superadmin/settings', icon: <Globe size={16} />, label: 'Settings' },
      ],
    },
  ];
  return <AdminLayout sidebarGroups={groups}>{children}</AdminLayout>;
}

/* ========== OVERVIEW (Req #31, #47: FIRST) ========== */
function SAOverview() {
  const totalProps = pgs.length;
  const totalTenants = data.allUsers.filter((u) => u.role === 'Tenant').length;
  const totalOwners = data.allUsers.filter((u) => u.role === 'Owner').length;
  const openTickets = data.supportTickets.filter((t) => t.status !== 'Resolved').length;
  const [loading, setLoading] = useState(true);

  // Read leads count from localStorage
  const leadsCount = (() => {
    try {
      return JSON.parse(localStorage.getItem('staykolo.leads') || '[]').length;
    } catch {
      return 0;
    }
  })();

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(id);
  }, []);

  return (
    <SAShell>
      <DashHeading eyebrow="Super Admin Platform" title="Platform Overview" />
      {loading ? (
        <div className="mt-6">
          <DashSkeleton rows={5} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
            <StatCard label="Properties Listed" value={totalProps} />
            <StatCard label="Platform Tenants" value={totalTenants} />
            <StatCard label="PG Owners" value={totalOwners} />
            <StatCard label="Captured Leads" value={leadsCount + 14} sub="via Search & Locator" />
            <StatCard label="Open Concerns" value={openTickets} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="sk-card p-5">
              <div className="flex items-center justify-between">
                <p className="sk-eyebrow">Recent Property Listings</p>
                <Link href="/superadmin/listings" className="text-xs font-bold text-[#0878b0]">
                  View All →
                </Link>
              </div>
              <div className="mt-3 space-y-2">
                {pgs.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/superadmin/listings/${p.id}/edit`}
                    className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2 hover:bg-[#f5f8f9]"
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-[#355364]">{p.name}</p>
                      <p className="text-[10px] text-[#81909a]">{p.area} · {p.genderPolicy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#edf7fa] px-2 py-0.5 text-[10px] font-bold text-[#0878b0]">
                        ₹{p.startingRent.toLocaleString('en-IN')}/mo
                      </span>
                      <StatusBadge status={(data.listingStatuses as Record<string, string>)[p.id] ?? 'Approved'} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sk-card p-5">
              <div className="flex items-center justify-between">
                <p className="sk-eyebrow">Recent Operations Concerns</p>
                <Link href="/superadmin/raise-concern" className="text-xs font-bold text-[#0878b0]">
                  Manage →
                </Link>
              </div>
              {data.supportTickets.length === 0 ? (
                <p className="mt-3 text-[12px] text-[#81909a]">No open tickets</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {data.supportTickets.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2">
                      <div>
                        <p className="text-[12px] font-semibold text-[#355364]">{t.subject}</p>
                        <p className="text-[10px] text-[#81909a]">{t.raisedBy} ({t.raisedByRole})</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </SAShell>
  );
}

/* ========== ANALYTICS ========== */
function SAAnalytics() {
  return (
    <SAShell>
      <DashHeading eyebrow="Platform" title="Platform Analytics" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Macro performance across Bengaluru corridors, tenant move-ins, and PG onboarding.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Search Volume" value="18,420" sub="+24% this month" />
        <StatCard label="25% Discount Conversions" value="342" sub="via StayKolo vouchers" />
        <StatCard label="Ecosystem Transfers" value="28" sub="seamless deposit shifts" />
        <StatCard label="Active Subscription Revenue" value="₹1,84,000" sub="monthly recurring" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="sk-card p-5">
          <h3 className="sk-display text-sm font-bold text-[#18364a]">Top Search Localities (Phase 1 Bengaluru)</h3>
          <div className="mt-4 space-y-3">
            {[
              { name: 'HSR Layout (Sector 1-7)', percent: 34, count: '6,260 searches' },
              { name: 'Koramangala (Sony World Signal)', percent: 28, count: '5,150 searches' },
              { name: 'Bellandur & EcoSpace', percent: 18, count: '3,310 searches' },
              { name: 'Indiranagar & 100ft Rd', percent: 12, count: '2,210 searches' },
              { name: 'Whitefield & ITPL', percent: 8, count: '1,490 searches' },
            ].map((loc) => (
              <div key={loc.name}>
                <div className="flex justify-between text-xs font-semibold text-[#355364] mb-1">
                  <span>{loc.name}</span>
                  <span className="text-[#81909a]">{loc.count} ({loc.percent}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#edf1f3]">
                  <div className="h-2 rounded-full bg-[#168aad]" style={{ width: `${loc.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sk-card p-5">
          <h3 className="sk-display text-sm font-bold text-[#18364a]">Verified Badge Impact</h3>
          <p className="text-xs text-[#6d7e88] mt-1">Properties with Verified Badges vs Unverified</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#cde5eb] bg-[#edf7fa] p-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0878b0]">
                <ShieldCheck size={14} /> Verified PGs
              </span>
              <p className="mt-2 text-2xl font-bold text-[#18364a]">89.4%</p>
              <p className="text-[11px] text-[#6d7e88] mt-0.5">Average occupancy rate</p>
              <p className="mt-3 text-[11px] font-bold text-[#176d73]">3.8x more tenant enquiries</p>
            </div>
            <div className="rounded-xl border border-[#dfe9ed] bg-white p-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#81909a]">
                Standard PGs
              </span>
              <p className="mt-2 text-2xl font-bold text-[#506875]">68.1%</p>
              <p className="text-[11px] text-[#6d7e88] mt-0.5">Average occupancy rate</p>
              <p className="mt-3 text-[11px] text-[#81909a]">1.0x baseline enquiries</p>
            </div>
          </div>
        </div>
      </div>
    </SAShell>
  );
}

/* ========== LISTINGS (Req #27, #28) ========== */
function SAListings() {
  const [statuses, setStatuses] = useState(data.listingStatuses as Record<string, string>);
  const [verifiedBadges, setVerifiedBadges] = useState<Record<string, boolean>>({
    pg_001: true,
    pg_002: true,
    pg_003: true,
    pg_004: false,
    pg_005: true,
    pg_006: false,
  });

  const updateStatus = (id: string, status: string) =>
    setStatuses((prev) => ({ ...prev, [id]: status }));

  const toggleVerified = (id: string) =>
    setVerifiedBadges((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SAShell>
      <DashHeading
        eyebrow="Platform"
        title="All PG Properties"
        action={
          <Link href="/superadmin/listings/new" className="sk-button sk-button-primary text-xs">
            <Plus size={14} /> Create Listing
          </Link>
        }
      />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Manage listings, review on-site inspection status, and issue StayKolo Verified Badges.
      </p>

      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Property', 'Area', 'Owner', 'Rent', 'Verified Badge (#28)', 'Status', 'Actions']}
          rows={pgs.map((p) => [
            <Link key={p.id} href={`/superadmin/listings/${p.id}/edit`} className="font-semibold text-[#0878b0]">
              {p.name}
            </Link>,
            p.area,
            p.contact.ownerName,
            <span>₹{p.startingRent.toLocaleString('en-IN')}/mo</span>,
            <button
              key={`badge-${p.id}`}
              type="button"
              onClick={() => toggleVerified(p.id)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                verifiedBadges[p.id]
                  ? 'border border-[#168aad] bg-[#edf7fa] text-[#0878b0]'
                  : 'border border-[#dfe9ed] bg-[#f8fafb] text-[#81909a]'
              }`}
            >
              <ShieldCheck size={12} />
              {verifiedBadges[p.id] ? 'Verified ✓' : 'Unverified'}
            </button>,
            <StatusBadge key={`status-${p.id}`} status={statuses[p.id] ?? 'Approved'} />,
            <div key={`act-${p.id}`} className="flex items-center gap-1.5">
              <Link
                href={`/superadmin/listings/${p.id}/edit`}
                className="rounded border border-[#dfe9ee] px-2 py-0.5 text-[10px] font-bold text-[#506875] hover:bg-[#edf7fa]"
              >
                Edit
              </Link>
              {statuses[p.id] !== 'Approved' && (
                <button
                  type="button"
                  className="rounded border border-[#176d73] px-2 py-0.5 text-[10px] font-bold text-[#176d73]"
                  onClick={() => updateStatus(p.id, 'Approved')}
                >
                  Approve
                </button>
              )}
              {statuses[p.id] !== 'Suspended' && (
                <button
                  type="button"
                  className="rounded border border-[#b55b25] px-2 py-0.5 text-[10px] font-bold text-[#b55b25]"
                  onClick={() => updateStatus(p.id, 'Suspended')}
                >
                  Suspend
                </button>
              )}
            </div>,
          ])}
        />
      </div>
    </SAShell>
  );
}

/* ========== CREATE/EDIT LISTING WITH MAP (#15, #34) ========== */
function SAListingEdit() {
  const { id } = useParams<{ id: string }>();
  const property = pgs.find((p) => p.id === id);
  const [lat, setLat] = useState(property?.coordinates.lat ?? 12.95);
  const [lng, setLng] = useState(property?.coordinates.lng ?? 77.6);
  const [address, setAddress] = useState(property?.address ?? '');
  const [saved, setSaved] = useState(false);

  return (
    <SAShell>
      <Link href="/superadmin/listings" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> All listings
      </Link>
      <DashHeading eyebrow="Listing Management" title={property ? `Edit: ${property.name}` : 'Edit listing'} />
      {saved && (
        <div className="mt-4 rounded-lg bg-[#e4f4f7] p-3 text-[12px] font-semibold text-[#176d73]">
          Changes saved with updated coordinates for public search locator.
        </div>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Property name</span>
            <input
              defaultValue={property?.name ?? ''}
              className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Address</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
              placeholder="Search address…"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-[12px] font-bold text-[#405966]">Latitude</span>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-bold text-[#405966]">Longitude</span>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Area (Bangalore Locality)</span>
            <input defaultValue={property?.area ?? ''} className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Starting rent (₹)</span>
            <input
              type="number"
              defaultValue={property?.startingRent ?? ''}
              className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"
            />
          </label>
          <button type="button" className="sk-button sk-button-primary w-full text-xs" onClick={() => setSaved(true)}>
            Save Listing Details
          </button>
        </div>
        <div>
          <p className="mb-2 text-[12px] font-bold text-[#405966]">Pin location on Bengaluru Map</p>
          <p className="mb-3 text-[11px] text-[#81909a]">
            This exact coordinate position renders on the StayKolo PG Locator search map.
          </p>
          <MapView
            pins={[{ id: property?.id ?? 'new', name: property?.name ?? 'New property', lat, lng }]}
            selectedId={property?.id ?? 'new'}
            center={[lng, lat]}
            className="h-[400px]"
          />
        </div>
      </div>
    </SAShell>
  );
}

function SAListingNew() {
  const [lat, setLat] = useState(12.95);
  const [lng, setLng] = useState(77.6);
  const [saved, setSaved] = useState(false);

  if (saved)
    return (
      <SAShell>
        <div className="py-12 text-center">
          <CheckCircle className="mx-auto text-[#176d73]" size={32} />
          <h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Listing Created</h2>
          <p className="mt-2 text-[13px] text-[#6d7e88]">
            The property has been registered and pinned to the Bengaluru search map.
          </p>
          <Link href="/superadmin/listings" className="sk-button sk-button-primary mt-6 text-xs">
            Back to Listings
          </Link>
        </div>
      </SAShell>
    );

  return (
    <SAShell>
      <Link href="/superadmin/listings" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> All listings
      </Link>
      <DashHeading eyebrow="Listing" title="Create New Listing" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          {[
            ['Property name', 'text', 'e.g. Lavender Living PG'],
            ['Address', 'text', 'e.g. 5th Main, Koramangala 4th Block'],
            ['Area', 'text', 'e.g. Koramangala'],
            ['Starting rent (₹)', 'number', '14000'],
            ['Deposit (₹)', 'number', '25000'],
          ].map(([l, t, p]) => (
            <label key={l as string} className="block">
              <span className="mb-1 block text-[12px] font-bold text-[#405966]">{l}</span>
              <input
                type={t as string}
                placeholder={p as string}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
              />
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-[12px] font-bold text-[#405966]">Latitude</span>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-bold text-[#405966]">Longitude</span>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"
              />
            </label>
          </div>
          <button type="button" className="sk-button sk-button-primary w-full text-xs" onClick={() => setSaved(true)}>
            Create &amp; Pin Listing
          </button>
        </div>
        <div>
          <p className="mb-2 text-[12px] font-bold text-[#405966]">Pin location on map</p>
          <MapView
            pins={[{ id: 'new', name: 'New property', lat, lng }]}
            selectedId="new"
            center={[lng, lat]}
            className="h-[400px]"
          />
        </div>
      </div>
    </SAShell>
  );
}

/* ========== USERS & SEARCH LEADS (Req #1, #35, #49) ========== */
function SAUsers() {
  const [tab, setTab] = useState<'users' | 'leads'>('leads');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const users = data.allUsers.filter(
    (u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (statusFilter === 'all' || u.status === statusFilter)
  );

  // Read leads captured from search / property page
  const [leads, setLeads] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('staykolo.leads') || '[]');
      const defaults = [
        {
          id: 'lead_default_1',
          name: 'Arjun Menon',
          contact: '+91 98451 90212',
          propertyName: 'Orchid House',
          area: 'HSR Layout',
          message: 'Interested in single room with food, move in next Monday.',
          timestamp: '2025-03-01T09:42:00.000Z',
        },
        {
          id: 'lead_default_2',
          name: 'Pooja Hegde',
          contact: '+91 97312 88401',
          propertyName: 'Sunrise Living',
          area: 'Bellandur',
          message: 'Claim 25% discount voucher for 2-sharing room.',
          timestamp: '2025-02-28T14:15:00.000Z',
        },
      ];
      return [...stored, ...defaults];
    } catch {
      return [];
    }
  });

  return (
    <SAShell>
      <DashHeading eyebrow="Platform Data" title="Users &amp; Search Leads" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Track registered accounts and guest search leads captured via the StayKolo website (#1, #35, #49).
      </p>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 border-b border-[#dfe9ee] pb-2">
        <button
          type="button"
          onClick={() => setTab('leads')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            tab === 'leads' ? 'bg-[#168aad] text-white' : 'bg-[#f5f8f9] text-[#506875] hover:bg-[#edf7fa]'
          }`}
        >
          Captured Search Leads ({leads.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('users')}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            tab === 'users' ? 'bg-[#168aad] text-white' : 'bg-[#f5f8f9] text-[#506875] hover:bg-[#edf7fa]'
          }`}
        >
          Registered Accounts ({users.length})
        </button>
      </div>

      {tab === 'leads' ? (
        <div className="mt-5 sk-card overflow-hidden">
          <DataTable
            headers={['Lead Name', 'Phone UID', 'Property / Area', 'Enquiry Message', 'ISO Timestamp (#49)']}
            rows={leads.map((l) => [
              <span key={`name-${l.id}`} className="font-semibold text-[#18364a]">{l.name}</span>,
              <span key={`uid-${l.id}`} className="font-mono text-xs text-[#0878b0]">{l.contact}</span>,
              <span key={`prop-${l.id}`} className="text-xs text-[#506875]">
                {l.propertyName} <span className="text-[#81909a]">({l.area})</span>
              </span>,
              <span key={`msg-${l.id}`} className="text-xs text-[#6d7e88] max-w-[260px] truncate block">
                {l.message || 'Direct discount claim'}
              </span>,
              <span key={`time-${l.id}`} className="text-[11px] text-[#81909a] font-mono">
                {new Date(l.timestamp).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>,
            ])}
          />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {['all', 'Tenant', 'Owner'].map((r) => (
              <button
                key={r}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                  roleFilter === r ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'
                }`}
                onClick={() => setRoleFilter(r)}
              >
                {r === 'all' ? 'All roles' : r}
              </button>
            ))}
            {['all', 'Active', 'Suspended'].map((s) => (
              <button
                key={s}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                  statusFilter === s ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'
                }`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All status' : s}
              </button>
            ))}
          </div>
          <div className="mt-4 sk-card overflow-hidden">
            <DataTable
              headers={['Name', 'Email / UID', 'Role', 'Property', 'Status', 'Joined', 'Actions']}
              rows={users.map((u) => [
                <Link key={u.id} href={`/superadmin/users/${u.id}`} className="font-semibold text-[#0878b0]">
                  {u.name}
                </Link>,
                <span key={`email-${u.id}`} className="text-[11px]">{u.email}</span>,
                u.role,
                u.propertyName,
                <StatusBadge key={`st-${u.id}`} status={u.status} />,
                u.joinedDate,
                <Link key={`v-${u.id}`} href={`/superadmin/users/${u.id}`} className="text-[11px] font-bold text-[#0878b0]">
                  View
                </Link>,
              ])}
            />
          </div>
        </>
      )}
    </SAShell>
  );
}

function SAUserDetail() {
  const { id } = useParams<{ id: string }>();
  const user = data.allUsers.find((u) => u.id === id);
  if (!user)
    return (
      <SAShell>
        <DashEmpty
          icon={<User size={18} />}
          title="User not found"
          description="This user account may have been removed."
          action={<Link href="/superadmin/users" className="sk-button sk-button-secondary text-xs">Back to users</Link>}
        />
      </SAShell>
    );

  const [status, setStatus] = useState(user.status);

  return (
    <SAShell>
      <Link href="/superadmin/users" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> All users
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf7fa] text-[20px] font-bold text-[#0878b0]">
          {user.name[0]}
        </div>
        <div>
          <h1 className="sk-display text-[22px] font-bold text-[#18364a]">{user.name}</h1>
          <p className="text-[12px] text-[#6d7e88]">{user.role} · {user.propertyName}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Email / Phone UID', user.email],
          ['Role', user.role],
          ['Property', user.propertyName],
          ['Joined', user.joinedDate],
          ['Account Status', ''],
        ].map(([l, v]) => (
          <div key={l} className="sk-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">{l}</p>
            {l === 'Account Status' ? (
              <div className="mt-1">
                <StatusBadge status={status} />
              </div>
            ) : (
              <p className="mt-1 text-[13px] text-[#355364]">{v}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="sk-button sk-button-secondary text-[12px]">
          <Eye size={14} /> Support Login Preview
        </button>
        {status === 'Active' ? (
          <button
            type="button"
            className="sk-button border border-[#b55b25] bg-white text-[12px] text-[#b55b25]"
            onClick={() => setStatus('Suspended')}
          >
            Suspend Account
          </button>
        ) : (
          <button
            type="button"
            className="sk-button border border-[#176d73] bg-white text-[12px] text-[#176d73]"
            onClick={() => setStatus('Active')}
          >
            Reinstate Account
          </button>
        )}
      </div>
    </SAShell>
  );
}

/* ========== TENANTS DATABASE (Req #7, #8) ========== */
function SATenants() {
  return (
    <SAShell>
      <DashHeading eyebrow="Platform Database" title="All Registered Tenants" />
      <div className="mt-3 rounded-lg border border-[#cde5eb] bg-[#edf7fa] p-3 text-xs text-[#0878b0]">
        <strong>Req #7 &amp; #8:</strong> As Super Admin, you have master access to tenant records across all Bengaluru PGs. Tenant issues and day-to-day problems are resolved at the PG Admin level.
      </div>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Tenant Name', 'Phone UID (#19)', 'Assigned PG', 'Room & Floor', 'Rent Status', 'Move-in Date']}
          rows={data.allTenantPayments.map((p, idx) => [
            <span key={`tn-${idx}`} className="font-semibold text-[#18364a]">{p.tenantName}</span>,
            <span key={`ph-${idx}`} className="font-mono text-xs text-[#81909a]">+91 98450 {10000 + idx * 111}</span>,
            <span key={`pg-${idx}`} className="text-xs font-medium text-[#506875]">{idx % 2 === 0 ? 'Orchid House' : 'Sunrise Living'}</span>,
            p.room,
            <StatusBadge key={`st-${idx}`} status={p.status} />,
            <span key={`dt-${idx}`} className="text-xs text-[#81909a]">Jan 2025</span>,
          ])}
        />
      </div>
    </SAShell>
  );
}

/* ========== STAFF DATABASE (Req #3) ========== */
function SAStaff() {
  return (
    <SAShell>
      <DashHeading eyebrow="Platform" title="Master Staff Records" />
      <p className="mt-2 text-[13px] text-[#6d7e88]">
        Staff accounts created by respective PG owners across Bengaluru properties.
      </p>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Staff Name', 'Role', 'Assigned PG', 'Phone UID', 'Attendance Status', 'Active Duty']}
          rows={data.staff.map((s) => [
            <span key={`sn-${s.id}`} className="font-semibold">{s.name}</span>,
            s.role,
            'Orchid House',
            <span key={`sph-${s.id}`} className="font-mono text-xs text-[#81909a]">{s.phone}</span>,
            <StatusBadge key={`sat-${s.id}`} status={s.attendance === 'Absent' ? 'Suspended' : 'Active'} />,
            s.onDuty ? <StatusBadge key={`sd-${s.id}`} status="Active" /> : <span key={`sod-${s.id}`} className="text-[11px] text-[#81909a]">Off duty</span>,
          ])}
        />
      </div>
    </SAShell>
  );
}

/* ========== RAISE CONCERN (Req #26) ========== */
function SARaiseConcern() {
  const allTickets = [
    ...data.supportTickets,
    ...data.issues
      .filter((i) => i.priority === 'High')
      .map((i) => ({
        id: i.id,
        subject: i.description.slice(0, 50),
        description: i.description,
        status: i.status,
        priority: i.priority,
        raisedBy: i.raisedBy,
        raisedByRole: 'Tenant' as const,
        propertyId: i.propertyId,
        raisedDate: i.raisedDate,
        assignedTo: i.assignedStaff,
      })),
  ];

  return (
    <SAShell>
      <DashHeading eyebrow="Operations" title="Raise Concern (Platform Support)" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Platform-wide tickets escalated by PG Owners and emergency platform inquiries.
      </p>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Subject', 'From', 'Role', 'Property', 'Priority', 'Status', 'Date']}
          rows={allTickets.map((t) => [
            <span key={`sub-${t.id}`} className="font-semibold max-w-[200px] truncate block">{t.subject}</span>,
            t.raisedBy,
            t.raisedByRole,
            t.propertyId,
            <StatusBadge key={`pri-${t.id}`} status={t.priority} />,
            <StatusBadge key={`st-${t.id}`} status={t.status} />,
            new Date(t.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          ])}
        />
      </div>
    </SAShell>
  );
}

/* ========== BILLING ========== */
function SABilling() {
  return (
    <SAShell>
      <DashHeading eyebrow="Operations" title="PG Owner Subscriptions &amp; Billing" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Monthly and annual platform subscriptions for listed Bengaluru PG properties.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Subscribed PGs" value="48" sub="Pro & Enterprise tiers" />
        <StatCard label="Monthly Billing Run" value="₹1,84,000" sub="Billed on 1st of month" />
        <StatCard label="Failed / Overdue Invoices" value="0" sub="All accounts in good standing" />
      </div>

      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['PG Property', 'Owner', 'Plan', 'Monthly Fee', 'Next Billing', 'Status']}
          rows={[
            ['Orchid House (HSR Layout)', 'Suresh Babu', 'Pro Tier', '₹3,500/mo', '01 Apr 2025', <StatusBadge key="b1" status="Active" />],
            ['Sunrise Living (Bellandur)', 'Naveen Reddy', 'Pro Tier', '₹3,500/mo', '01 Apr 2025', <StatusBadge key="b2" status="Active" />],
            ['Kaveri Heights (Indiranagar)', 'Meenakshi Iyer', 'Enterprise Tier', '₹6,000/mo', '01 Apr 2025', <StatusBadge key="b3" status="Active" />],
            ['Whitefield Tech Stays', 'Anand Rao', 'Starter Tier', '₹1,999/mo', '01 Apr 2025', <StatusBadge key="b4" status="Active" />],
          ]}
        />
      </div>
    </SAShell>
  );
}

/* ========== CHANGES LOG (Req #45, #49) ========== */
function SAChangesLog() {
  const logs = [
    { id: '1', action: 'PG Orchid House approved & Verified badge assigned', user: 'Super Admin', timestamp: '2025-03-01T10:30:00Z', section: 'Properties' },
    { id: '2', action: 'User Priya account suspended for policy breach', user: 'Super Admin', timestamp: '2025-02-28T14:15:00Z', section: 'Users' },
    { id: '3', action: 'Billing plan updated for Sunrise PG', user: 'Super Admin', timestamp: '2025-02-27T09:00:00Z', section: 'Billing' },
    { id: '4', action: 'Legal doc Terms of Service v2.1 published with Karnataka jurisdiction', user: 'Super Admin', timestamp: '2025-02-26T18:45:00Z', section: 'Legal' },
    { id: '5', action: 'Chronicle article published: First PG Visit Checklist', user: 'Super Admin', timestamp: '2025-02-25T11:20:00Z', section: 'Content' },
  ];

  return (
    <SAShell>
      <DashHeading eyebrow="Audit &amp; Compliance" title="Platform Changes Log" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Track all platform-wide administrative updates with universal ISO timestamps (#45, #49).
      </p>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Action', 'Admin User', 'Module', 'Universal Timestamp (#49)']}
          rows={logs.map((l) => [
            <span key={`a-${l.id}`} className="font-semibold text-[#18364a]">{l.action}</span>,
            l.user,
            <span key={`s-${l.id}`} className="rounded-full bg-[#edf7fa] px-2.5 py-0.5 text-[10px] font-bold text-[#0878b0]">
              {l.section}
            </span>,
            new Date(l.timestamp).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          ])}
        />
      </div>
    </SAShell>
  );
}

/* ========== CHRONICLES CMS (#30) ========== */
function SAChronicles() {
  return (
    <SAShell>
      <DashHeading
        eyebrow="Content Management"
        title="Chronicles CMS"
        action={
          <Link href="/superadmin/chronicles-cms/new" className="sk-button sk-button-primary text-xs">
            <Plus size={14} /> New Article
          </Link>
        }
      />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Publish rental guides, area spotlights, and tenant tips for the Bengaluru community.
      </p>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Article Title', 'Tag', 'Read Time', 'Published Date', 'Status']}
          rows={[
            ['A practical checklist for your first PG visit', '#tenant-tips', '5 min read', '18 Feb 2025', <StatusBadge key="c1" status="Approved" />],
            ['Choosing a Bengaluru area around your commute', '#tenant-tips', '4 min read', '11 Feb 2025', <StatusBadge key="c2" status="Approved" />],
            ['The property details residents ask for first', '#owner-guides', '6 min read', '06 Feb 2025', <StatusBadge key="c3" status="Approved" />],
            ['Why StayKolo uses verification notes, not star ratings', '#staykolo-updates', '4 min read', '21 Jan 2025', <StatusBadge key="c4" status="Approved" />],
          ]}
        />
      </div>
    </SAShell>
  );
}

function SAChronicleNew() {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('#tenant-tips');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  if (saved)
    return (
      <SAShell>
        <div className="py-12 text-center">
          <CheckCircle className="mx-auto text-[#176d73]" size={32} />
          <h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Article Published</h2>
          <p className="mt-2 text-xs text-[#6d7e88]">The Chronicle post is live on the public website.</p>
          <Link href="/superadmin/chronicles-cms" className="sk-button sk-button-primary mt-6 text-xs">
            Back to Chronicles CMS
          </Link>
        </div>
      </SAShell>
    );

  return (
    <SAShell>
      <Link href="/superadmin/chronicles-cms" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> All Articles
      </Link>
      <DashHeading eyebrow="Content CMS" title="Create Chronicle Post" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
        className="mt-6 max-w-[700px] space-y-4"
      >
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-[#405966]">Article Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Navigating Bellandur Traffic: A Renter's Guide"
            required
            className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-[#405966]">Category Tag</span>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
          >
            <option value="#tenant-tips">#tenant-tips</option>
            <option value="#owner-guides">#owner-guides</option>
            <option value="#staykolo-updates">#staykolo-updates</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-[#405966]">Content (Markdown)</span>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the guide content here..."
            required
            className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
          />
        </label>
        <button type="submit" className="sk-button sk-button-primary text-xs">
          Publish Chronicle <ArrowRight size={14} />
        </button>
      </form>
    </SAShell>
  );
}

/* ========== LEGAL DOCS ========== */
function SALegalDocs() {
  return (
    <SAShell>
      <DashHeading eyebrow="Compliance" title="Legal Documents Manager" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Review and update Terms of Service, Privacy Policy, and Data Deletion Policy.
      </p>
      <div className="mt-6 space-y-3 max-w-[750px]">
        {[
          { title: 'Terms of Service & User Agreement', version: 'v2.1', jurisdiction: 'Bengaluru, Karnataka', link: '/legal/terms' },
          { title: 'Privacy Policy (DPDP Act 2023 Compliant)', version: 'v1.4', jurisdiction: 'Bengaluru, Karnataka', link: '/legal/privacy' },
          { title: 'Account & Data Deletion Policy', version: 'v1.0', jurisdiction: 'Bengaluru, Karnataka', link: '/legal/data-deletion' },
        ].map((doc) => (
          <div key={doc.title} className="sk-card flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-bold text-[#18364a]">{doc.title}</p>
              <p className="text-[10px] text-[#81909a] mt-0.5">Version {doc.version} · {doc.jurisdiction}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={doc.link} target="_blank" className="sk-button sk-button-secondary text-[11px] py-1">
                View Live
              </Link>
            </div>
          </div>
        ))}
      </div>
    </SAShell>
  );
}

/* ========== SETTINGS (Req #14, #46: LAST) ========== */
function SASettings() {
  return (
    <SAShell>
      <DashHeading eyebrow="Platform Configuration" title="Global Platform Settings" />
      <p className="mt-2 text-xs text-[#6d7e88]">
        Full administrative control over StayKolo platform configurations, vouchers, and corridor limits.
      </p>
      <div className="mt-6 space-y-3 max-w-[750px]">
        {[
          ['Platform Brand Name', 'StayKolo'],
          ['Parent Entity', 'CoreForge Technologies'],
          ['State Branding', 'Brand Karnataka (Yellow & Red)'],
          ['Active Rollout Phase', 'Phase 1 Bengaluru (HSR, Koramangala, Bellandur, Indiranagar, Whitefield)'],
          ['Guest Free Search Limit', '5 Properties (Requires UID login for expanded search)'],
          ['25% 1st Month Voucher Program', 'Active for all Verified PGs'],
          ['Ecosystem Deposit Transfer Protocol', 'Enabled across network'],
          ['Universal User Identifier', '10-Digit Mobile Phone Number (UID)'],
          ['Audio Notification Chime', 'Web Audio API Dual-Tone Chime Enabled'],
          ['Support Dispatch Email', 'support@staykolo.in'],
        ].map(([label, value]) => (
          <div key={label} className="sk-card flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-bold text-[#355364]">{label}</p>
            </div>
            <span className="text-xs font-semibold text-[#0878b0] max-w-[320px] text-right">{value}</span>
          </div>
        ))}
      </div>
    </SAShell>
  );
}

/* ========== ROUTER ========== */
export function SuperAdminDashboard() {
  return (
    <Switch>
      <Route path="/superadmin/overview" component={SAOverview} />
      <Route path="/superadmin/analytics" component={SAAnalytics} />
      <Route path="/superadmin/listings/new" component={SAListingNew} />
      <Route path="/superadmin/listings/:id/edit" component={SAListingEdit} />
      <Route path="/superadmin/listings" component={SAListings} />
      <Route path="/superadmin/users/:id" component={SAUserDetail} />
      <Route path="/superadmin/users" component={SAUsers} />
      <Route path="/superadmin/tenants" component={SATenants} />
      <Route path="/superadmin/staff" component={SAStaff} />
      <Route path="/superadmin/raise-concern" component={SARaiseConcern} />
      <Route path="/superadmin/support-tickets" component={SARaiseConcern} />
      <Route path="/superadmin/billing" component={SABilling} />
      <Route path="/superadmin/changes-log" component={SAChangesLog} />
      <Route path="/superadmin/chronicles-cms/new" component={SAChronicleNew} />
      <Route path="/superadmin/chronicles-cms" component={SAChronicles} />
      <Route path="/superadmin/legal-docs" component={SALegalDocs} />
      <Route path="/superadmin/settings" component={SASettings} />
      <Route path="/superadmin" component={SAOverview} />
      <Route>
        {() => {
          const [, setLoc] = useLocation();
          useEffect(() => {
            setLoc('/superadmin/overview');
          }, []);
          return null;
        }}
      </Route>
    </Switch>
  );
}
