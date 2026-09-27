import { type ReactNode, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, ChevronDown, CircleAlert, Clock3, House, Menu, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';

export function Logo() {
  return <Link href="/" className="inline-flex items-center gap-0.5 text-[20px] font-extrabold tracking-[-0.06em] text-[#18364a]" data-testid="link-logo" aria-label="Staykolo home">staykolo<span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1c9bd0]" aria-hidden="true" /></Link>;
}

const navItems = [
  { href: '/search', label: 'Find a PG' },
  { href: '/chronicles', label: 'Chronicles' },
  { href: '/about', label: 'How it works' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return <header className="border-b border-[#e1e8ed] bg-white">
    <div className="sk-container flex h-[72px] items-center justify-between">
      <div className="flex items-center gap-10"><Logo /><span className="hidden border-l border-[#d9e2e8] pl-10 text-[12px] text-[#6e7d87] md:block">All at one click.</span></div>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
        {navItems.map((item) => <Link key={item.href} href={item.href} className="text-[13px] font-semibold text-[#4d626f] transition-colors hover:text-[#0878b0]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 md:flex"><Link href="/contact" className="sk-button sk-button-quiet" data-testid="link-list-property">List your property</Link><Link href="/auth/sign-in" className="sk-button sk-button-secondary" data-testid="link-sign-in">Sign in</Link></div>
      <button className="rounded-md p-2 text-[#355364] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-mobile-menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
    {open && <nav className="border-t border-[#e1e8ed] bg-white px-4 py-3 md:hidden" aria-label="Mobile navigation">
      {navItems.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className="block border-b border-[#eef2f4] px-2 py-3 text-sm font-semibold text-[#355364]" data-testid={`mobile-link-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</Link>)}
      <Link onClick={() => setOpen(false)} href="/contact" className="mt-3 block text-sm font-semibold text-[#0878b0]" data-testid="mobile-link-list-property">List your property</Link>
    </nav>}
  </header>;
}

export function SiteFooter() {
  return <footer className="border-t border-[#dfe7eb] bg-[#f5f8f9]">
    <div className="sk-container grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div><Logo /><p className="mt-4 max-w-[240px] text-[13px] leading-6 text-[#6d7e88]">A clearer way to find and run well-managed PG accommodation in Bengaluru.</p></div>
      <FooterGroup title="Explore" links={[['Find a PG','/search'],['Chronicles','/chronicles'],['How it works','/about']]} />
      <FooterGroup title="For property teams" links={[['List your property','/contact'],['Contact us','/contact']]} />
      <FooterGroup title="Account" links={[['Sign in','/auth/sign-in'],['Your shortlist','/user/saved']]} />
    </div>
    <div className="sk-container flex flex-col gap-2 border-t border-[#dfe7eb] py-5 text-[11px] text-[#81909a] sm:flex-row sm:items-center sm:justify-between"><span>© 2025 Staykolo. CoreForge product systems.</span><span>Built for better renting in Bengaluru.</span></div>
  </footer>;
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return <div><p className="mb-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#8a99a2]">{title}</p>{links.map(([label, href]) => <Link className="mb-2 block w-fit text-[13px] text-[#4d626f] hover:text-[#0878b0]" href={href} key={href + label} data-testid={`footer-link-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}</div>;
}

export function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="sk-eyebrow">{eyebrow}</p><h2 className="sk-display mt-2 text-[25px] font-bold leading-tight text-[#18364a] sm:text-[30px]">{title}</h2>{copy && <p className="mt-2 max-w-[550px] text-[14px] leading-6 text-[#6d7e88]">{copy}</p>}</div>{action}</div>;
}

export function PropertyCard({ name, area, rooms, price, tag, tone = 'blue' }: { name: string; area: string; rooms: string; price: string; tag: string; tone?: 'blue' | 'cyan' | 'slate' }) {
  const toneClass = tone === 'cyan' ? 'bg-[#e4f7f6] text-[#176d73]' : tone === 'slate' ? 'bg-[#edf1f3] text-[#4d626f]' : 'bg-[#e6f2f8] text-[#17668c]';
  return <article className="sk-card overflow-hidden transition-transform duration-200 hover:-translate-y-0.5" data-testid={`card-property-${name.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="sk-property-art"><span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold ${toneClass}`}>{tag}</span><span className="absolute bottom-3 left-4 z-10 text-[11px] font-semibold text-[#53707e]">Verified property profile</span></div>
    <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="sk-display text-[16px] font-bold text-[#18364a]">{name}</h3><p className="mt-1 flex items-center gap-1 text-[12px] text-[#70818b]"><House size={13} /> {area}</p></div><span className="sk-mono text-[13px] font-bold text-[#18364a]">{price}<small className="font-sans font-normal text-[#70818b]"> /mo</small></span></div><div className="mt-4 flex items-center justify-between border-t border-[#edf1f3] pt-3"><span className="text-[12px] text-[#647782]">{rooms}</span><Link href="/pg/orchid-house" className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0878b0] hover:underline" data-testid={`link-property-${name.toLowerCase().replaceAll(' ', '-')}`}>View details <ArrowRight size={13} /></Link></div></div>
  </article>;
}

export function SearchPanel() {
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="sk-card grid gap-3 p-3 shadow-[0_16px_38px_rgba(28,65,87,.12)] md:grid-cols-[1.25fr_1fr_1fr_auto]" aria-label="Find a PG form">
    <label className="sk-field"><Search size={17} /><span className="sr-only">Location</span><input value={location} onChange={(e) => { setLocation(e.target.value); setSubmitted(false); }} placeholder="Search by area or landmark" data-testid="input-search-location" /></label>
    <label className="sk-field"><Clock3 size={17} /><span className="sr-only">Move-in timing</span><select defaultValue="" data-testid="select-move-in"><option value="" disabled>Move-in timing</option><option>Within 30 days</option><option>In 1–3 months</option><option>Just exploring</option></select><ChevronDown size={15} /></label>
    <label className="sk-field"><SlidersHorizontal size={17} /><span className="sr-only">Budget</span><select defaultValue="" data-testid="select-budget"><option value="" disabled>Monthly budget</option><option>Under ₹12,000</option><option>₹12,000–₹20,000</option><option>₹20,000 and above</option></select><ChevronDown size={15} /></label>
    <button type="submit" className="sk-button sk-button-primary px-6" data-testid="button-search-pgs"><Search size={16} /> Find a PG</button>
    {submitted && <p className="col-span-full px-2 pb-1 text-[12px] font-medium text-[#176d73]" role="status" data-testid="status-search">Showing the best available matches{location ? ` near ${location}` : ''}. Search results are coming in Phase 2.</p>}
  </form>;
}

export function StateShowcase() {
  return <section className="sk-container py-20" aria-labelledby="states-heading"><SectionHeading eyebrow="A dependable foundation" title="Clear states for every step" copy="The same straightforward feedback language carries from a first search to a property team dashboard." />
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="sk-card p-5"><div className="mb-5 flex gap-1.5"><div className="sk-sheen h-2 w-16 rounded-full" /><div className="sk-sheen h-2 w-8 rounded-full" /></div><div className="sk-sheen h-3 w-4/5 rounded-full" /><div className="sk-sheen mt-3 h-3 w-full rounded-full" /><div className="sk-sheen mt-3 h-3 w-2/3 rounded-full" /><p className="mt-5 text-[12px] font-semibold text-[#70818b]">Loading property data</p></div>
      <div className="sk-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f3f8] text-[#0878b0]"><Check size={18} /></div><h3 className="sk-display mt-4 text-[15px] font-bold text-[#18364a]">Saved to shortlist</h3><p className="mt-2 text-[12px] leading-5 text-[#70818b]">You can compare this property from your shortlist.</p></div>
      <div className="sk-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e8] text-[#b55b25]"><CircleAlert size={18} /></div><h3 className="sk-display mt-4 text-[15px] font-bold text-[#18364a]">Could not load</h3><p className="mt-2 text-[12px] leading-5 text-[#70818b]">Check your connection and try again.</p><button className="mt-4 text-[12px] font-bold text-[#0878b0] underline underline-offset-2" onClick={() => window.location.reload()} data-testid="button-retry-state">Try again</button></div>
      <div className="sk-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf1f3] text-[#526a78]"><House size={17} /></div><h3 className="sk-display mt-4 text-[15px] font-bold text-[#18364a]">No saved places yet</h3><p className="mt-2 text-[12px] leading-5 text-[#70818b]">Shortlist a place to come back to it later.</p><Link href="/search" className="mt-4 inline-block text-[12px] font-bold text-[#0878b0] underline underline-offset-2" data-testid="link-empty-search">Start exploring</Link></div>
    </div>
  </section>;
}

export function ComingSoon({ title }: { title: string }) {
  return <main className="sk-container flex min-h-[60vh] items-center py-16"><div className="max-w-[560px]"><p className="sk-eyebrow">Phase 1 foundation</p><h1 className="sk-display mt-3 text-[38px] font-bold leading-tight text-[#18364a]">{title}</h1><p className="mt-4 text-[16px] leading-7 text-[#647782]">This screen is mapped into Staykolo’s navigation and will be designed in a future phase. The foundation is ready for it.</p><Link href="/" className="sk-button sk-button-primary mt-7" data-testid="link-return-home">Return to home <ArrowRight size={16} /></Link></div></main>;
}