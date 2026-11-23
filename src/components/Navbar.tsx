import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Mail, Menu, X } from 'lucide-react';
import { NAV_SECTIONS, PROFILE, SectionId } from '../data/portfolioData';
import { LiquidNavbar, LiquidNavItem } from './ui/liquid-glass-navbar';
import ArrowFillButton from './ui/arrow-fill-button';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  onOpenResume: () => void;
}

export function Navbar({
  activeSection,
  onNavigate,
  onOpenResume,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeIndex = useMemo(() => {
    const idx = NAV_SECTIONS.findIndex((item) => item.id === activeSection);
    return idx >= 0 ? idx : 0;
  }, [activeSection]);

  const liquidNavItems: LiquidNavItem[] = useMemo(
    () =>
      NAV_SECTIONS.map((item) => ({
        label: item.label,
        href: `#${item.id}`,
        fx: 'none',
      })),
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll and listen for ESC while mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavSelect = (id: SectionId) => {
    setMobileMenuOpen(false);
    // Slight defer if closing the body-locked drawer so scroll starts cleanly
    if (mobileMenuOpen) {
      setTimeout(() => onNavigate(id), 40);
    } else {
      onNavigate(id);
    }
  };

  return (
    <>
      <header
        data-sticky-header="true"
        className={`no-print sticky top-0 z-40 w-full transition-colors duration-200 ${
          scrolled
            ? 'bg-white/88 dark:bg-[#0a0d14]/88 backdrop-blur-md border-b border-slate-200/90 dark:border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 xl:gap-6 px-5 md:px-8 lg:px-10 xl:px-12">
          {/* Zone 1: Custom Champagne Gold SNB Monogram (Transparent Alpha Cutout) */}
          <a
            href="#overview"
            aria-label={`${PROFILE.name} — Back to top`}
            onClick={(e) => {
              e.preventDefault();
              handleNavSelect('overview');
            }}
            className="group inline-flex items-center shrink-0 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] rounded-md"
          >
            <img
              src="/assets/snb-monogram-transparent.png"
              alt="SNB Monogram — Shankar Narayan Bhattacharjee"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_1px_2px_rgba(20,16,10,0.16)] transition-transform duration-200 group-hover:scale-[1.04]"
            />
          </a>

          {/* Zone 2: Desktop Liquid Glass Navigation Pill */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <LiquidNavbar
              items={liquidNavItems}
              active={activeIndex}
              onChange={(index) => {
                const target = NAV_SECTIONS[index];
                if (target) handleNavSelect(target.id);
              }}
              tone="light"
              compact={false}
              ariaLabel="Primary navigation"
            />
          </div>

          {/* Zone 3: Primary Action & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:inline-flex shrink-0">
              <ArrowFillButton
                btnText="View Resume"
                href="#resume"
                size="navbar"
                bgColor="#1d63ff"
                textColor="#ffffff"
                fillBgColor="#ffffff"
                fillTextColor="#1d63ff"
                hoverFillBgColor="#ffffff"
                hoverFillTextColor="#1d63ff"
                arrowColor="#1d63ff"
                hoverArrowColor="#1d63ff"
                onClick={(event) => {
                  event.preventDefault();
                  onOpenResume();
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={
                mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.14] bg-white/90 dark:bg-[#10131a]/90 text-slate-800 dark:text-[#f1f5f9] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="no-print fixed inset-0 z-50 lg:hidden">
            {/* Backdrop scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 bg-slate-950/45 dark:bg-[#06080d]/75 backdrop-blur-sm"
            />

            {/* Right-aligned drawer panel */}
            <motion.aside
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 flex w-full max-w-[320px] flex-col border-l border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0b0e15] shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/[0.08] px-5">
                <span className="font-display text-sm font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation drawer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.12] text-slate-600 dark:text-[#c3c5d8] hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Nav Links (48px touch targets) */}
              <nav
                aria-label="Mobile section navigation"
                className="flex-1 overflow-y-auto px-4 py-5"
              >
                <div className="space-y-1.5">
                  {NAV_SECTIONS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavSelect(item.id);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 py-3 font-display text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#1d63ff]/10 text-[#1d4ed8] dark:bg-[#1d63ff]/18 dark:text-[#f1f5f9]'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-[#c3c5d8] dark:hover:bg-white/[0.05] dark:hover:text-[#f1f5f9]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isActive
                              ? 'text-[#1d63ff] dark:text-[#38bdf8] translate-x-0.5'
                              : 'text-slate-400 dark:text-white/30'
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                    );
                  })}
                </div>
              </nav>

              {/* Drawer Footer CTA */}
              <div className="shrink-0 space-y-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#06080d] p-5">
                <ArrowFillButton
                  btnText="View Resume"
                  href="#resume"
                  size="drawer"
                  bgColor="#1d63ff"
                  textColor="#ffffff"
                  fillBgColor="#ffffff"
                  fillTextColor="#1d63ff"
                  hoverFillBgColor="#ffffff"
                  hoverFillTextColor="#1d63ff"
                  arrowColor="#1d63ff"
                  hoverArrowColor="#1d63ff"
                  onClick={(event) => {
                    event.preventDefault();
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                />

                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 dark:text-[#94a3b8] hover:text-slate-950 dark:hover:text-[#f1f5f9] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{PROFILE.email}</span>
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
