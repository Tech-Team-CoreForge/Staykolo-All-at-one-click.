import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Compass, Home } from 'lucide-react';
import { SiteNav, SiteFooter } from '@/components/staykolo-ui';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#fbfcfd] flex flex-col justify-between">
      <SiteNav />
      <main className="sk-container py-20 my-auto flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7fa] text-[#0878b0] mb-5 shadow-sm">
          <Compass size={32} />
        </div>
        <p className="sk-eyebrow">404 Error · Page Not Found</p>
        <h1 className="sk-display mt-2 text-[36px] font-bold text-[#18364a] sm:text-[46px]">
          We couldn't locate that page.
        </h1>
        <p className="mt-3 max-w-[500px] text-sm text-[#6d7e88] leading-relaxed">
          The link you followed may be outdated, moved, or misspelled. Use the options below to get back to the StayKolo ecosystem.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="sk-button sk-button-secondary text-xs">
            <Home size={14} /> Back to Home
          </Link>
          <Link href="/search" className="sk-button sk-button-primary text-xs">
            Launch StayKolo PG Locator <ArrowRight size={14} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
