import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams, Route, Switch } from 'wouter';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bed, Bell, BellPlus, Building2, Calendar, CalendarDays,
  Check, CheckCircle, ChevronDown, CircleAlert, ClipboardList, CreditCard, Droplets, Eye,
  FileText, Home, ImagePlus, Lightbulb, MessageSquarePlus, PenLine, Phone, Plus, RotateCcw,
  ScrollText, Send, Settings, ShieldCheck, Sparkles, Ticket, ToggleLeft, ToggleRight, Trash2,
  Upload, UserCheck, Users, Utensils, Wifi, Wrench, X, DoorOpen, Armchair,
} from 'lucide-react';
import {
  AdminLayout, DashHeading, DashSkeleton, DashEmpty, DashError, StatusBadge, StatCard,
  DataTable, PropertySwitcher, ModuleProvider, useModules,
} from '@/components/dashboard-shared';
import pgsJson from '../../mock-data/pgs.json';
import data from '../../mock-data/dashboard.json';

const pgs = pgsJson as (typeof pgsJson)[number][];
const ownerProperties = [{ id: 'pg_001', name: 'Orchid House' }];

function AdminShell({ children }: { children: ReactNode }) {
  const { modules } = useModules();
  const [selectedProperty, setSelectedProperty] = useState(ownerProperties[0].id);
  const groups = [
    {
      title: 'Platform',
      items: [
        { href: '/admin/overview', icon: <Home size={16} />, label: 'Overview' },
      ],
    },
    {
      title: 'Property',
      items: [
        { href: '/admin/rooms', icon: <Bed size={16} />, label: 'Rooms', hidden: !modules.rooms },
        { href: '/admin/water', icon: <Droplets size={16} />, label: 'Water', hidden: !modules.water },
        { href: '/admin/electricity', icon: <Lightbulb size={16} />, label: 'Electricity', hidden: !modules.electricity },
        { href: '/admin/food', icon: <Utensils size={16} />, label: 'Food Menu', hidden: !modules.food },
        { href: '/admin/staff', icon: <UserCheck size={16} />, label: 'Staff Management', hidden: !modules['staff-attendance'] },
        { href: '/admin/visitor-log', icon: <DoorOpen size={16} />, label: 'Visitors Log', hidden: !modules['visitor-log'] },
        { href: '/admin/furniture', icon: <Armchair size={16} />, label: 'Furniture', hidden: !modules.furniture },
        { href: '/admin/wifi', icon: <Wifi size={16} />, label: 'WiFi Control', hidden: !modules.wifi },
        { href: '/admin/amenities', icon: <Settings size={16} />, label: 'Amenities', hidden: !modules.amenities },
      ],
    },
    {
      title: 'Operations',
      items: [
        { href: '/admin/tenants', icon: <Users size={16} />, label: 'Tenants' },
        { href: '/admin/issues', icon: <Wrench size={16} />, label: 'Issues' },
        { href: '/admin/notices', icon: <Bell size={16} />, label: 'Notices', hidden: !modules.notices },
        { href: '/admin/payments', icon: <CreditCard size={16} />, label: 'Payments', hidden: !modules.payments },
        { href: '/admin/agreements', icon: <FileText size={16} />, label: 'Agreements', hidden: !modules.agreements },
        { href: '/admin/changes-log', icon: <ClipboardList size={16} />, label: 'Changes Log' },
      ],
    },
    {
      title: 'Support',
      items: [
        { href: '/admin/raise-concern', icon: <Ticket size={16} />, label: 'Raise Concern' },
        { href: '/admin/properties', icon: <Building2 size={16} />, label: 'Properties' },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { href: '/admin/settings/modules', icon: <Settings size={16} />, label: 'Settings' },
      ],
    },
  ];

  return (
    <AdminLayout
      sidebarGroups={groups}
      header={
        <PropertySwitcher
          properties={ownerProperties}
          selectedId={selectedProperty}
          onSelect={setSelectedProperty}
        />
      }
    >
      {children}
    </AdminLayout>
  );
}

/* ========== 1. OVERVIEW (FIRST - #31, #47) ========== */
function AdminOverview() {
  const rooms = data.rooms;
  const totalBeds = rooms.reduce((sum, r) => sum + r.beds.length, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.beds.filter((b) => b.status === 'Occupied').length, 0);
  const vacantBeds = totalBeds - occupiedBeds;
  const pendingIssues = data.issues.filter((i) => i.status !== 'Resolved').length;
  const paidCount = data.allTenantPayments.filter((p) => p.status === 'Paid').length;
  const totalTenants = data.allTenantPayments.length;
  const staffOnDuty = data.staff.filter((s) => s.onDuty).length;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <AdminShell>
      <DashHeading eyebrow="PG Owner Control Center" title="Property Overview" />
      {loading ? (
        <div className="mt-6">
          <DashSkeleton rows={5} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
            <StatCard label="Occupancy" value={`${Math.round((occupiedBeds / totalBeds) * 100)}%`} sub={`${occupiedBeds}/${totalBeds} beds`} />
            <StatCard label="Vacant beds" value={vacantBeds} />
            <StatCard label="Pending issues" value={pendingIssues} />
            <StatCard label="Payments" value={`${paidCount}/${totalTenants}`} sub="approved this month" />
            <StatCard label="Staff on duty" value={staffOnDuty} sub={`of ${data.staff.length} staff`} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="sk-card p-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1f3]">
                <p className="sk-eyebrow">Pending Tenant Concerns</p>
                <Link href="/admin/issues" className="text-xs font-bold text-[#0878b0]">
                  View all
                </Link>
              </div>
              <div className="mt-3 space-y-2">
                {data.issues
                  .filter((i) => i.status !== 'Resolved')
                  .slice(0, 3)
                  .map((i) => (
                    <Link
                      key={i.id}
                      href={`/admin/issues/${i.id}`}
                      className="flex items-center justify-between rounded-lg border border-[#edf1f3] px-3 py-2 hover:bg-[#f5f8f9]"
                    >
                      <div>
                        <p className="text-[12px] font-semibold text-[#355364]">{i.description.slice(0, 50)}…</p>
                        <p className="text-[10px] text-[#81909a]">
                          {i.raisedBy} · Category: {i.category}
                        </p>
                      </div>
                      <StatusBadge status={i.status} />
                    </Link>
                  ))}
              </div>
            </div>

            <div className="sk-card p-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#edf1f3]">
                <p className="sk-eyebrow">Today's Visitors Log</p>
                <Link href="/admin/visitor-log" className="text-xs font-bold text-[#0878b0]">
                  View all ({data.visitors.length})
                </Link>
              </div>
              <div className="mt-3 space-y-2">
                {data.visitors.slice(0, 3).map((v) => (
                  <div key={v.id} className="rounded-lg border border-[#edf1f3] px-3 py-2 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-[#355364]">{v.visitorName} → {v.residentVisited}</p>
                      <p className="text-[10px] text-[#81909a]">
                        Entry: {new Date(v.entryTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {v.purpose}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#176d73]">Logged by Staff</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

/* ========== 2. FOOD & MENU MANAGEMENT (#9) ========== */
function AdminFood() {
  const f = data.food;
  const [menuMode, setMenuMode] = useState<'daily' | 'fixed'>('daily');
  const [activeDay, setActiveDay] = useState('Monday');
  const [editing, setEditing] = useState(false);
  const [specialItems, setSpecialItems] = useState([
    { id: 'sp_1', title: 'Sunday Special Chicken / Paneer Biryani with Raita', day: 'Sunday', meal: 'Dinner' },
    { id: 'sp_2', title: 'Ugadi / Festival Special Sweet Payasam & Vada', day: 'Wednesday', meal: 'Lunch' },
  ]);
  const [showAddSpecial, setShowAddSpecial] = useState(false);
  const [newSpecialTitle, setNewSpecialTitle] = useState('');
  const [newSpecialDay, setNewSpecialDay] = useState('Sunday');
  const [newSpecialMeal, setNewSpecialMeal] = useState('Dinner');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addSpecial = (e: FormEvent) => {
    e.preventDefault();
    if (!newSpecialTitle) return;
    setSpecialItems([
      ...specialItems,
      { id: `sp_${Date.now()}`, title: newSpecialTitle, day: newSpecialDay, meal: newSpecialMeal },
    ]);
    setShowAddSpecial(false);
    setNewSpecialTitle('');
  };

  return (
    <AdminShell>
      <DashHeading
        eyebrow="Dining &amp; Kitchen"
        title="Food Menu Management"
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="sk-button sk-button-secondary text-xs"
              onClick={() => setShowAddSpecial(true)}
            >
              <Plus size={14} /> Add Special Item
            </button>
            <button
              type="button"
              className="sk-button sk-button-primary text-xs"
              onClick={() => setEditing(!editing)}
            >
              <PenLine size={14} /> {editing ? 'Done Editing' : 'Edit Menu'}
            </button>
          </div>
        }
      />
      <p className="mt-1 text-xs text-[#6d7e88]">
        Configure ① Daily-wise menu, ② Fixed menu toggle for all days, or ③ Add special festive dishes (#9).
      </p>

      {/* Menu Mode Toggle Bar (#9) */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 sk-card p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#18364a]">Menu Structure:</span>
          <div className="inline-flex rounded-lg border border-[#dfe9ee] p-0.5 bg-[#f5f8f9]">
            <button
              type="button"
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                menuMode === 'daily' ? 'bg-[#0878b0] text-white shadow-sm' : 'text-[#506875]'
              }`}
              onClick={() => setMenuMode('daily')}
            >
              ① Daily-Wise Schedule
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                menuMode === 'fixed' ? 'bg-[#0878b0] text-white shadow-sm' : 'text-[#506875]'
              }`}
              onClick={() => setMenuMode('fixed')}
            >
              ② Fixed Menu (All Days)
            </button>
          </div>
        </div>
        <span className="text-[11px] text-[#81909a]">
          {menuMode === 'daily' ? 'Separate menu per weekday' : 'Same fixed menu repeats daily'}
        </span>
      </div>

      {/* Weekday Selector for Daily Mode */}
      {menuMode === 'daily' && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDay(d)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                activeDay === d
                  ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]'
                  : 'border-[#dfe9ee] bg-white text-[#506875] hover:bg-[#f9fafb]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Today's / Active Meal Cards */}
      <div className="mt-5 space-y-3">
        {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
          const m = f.todayMenu[meal];
          return (
            <div key={meal} className="sk-card p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-[14px] font-bold capitalize text-[#18364a]">{meal}</h3>
                <span className="text-[11px] text-[#81909a]">{m.time}</span>
              </div>
              {editing ? (
                <textarea
                  defaultValue={m.items}
                  className="mt-2 w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] text-[#18364a] outline-none focus:border-[#168aad]"
                  rows={2}
                />
              ) : (
                <p className="mt-2 text-[13px] text-[#6d7e88]">{m.items}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ③ Special Items Section (#9) */}
      <div className="mt-6 sk-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1f3]">
          <div>
            <h3 className="text-sm font-bold text-[#18364a]">③ Special Dishes &amp; Weekend Feasts</h3>
            <p className="text-[11px] text-[#70818b] mt-0.5">Special meals scheduled for holidays or Sundays</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddSpecial(true)}
            className="text-xs font-bold text-[#0878b0]"
          >
            + Add Special
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {specialItems.map((sp) => (
            <div key={sp.id} className="flex items-center justify-between rounded-lg border border-[#edf1f3] p-3">
              <div>
                <span className="rounded bg-[#edf7fa] px-2 py-0.5 text-[10px] font-bold text-[#0878b0]">
                  {sp.day} · {sp.meal}
                </span>
                <p className="text-xs font-bold text-[#18364a] mt-1">{sp.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSpecialItems(specialItems.filter((x) => x.id !== sp.id))}
                className="text-xs text-[#b55b25] hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Special Modal */}
      {showAddSpecial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={addSpecial} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#18364a]">Add Special Dish</h3>
            <div>
              <label className="block text-xs font-bold text-[#405966] mb-1">Dish Name &amp; Details</label>
              <input
                required
                value={newSpecialTitle}
                onChange={(e) => setNewSpecialTitle(e.target.value)}
                placeholder="e.g. Hyderabadi Mutton Biryani + Gulab Jamun"
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Day</label>
                <select
                  value={newSpecialDay}
                  onChange={(e) => setNewSpecialDay(e.target.value)}
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs"
                >
                  {days.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Meal Time</label>
                <select
                  value={newSpecialMeal}
                  onChange={(e) => setNewSpecialMeal(e.target.value)}
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs"
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSpecial(false)}
                className="flex-1 rounded-lg border border-[#d3e0e4] p-2.5 text-xs font-bold text-[#506875]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#0878b0] p-2.5 text-xs font-bold text-white hover:bg-[#076899]"
              >
                Save Special Item
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

/* ========== 3. STAFF MANAGEMENT & ACCESS TOGGLES (#10, #17, #44) ========== */
function AdminStaff() {
  const [staffList, setStaffList] = useState(data.staff);
  const [adding, setAdding] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Warden');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('pass123');
  const [staffAccess, setStaffAccess] = useState<Record<string, boolean>>({
    visitors: true,
    issues: true,
    food: true,
    tenants: false,
  });

  const toggleDuty = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, onDuty: !s.onDuty } : s))
    );
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  const addStaff = (e: FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPhone) return;
    const newMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      phone: newStaffPhone,
      attendance: 'Present',
      onDuty: true,
    };
    setStaffList([...staffList, newMember]);
    setAdding(false);
    setNewStaffName('');
    setNewStaffPhone('');
  };

  return (
    <AdminShell>
      <DashHeading
        eyebrow="Personnel"
        title="Staff &amp; Access Control"
        action={
          <button
            type="button"
            className="sk-button sk-button-primary text-xs"
            onClick={() => setAdding(true)}
          >
            <Plus size={14} /> Add Staff Member
          </button>
        }
      />
      <p className="mt-1 text-xs text-[#6d7e88]">
        Create staff credentials (UID = phone). Toggle module access permissions per staff member (#17, #44).
      </p>

      {/* Staff Table */}
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Staff Name', 'Role', 'UID (Phone)', 'Duty Status', 'Attendance', 'Actions']}
          rows={staffList.map((s) => [
            <span className="font-semibold text-xs text-[#18364a]">{s.name}</span>,
            s.role,
            <span className="text-[11px] text-[#81909a]">{s.phone}</span>,
            <button
              type="button"
              onClick={() => toggleDuty(s.id)}
              className={`rounded px-2.5 py-1 text-[11px] font-bold ${
                s.onDuty ? 'bg-[#e4f4f7] text-[#176d73]' : 'bg-[#edf1f3] text-[#70818b]'
              }`}
            >
              {s.onDuty ? '✓ On Duty' : 'Off Duty'}
            </button>,
            <StatusBadge status={s.attendance} />,
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => deleteStaff(s.id)}
                className="text-[11px] font-bold text-[#b55b25] hover:underline"
              >
                Delete
              </button>
            </div>,
          ])}
        />
      </div>

      {/* Add Staff Modal (#10, #17, #44) */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={addStaff} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#18364a]">Create Staff Account</h3>
            <div>
              <label className="block text-xs font-bold text-[#405966] mb-1">Staff Full Name</label>
              <input
                required
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="e.g. Suresh Gowda"
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Role / Duty</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs"
                >
                  <option>Warden</option>
                  <option>Caretaker</option>
                  <option>Chef</option>
                  <option>Security</option>
                  <option>Housekeeping</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Phone (UID)</label>
                <input
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#405966] mb-1">Temporary Password</label>
              <input
                value={newStaffPass}
                onChange={(e) => setNewStaffPass(e.target.value)}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs"
              />
            </div>

            {/* Admin Toggle for Staff Access (#44) */}
            <div className="border-t border-[#edf1f3] pt-3">
              <p className="text-xs font-bold text-[#18364a] mb-2">Toggle Module Permissions (#44)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'visitors', label: 'Visitor Logging' },
                  { key: 'issues', label: 'Issue Resolution' },
                  { key: 'food', label: 'Food Attendance' },
                  { key: 'tenants', label: 'Tenant Directory' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={staffAccess[item.key]}
                      onChange={(e) =>
                        setStaffAccess({ ...staffAccess, [item.key]: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#0878b0]"
                    />
                    <span className="text-[#355364]">{item.label}</span>
                  </label>
                ))}
              </div>
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
                Create Staff Account
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

/* ========== 4. TENANTS (1st Priority - #20, #24) ========== */
function AdminTenants() {
  const [tenants, setTenants] = useState(data.allTenantPayments);
  const [selectedTenant, setSelectedTenant] = useState<(typeof data.allTenantPayments)[number] | null>(null);
  const [addingTenant, setAddingTenant] = useState(false);
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tRoom, setTRoom] = useState('201');
  const [tRent, setTRent] = useState('14500');

  const approveRent = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => (t.tenantId === id ? { ...t, status: 'Paid' } : t))
    );
    if (selectedTenant && selectedTenant.tenantId === id) {
      setSelectedTenant({ ...selectedTenant, status: 'Paid' });
    }
  };

  const addTenant = (e: FormEvent) => {
    e.preventDefault();
    if (!tName || !tPhone) return;
    const newT = {
      tenantId: `t_${Date.now()}`,
      tenantName: tName,
      room: tRoom,
      rentAmount: parseInt(tRent, 10) || 14500,
      dueDate: '05 Every Month',
      status: 'Paid',
      depositOnRecord: 25000,
    };
    setTenants([newT, ...tenants]);
    setAddingTenant(false);
    setTName('');
    setTPhone('');
  };

  return (
    <AdminShell>
      <DashHeading
        eyebrow="Operations"
        title="Tenant Directory &amp; Payment Calendar"
        action={
          <button
            type="button"
            className="sk-button sk-button-primary text-xs"
            onClick={() => setAddingTenant(true)}
          >
            <Plus size={14} /> Add Tenant
          </button>
        }
      />
      <p className="mt-1 text-xs text-[#6d7e88]">
        1st Priority Module: View complete tenant profile details, room allocation, and approve rent to grant calendar green ticks (#20, #24).
      </p>

      {/* Tenants Table */}
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Tenant Name', 'Room', 'Rent', 'Due Date', 'Status', 'Deposit', 'Action']}
          rows={tenants.map((p) => [
            <span className="font-semibold text-xs text-[#18364a]">{p.tenantName}</span>,
            p.room,
            <span>₹{p.rentAmount.toLocaleString('en-IN')}</span>,
            p.dueDate,
            <StatusBadge status={p.status} />,
            <span>₹{p.depositOnRecord.toLocaleString('en-IN')}</span>,
            <button
              type="button"
              className="text-[11px] font-bold text-[#0878b0] hover:underline"
              onClick={() => setSelectedTenant(p)}
            >
              View Profile
            </button>,
          ])}
        />
      </div>

      {/* Tenant Profile Modal (#20, #24) */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1f3]">
              <div>
                <h3 className="text-base font-bold text-[#18364a]">{selectedTenant.tenantName}</h3>
                <p className="text-xs text-[#70818b]">Room {selectedTenant.room} · Orchid House</p>
              </div>
              <button onClick={() => setSelectedTenant(null)} className="text-[#70818b] hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="sk-card p-3">
                <p className="text-[#81909a] font-bold text-[10px]">Monthly Rent</p>
                <p className="text-sm font-bold text-[#18364a] mt-1">₹{selectedTenant.rentAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="sk-card p-3">
                <p className="text-[#81909a] font-bold text-[10px]">Security Deposit</p>
                <p className="text-sm font-bold text-[#18364a] mt-1">₹{selectedTenant.depositOnRecord.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Payment Approval Action */}
            <div className="rounded-xl border border-[#dfe9ee] bg-[#fbfcfd] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#18364a]">Current Month Payment</p>
                  <p className="text-[11px] text-[#6d7e88]">Status: {selectedTenant.status}</p>
                </div>
                {selectedTenant.status !== 'Paid' ? (
                  <button
                    type="button"
                    onClick={() => approveRent(selectedTenant.tenantId)}
                    className="rounded-lg bg-[#176d73] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#135a5f]"
                  >
                    ✓ Approve Payment (Log Green Tick)
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#176d73]">
                    <CheckCircle size={15} /> Approved &amp; Logged
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTenant(null)}
                className="sk-button sk-button-primary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {addingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={addTenant} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#18364a]">Add New Tenant</h3>
            <div>
              <label className="block text-xs font-bold text-[#405966] mb-1">Full Name</label>
              <input
                required
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="e.g. Ananya Rao"
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Phone (UID)</label>
                <input
                  required
                  value={tPhone}
                  onChange={(e) => setTPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#405966] mb-1">Room Number</label>
                <input
                  value={tRoom}
                  onChange={(e) => setTRoom(e.target.value)}
                  placeholder="e.g. 201"
                  className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#405966] mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                value={tRent}
                onChange={(e) => setTRent(e.target.value)}
                className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddingTenant(false)}
                className="flex-1 rounded-lg border border-[#d3e0e4] p-2.5 text-xs font-bold text-[#506875]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#0878b0] p-2.5 text-xs font-bold text-white hover:bg-[#076899]"
              >
                Save Tenant
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

/* ========== 5. ROOMS ========== */
function AdminRooms() {
  const [rooms, setRooms] = useState(data.rooms);
  const [adding, setAdding] = useState(false);

  return (
    <AdminShell>
      <DashHeading
        eyebrow="Property"
        title="Rooms &amp; Floor Nomenclature (#13, #15)"
        action={
          <button type="button" className="sk-button sk-button-primary text-xs" onClick={() => setAdding(true)}>
            <Plus size={14} /> Add Room
          </button>
        }
      />
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Room', 'Type', 'Floor', 'Beds', 'Occupancy', 'Status']}
          rows={rooms.map((r) => [
            <span className="font-semibold text-xs text-[#18364a]">{r.number}</span>,
            r.type,
            `Floor ${r.floor}`,
            <span>{r.beds.filter((b) => b.status === 'Occupied').length}/{r.beds.length} occupied</span>,
            <span>{r.beds.filter((b) => b.tenant).map((b) => b.tenant).join(', ') || '—'}</span>,
            <StatusBadge status={r.beds.some((b) => b.status === 'Vacant') ? 'Vacant' : 'Occupied'} />,
          ])}
        />
      </div>
    </AdminShell>
  );
}

/* ========== 6. WATER & ELECTRICITY ========== */
function AdminWater() {
  const [drinking, setDrinking] = useState(data.water.drinking.status);
  const [bathing, setBathing] = useState(data.water.bathing.status);
  const statuses = ['Available', 'Low', 'Unavailable'];
  return (
    <AdminShell>
      <DashHeading eyebrow="Utilities" title="Water Management" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Drinking Water Supply', value: drinking, set: setDrinking },
          { label: 'Bathing / Tap Water Supply', value: bathing, set: setBathing },
        ].map((w) => (
          <div key={w.label} className="sk-card p-5">
            <p className="text-[13px] font-bold text-[#18364a]">{w.label}</p>
            <div className="mt-3 flex gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${
                    w.value === s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'
                  }`}
                  onClick={() => w.set(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function AdminElectricity() {
  const [status, setStatus] = useState(data.electricity.status);
  return (
    <AdminShell>
      <DashHeading eyebrow="Utilities" title="Electricity Management" />
      <div className="mt-6 sk-card p-5">
        <p className="text-[13px] font-bold text-[#18364a]">Power Supply Status</p>
        <div className="mt-3 flex gap-2">
          {['On', 'Outage'].map((s) => (
            <button
              key={s}
              type="button"
              className={`rounded-md px-4 py-2 text-[12px] font-bold ${
                status === s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'
              }`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

/* ========== 7. VISITOR LOG (#12, #13) ========== */
function AdminVisitors() {
  const [search, setSearch] = useState('');
  const filtered = data.visitors.filter((v) =>
    `${v.visitorName} ${v.residentVisited} ${v.purpose}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AdminShell>
      <DashHeading eyebrow="Operations" title="Visitor Log (Updated by Staff)" />
      <p className="text-xs text-[#6d7e88] mt-1">
        Real-time visitor logs recorded by staff on duty. Shows who, when, purpose, and exit time (#12, #13).
      </p>
      <div className="mt-4">
        <label className="sk-field max-w-[340px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visitors or residents…"
            className="text-[13px]"
          />
        </label>
      </div>
      <div className="mt-4 sk-card overflow-hidden">
        <DataTable
          headers={['Visitor Name', 'Resident Visited', 'Entry Time', 'Exit Time', 'Purpose']}
          rows={filtered.map((v) => [
            <span className="font-semibold text-xs text-[#18364a]">{v.visitorName}</span>,
            v.residentVisited,
            new Date(v.entryTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
            v.exitTime ? new Date(v.exitTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'On premises',
            v.purpose,
          ])}
        />
      </div>
    </AdminShell>
  );
}

/* ========== 8. FURNITURE & WIFI ========== */
function AdminFurniture() {
  return (
    <AdminShell>
      <DashHeading eyebrow="Property" title="Furniture Inventory" />
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Room', 'Item', 'Condition', 'Flagged', 'Repair Status']}
          rows={data.furniture.map((f) => [
            <span className="font-semibold text-xs text-[#18364a]">{f.room}</span>,
            f.item,
            <StatusBadge status={f.condition} />,
            f.flagged ? <span className="text-[11px] font-bold text-[#b55b25]">Flagged</span> : <span className="text-[11px] text-[#81909a]">OK</span>,
            f.repairStatus ?? '—',
          ])}
        />
      </div>
    </AdminShell>
  );
}

function AdminWifi() {
  const [wifiName, setWifiName] = useState(data.wifi.networkName);
  const [wifiPassword, setWifiPassword] = useState('StayKolo@2025');
  const [saved, setSaved] = useState(false);
  return (
    <AdminShell>
      <DashHeading eyebrow="Utilities" title="WiFi Credentials Control (#14, #23)" />
      <p className="mt-2 text-[13px] text-[#6d7e88]">
        Set the WiFi network name and password displayed to tenants. Speed test info is not shown (#23).
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sk-card p-5">
          <label className="block">
            <span className="mb-1 block text-[12px] font-bold text-[#405966]">SSID (Network Name)</span>
            <input
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
            />
          </label>
        </div>
        <div className="sk-card p-5">
          <label className="block">
            <span className="mb-1 block text-[12px] font-bold text-[#405966]">WiFi Password</span>
            <input
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px] outline-none focus:border-[#168aad]"
            />
          </label>
        </div>
      </div>
      <button type="button" className="sk-button sk-button-primary mt-4 text-xs" onClick={() => setSaved(true)}>
        Save WiFi Credentials
      </button>
      {saved && (
        <p className="mt-2 text-xs font-semibold text-[#176d73]">
          ✓ WiFi credentials saved. All tenants at Orchid House see this updated password.
        </p>
      )}
    </AdminShell>
  );
}

/* ========== 9. AMENITIES (CHECKBOX - #21) ========== */
function AdminAmenities() {
  const [amenities, setAmenities] = useState(data.amenities);
  const toggleAmenity = (id: string) =>
    setAmenities((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  return (
    <AdminShell>
      <DashHeading eyebrow="Property" title="Amenities Checklist (#21)" />
      <p className="mt-1 text-xs text-[#6d7e88]">
        Select available amenities using checkboxes. Tenants can rate and verify these same amenities on their portal (#21, #22).
      </p>
      <div className="mt-5 space-y-2">
        {amenities.map((a) => (
          <div key={a.id} className={`sk-card flex items-center gap-4 p-4 ${!a.enabled ? 'opacity-50' : ''}`}>
            <input
              type="checkbox"
              checked={a.enabled}
              onChange={() => toggleAmenity(a.id)}
              className="h-5 w-5 rounded border-[#c7d8de] text-[#0878b0] accent-[#0878b0]"
            />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#355364]">{a.name}</p>
              <p className="text-[11px] text-[#6d7e88]">{a.note}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

/* ========== 10. ISSUES ========== */
function AdminIssues() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? data.issues : data.issues.filter((i) => i.status === filter);
  return (
    <AdminShell>
      <DashHeading eyebrow="Operations" title="Tenant Issues &amp; Concerns" />
      <div className="mt-4 flex gap-2">
        {['all', 'Pending', 'In Progress', 'Resolved'].map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              filter === s ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] text-[#607783]'
            }`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>
      <div className="mt-4 sk-card overflow-hidden">
        <DataTable
          headers={['Category', 'Tenant', 'Description', 'Priority', 'Status', 'Date', 'Action']}
          rows={filtered.map((i) => [
            i.category,
            <span className="font-semibold text-xs text-[#18364a]">{i.raisedBy}</span>,
            <span className="max-w-[200px] truncate block">{i.description}</span>,
            <StatusBadge status={i.priority} />,
            <StatusBadge status={i.status} />,
            new Date(i.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            <Link href={`/admin/issues/${i.id}`} className="text-[11px] font-bold text-[#0878b0]">
              View
            </Link>,
          ])}
        />
      </div>
    </AdminShell>
  );
}

function AdminIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = data.issues.find((i) => i.id === id);
  if (!issue) {
    return (
      <AdminShell>
        <DashEmpty
          icon={<CircleAlert size={18} />}
          title="Issue not found"
          description="This issue may have been removed."
          action={
            <Link href="/admin/issues" className="sk-button sk-button-secondary">
              Back to issues
            </Link>
          }
        />
      </AdminShell>
    );
  }
  const [status, setStatus] = useState(issue.status);
  return (
    <AdminShell>
      <Link href="/admin/issues" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> All issues
      </Link>
      <div className="mt-4 flex items-center gap-2">
        <StatusBadge status={status} />
        <StatusBadge status={issue.priority} />
      </div>
      <h1 className="sk-display mt-3 text-[20px] font-bold text-[#18364a]">{issue.description}</h1>
      <p className="mt-2 text-[12px] text-[#81909a]">
        Raised by {issue.raisedBy} · {issue.category} ·{' '}
        {new Date(issue.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <div className="mt-5 sk-card p-4">
        <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#81909a]">Update Status</p>
        <div className="mt-2 flex gap-2">
          {['Pending', 'In Progress', 'Resolved'].map((s) => (
            <button
              key={s}
              type="button"
              className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${
                status === s ? 'bg-[#0878b0] text-white' : 'border border-[#d8e3e7] text-[#506875]'
              }`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

/* ========== 11. NOTICES ========== */
function AdminNotices() {
  return (
    <AdminShell>
      <DashHeading
        eyebrow="Communication"
        title="Notices"
        action={
          <Link href="/admin/notices/new" className="sk-button sk-button-primary text-xs">
            <BellPlus size={14} /> New Notice
          </Link>
        }
      />
      <div className="mt-6 space-y-2">
        {data.notices.map((n) => (
          <div key={n.id} className="sk-card p-4">
            <div className="flex justify-between">
              <h3 className="text-[13px] font-bold text-[#355364]">{n.title}</h3>
              <span className="text-[11px] text-[#81909a]">
                {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-[#6d7e88]">{n.body}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function AdminNewNotice() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <AdminShell>
        <div className="py-12 text-center">
          <CheckCircle className="mx-auto text-[#176d73]" size={32} />
          <h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Notice Sent</h2>
          <p className="mt-2 text-[13px] text-[#6d7e88]">All tenants have received this announcement.</p>
          <Link href="/admin/notices" className="sk-button sk-button-primary mt-6">
            Back to notices
          </Link>
        </div>
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <Link href="/admin/notices" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> Notices
      </Link>
      <DashHeading eyebrow="Communication" title="Compose Notice" />
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"
            placeholder="Notice title"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Body</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]"
            placeholder="Write notice content…"
          />
        </label>
        <button
          type="button"
          disabled={!title || !body}
          className="sk-button sk-button-primary disabled:opacity-40"
          onClick={() => setSent(true)}
        >
          <Send size={15} /> Send Notice
        </button>
      </div>
    </AdminShell>
  );
}

/* ========== 12. PAYMENTS & AGREEMENTS ========== */
function AdminPayments() {
  const [payments, setPayments] = useState(data.allTenantPayments);
  const markPaid = (id: string) =>
    setPayments((prev) => prev.map((p) => (p.tenantId === id ? { ...p, status: 'Paid' } : p)));
  return (
    <AdminShell>
      <DashHeading eyebrow="Billing" title="Tenant Rent Payments" />
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Tenant', 'Room', 'Rent', 'Due Date', 'Status', 'Deposit', 'Action']}
          rows={payments.map((p) => [
            <span className="font-semibold text-xs text-[#18364a]">{p.tenantName}</span>,
            p.room,
            <span>₹{p.rentAmount.toLocaleString('en-IN')}</span>,
            p.dueDate,
            <StatusBadge status={p.status} />,
            <span>₹{p.depositOnRecord.toLocaleString('en-IN')}</span>,
            p.status !== 'Paid' ? (
              <button
                type="button"
                className="text-[11px] font-bold text-[#0878b0]"
                onClick={() => markPaid(p.tenantId)}
              >
                Mark paid
              </button>
            ) : (
              <span className="text-[11px] font-bold text-[#176d73]">✓ Paid</span>
            ),
          ])}
        />
      </div>
    </AdminShell>
  );
}

function AdminAgreements() {
  return (
    <AdminShell>
      <DashHeading eyebrow="Legal" title="Rental Agreements &amp; Damage Terms (#25)" />
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Tenant', 'Start Date', 'End Date', 'Sign Status', 'Signed On']}
          rows={data.agreements.map((a) => [
            <span className="font-semibold text-xs text-[#18364a]">{a.tenantName}</span>,
            a.startDate,
            a.endDate,
            <StatusBadge status={a.signStatus} />,
            a.signedDate ?? '—',
          ])}
        />
      </div>
    </AdminShell>
  );
}

/* ========== 13. RAISE CONCERN (#26) ========== */
function AdminRaiseConcern() {
  const quickOptions = [
    'Software glitch',
    'Feature request',
    'Billing discrepancy',
    'Verification question',
    'Dashboard update',
  ];
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);
  return (
    <AdminShell>
      <DashHeading
        eyebrow="StayKolo Support"
        title="Raise Concern (#26)"
        action={
          <Link href="/admin/raise-concern/new" className="sk-button sk-button-primary text-xs">
            <Ticket size={14} /> New Concern
          </Link>
        }
      />
      <div className="mt-4">
        <p className="text-[13px] text-[#6d7e88]">
          PG Admins are subscribed partners. Report any software glitches or requests directly to StayKolo engineers.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                selectedQuick === opt
                  ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]'
                  : 'border-[#d7e4e9] text-[#607783]'
              }`}
              onClick={() => setSelectedQuick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Concern Subject', 'Status', 'Priority', 'Logged Date']}
          rows={data.supportTickets.map((t) => [
            <span className="font-semibold text-xs text-[#18364a]">{t.subject}</span>,
            <StatusBadge status={t.status} />,
            <StatusBadge status={t.priority} />,
            new Date(t.raisedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          ])}
        />
      </div>
    </AdminShell>
  );
}

function AdminNewConcern() {
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <AdminShell>
        <div className="py-12 text-center">
          <CheckCircle className="mx-auto text-[#176d73]" size={32} />
          <h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">Concern Logged</h2>
          <p className="mt-2 text-[13px] text-[#6d7e88]">StayKolo engineering team has received your report.</p>
          <Link href="/admin/raise-concern" className="sk-button sk-button-primary mt-6">
            Back to concerns
          </Link>
        </div>
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <Link href="/admin/raise-concern" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]">
        <ArrowLeft size={14} /> Raise Concern
      </Link>
      <DashHeading eyebrow="Support" title="Report Issue to StayKolo" />
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-[13px]"
            placeholder="e.g. WiFi password sync delay"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">Description</span>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-[#d3e0e4] p-3 text-[13px]"
            placeholder="Provide context on what happened…"
          />
        </label>
        <button
          type="button"
          disabled={!subject || !desc}
          className="sk-button sk-button-primary disabled:opacity-40"
          onClick={() => setSent(true)}
        >
          <Send size={15} /> Submit Concern
        </button>
      </div>
    </AdminShell>
  );
}

/* ========== 14. PROPERTIES & PIC UPLOAD (#15, #34) ========== */
function AdminProperties() {
  const ownerPgs = pgs.filter((p) => p.id === 'pg_001');
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadedPic, setUploadedPic] = useState<string | null>(null);

  return (
    <AdminShell>
      <DashHeading
        eyebrow="Portfolio"
        title="My Properties"
        action={
          <button
            type="button"
            className="sk-button sk-button-primary text-xs"
            onClick={() => {
              setAdding(true);
              setSaved(false);
            }}
          >
            <Plus size={14} /> Add Property
          </button>
        }
      />
      <div className="mt-6 space-y-3">
        {ownerPgs.map((p) => (
          <div key={p.id} className="sk-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#18364a]">{p.name}</h3>
                <p className="mt-1 text-[12px] text-[#6d7e88]">{p.address}</p>
              </div>
              <StatusBadge status="Approved" />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[#506875]">
              <span>{p.roomTypes.join(', ')}</span>
              <span>·</span>
              <span>{p.genderPolicy}</span>
              <span>·</span>
              <span>From ₹{p.startingRent.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property with Pic Upload (#15, #34) */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl space-y-4">
            {saved ? (
              <div className="py-6 text-center">
                <CheckCircle className="mx-auto text-[#176d73]" size={32} />
                <h3 className="sk-display mt-3 text-lg font-bold text-[#18364a]">Property Submitted for Verification</h3>
                <p className="text-xs text-[#6d7e88] mt-1">Super Admin will review certificates and grant your Verified Badge (#27, #28).</p>
                <button type="button" className="sk-button sk-button-primary mt-4 text-xs" onClick={() => setAdding(false)}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#18364a]">Add New Property</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#405966] mb-1">Property Name</label>
                    <input className="w-full rounded-lg border border-[#d3e0e4] p-2.5" placeholder="e.g. Lavender Suites" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#405966] mb-1">Full Address</label>
                    <input className="w-full rounded-lg border border-[#d3e0e4] p-2.5" placeholder="Complete street address" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#405966] mb-1">Bengaluru Area</label>
                      <input className="w-full rounded-lg border border-[#d3e0e4] p-2.5" placeholder="e.g. HSR Layout" />
                    </div>
                    <div>
                      <label className="block font-bold text-[#405966] mb-1">Starting Rent (₹)</label>
                      <input type="number" className="w-full rounded-lg border border-[#d3e0e4] p-2.5" placeholder="13000" />
                    </div>
                  </div>

                  {/* Pic Upload for Property (#34) */}
                  <div>
                    <label className="block font-bold text-[#405966] mb-1">Property Photos (#34)</label>
                    {uploadedPic ? (
                      <div className="flex items-center gap-3 rounded-lg border border-[#0878b0] bg-[#edf7fa] p-3">
                        <ImagePlus className="text-[#0878b0]" size={20} />
                        <span className="text-xs font-bold text-[#18364a]">photo_exterior.jpg attached</span>
                        <button type="button" onClick={() => setUploadedPic(null)} className="ml-auto text-xs text-[#b55b25]">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setUploadedPic('mock_pic')}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#c7d8de] bg-[#f9fbfc] p-4 font-semibold text-[#506875] hover:bg-[#edf7fa]"
                      >
                        <Upload size={16} /> Click to upload property photos
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#d3e0e4] p-2.5 text-xs font-bold text-[#506875]"
                    onClick={() => setAdding(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-[#0878b0] p-2.5 text-xs font-bold text-white hover:bg-[#076899]"
                    onClick={() => setSaved(true)}
                  >
                    Submit for Verification
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ========== 15. CHANGES LOG (#45, #49) ========== */
function AdminChangesLog() {
  const logs = [
    { id: '1', action: 'Approved Priya monthly payment for Mar 2025', user: 'Admin', timestamp: '2025-03-01T10:30:00Z', section: 'Payments' },
    { id: '2', action: 'Assigned Warden shift to Ramesh Kumar', user: 'Admin', timestamp: '2025-02-28T14:15:00Z', section: 'Staff' },
    { id: '3', action: 'WiFi password updated', user: 'Admin', timestamp: '2025-02-27T09:00:00Z', section: 'WiFi' },
    { id: '4', action: 'Added Special Sunday Biryani menu', user: 'Admin', timestamp: '2025-02-26T18:45:00Z', section: 'Food' },
    { id: '5', action: 'Logged Visitor entry for Room 202', user: 'Staff - Ramesh', timestamp: '2025-02-25T11:20:00Z', section: 'Visitors' },
  ];
  return (
    <AdminShell>
      <DashHeading eyebrow="Audit &amp; Compliance" title="Universal Changes Log (#45, #49)" />
      <p className="mt-1 text-xs text-[#6d7e88]">
        Track all recorded changes across all property modules with universal timestamps.
      </p>
      <div className="mt-6 sk-card overflow-hidden">
        <DataTable
          headers={['Action Description', 'Executed By', 'Module', 'Timestamp']}
          rows={logs.map((l) => [
            <span className="font-semibold text-xs text-[#18364a]">{l.action}</span>,
            l.user,
            <span className="rounded-full bg-[#edf7fa] px-2 py-0.5 text-[10px] font-bold text-[#0878b0]">{l.section}</span>,
            new Date(l.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          ])}
        />
      </div>
    </AdminShell>
  );
}

/* ========== 16. SETTINGS & CUSTOM BUTTONS (LAST - #6, #14) ========== */
function AdminModules() {
  const { modules, toggle } = useModules();
  const [customButtons, setCustomButtons] = useState([
    { id: 'cb_1', label: 'Deluxe Studio Format', group: 'Room Types' },
    { id: 'cb_2', label: 'Co-Living Flexible Agreement', group: 'Agreements' },
  ]);
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnGroup, setNewBtnGroup] = useState('Room Types');

  const addCustomButton = (e: FormEvent) => {
    e.preventDefault();
    if (!newBtnLabel) return;
    setCustomButtons([...customButtons, { id: `cb_${Date.now()}`, label: newBtnLabel, group: newBtnGroup }]);
    setNewBtnLabel('');
  };

  const moduleList = [
    { key: 'rooms', label: 'Rooms Management', desc: 'Room and bed inventory for the property.' },
    { key: 'water', label: 'Water Utility', desc: 'Track drinking and tap water supply status.' },
    { key: 'electricity', label: 'Electricity Utility', desc: 'Log BESCOM outages and power status.' },
    { key: 'food', label: 'Food & Meals', desc: 'Manage daily menus and special items (#9).' },
    { key: 'staff-attendance', label: 'Staff Management', desc: 'Manage staff credentials and duties (#17).' },
    { key: 'visitor-log', label: 'Visitor Logging', desc: 'Record visitor entries and exits (#12, #13).' },
    { key: 'furniture', label: 'Furniture Inventory', desc: 'Track room furniture and repair flags.' },
    { key: 'wifi', label: 'WiFi Control', desc: 'Manage network credentials shown to tenants.' },
    { key: 'amenities', label: 'Amenities Checklist', desc: 'Checkbox-based amenity declarations (#21).' },
    { key: 'notices', label: 'Notices Board', desc: 'Broadcast notices to tenants.' },
    { key: 'payments', label: 'Rent Payments', desc: 'Calendar tracking and payment approvals (#24).' },
    { key: 'agreements', label: 'Rental Agreements', desc: 'Deposit deduction terms and damage charges (#25).' },
  ];

  return (
    <AdminShell>
      <DashHeading eyebrow="Configuration" title="Settings &amp; Module Toggles (#14)" />
      <p className="mt-1 text-xs text-[#6d7e88]">
        Configure platform modules. Settings is placed last in the sidebar (#14).
      </p>

      {/* Module Toggles List */}
      <div className="mt-6 space-y-2">
        {moduleList.map((m) => (
          <div key={m.key} className={`sk-card flex items-center justify-between p-4 ${!modules[m.key] ? 'opacity-50' : ''}`}>
            <div>
              <p className="text-[13px] font-bold text-[#355364]">{m.label}</p>
              <p className="text-[11px] text-[#6d7e88]">{m.desc}</p>
            </div>
            <button
              type="button"
              className={`relative h-6 w-11 rounded-full transition-colors ${
                modules[m.key] ? 'bg-[#0878b0]' : 'bg-[#c7d8de]'
              }`}
              onClick={() => toggle(m.key)}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  modules[m.key] ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Buttons & Options Manager (#6) */}
      <div className="mt-8 sk-card p-5">
        <h3 className="text-sm font-bold text-[#18364a]">Custom Buttons &amp; Configurable Options (#6)</h3>
        <p className="text-xs text-[#6d7e88] mt-1">
          Create configurable buttons (e.g. customized room types, special rental tags) for Orchid House.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {customButtons.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0878b0]/30 bg-[#edf7fa] px-3 py-1 text-xs font-bold text-[#0878b0]"
            >
              {b.label} <span className="text-[10px] text-[#81909a]">({b.group})</span>
            </span>
          ))}
        </div>

        <form onSubmit={addCustomButton} className="mt-4 flex flex-wrap gap-2 text-xs">
          <input
            value={newBtnLabel}
            onChange={(e) => setNewBtnLabel(e.target.value)}
            placeholder="New option label (e.g. Penthouse Suite)"
            className="flex-1 min-w-[200px] rounded-lg border border-[#d3e0e4] p-2 text-xs"
          />
          <select
            value={newBtnGroup}
            onChange={(e) => setNewBtnGroup(e.target.value)}
            className="rounded-lg border border-[#d3e0e4] p-2 text-xs"
          >
            <option>Room Types</option>
            <option>Agreements</option>
            <option>Amenities</option>
          </select>
          <button type="submit" className="sk-button sk-button-primary text-xs">
            Add Custom Button
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

/* ========== ADMIN ROUTER ========== */
export function AdminDashboard() {
  return (
    <ModuleProvider>
      <Switch>
        <Route path="/admin/overview" component={AdminOverview} />
        <Route path="/admin/settings/modules" component={AdminModules} />
        <Route path="/admin/settings" component={AdminModules} />
        <Route path="/admin/rooms" component={AdminRooms} />
        <Route path="/admin/water" component={AdminWater} />
        <Route path="/admin/electricity" component={AdminElectricity} />
        <Route path="/admin/food" component={AdminFood} />
        <Route path="/admin/staff" component={AdminStaff} />
        <Route path="/admin/staff-attendance" component={AdminStaff} />
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
        <Route path="/admin/raise-concern/new" component={AdminNewConcern} />
        <Route path="/admin/raise-concern" component={AdminRaiseConcern} />
        <Route path="/admin/support-tickets/new" component={AdminNewConcern} />
        <Route path="/admin/support-tickets" component={AdminRaiseConcern} />
        <Route path="/admin/properties" component={AdminProperties} />
        <Route path="/admin/tenants" component={AdminTenants} />
        <Route path="/admin/changes-log" component={AdminChangesLog} />
        <Route path="/admin" component={AdminOverview} />
        <Route>
          {() => {
            const [, setLoc] = useLocation();
            useEffect(() => {
              setLoc('/admin/overview');
            }, []);
            return null;
          }}
        </Route>
      </Switch>
    </ModuleProvider>
  );
}
