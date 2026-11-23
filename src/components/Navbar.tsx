import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  FileText,
  History,
  Layers,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { NAV_SECTIONS, PROFILE, SectionId } from '../data/portfolioData';
import { LiquidNavbar, LiquidNavItem } from './ui/liquid-glass-navbar';
import ArrowFillButton from './ui/arrow-fill-button';

interface NavbarProps {
  activeSection: SectionId;
  showResumeButton: boolean;
  onNavigate: (id: SectionId) => void;
  onOpenResume: () => void;
}

const COMPACT_MEDIA_QUERY = '(max-width: 479px)';

const SECTION_ICONS: Record<SectionId, ReactNode> = {
  overview: <Compass className="h-4 w-4" aria-hidden="true" />,
  'case-studies': <Briefcase className="h-4 w-4" aria-hidden="true" />,
  experience: <History className="h-4 w-4" aria-hidden="true" />,
  capabilities: <Layers className="h-4 w-4" aria-hidden="true" />,
  contact: <Mail className="h-4 w-4" aria-hidden="true" />,
};

export function Navbar({
  activeSection,
  showResumeButton,
  onNavigate,
  onOpenResume,
}: NavbarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [isCompact, setIsCompact] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(COMPACT_MEDIA_QUERY).matches
      : false
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    const idx = NAV_SECTIONS.findIndex((item) => item.id === activeSection);
    return idx >= 0 ? idx : 0;
  }, [activeSection]);

  const activeNavItem = NAV_SECTIONS[activeIndex] ?? NAV_SECTIONS[0];

  const liquidNavItems: LiquidNavItem[] = useMemo(
    () =>
      NAV_SECTIONS.map((item) => ({
        label: item.label,
        href: `#${item.id}`,
        icon: isCompact ? SECTION_ICONS[item.id] : undefined,
        fx: isCompact ? 'pop' : 'none',
      })),
    [isCompact]
  );

  // Automatically switch to compact mode on screens smaller than 480px
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(COMPACT_MEDIA_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsCompact(event.matches);
      setSectionDropdownOpen(false);
    };

    setIsCompact(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleViewportChange);
      return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }
    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close touch-friendly section dropdown on outside click or Escape key
  useEffect(() => {
    if (!sectionDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSectionDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSectionDropdownOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sectionDropdownOpen]);

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
    const wasDrawerOpen = mobileMenuOpen;
    setMobileMenuOpen(false);
    setSectionDropdownOpen(false);
    // Slight defer if closing the body-locked drawer so scroll starts cleanly
    if (wasDrawerOpen) {
      setTimeout(() => onNavigate(id), 40);
    } else {
      onNavigate(id);
    }
  };

  const renderDropdownMenu = (align: 'right' | 'center') => (
    <AnimatePresence>
      {sectionDropdownOpen && (
        <motion.div
          id="section-nav-dropdown"
          role="menu"
          aria-label="Section navigation"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -6, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -6, scale: 0.97 }
          }
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-[calc(100%+8px)] z-50 w-60 max-w-[calc(100vw-24px)] rounded-2xl border border-[#2a2319]/12 bg-[#fdfbf6]/96 p-1.5 shadow-[0_18px_42px_-14px_rgba(15,23,42,0.26)] backdrop-blur-md ${
            align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
          }`}
        >
          <div className="space-y-0.5">
            {NAV_SECTIONS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavSelect(item.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left font-display text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] ${
                    isActive
                      ? 'bg-[#4f6df5]/12 text-[#1d4ed8]'
                      : 'text-[#1c1f2b] hover:bg-[#2a2319]/[0.05] active:bg-[#2a2319]/[0.08]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <span
                      className={
                        isActive ? 'text-[#1d63ff]' : 'text-[#5b5346]'
                      }
                    >
                      {SECTION_ICONS[item.id]}
                    </span>
                    <span className="truncate whitespace-nowrap">
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <Check
                      className="h-4 w-4 shrink-0 text-[#1d63ff]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* One-tap Resume access on compact / small viewports only when scrolled to Thank You */}
          {showResumeButton && (
            <div className="mt-1.5 border-t border-[#2a2319]/10 pt-1.5 sm:hidden">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setSectionDropdownOpen(false);
                  onOpenResume();
                }}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl bg-[#1d63ff] px-3.5 py-2.5 font-display text-sm font-semibold text-white hover:bg-[#1553e6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] focus-visible:ring-offset-1"
              >
                <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>View Resume</span>
                </span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header
        data-sticky-header="true"
        data-compact={isCompact ? 'true' : 'false'}
        className={`no-print sticky top-0 z-40 w-full transition-colors duration-200 ${
          scrolled
            ? 'bg-white/88 dark:bg-[#0a0d14]/88 backdrop-blur-md border-b border-slate-200/90 dark:border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1280px] items-center justify-between ${
            isCompact
              ? 'h-[64px] gap-2 px-3'
              : 'h-[72px] gap-4 xl:gap-6 px-5 md:px-8 lg:px-10 xl:px-12'
          }`}
        >
          {/* Zone 1: Custom Champagne Gold SNB Monogram Home Link */}
          <a
            href="#overview"
            aria-label="Shankar Narayan Bhattacharjee — Home"
            onClick={(e) => {
              e.preventDefault();
              handleNavSelect('overview');
            }}
            className="group inline-flex items-center shrink-0 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] rounded-md"
          >
            <span className="inline-flex items-center mix-blend-multiply">
              <img
                src="/assets/snb-monogram-transparent.png"
                alt="Shankar Narayan Bhattacharjee personal brand logo"
                width={841}
                height={501}
                decoding="async"
                className={`w-auto object-contain transition-transform duration-200 group-hover:scale-[1.04] ${
                  isCompact ? 'h-7' : 'h-9 sm:h-10'
                }`}
              />
            </span>
          </a>

          {/* Zone 2: Navigation (Full text LiquidNavbar on desktop, icon-only compact LiquidNavbar on <480px, section dropdown on 480px–1023px) */}
          {isCompact ? (
            <div className="flex items-center justify-center shrink-0">
              <LiquidNavbar
                items={liquidNavItems}
                active={activeIndex}
                onChange={(index) => {
                  const target = NAV_SECTIONS[index];
                  if (target) handleNavSelect(target.id);
                }}
                tone="light"
                compact={true}
                ariaLabel="Compact primary navigation"
              />
            </div>
          ) : (
            <>
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

              <div
                ref={dropdownRef}
                className="relative flex lg:hidden items-center justify-center shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSectionDropdownOpen((prev) => !prev);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={sectionDropdownOpen}
                  aria-controls="section-nav-dropdown"
                  aria-label={`Current section: ${activeNavItem.label}. Open section navigation menu`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#2a2319]/12 bg-white/82 px-3.5 py-2 font-display text-xs font-semibold text-[#16181f] shadow-sm backdrop-blur-md hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff]"
                >
                  <span className="text-[#4f6df5]">
                    {SECTION_ICONS[activeNavItem.id]}
                  </span>
                  <span>{activeNavItem.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#5b5346] transition-transform duration-200 ${
                      sectionDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {renderDropdownMenu('center')}
              </div>
            </>
          )}

          {/* Zone 3: Primary Action / Compact Touch-Friendly Dropdown / Mobile Drawer */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {isCompact ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSectionDropdownOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={sectionDropdownOpen}
                  aria-controls="section-nav-dropdown"
                  aria-label={`Jump to section (${activeNavItem.label} active)`}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] ${
                    sectionDropdownOpen
                      ? 'border-[#1d63ff]/40 bg-[#1d63ff]/10 text-[#1d4ed8]'
                      : 'border-[#2a2319]/14 bg-white/88 text-[#16181f] hover:bg-white'
                  }`}
                >
                  <span className="sr-only">
                    Section menu ({activeNavItem.label})
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      sectionDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {renderDropdownMenu('right')}
              </div>
            ) : (
              <>
                <div className="hidden sm:flex sm:min-w-[164px] sm:items-center sm:justify-end shrink-0">
                  <AnimatePresence>
                    {showResumeButton && (
                      <motion.div
                        key="navbar-view-resume"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -6, scale: 0.94 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -6, scale: 0.94 }
                        }
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSectionDropdownOpen(false);
                    setMobileMenuOpen((prev) => !prev);
                  }}
                  aria-label={
                    mobileMenuOpen
                      ? 'Close navigation drawer'
                      : 'Open navigation drawer'
                  }
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav-drawer"
                  className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.14] bg-white/90 dark:bg-[#10131a]/90 text-slate-800 dark:text-[#f1f5f9] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff]"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </>
            )}
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
                {showResumeButton && (
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
                )}

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
