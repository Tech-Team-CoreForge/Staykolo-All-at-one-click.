import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle, ChevronDown, CircleAlert, Eye, EyeOff, FileText,
  Gift, Heart, Home, Info, Mail, MapPin, Phone, RotateCcw, Scale, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, User, UserCheck, UserRound, Users, Wrench, X,
} from 'lucide-react';
import { MapView } from '@/components/map-view';
import { BrandKarnatakaBadge, KarnatakaFlag, SectionHeading, SiteFooter, SiteNav } from '@/components/staykolo-ui';
import pgsJson from '../../mock-data/pgs.json';

type PG = (typeof pgsJson)[number];
type ModalProps = { onClose: () => void; children: React.ReactNode; title: string };
const pgs = pgsJson as PG[];
const chronicles = [
  { id: 'c1', tag: '#tenant-tips', title: 'A practical checklist for your first PG visit', date: '18 Feb 2025', read: '5 min read', copy: 'What to look for beyond the room: water pressure, notice periods, visitor rules and the questions worth asking before you pay a deposit.' },
  { id: 'c2', tag: '#tenant-tips', title: 'Choosing a Bengaluru area around your commute', date: '11 Feb 2025', read: '4 min read', copy: 'HSR Layout, Bellandur, Indiranagar and Whitefield each solve a different commute. Start with the route, not the pin on a map.' },
  { id: 'c3', tag: '#owner-guides', title: 'The property details residents ask for first', date: '06 Feb 2025', read: '6 min read', copy: 'A useful property profile answers rent, deposit, room format, house rules and move-in logistics before a call is made.' },
  { id: 'c4', tag: '#owner-guides', title: 'Keeping availability information current', date: '28 Jan 2025', read: '3 min read', copy: 'A small operating habit that saves time for property teams and prevents avoidable conversations with prospective residents.' },
  { id: 'c5', tag: '#staykolo-updates', title: 'Why Staykolo uses verification notes, not star ratings', date: '21 Jan 2025', read: '4 min read', copy: 'We are building for clearer decisions, so property details and verification context come before invented certainty.' },
  { id: 'c6', tag: '#staykolo-updates', title: 'A clearer start for Bengaluru renting', date: '14 Jan 2025', read: '2 min read', copy: 'Staykolo begins with a simple promise: make the practical information about a PG easier to find and easier to compare.' },
];
const tagOptions = ['#tenant-tips', '#owner-guides', '#staykolo-updates'];

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-[100dvh] bg-[#fbfcfd]"><SiteNav />{children}<SiteFooter /></div>;
}

function Money({ value }: { value: number }) {
  return <span className="sk-mono">₹{value.toLocaleString('en-IN')}</span>;
}

function PropertyCardFull({
  property,
  selected,
  onSelect,
  isLiked,
  onToggleLike,
}: {
  property: PG;
  selected?: boolean;
  onSelect?: () => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
}) {
  return (
    <article
      className={`sk-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
        selected ? 'border-[#168aad] ring-2 ring-[#168aad]/15' : ''
      }`}
      data-testid={`card-search-property-${property.id}`}
    >
      <div className="relative h-[160px] overflow-hidden bg-[#e6f2f2]">
        <img
          src={property.images[0]}
          alt={`${property.name} property exterior`}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#e5f3f8]/95 px-2.5 py-1 text-[10px] font-bold text-[#17668c] shadow-sm">
          {property.verification.status}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#176d73] shadow-sm">
          {property.occupancy}
        </span>
        {/* 25% Offer Badge (#50) */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#b55b25] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          <Gift size={11} /> 25% Off 1st Mo*
        </span>
        {/* Like Button (#40) */}
        {onToggleLike && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#647782] shadow transition-transform active:scale-90 hover:text-[#b55b25]"
            title={isLiked ? 'Remove from saved' : 'Save to Liked PGs'}
          >
            <Heart size={15} className={isLiked ? 'fill-[#b55b25] text-[#b55b25]' : ''} />
          </button>
        )}
      </div>
      <button
        type="button"
        className="block w-full text-left p-4"
        onClick={onSelect}
        data-testid={`button-select-property-${property.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="sk-display text-[17px] font-bold text-[#18364a]">{property.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-[#70818b]">
              <MapPin size={13} />
              {property.area}
            </p>
          </div>
          <div className="text-right text-[13px] font-bold text-[#18364a]">
            <Money value={property.startingRent} />
            <small className="block font-sans text-[10px] font-normal text-[#70818b]">starting / month</small>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#edf1f3] pt-3 text-[11px] text-[#647782]">
          <span>{property.roomTypes.join(' · ')}</span>
          <span>{property.genderPolicy}</span>
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-[#edf1f3] px-4 py-3 bg-[#fafcfd]">
        <Link
          href={`/pg/${property.slug}`}
          className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"
          data-testid={`link-search-detail-${property.id}`}
        >
          View details &amp; verify amenities <ArrowRight size={13} />
        </Link>
        <span className="text-[10px] text-[#81909a]">Ecosystem transfer ready</span>
      </div>
    </article>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  const actualType = isPass ? (showPass ? 'text' : 'password') : type;
  const autoComplete = isPass
    ? name.includes('login')
      ? 'current-password'
      : 'new-password'
    : name.includes('contact')
    ? 'email'
    : name.includes('name')
    ? 'name'
    : 'off';

  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">{label}</span>
      <span className={`sk-field relative flex items-center ${error ? 'border-[#b55b25]' : ''}`}>
        <input
          name={name}
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className="flex-1 pr-9"
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 text-[#70818b] hover:text-[#18364a] focus:outline-none"
            title={showPass ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
      {error && <span className="mt-1 block text-[11px] text-[#b55b25]">{error}</span>}
    </label>
  );
}

function Modal({
  onClose,
  children,
  title,
  maxWidth = 'max-w-[580px]',
}: ModalProps & { maxWidth?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#18364a]/45 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`max-h-[92dvh] w-full ${maxWidth} overflow-y-auto rounded-t-[20px] border border-[#d7e3e8] bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(28,65,87,.25)] sm:rounded-[18px]`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="sk-display text-[20px] sm:text-[22px] font-bold text-[#18364a]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#607b88] hover:bg-[#edf7fa] transition-colors"
            aria-label="Close dialog"
            data-testid="button-close-modal"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

/* ========== SEARCH PAGE (Req #1, #40, #41, #42, #43, #50, #36) ========== */
export function SearchPage() {
  const [location] = useLocation();
  const initialArea = new URLSearchParams(location.split('?')[1] ?? '').get('area') ?? '';
  const [area, setArea] = useState(initialArea);
  const [price, setPrice] = useState('any');
  const [gender, setGender] = useState('any');
  const [room, setRoom] = useState('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selected, setSelected] = useState(pgs[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Liked PGs state (Req #40)
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('staykolo.likedPgs') || '["pg_001"]');
    } catch {
      return ['pg_001'];
    }
  });
  const [viewLikedOnly, setViewLikedOnly] = useState(false);
  const [compareModal, setCompareModal] = useState(false);
  const [accountPromptModal, setAccountPromptModal] = useState(false);

  // User auth state simulation
  const [isLoggedIn] = useState(() => Boolean(localStorage.getItem('staykolo.mockUser')));

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('staykolo.likedPgs', JSON.stringify(updated));
      return updated;
    });
  };

  const filtered = useMemo(() => {
    return pgs.filter((p) => {
      if (viewLikedOnly && !likedIds.includes(p.id)) return false;
      const areaMatch = !area || `${p.area} ${p.name}`.toLowerCase().includes(area.toLowerCase());
      const priceMatch =
        price === 'any' ||
        (price === 'under-13'
          ? p.startingRent < 13000
          : price === '13-18'
          ? p.startingRent >= 13000 && p.startingRent <= 18000
          : p.startingRent > 18000);
      const genderMatch = gender === 'any' || p.genderPolicy === gender;
      const roomMatch = room === 'any' || p.roomTypes.some((r) => r.toLowerCase().includes(room));
      const amenityMatch = amenities.every((a) => p.amenities.includes(a));
      return areaMatch && priceMatch && genderMatch && roomMatch && amenityMatch;
    });
  }, [area, price, gender, room, amenities, viewLikedOnly, likedIds]);

  // Req #1: Non-logged in users see first 5 PGs
  const displayedProperties = !isLoggedIn && !viewLikedOnly ? filtered.slice(0, 5) : filtered;
  const hasMoreUnauthenticated = !isLoggedIn && !viewLikedOnly && filtered.length > 5;

  const visiblePins = displayedProperties.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.coordinates.lat,
    lng: p.coordinates.lng,
  }));

  const comparedProperties = pgs.filter((p) => likedIds.includes(p.id)).slice(0, 3);

  return (
    <Shell>
      <main>
        {/* Banner with 25% Off + Phase 1 Bengaluru info (#17, #50) */}
        <section className="border-b border-[#dfe9ee] bg-[#edf7fa]">
          <div className="sk-container py-10 sm:py-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <KarnatakaFlag className="h-3.5 w-5" />
                  <p className="sk-eyebrow">StayKolo PG Locator · Phase 1 Bengaluru</p>
                </div>
                <h1 className="sk-display mt-2 text-[32px] font-bold text-[#18364a] sm:text-[42px]">
                  Search Bengaluru by the details that matter.
                </h1>
              </div>
              <div className="rounded-xl border border-[#0878b0]/30 bg-white p-3 shadow-sm text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#b55b25]">
                  <Gift size={14} /> 25% Off 1st Month Offer
                </span>
                <p className="text-[#647782] mt-0.5 max-w-[260px]">
                  Contact verified PGs directly on StayKolo to claim your move-in discount.
                </p>
              </div>
            </div>

            {/* Smart Suggestions Bar (Req #36) */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-[#476772]">
                <Sparkles size={13} className="text-[#168aad]" /> Suggestions:
              </span>
              {[
                { label: 'HSR Layout Corridors', fn: () => setArea('HSR') },
                { label: 'Koramangala Tech Hub', fn: () => setArea('Koramangala') },
                { label: 'Budget Under ₹13k', fn: () => setPrice('under-13') },
                { label: 'Private Rooms', fn: () => setRoom('private') },
                { label: 'Co-living Spaces', fn: () => setGender('Co-living') },
              ].map((sug) => (
                <button
                  key={sug.label}
                  type="button"
                  onClick={sug.fn}
                  className="rounded-full border border-[#d3e0e4] bg-white px-3 py-1 text-[#476772] hover:border-[#168aad] hover:bg-[#edf7fa]"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Search Filters Bar */}
            <div className="mt-6 sk-card grid gap-3 p-3 md:grid-cols-[1.3fr_1fr_1fr_auto]">
              <label className="sk-field">
                <Search size={17} />
                <span className="sr-only">Area or landmark</span>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area or landmark"
                  aria-label="Area or landmark"
                  data-testid="input-search-area"
                />
              </label>
              <label className="sk-field">
                <SlidersHorizontal size={16} />
                <span className="sr-only">Budget</span>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  aria-label="Budget"
                  data-testid="select-search-price"
                >
                  <option value="any">Any monthly rent</option>
                  <option value="under-13">Under ₹13,000</option>
                  <option value="13-18">₹13,000–₹18,000</option>
                  <option value="over-18">Above ₹18,000</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <label className="sk-field">
                <MapPin size={16} />
                <span className="sr-only">Gender preference</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  aria-label="Gender preference"
                  data-testid="select-search-gender"
                >
                  <option value="any">Any gender policy</option>
                  <option value="Women only">Women only</option>
                  <option value="Men only">Men only</option>
                  <option value="Co-living">Co-living</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <button
                type="button"
                className="sk-button sk-button-primary"
                onClick={() => {
                  setArea('');
                  setPrice('any');
                  setGender('any');
                  setRoom('any');
                  setAmenities([]);
                  setViewLikedOnly(false);
                }}
                data-testid="button-clear-filters"
              >
                Clear filters
              </button>
            </div>
          </div>
        </section>

        {/* Main Search Results Area */}
        <section className="sk-container py-8">
          {/* Mobile View Switcher (List vs Map) */}
          <div className="mb-4 flex rounded-xl bg-[#e5eff3] p-1 lg:hidden" role="tablist" aria-label="Search view mode">
            <button
              type="button"
              role="tab"
              aria-selected={mobileTab === 'list'}
              onClick={() => setMobileTab('list')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                mobileTab === 'list'
                  ? 'bg-white text-[#18364a] shadow-sm'
                  : 'text-[#647782] hover:text-[#18364a]'
              }`}
            >
              List View ({displayedProperties.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileTab === 'map'}
              onClick={() => setMobileTab('map')}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition-all ${
                mobileTab === 'map'
                  ? 'bg-white text-[#18364a] shadow-sm'
                  : 'text-[#647782] hover:text-[#18364a]'
              }`}
            >
              Map View ({visiblePins.length} Pins)
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.86fr)_1.14fr]">
            <aside className={mobileTab === 'map' ? 'hidden lg:block' : 'block'}>
              {/* Liked & Compare Header Bar (Req #40, #43) */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="sk-eyebrow">Available profiles</p>
                  <h2 className="sk-display mt-1 text-[23px] font-bold text-[#18364a]">
                    {loading
                      ? 'Checking profiles'
                      : viewLikedOnly
                      ? `${filtered.length} Liked Properties`
                      : `${filtered.length} properties found`}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewLikedOnly(!viewLikedOnly)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                      viewLikedOnly
                        ? 'border-[#b55b25] bg-[#fff5f0] text-[#b55b25]'
                        : 'border-[#d8e3e7] bg-white text-[#506875] hover:bg-[#edf7fa]'
                    }`}
                  >
                    <Heart size={14} className={viewLikedOnly ? 'fill-[#b55b25]' : ''} />
                    <span>Liked ({likedIds.length})</span>
                  </button>
                  {likedIds.length >= 2 && (
                    <button
                      type="button"
                      onClick={() => setCompareModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0878b0] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#076899]"
                    >
                      <Scale size={14} /> Compare
                    </button>
                  )}
                </div>
              </div>

              {/* Refine Search Box */}
              <div className="mb-5 sk-card p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.1em] text-[#81909a]">
                  Refine the list
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="sk-field min-h-[42px]">
                    <Home size={14} />
                    <span className="sr-only">Room type</span>
                    <select
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      aria-label="Room type"
                      data-testid="select-search-room"
                    >
                      <option value="any">Any room type</option>
                      <option value="private">Private room</option>
                      <option value="twin">Twin sharing</option>
                      <option value="triple">Triple sharing</option>
                    </select>
                    <ChevronDown size={13} />
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {['Wi-Fi', 'Meals', 'Laundry'].map((item) => (
                      <label
                        key={item}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[#506875]"
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(item)}
                          onChange={(e) =>
                            setAmenities((prev) =>
                              e.target.checked ? [...prev, item] : prev.filter((x) => x !== item)
                            )
                          }
                          data-testid={`checkbox-amenity-${item.toLowerCase().replace('-', '')}`}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Cards List */}
              {loading ? (
                <div className="space-y-4" aria-label="Loading properties">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="sk-card h-[300px] p-4">
                      <div className="sk-sheen h-[150px] rounded-lg" />
                      <div className="sk-sheen mt-4 h-4 w-3/5 rounded" />
                      <div className="sk-sheen mt-3 h-3 w-2/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="sk-card p-7 text-center">
                  <CircleAlert className="mx-auto text-[#b55b25]" size={25} />
                  <h3 className="sk-display mt-3 text-[17px] font-bold text-[#18364a]">
                    Property profiles could not load
                  </h3>
                  <button
                    type="button"
                    className="sk-button sk-button-secondary mt-5"
                    onClick={() => {
                      setError(false);
                      setLoading(true);
                      window.setTimeout(() => setLoading(false), 400);
                    }}
                    data-testid="button-search-retry"
                  >
                    Try again
                  </button>
                </div>
              ) : displayedProperties.length === 0 ? (
                <div className="sk-card p-8 text-center">
                  <Search className="mx-auto text-[#6e8c97]" size={25} />
                  <h3 className="sk-display mt-3 text-[17px] font-bold text-[#18364a]">
                    No profiles match those filters
                  </h3>
                  <p className="mt-2 text-[13px] text-[#70818b]">
                    Try clearing filters or search another Bengaluru area.
                  </p>
                  <button
                    type="button"
                    className="sk-button sk-button-secondary mt-5"
                    onClick={() => {
                      setArea('');
                      setPrice('any');
                      setGender('any');
                      setRoom('any');
                      setAmenities([]);
                      setViewLikedOnly(false);
                    }}
                  >
                    Reset search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedProperties.map((property) => (
                    <PropertyCardFull
                      key={property.id}
                      property={property}
                      selected={selected === property.id}
                      onSelect={() => setSelected(property.id)}
                      isLiked={likedIds.includes(property.id)}
                      onToggleLike={() => toggleLike(property.id)}
                    />
                  ))}

                  {/* 5-PG Search Limit Barrier for Guests (#1) */}
                  {hasMoreUnauthenticated && (
                    <div className="sk-card border-2 border-dashed border-[#0878b0]/40 bg-[#edf7fa] p-6 text-center">
                      <ShieldCheck className="mx-auto text-[#0878b0]" size={30} />
                      <h3 className="sk-display mt-3 text-lg font-bold text-[#18364a]">
                        Viewing first 5 PGs
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-xs text-[#506875]">
                        Create a free StayKolo account using your phone number to unlock unlimited
                        PG listings, side-by-side comparison, and 25% first-month discounts.
                      </p>
                      <div className="mt-4 flex justify-center gap-3">
                        <Link href="/auth/signup" className="sk-button sk-button-primary text-xs">
                          Create Account (Free)
                        </Link>
                        <Link href="/auth/login" className="sk-button sk-button-secondary text-xs">
                          Sign In
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </aside>

            {/* Map View */}
            <div className={`lg:sticky lg:top-5 lg:h-[calc(100dvh-120px)] ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
              <MapView
                pins={visiblePins}
                selectedId={selected}
                onSelect={setSelected}
                className="h-[520px] lg:h-full"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Floating Sticky Compare Bar when 2+ PGs are selected (#43) */}
      {likedIds.length >= 2 && !compareModal && (
        <aside className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-3 pointer-events-none" aria-label="Compare bar">
          <div className="pointer-events-auto flex items-center justify-between sm:justify-start gap-3 sm:gap-4 rounded-2xl bg-[#18364a] px-4 py-2.5 sm:px-5 sm:py-3 text-white shadow-2xl border border-white/20 animate-in slide-in-from-bottom-5 max-w-lg w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#168aad] text-xs font-bold text-white shadow-inner">
                {likedIds.length}
              </span>
              <div className="text-left truncate">
                <p className="text-xs font-bold leading-tight truncate">PGs to Compare</p>
                <p className="text-[10px] text-white/70 hidden sm:block">Compare rent, amenities &amp; offers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCompareModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0878b0] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white hover:bg-[#076899] shadow-md transition-transform active:scale-95"
              >
                <Scale size={13} /> Compare
              </button>
              <button
                type="button"
                onClick={() => {
                  setLikedIds([]);
                  localStorage.setItem('staykolo.likedPgs', '[]');
                }}
                className="text-[11px] text-white/60 hover:text-white underline px-1"
              >
                Clear
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Side-by-Side PG Comparison Modal (Req #43) */}
      {compareModal && (
        <Modal title="Side-by-Side PG Comparison" onClose={() => setCompareModal(false)} maxWidth="max-w-[780px]">
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-[#70818b] sm:hidden">
            <span className="flex items-center gap-1 font-medium">
              <ArrowRight size={12} className="text-[#0878b0]" /> Swipe horizontally to view all PGs
            </span>
            <span className="font-semibold text-[#18364a]">{comparedProperties.length} compared</span>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-[#dfe9ee]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dfe9ee] bg-[#f8fbfd]">
                  <th className="sticky left-0 z-20 bg-[#f8fbfd] p-3 font-bold text-[#70818b] w-32 min-w-[120px] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Property
                  </th>
                  {comparedProperties.map((p) => (
                    <th key={p.id} className="p-3 font-bold text-[#18364a] min-w-[160px] sm:min-w-[190px]">
                      <div className="space-y-1.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-24 w-full rounded-lg object-cover"
                        />
                        <span className="block font-bold text-sm text-[#18364a] line-clamp-1">{p.name}</span>
                        <span className="block text-[11px] font-normal text-[#70818b]">{p.area}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f3]">
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Starting Rent
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-[#0878b0]">
                      <Money value={p.startingRent} />
                      <span className="block text-[10px] font-normal text-[#70818b]">/ month</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Security Deposit
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 font-semibold text-[#18364a]">
                      <Money value={p.deposit} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Room Types
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 text-[#18364a]">
                      {p.roomTypes.join(' · ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Gender Policy
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 text-[#18364a]">
                      <span className="rounded-md bg-[#edf7fa] px-2 py-0.5 text-[11px] font-semibold text-[#0878b0]">
                        {p.genderPolicy}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Verified Amenities
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 text-[#18364a]">
                      <ul className="space-y-1 text-[11px] text-[#506875]">
                        {p.amenities.map((a) => (
                          <li key={a} className="flex items-center gap-1">
                            <Check size={12} className="text-[#176d73] shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Verification Status
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-[#176d73]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f4f7] px-2.5 py-0.5 text-[11px]">
                        <ShieldCheck size={12} /> {p.verification.status}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    1st Month Offer
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3 font-bold text-[#b55b25]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8f5] border border-[#fbd4c2] px-2.5 py-0.5 text-[11px]">
                        <Gift size={12} /> 25% Off Eligible
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-3 font-semibold text-[#506875] border-r border-[#dfe9ee] shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                    Action
                  </td>
                  {comparedProperties.map((p) => (
                    <td key={p.id} className="p-3">
                      <Link
                        href={`/pg/${p.slug}`}
                        className="sk-button sk-button-primary w-full text-center text-xs py-2"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="sk-button sk-button-secondary text-xs"
              onClick={() => setCompareModal(false)}
            >
              Close Comparison
            </button>
          </div>
        </Modal>
      )}
    </Shell>
  );
}

/* ========== PROPERTY DETAIL (Req #22, #50, #38, #35) ========== */
export function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const property =
    pgs.find((p) => p.slug === slug || p.id === slug) ||
    (slug?.includes('koramangala') ? pgs.find((p) => p.slug.includes('koramangala')) : undefined) ||
    pgs[0];
  const [modal, setModal] = useState(false);

  // Amenities verification checklist rating by tenant/user (Req #22)
  const [verifiedAmenities, setVerifiedAmenities] = useState<Record<string, boolean>>({
    'Wi-Fi': true,
    'Meals': true,
    'Laundry': true,
  });

  const toggleVerification = (amenity: string) => {
    setVerifiedAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  if (!property) {
    return (
      <Shell>
        <main className="sk-container flex min-h-[60vh] items-center py-16">
          <div>
            <p className="sk-eyebrow">Property not found</p>
            <h1 className="sk-display mt-3 text-[38px] font-bold text-[#18364a]">
              That profile is not available.
            </h1>
            <Link href="/search" className="sk-button sk-button-primary mt-6">
              Back to search <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main>
        <div className="sk-container py-7">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]"
          >
            <ArrowLeft size={14} /> Back to search
          </Link>

          {/* Photo Showcase */}
          <div className="mt-5 grid gap-2 sm:grid-cols-[1.6fr_1fr]">
            <img
              src={property.images[0]}
              alt={`${property.name} exterior`}
              className="h-[260px] w-full rounded-[14px] object-cover sm:h-[390px]"
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              <img
                src={property.images[1]}
                alt={`${property.name} common area`}
                className="h-[127px] w-full rounded-[14px] object-cover sm:h-[191px]"
              />
              <div className="sk-surface-blue flex flex-col justify-end rounded-[14px] p-5">
                <span className="flex items-center gap-1.5 font-bold text-xs text-[#176d73]">
                  <Gift size={15} /> 25% Off 1st Month Rent
                </span>
                <p className="text-[11px] font-medium leading-4 text-[#476772] mt-1">
                  Exclusive StayKolo Verified Badge discount applied when contacting through our platform.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 py-9 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7fa] px-3 py-1 text-xs font-bold text-[#0878b0]">
                    <ShieldCheck size={14} /> {property.verification.status}
                  </span>
                  <h1 className="sk-display mt-2 text-[36px] font-bold leading-tight text-[#18364a]">
                    {property.name}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-[#647782]">
                    <MapPin size={15} />
                    {property.address}
                  </p>
                </div>
                <div className="rounded-lg bg-[#edf7fa] px-4 py-3 text-right">
                  <p className="text-[11px] text-[#6c818a]">Starting rent</p>
                  <p className="sk-mono mt-1 text-[20px] font-bold text-[#18364a]">
                    <Money value={property.startingRent} />
                  </p>
                  <p className="text-[10px] text-[#6c818a]">per month</p>
                </div>
              </div>

              {/* Ecosystem Transfer Guarantee Banner (Req #50) */}
              <div className="mt-6 rounded-xl border border-[#dfe9ee] bg-[#fbfcfd] p-4 flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-[#0878b0] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#18364a]">StayKolo Ecosystem Transfer Ready</h4>
                  <p className="text-[11px] text-[#647782] mt-0.5 leading-relaxed">
                    Need to switch location later? Easily transfer your deposit and verification history between any
                    StayKolo Verified PG in Bengaluru without lock-in penalties.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-7 text-[#5f7783]">{property.description}</p>

              {/* Property Facts */}
              <div className="mt-8">
                <SectionHeading eyebrow="Property facts" title="Know the practicals first" />
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['Deposit', `₹${property.deposit.toLocaleString('en-IN')}`],
                    ['Room types', property.roomTypes.join(' / ')],
                    ['Gender policy', property.genderPolicy],
                    ['Availability', property.occupancy],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-[#dfe9ed] bg-white p-3">
                      <p className="text-[10px] uppercase tracking-[.08em] text-[#81909a]">{label}</p>
                      <p className="mt-2 text-[13px] font-bold leading-5 text-[#355364]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Tenant Checklist Rating (Req #21, #22) */}
              <div className="mt-9">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sk-eyebrow">Amenities checklist</p>
                    <h2 className="sk-display text-lg font-bold text-[#18364a]">
                      Resident-Verified Amenities
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#81909a]">Check to verify on-site</span>
                </div>
                <p className="text-xs text-[#6d7e88] mt-1">
                  Users and tenants verify which advertised amenities are operational at this location:
                </p>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((item) => {
                    const isChecked = verifiedAmenities[item] ?? true;
                    return (
                      <label
                        key={item}
                        className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                          isChecked ? 'border-[#168aad] bg-[#edf7fa]' : 'border-[#dfe9ed] bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleVerification(item)}
                          className="h-4 w-4 accent-[#0878b0]"
                        />
                        <span className="text-xs font-semibold text-[#355364]">{item}</span>
                        {isChecked && <span className="ml-auto text-[10px] font-bold text-[#176d73]">Verified ✓</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location Map */}
              <div className="mt-9 sk-card overflow-hidden">
                <div className="p-5">
                  <p className="sk-eyebrow">Location</p>
                  <h2 className="sk-display mt-2 text-[20px] font-bold text-[#18364a]">{property.area}</h2>
                  <p className="mt-1 text-[13px] text-[#6d7e88]">{property.address}</p>
                </div>
                <MapView
                  pins={[{ id: property.id, name: property.name, lat: property.coordinates.lat, lng: property.coordinates.lng }]}
                  selectedId={property.id}
                  center={[property.coordinates.lng, property.coordinates.lat]}
                  className="h-[260px] rounded-none border-0 border-t"
                />
              </div>
            </div>

            {/* Sticky Action Sidebar */}
            <aside className="lg:pt-1">
              <div className="sk-card sticky top-5 p-5">
                <div className="rounded-lg bg-[#fff8f5] border border-[#fbd4c2] p-3 mb-4">
                  <p className="text-xs font-bold text-[#b55b25] flex items-center gap-1.5">
                    <Gift size={14} /> 25% Off 1st Month Rent
                  </p>
                  <p className="text-[11px] text-[#647782] mt-1">
                    Apply via StayKolo below to claim your verified discount.
                  </p>
                </div>
                <p className="text-[12px] font-bold uppercase tracking-[.12em] text-[#81909a]">Interested in this PG?</p>
                <h2 className="sk-display mt-2 text-[22px] font-bold text-[#18364a]">Request a visit or book now.</h2>
                <p className="mt-2 text-[13px] leading-6 text-[#6d7e88]">
                  Your details go straight to the property owner. No booking commission or hidden fees.
                </p>
                <button
                  type="button"
                  className="sk-button sk-button-primary mt-5 w-full"
                  onClick={() => setModal(true)}
                  data-testid="button-apply-contact"
                >
                  <Mail size={15} /> Apply / Contact PG Owner
                </button>
                <div className="mt-5 border-t border-[#edf1f3] pt-4 text-[12px] text-[#647782]">
                  <p className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#168aad]" />
                    {property.verification.status}
                  </p>
                  <p className="mt-2">Last inspected {property.verification.lastChecked}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {modal && <LeadModal property={property} onClose={() => setModal(false)} />}
    </Shell>
  );
}

/* ========== LEAD CAPTURE MODAL (Req #35, #49) ========== */
function LeadModal({ property, onClose }: { property: PG; onClose: () => void }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !contact.match(/(@|[0-9]{10})/)) {
      setErrors('Enter your name and a valid 10-digit phone number (UID) or email.');
      return;
    }
    setErrors('');
    // Store lead in localStorage for SuperAdmin lead tracking (#35, #49)
    try {
      const existingLeads = JSON.parse(localStorage.getItem('staykolo.leads') || '[]');
      const newLead = {
        id: `lead_${Date.now()}`,
        name,
        contact,
        propertyId: property.id,
        propertyName: property.name,
        area: property.area,
        message,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('staykolo.leads', JSON.stringify([newLead, ...existingLeads]));
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  return (
    <Modal title={`Contact ${property.name}`} onClose={onClose}>
      {submitted ? (
        <div className="py-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f4f7] text-[#0878b0]">
            <Check size={22} />
          </div>
          <h3 className="sk-display mt-4 text-[21px] font-bold text-[#18364a]">Request Received</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#6d7e88]">
            The owner of {property.name} has received your enquiry. Your 25% discount voucher is attached to this request.
          </p>
          <button type="button" className="sk-button sk-button-primary mt-5" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="rounded-lg bg-[#edf7fa] p-3 text-xs text-[#0878b0] font-semibold">
            ✓ Eligible for 25% 1st-month discount on Verified PG admission.
          </div>
          <Field label="Your full name" name="name" value={name} onChange={setName} placeholder="e.g. Rahul Sharma" />
          <Field
            label="Phone number / UID"
            name="contact"
            value={contact}
            onChange={setContact}
            placeholder="+91 98765 43210"
          />
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-[#405966]">
              Message <span className="font-normal text-[#81909a]">(optional)</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#d3e0e4] bg-white p-3 text-[13px] text-[#18364a] outline-none focus:border-[#168aad]"
              placeholder="I would like to know about single room availability starting next week..."
            />
          </label>
          {errors && <p className="text-[11px] text-[#b55b25]">{errors}</p>}
          <button type="submit" className="sk-button sk-button-primary w-full">
            Send Request &amp; Claim 25% Discount <ArrowRight size={15} />
          </button>
        </form>
      )}
    </Modal>
  );
}

function AuthLayout({
  children,
  eyebrow,
  title,
  copy,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <Shell>
      <main className="sk-container py-10 sm:py-16">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-[1fr_1.1fr] items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <KarnatakaFlag className="h-4 w-6" />
              <p className="sk-eyebrow">{eyebrow}</p>
            </div>
            <h1 className="sk-display text-3xl sm:text-4xl font-bold text-[#18364a] leading-tight">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-[#5f7783] max-w-md">
              {copy}
            </p>
            <div className="rounded-xl border border-[#dfe9ee] bg-[#f8fafb] p-4 text-xs space-y-2 text-[#506875]">
              <div className="flex items-center gap-2 font-bold text-[#18364a]">
                <ShieldCheck size={16} className="text-[#0878b0]" />
                Universal 10-Digit Mobile UID Login
              </div>
              <p>
                One single credential across Tenants, PG Owners, Field Staff, and Super Admins.
              </p>
            </div>
          </div>
          <div className="sk-card p-6 sm:p-8 shadow-lg border border-[#d8e4e9] bg-white">
            {children}
          </div>
        </div>
      </main>
    </Shell>
  );
}

/* ========== ROLE-BASED LOGIN PAGE (Req #5, #19, #33, #2) ========== */
export function LoginPage() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'admin' | 'staff' | 'superadmin'>('tenant');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');
  const [ownerPendingMessage, setOwnerPendingMessage] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!contact || !password) {
      setError('Enter your phone number (UID) and password.');
      return;
    }

    setError('');
    setState('loading');

    setTimeout(() => {
      // Role-based routing (#5)
      if (selectedRole === 'tenant') {
        setLocation('/tenant/home');
      } else if (selectedRole === 'admin') {
        if (contact.includes('new') || contact.includes('pending')) {
          setOwnerPendingMessage(true);
          setState('idle');
        } else {
          setLocation('/admin/overview');
        }
      } else if (selectedRole === 'staff') {
        setLocation('/staff/overview');
      } else if (selectedRole === 'superadmin') {
        setLocation('/superadmin/overview');
      } else {
        setLocation('/search');
      }
    }, 500);
  };

  return (
    <AuthLayout
      eyebrow="Single Entry Point"
      title="Role-Based Access."
      copy="One universal login portal for Tenants, PG Owners, Staff, and StayKolo Platform Administrators."
    >
      <p className="sk-eyebrow">StayKolo Account</p>
      <h2 className="sk-display mt-2 text-[26px] font-bold text-[#18364a]">Select your role to sign in.</h2>

      {/* Role Picker (Req #5) */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'tenant', label: 'Tenant', icon: <User size={14} />, route: '/tenant' },
          { id: 'admin', label: 'PG Owner', icon: <Home size={14} />, route: '/admin' },
          { id: 'staff', label: 'Staff', icon: <UserCheck size={14} />, route: '/staff' },
          { id: 'superadmin', label: 'Super Admin', icon: <ShieldCheck size={14} />, route: '/superadmin' },
        ].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setSelectedRole(r.id as typeof selectedRole);
              setOwnerPendingMessage(false);
            }}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
              selectedRole === r.id
                ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0] shadow-sm'
                : 'border-[#dfe9ed] bg-white text-[#506875] hover:bg-[#f8fafb]'
            }`}
          >
            <span className="mb-1">{r.icon}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      {ownerPendingMessage ? (
        <div className="mt-6 rounded-xl bg-[#edf7fa] p-5 text-center">
          <Info className="mx-auto text-[#0878b0]" size={28} />
          <h3 className="sk-display mt-3 text-lg font-bold text-[#18364a]">Verification In Progress</h3>
          <p className="text-xs text-[#506875] mt-2 leading-relaxed">
            Our team will contact you soon to complete profile creation and business verification.
          </p>
          <button
            type="button"
            className="sk-button sk-button-primary mt-4 text-xs"
            onClick={() => setOwnerPendingMessage(false)}
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field
            label="Phone Number (UID)"
            name="login-contact"
            value={contact}
            onChange={setContact}
            placeholder="e.g. 9845012345"
          />
          <Field
            label="Password"
            name="login-password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Enter password"
          />

          {error && <p className="text-xs text-[#b55b25]">{error}</p>}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="sk-button sk-button-primary w-full disabled:opacity-50"
            data-testid="button-login-submit"
          >
            {state === 'loading' ? 'Authenticating…' : `Enter as ${selectedRole.toUpperCase()}`} <ArrowRight size={15} />
          </button>

          <div className="flex justify-between items-center text-xs pt-2">
            <Link href="/auth/forgot-password" className="sk-link">
              Forgot password?
            </Link>
            <Link href="/auth/signup" className="sk-link">
              Create new account
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

/* ========== SIGNUP PAGE (Req #19, #33, #50) ========== */
export function SignupPage() {
  const params = new URLSearchParams(window.location.search);
  const [role, setRole] = useState(params.get('role') === 'owner' ? 'owner' : 'tenant');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !contact.match(/(@|[0-9]{10})/) || password.length < 6) {
      setError('Add your name, a valid 10-digit phone number (UID), and a password of at least 6 characters.');
      return;
    }
    setError('');
    setState('loading');
    const now = new Date().toISOString();
    window.setTimeout(() => {
      localStorage.setItem(
        'staykolo.mockUser',
        JSON.stringify({
          name,
          contact,
          role,
          consent: [
            { agreedDocument: 'terms', version: '2026-09-26', timestamp: now },
            { agreedDocument: 'privacy', version: '2026-09-26', timestamp: now },
          ],
        })
      );
      setState('success');
    }, 550);
  };

  return (
    <AuthLayout
      eyebrow="Create an account"
      title="Start with a better-informed move."
      copy="Save a shortlist, send focused enquiries, claim 25% move-in discount, and access role-based portals."
    >
      <p className="sk-eyebrow">Create account</p>
      <h2 className="sk-display mt-2 text-[26px] font-bold text-[#18364a]">Who are you registering as?</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={`rounded-lg border p-3.5 text-left ${
            role === 'tenant' ? 'border-[#168aad] bg-[#edf7fa]' : 'border-[#d9e4e8] bg-white'
          }`}
          onClick={() => setRole('tenant')}
        >
          <UserRound size={17} className="text-[#0878b0]" />
          <span className="mt-2 block text-xs font-bold text-[#355364]">PG Seeker / Tenant</span>
          <span className="mt-0.5 block text-[11px] text-[#778891]">Compare stays, get 25% off 1st mo.</span>
        </button>
        <button
          type="button"
          className={`rounded-lg border p-3.5 text-left ${
            role === 'owner' ? 'border-[#168aad] bg-[#edf7fa]' : 'border-[#d9e4e8] bg-white'
          }`}
          onClick={() => setRole('owner')}
        >
          <Home size={17} className="text-[#0878b0]" />
          <span className="mt-2 block text-xs font-bold text-[#355364]">PG Owner / Admin</span>
          <span className="mt-0.5 block text-[11px] text-[#778891]">List property &amp; manage tenants.</span>
        </button>
      </div>

      {state === 'success' ? (
        <div className="mt-6 rounded-lg bg-[#edf7fa] p-5 text-center">
          <Check className="mx-auto text-[#168aad]" size={24} />
          <h3 className="sk-display mt-3 text-lg font-bold text-[#18364a]">Account Created</h3>
          <p className="mt-1 text-xs text-[#6d7e88]">Your UID ({contact}) is registered.</p>
          <Link href={role === 'owner' ? '/admin/overview' : '/tenant/home'} className="sk-button sk-button-primary mt-4 text-xs">
            Continue to Portal
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field label="Full Name" name="signup-name" value={name} onChange={setName} placeholder="Your name" />
          <Field
            label="Phone Number (Universal UID)"
            name="signup-contact"
            value={contact}
            onChange={setContact}
            placeholder="10-digit mobile number"
          />
          <Field
            label="Password"
            name="signup-password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="At least 6 characters"
          />

          {error && <p className="text-xs text-[#b55b25]">{error}</p>}

          <label className="flex items-start gap-2 text-[11px] leading-4 text-[#5f7783]">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5"
            />
            I agree to the <Link href="/legal/terms" className="sk-link mx-0.5">Terms of Service</Link>.
          </label>
          <label className="flex items-start gap-2 text-[11px] leading-4 text-[#5f7783]">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5"
            />
            I agree to the <Link href="/legal/privacy" className="sk-link mx-0.5">Privacy Policy</Link>.
          </label>

          <button
            type="submit"
            disabled={!terms || !privacy || state === 'loading'}
            className="sk-button sk-button-primary w-full disabled:opacity-45 text-xs"
          >
            {state === 'loading' ? 'Creating account…' : 'Create Account'} <ArrowRight size={15} />
          </button>
          <p className="text-center text-xs text-[#6d7e88]">
            Already have an account? <Link href="/auth/login" className="sk-link">Sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

function strength(password: string) {
  if (!password) return { label: 'Enter a password', color: '#81909a', width: '0%' };
  if (password.length < 8 || !/[0-9]/.test(password)) return { label: 'Weak', color: '#b55b25', width: '33%' };
  if (password.length < 12 || !/[A-Z]/.test(password)) return { label: 'Medium', color: '#a77b25', width: '66%' };
  return { label: 'Strong', color: '#176d73', width: '100%' };
}

export function ForgotPasswordPage() {
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  return (
    <AuthLayout
      eyebrow="Account access"
      title="A reset link, without the runaround."
      copy="Request a mock email or OTP, then set a new password in the next step."
    >
      <p className="sk-eyebrow">Forgot password</p>
      {sent ? (
        <div className="py-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f4f7] text-[#0878b0]">
            <Mail size={21} />
          </div>
          <h2 className="sk-display mt-4 text-[27px] font-bold text-[#18364a]">Check your phone.</h2>
          <p className="mt-3 text-[13px] leading-6 text-[#6d7e88]">
            For this demo, use OTP <span className="sk-mono font-bold text-[#18364a]">482913</span> on the next screen.
          </p>
          <Link href="/auth/reset-password" className="sk-button sk-button-primary mt-6">
            Continue to reset password <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!contact.match(/(@|[0-9]{10})/)) {
              setError('Enter a valid email or 10-digit phone number.');
              return;
            }
            setSent(true);
          }}
          className="mt-7 space-y-5"
          noValidate
        >
          <h2 className="sk-display text-[27px] font-bold text-[#18364a]">Where should we send it?</h2>
          <Field
            label="Email or Phone Number (UID)"
            name="forgot-contact"
            value={contact}
            onChange={setContact}
            placeholder="you@example.com or 10-digit mobile"
          />
          {error && <p className="text-[11px] text-[#b55b25]">{error}</p>}
          <button type="submit" className="sk-button sk-button-primary w-full">
            Send reset instructions <ArrowRight size={15} />
          </button>
          <Link href="/auth/login" className="block text-center text-[12px] font-semibold text-[#0878b0]">
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const level = strength(password);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (otp !== '482913') setError('That OTP is not correct. Use the six-digit code 482913.');
    else if (password.length < 6) setError('Choose a password of at least 6 characters.');
    else if (password !== confirm) setError('Passwords do not match.');
    else {
      setError('');
      setSuccess(true);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account access"
      title="Choose a password you can keep."
      copy="Password view/hide toggles make it easy to verify what you typed."
    >
      <p className="sk-eyebrow">Reset password</p>
      {success ? (
        <div className="py-8 text-center">
          <Check className="mx-auto text-[#168aad]" size={29} />
          <h2 className="sk-display mt-4 text-[25px] font-bold text-[#18364a]">Password updated.</h2>
          <p className="mt-2 text-[13px] text-[#6d7e88]">Your demo account is ready for sign in.</p>
          <Link href="/auth/login" className="sk-button sk-button-primary mt-5">
            Sign in <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
          <Field label="Six-digit OTP" name="reset-otp" value={otp} onChange={setOtp} placeholder="482913" />
          <div>
            <Field
              label="New password"
              name="reset-password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="Use 6+ characters"
            />
            <div className="mt-2 h-1 rounded-full bg-[#e9eff1]">
              <div className="h-1 rounded-full transition-all" style={{ width: level.width, background: level.color }} />
            </div>
            <p className="mt-1 text-[11px]" style={{ color: level.color }}>
              {level.label}
            </p>
          </div>
          <Field
            label="Confirm new password"
            name="reset-confirm"
            value={confirm}
            onChange={setConfirm}
            type="password"
            placeholder="Repeat password"
          />
          {error && <p className="text-[11px] text-[#b55b25]">{error}</p>}
          <button type="submit" className="sk-button sk-button-primary w-full">
            Set new password <ArrowRight size={15} />
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

function ChronicleCard({ item }: { item: typeof chronicles[number] }) {
  return <article className="sk-card p-5"><div className="flex items-center justify-between gap-3"><span className="text-[11px] font-bold text-[#0878b0]">{item.tag}</span><span className="text-[11px] text-[#81909a]">{item.read}</span></div><h2 className="sk-display mt-5 text-[20px] font-bold leading-tight text-[#18364a]">{item.title}</h2><p className="mt-3 text-[13px] leading-6 text-[#6d7e88]">{item.copy}</p><p className="mt-5 text-[11px] font-semibold text-[#81909a]">{item.date}</p></article>;
}
export function ChroniclesPage() {
  const [active, setActive] = useState('all'); const list = active === 'all' ? chronicles : chronicles.filter((item) => item.tag === active);
  return <Shell><main><section className="border-b border-[#dfe9ee] bg-[#edf7fa]"><div className="sk-container py-14 sm:py-20"><p className="sk-eyebrow">Chronicles</p><h1 className="sk-display mt-3 text-[42px] font-bold text-[#18364a] sm:text-[56px]">Useful notes for the Bengaluru move.</h1><p className="mt-4 max-w-[590px] text-[16px] leading-7 text-[#59717e]">Specific guidance for residents, practical notes for property teams and a record of how Staykolo is being built.</p></div></section><section className="sk-container py-12"><div className="flex flex-wrap gap-2" aria-label="Chronicle tags"><button type="button" className={`rounded-full border px-4 py-2 text-[12px] font-bold ${active === 'all' ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] bg-white text-[#607783]'}`} onClick={() => setActive('all')} data-testid="button-chronicles-all">All notes</button>{tagOptions.map((tag) => <Link key={tag} href={`/chronicles/${tag.slice(1)}`} className={`rounded-full border px-4 py-2 text-[12px] font-bold ${active === tag ? 'border-[#168aad] bg-[#edf7fa] text-[#0878b0]' : 'border-[#d7e4e9] bg-white text-[#607783]'}`} data-testid={`link-chronicle-tag-${tag.slice(1)}`}>{tag}</Link>)}</div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{list.map((item) => <ChronicleCard item={item} key={item.id} />)}</div></section></main></Shell>;
}
export function ChronicleTagPage() {
  const { tag } = useParams<{ tag: string }>(); const fullTag = `#${tag}`; const list = chronicles.filter((item) => item.tag === fullTag);
  return <Shell><main className="sk-container py-12"><Link href="/chronicles" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0]" data-testid="link-back-chronicles"><ArrowLeft size={14} /> All Chronicles</Link><p className="sk-eyebrow mt-10">Chronicles tag</p><h1 className="sk-display mt-2 text-[42px] font-bold text-[#18364a]">{fullTag}</h1>{list.length ? <div className="mt-8 grid gap-4 md:grid-cols-2">{list.map((item) => <ChronicleCard item={item} key={item.id} />)}</div> : <div className="sk-card mt-8 max-w-[580px] p-8"><FileText className="text-[#168aad]" size={25} /><h2 className="sk-display mt-4 text-[22px] font-bold text-[#18364a]">No notes under this tag yet.</h2><p className="mt-2 text-[13px] leading-6 text-[#6d7e88]">Try one of the current Chronicle tags or return to the full notes index.</p><Link href="/chronicles" className="sk-button sk-button-secondary mt-5" data-testid="link-unknown-tag-chronicles">Browse all Chronicles <ArrowRight size={15} /></Link></div>}</main></Shell>;
}

const legalSections = {
  terms: [
    ['1', 'Introduction & Acceptance of Terms', `These Terms of Service, together with the User Agreement, Privacy Policy, and Data Deletion Policy set out below (collectively, the "Terms"), govern access to and use of the Staykolo mobile application and website (the "Platform" or "App"), operated by CoreForge ("CoreForge", "we", "us", or "our"), a company/proprietorship based in Bengaluru, Karnataka, India.\n\nBy downloading, installing, registering on, or otherwise using the Platform whether as a Property Owner, Property Manager/Warden, Staff Member, or Tenant/Resident (each a "User", collectively "Users") you agree to be bound by these Terms. If you do not agree, you must not access or use the Platform.\n\nIf you are entering into these Terms on behalf of a business (for example, listing a PG/co-living property as an Owner), you represent that you have the authority to bind that business, and "you" refers both to you and that business.\n\nWe may update these Terms from time to time. We will notify Users of material changes through the App or by email at least 7 days before the changes take effect. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.`],
    ['2', 'Definitions', `"Platform" means the Staykolo website and mobile application, and all related services, features, and content.\n\n"Owner" means a person or entity who lists a PG/co-living property on the Platform.\n\n"Tenant" or "Resident" means a person who books, subscribes to, or resides at a property listed on the Platform.\n\n"Staff" means wardens, caretakers, or other personnel granted access to manage a property through the Platform.\n\n"Content" means listings, photos, descriptions, reviews, messages, and any other material submitted to the Platform.\n\n"Personal Data" has the meaning given under the Digital Personal Data Protection Act, 2023 ("DPDP Act") any data about an individual who is identifiable by or in relation to such data.\n\n"Services" means property listing and discovery, digital rent/subscription tracking, QR-based WiFi and access provisioning, visitor logging, complaint/issue tracking, staff attendance, notices, and related features described on the Platform.`],
    ['3', 'User Agreement & Eligibility', `3.1 Eligibility\nYou must be at least 18 years old and capable of entering into a legally binding contract under the Indian Contract Act, 1872 to use the Platform. By using the Platform, you represent that you meet this requirement.\n\n3.2 Account Registration\nYou must register using accurate, current, and complete information, including a valid phone number and/or email address. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must notify us immediately at the support contact below if you suspect unauthorized use of your account.\n\n3.3 User Roles & Access Control\nThe Platform assigns role-based access (Owner, Staff/Warden, Tenant) so that each User can only view or manage information relevant to their role. Owners are responsible for correctly assigning and revoking Staff access, including when a Staff member's employment ends.\n\n3.4 Owner Obligations\nProvide accurate property details, pricing, amenities, and photographs. Comply with all applicable local, municipal, and state laws relating to PG/rental accommodation, including police verification of tenants where mandated by local regulations, fire safety norms, and building/occupancy regulations. Obtain and maintain any licenses or registrations required to legally operate a paying-guest accommodation in the relevant jurisdiction. Honour the terms of any tenancy/leave-and-license agreement entered into with a Tenant, independent of the Platform.\n\n3.5 Tenant Obligations\nProvide accurate identification and contact information as required for onboarding and, where applicable, police verification. Comply with the property's house rules, visitor policies, and payment schedules. Use shared amenities, WiFi access, and QR-based entry systems only for their intended purpose and not share access credentials with unauthorized persons.\n\n3.6 Prohibited Conduct\nPosting false, misleading, or fraudulent listings or reviews; attempting to bypass, hack, or misuse the QR-based access, WiFi provisioning, or security systems; harassment, discrimination, or unlawful conduct towards other Users or Staff; or using the Platform for any unlawful purpose or in violation of any applicable law.`],
    ['4', 'Subscription, Payments & Billing', `Staykolo is offered to Owners on a subscription basis as described on the Platform's pricing page, which may include promotional/introductory pricing. Promotional pricing is offered at our discretion, may be time-bound, and may be modified or withdrawn for new subscribers at any time without affecting Users already enrolled at that rate for the promised duration.\n\nWhere the Platform facilitates online rent or subscription payments through a third-party payment gateway, such payments are subject to the payment gateway provider's own terms, and CoreForge is not responsible for failures, delays, or errors caused by the payment gateway or the User's bank. Where the Platform is used only to track or remind Users of payments made outside the App, CoreForge does not process, hold, or guarantee those payments and is not a party to the underlying rent agreement between Owner and Tenant.\n\nSubscription fees, once paid, are non-refundable except where required by law or expressly stated in a specific offer's terms. We will provide reasonable advance notice before any price change takes effect for existing subscribers.`],
    ['5', 'Platform Features & Disclaimers', `The Platform provides tools including, but not limited to: automated property profile creation and marketing, tenant-matching alerts, QR-based WiFi provisioning and automatic credential refresh, QR-based access/entry, visitor logging, staff attendance tracking, furniture/asset inventory, issue/complaint raising and tracking, and payment/agreement/deposit notices, as illustrated in the Platform's feature overview.\n\nThese features are provided as a management and convenience tool. CoreForge does not guarantee tenant occupancy, rental income, or any specific business outcome for Owners. Physical security of the property remains the Owner's responsibility; the Platform's digital access/QR features supplement, but do not replace, physical security measures.\n\nCoreForge Technologies is a technology platform and is not a party to, and does not guarantee performance of, any tenancy, leave-and-license, or rental agreement entered into between an Owner and a Tenant.`],
    ['6', 'Intellectual Property', `All trademarks, logos, app design, source code, and content created by CoreForge (excluding User-submitted Content) are the property of CoreForge and may not be copied, reproduced, or used without prior written consent. Users retain ownership of Content they submit (such as property photos) but grant CoreForge a non-exclusive, royalty-free, worldwide licence to host, display, and use that Content for the purpose of operating and promoting the Platform.`],
    ['7', 'Limitation of Liability & Indemnity', `To the maximum extent permitted by applicable law, CoreForge shall not be liable for any indirect, incidental, special, or consequential damages, or loss of profits, revenue, or data, arising from use of, or inability to use, the Platform. CoreForge aggregate liability for any claim arising out of these Terms shall not exceed the subscription fees paid by the User to CoreForge in the three (3) months preceding the claim.\n\nNothing in these Terms limits liability that cannot be limited under applicable Indian law, including liability arising from gross negligence, wilful misconduct, or fraud.\n\nYou agree to indemnify and hold harmless CoreForge, its officers, employees, and agents from any claims, damages, or expenses (including reasonable legal fees) arising from your breach of these Terms, your Content, or your violation of any law or third-party right.`],
    ['8', 'Suspension & Termination', `We may suspend or terminate a User's access to the Platform, with or without notice, if we reasonably believe the User has violated these Terms, engaged in fraudulent or unlawful conduct, or misused the security/access features of the Platform. Users may terminate their account at any time by contacting support; termination does not entitle the User to a refund of subscription fees already paid, except as required by law.\n\nUpon termination, an Owner's property listing and associated data will be handled in accordance with the Data Deletion Policy in Section 12.`],
    ['9', 'Governing Law & Dispute Resolution', `These Terms are governed by the laws of India. Subject to Section 9 below, the courts at Bengaluru, Karnataka shall have exclusive jurisdiction over any disputes arising out of or in connection with these Terms.\n\nAny dispute, controversy, or claim arising out of or relating to these Terms shall first be referred to good-faith negotiation between the parties. If not resolved within 30 days, the dispute shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, seated in Bengaluru, Karnataka, conducted in English, before a sole arbitrator appointed by mutual agreement. This clause does not prevent either party from seeking urgent interim relief from a competent court.`],
  ],
  privacy: [
    ['10.1', 'Data We Collect', `Identity & contact data: name, phone number, email address, photograph, government ID details (where required for tenant verification).\n\nProperty data: address, room/bed configuration, amenities, rent, occupancy status.\n\nOccupancy & operations data: staff attendance records, visitor logs, furniture/asset inventory, utility status reports.\n\nFinancial data: rent/subscription amounts, payment status, deposit details, and transaction references from the payment gateway. CoreForge does not store full card or bank account numbers.\n\nAccess & device data: QR-based WiFi/access credentials and logs, device identifiers, IP address, app usage/log data, notices and complaint/issue records.\n\nCommunications: messages, complaint descriptions, and support interactions submitted through the Platform.`],
    ['10.2', 'How We Use Personal Data', `To create and manage property listings, tenant-matching alerts, and marketing of properties to prospective tenants; to operate role-based access control, QR WiFi/entry provisioning, and automatic credential refresh; to maintain visitor logs, staff attendance, issue tracking, and notices for property management and safety purposes; to send payment reminders, agreement, and deposit-related notices; to provide customer support, respond to queries, and improve the Platform; and to comply with legal obligations, including tenant verification requirements under applicable local police/municipal regulations, where such verification is enabled through the Platform.\n\nWe process Personal Data on the basis of your consent, for the performance of the contract between you and CoreForge, and, where applicable, to comply with legal obligations.`],
    ['10.3', 'Sharing of Personal Data', `We share Personal Data only as necessary: between an Owner/Staff and their Tenants, and vice versa, to operate the Services; with payment gateway providers, cloud hosting providers, SMS/notification providers, and other service providers who process data on our behalf under contractual confidentiality obligations; with law enforcement or government authorities where required by law; and in connection with a merger, acquisition, or sale of assets of CoreForge, subject to equivalent privacy protections. We do not sell Personal Data to third parties for their independent marketing use.`],
    ['10.4', 'Data Storage & Security', `Personal Data is stored on secure servers, with access restricted through role-based permissions as described in Section 3.3. We use reasonable technical and organisational measures including encryption in transit, access controls, and automatic credential refresh for WiFi/access QR codes to protect Personal Data against unauthorized access, alteration, disclosure, or destruction, in line with the reasonable security practices standard under the IT Act, 2000 and applicable rules. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.`],
    ['10.5', 'Data Retention', `We retain Personal Data for as long as your account is active and as necessary to provide the Services. Visitor logs, attendance records, and complaint/issue records are retained for safety, audit, and dispute-resolution purposes, unless a longer period is required by applicable law. Financial records may be retained longer where required for tax or accounting compliance.`],
    ['10.6', 'Your Rights (Consent, Access, Correction & Erasure)', `In accordance with the DPDP Act, 2023, you have the right to obtain a summary of the Personal Data we hold about you; correct or update inaccurate or incomplete Personal Data; request erasure of your Personal Data, subject to the Data Deletion Policy and legal retention requirements; withdraw consent at any time; nominate another individual to exercise these rights on your behalf in the event of death or incapacity; and file a complaint with the Data Protection Board of India after first raising the grievance with our Grievance Officer.\n\nWithdrawing consent or requesting erasure of certain data may mean we are unable to continue providing some or all Services to you, and we will inform you of this before processing your request.`],
    ['10.7', 'Cookies & Analytics', `The Platform may use cookies, SDKs, and similar technologies to remember preferences, keep you logged in, and understand how the Platform is used, so we can improve it. You can control cookie preferences through your device/browser settings, though disabling cookies may affect some features.`],
    ['10.8', "Children's Data", `The Platform is not directed at, and does not knowingly collect Personal Data from, individuals below 18 years of age acting as independent Users. If you believe a minor has provided Personal Data to us without appropriate consent, please contact us using the details below so we can take appropriate action.`],
    ['10.9', 'Grievance Officer & Contact', `In accordance with the IT Act, 2000, its rules, and the DPDP Act, 2023, the contact details of our Grievance Officer / Data Protection contact are provided below. [Declared Soon]`],
  ],
  deletion: [
    ['11.1', 'How to Request Deletion', `Users may request deletion of their account and associated Personal Data at any time through the "Delete Account" option in the App's settings, or by writing to our support/Grievance Officer contact with the request. We will verify the identity of the requester before processing the request.`],
    ['11.2', 'What Happens on Deletion', `Profile information (name, contact details, photograph) will be permanently deleted from active systems within 30 days of a verified request.\n\nProperty listings created by an Owner will be delisted immediately and permanently deleted within 30 days, unless there is an active, unresolved tenancy or dispute linked to that listing.\n\nVisitor logs, attendance records, and issue/complaint records directly tied to your account will be deleted or anonymised within 30 days, unless retention is required for safety, audit, legal, or regulatory purposes. Financial and transaction records may be retained for the period required under applicable tax, accounting, and audit laws.\n\nPersonal Data may persist in encrypted backups for a limited period (e.g., up to 90 days) after deletion from live systems, after which it is purged in the ordinary backup-rotation cycle. Backup copies are not used for active processing.`],
    ['11.3', 'Effect on Other Users', `Where your data is also part of another User's records required for their own legal or safety compliance (for example, an Owner's visitor log which includes a Tenant's visit details, or a Tenant's record of a completed tenancy needed for an Owner's compliance records), we may retain the minimum necessary information within that other User's records even after you delete your own account, to the extent permitted by law.`],
    ['11.4', 'Confirmation', `We will send a confirmation once your deletion request has been processed. If any data is retained beyond the standard 30-day period, we will explain what is retained, why, and for how long.`],
  ],
} as const;

export function LegalPage({ kind }: { kind: keyof typeof legalSections }) {
  const [confirm, setConfirm] = useState(false); const [requested, setRequested] = useState(false); const isTerms = kind === 'terms'; const isPrivacy = kind === 'privacy'; const title = isTerms ? 'Terms of Service & User Agreement' : isPrivacy ? 'Privacy Policy' : 'Account & Data Deletion Policy'; const sections = legalSections[kind];
  return <Shell><main className="sk-container py-10 sm:py-14"><div className="max-w-[850px]"><p className="sk-eyebrow">Staykolo legal</p><h1 className="sk-display mt-3 text-[36px] font-bold leading-tight text-[#18364a] sm:text-[46px]">{title}</h1><p className="mt-4 text-[13px] leading-6 text-[#6d7e88]">Effective Date: <strong className="text-[#405966]">26 September 2026</strong> · Governing Jurisdiction: <strong className="text-[#405966]">Bengaluru, Karnataka, India</strong></p></div><div className="mt-10 grid gap-10 lg:grid-cols-[210px_1fr]"><aside className="lg:sticky lg:top-5 lg:self-start"><details className="sk-card p-4 lg:open"><summary className="cursor-pointer list-none text-[12px] font-bold text-[#355364]">On this page</summary><nav className="mt-3 space-y-2 border-t border-[#edf1f3] pt-3">{sections.map(([id, heading]) => <a href={`#section-${id.replace('.', '-')}`} key={id} className="block text-[11px] leading-4 text-[#0878b0] hover:underline" data-testid={`link-toc-${id.replace('.', '-')}`}>{id}. {heading}</a>)}</nav></details>{isTerms && <Link href="/legal/privacy" className="mt-4 block text-[11px] font-semibold text-[#0878b0]" data-testid="link-legal-privacy">Read Privacy Policy <ArrowRight size={12} className="inline" /></Link>}{isPrivacy && <Link href="/legal/data-deletion" className="mt-4 block text-[11px] font-semibold text-[#0878b0]" data-testid="link-legal-deletion">Read Data Deletion Policy <ArrowRight size={12} className="inline" /></Link>}</aside><article className="max-w-[700px]"><div className="mb-8 rounded-lg border border-[#cfe2e6] bg-[#edf7fa] p-5 text-[13px] leading-6 text-[#4e6b77]">This document is a structured demo policy for Staykolo, operated by CoreForge. Please read the sections relevant to your use of the Platform.</div>{sections.map(([id, heading, copy]) => <section id={`section-${id.replace('.', '-')}`} key={id} className="scroll-mt-6 border-b border-[#e5edef] py-7 first:pt-0"><h2 className="sk-display text-[23px] font-bold text-[#18364a]"><span className="mr-2 text-[#168aad]">{id}</span>{heading}</h2><div className="mt-4 space-y-4 text-[14px] leading-7 text-[#586f7b]">{copy.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>)}{kind === 'deletion' && <div className="mt-8">{requested ? <div className="rounded-lg bg-[#e4f4f7] p-5 text-[13px] text-[#176d73]" role="status"><Check className="mb-2" size={18} />Deletion request prepared for this demo. No data was deleted.</div> : <button type="button" className="sk-button sk-button-primary" onClick={() => setConfirm(true)} data-testid="button-request-deletion">Request deletion <ArrowRight size={15} /></button>}</div>}</article></div></main>{confirm && <Modal title="Request account deletion?" onClose={() => setConfirm(false)}><p className="mt-4 text-[13px] leading-6 text-[#647782]">This demo will only record that you requested deletion. It will not delete an account or contact a real support team.</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" className="sk-button sk-button-secondary" onClick={() => setConfirm(false)} data-testid="button-cancel-deletion">Cancel</button><button type="button" className="sk-button sk-button-primary" onClick={() => { setRequested(true); setConfirm(false); }} data-testid="button-confirm-deletion">Confirm request</button></div></Modal>}</Shell>;
}

/* ========== ABOUT PAGE (#16, #17, #50) ========== */
export function AboutPage() {
  return (
    <Shell>
      <main>
        <section className="border-b border-[#dfe9ee] bg-[#edf7fa]">
          <div className="sk-container py-14 sm:py-20">
            <div className="flex items-center gap-2.5 mb-3">
              <KarnatakaFlag className="h-4 w-6" />
              <p className="sk-eyebrow tracking-wider font-bold">Brand Karnataka · Made for Bengaluru</p>
            </div>
            <h1 className="sk-display mt-2 text-[40px] font-bold text-[#18364a] sm:text-[54px] leading-tight">
              All at one click. The complete PG ecosystem.
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#59717e]">
              StayKolo connects PG seekers, tenants, staff, and owners across Bengaluru with verified amenities, direct owner contacts, zero broker fees, and 25% first-month savings.
            </p>
          </div>
        </section>

        <section className="sk-container py-14">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="sk-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7fa] text-[#0878b0] mb-4">
                <ShieldCheck size={22} />
              </span>
              <h3 className="sk-display text-lg font-bold text-[#18364a]">100% Resident-Verified</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6d7e88]">
                No fake reviews or star ratings. Real amenity checklists audited by active tenants and on-site staff.
              </p>
            </div>
            <div className="sk-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff8f5] text-[#b55b25] mb-4">
                <Gift size={22} />
              </span>
              <h3 className="sk-display text-lg font-bold text-[#18364a]">25% Off 1st Month</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6d7e88]">
                Claim exclusive move-in savings when applying through the StayKolo platform for verified PG partners.
              </p>
            </div>
            <div className="sk-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7fa] text-[#176d73] mb-4">
                <RotateCcw size={22} />
              </span>
              <h3 className="sk-display text-lg font-bold text-[#18364a]">Ecosystem Deposit Transfer</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6d7e88]">
                Relocating across Bengaluru? Transfer your verification history and deposit seamlessly within our network.
              </p>
            </div>
          </div>

          <div className="mt-12 sk-card p-8 bg-gradient-to-r from-[#edf7fa] to-[#f5fafc]">
            <p className="sk-eyebrow">Phase 1 Bengaluru Corridors</p>
            <h2 className="sk-display mt-2 text-2xl font-bold text-[#18364a]">Built for tech commutes and college hubs.</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#6d7e88] max-w-[650px]">
              Currently serving HSR Layout, Koramangala, Bellandur, Indiranagar, Whitefield, Marathahalli, and Electronic City with localized daily food menus, visitor management, and Wi-Fi provisioning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search" className="sk-button sk-button-primary text-xs">
                Launch StayKolo PG Locator <ArrowRight size={14} />
              </Link>
              <Link href="/auth/signup" className="sk-button sk-button-secondary text-xs">
                Register as PG Owner
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

/* ========== CONTACT PAGE ========== */
export function ContactPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    setSubmitted(true);
  };

  return (
    <Shell>
      <main>
        <section className="border-b border-[#dfe9ee] bg-[#edf7fa]">
          <div className="sk-container py-14 sm:py-20">
            <p className="sk-eyebrow">StayKolo Support</p>
            <h1 className="sk-display mt-2 text-[40px] font-bold text-[#18364a] sm:text-[52px]">
              Get in touch with our team.
            </h1>
            <p className="mt-4 max-w-[550px] text-[16px] leading-7 text-[#59717e]">
              Have questions about PG onboarding, 25% discount claims, or need assistance? We are here to help.
            </p>
          </div>
        </section>

        <section className="sk-container py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <div className="sk-card p-6">
                <h3 className="sk-display text-base font-bold text-[#18364a]">Bengaluru Operations Hub</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6d7e88]">
                  CoreForge Technologies<br />
                  14th Main Rd, Sector 4, HSR Layout<br />
                  Bengaluru, Karnataka 560102
                </p>
                <div className="mt-4 pt-4 border-t border-[#edf1f3] space-y-2 text-xs text-[#506875]">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-[#0878b0]" /> +91 98450 12345
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-[#0878b0]" /> support@staykolo.in
                  </p>
                </div>
              </div>

              <div className="sk-card p-6 bg-[#fff8f5] border-[#fbd4c2]">
                <h4 className="text-xs font-bold text-[#b55b25] flex items-center gap-1.5">
                  <Gift size={14} /> PG Owner Partner Programme
                </h4>
                <p className="text-[11px] text-[#6d7e88] mt-2 leading-relaxed">
                  List your PG on StayKolo and access automated food menu management, staff duty rosters, digital rent reminders, and visitor logs.
                </p>
                <Link href="/auth/signup?role=owner" className="inline-block mt-3 text-xs font-bold text-[#b55b25] hover:underline">
                  List your property →
                </Link>
              </div>
            </div>

            <div className="sk-card p-8">
              <h2 className="sk-display text-xl font-bold text-[#18364a]">Send a message</h2>
              {submitted ? (
                <div className="mt-6 rounded-xl bg-[#edf7fa] p-6 text-center">
                  <Check className="mx-auto text-[#0878b0]" size={28} />
                  <h3 className="sk-display mt-3 text-lg font-bold text-[#18364a]">Message Received</h3>
                  <p className="mt-2 text-xs text-[#6d7e88]">
                    Thank you {name}. Our Bangalore operations team will respond to {contact} within 4 working hours.
                  </p>
                  <button type="button" className="sk-button sk-button-primary mt-5 text-xs" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <Field label="Your Name" name="contact-name" value={name} onChange={setName} placeholder="Rahul Sharma" />
                  <Field label="Phone Number (UID) or Email" name="contact-phone" value={contact} onChange={setContact} placeholder="+91 98765 43210" />
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#405966]">Subject</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. PG Listing verification, 25% discount"
                      className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#405966]">Message</span>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full rounded-lg border border-[#d3e0e4] p-2.5 text-xs outline-none focus:border-[#168aad]"
                    />
                  </label>
                  <button type="submit" className="sk-button sk-button-primary w-full text-xs">
                    Submit Message <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}