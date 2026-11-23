import {
  Component,
  ComponentType,
  ErrorInfo,
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion, MotionConfig, useInView, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { CoverSection } from './components/CoverSection';
import { HeroSection } from './components/HeroSection';
import { ScrollProgressBar } from './components/ui/scroll-progress-bar';
import { MagneticCursor } from './components/ui/magnetic-cursor';
import { SectionSeoHead } from './components/SectionSeoHead';
import {
  CASE_STUDIES,
  CaseStudy,
  NAV_SECTIONS,
  PROFILE,
  SectionId,
} from './data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps dynamic ES module imports with export verification and diagnostic error
 * logging so missing exports or failed chunks surface clearly in DevTools.
 */
function createLazyLoader<TModule, TProps>(
  sectionName: string,
  modulePath: string,
  importer: () => Promise<TModule>,
  selector: (mod: TModule) => ComponentType<TProps> | undefined
): () => Promise<{ default: ComponentType<TProps> }> {
  return () => {
    console.log(`[LazyLoad] Resolving "${sectionName}" from "${modulePath}"`);
    return importer()
      .then((mod) => {
        const Selected = selector(mod);
        if (!Selected) {
          throw new Error(
            `Expected named export for "${sectionName}" was undefined in ${modulePath}`
          );
        }
        console.log(
          `[LazyLoad] Loaded "${sectionName}" from "${modulePath}" (export verified)`
        );
        return { default: Selected };
      })
      .catch((error: unknown) => {
        console.error(
          `[LazyLoad] Failed to load "${sectionName}" from "${modulePath}":`,
          error
        );
        throw error;
      });
  };
}

// Verified relative paths from /src/App.tsx -> /src/components/*.tsx
const loadProductShowcase = createLazyLoader(
  'ProductShowcaseScroll',
  './components/ProductShowcaseScroll',
  () => import('./components/ProductShowcaseScroll'),
  (m) => m.ProductShowcaseScroll
);
const loadCaseStudies = createLazyLoader(
  'CaseStudiesSection',
  './components/CaseStudiesSection',
  () => import('./components/CaseStudiesSection'),
  (m) => m.CaseStudiesSection
);
const loadCareerTimeline = createLazyLoader(
  'CareerTimelineSection',
  './components/CareerTimelineSection',
  () => import('./components/CareerTimelineSection'),
  (m) => m.CareerTimelineSection
);
const loadCapabilities = createLazyLoader(
  'CapabilitiesAndProofSection',
  './components/CapabilitiesAndProofSection',
  () => import('./components/CapabilitiesAndProofSection'),
  (m) => m.CapabilitiesAndProofSection
);
const loadFunFacts = createLazyLoader(
  'FunFactsSection',
  './components/FunFactsSection',
  () => import('./components/FunFactsSection'),
  (m) => m.FunFactsSection
);
const loadThankYou = createLazyLoader(
  'ThankYouSection',
  './components/ThankYouSection',
  () => import('./components/ThankYouSection'),
  (m) => m.ThankYouSection
);
const loadCaseStudyModal = createLazyLoader(
  'CaseStudyModal',
  './components/CaseStudyModal',
  () => import('./components/CaseStudyModal'),
  (m) => m.CaseStudyModal
);
const loadResumeDrawer = createLazyLoader(
  'ResumeDrawer',
  './components/ResumeDrawer',
  () => import('./components/ResumeDrawer'),
  (m) => m.ResumeDrawer
);

const ProductShowcaseScroll = lazy(loadProductShowcase);
const CaseStudiesSection = lazy(loadCaseStudies);
const CareerTimelineSection = lazy(loadCareerTimeline);
const CapabilitiesAndProofSection = lazy(loadCapabilities);
const FunFactsSection = lazy(loadFunFacts);
const ThankYouSection = lazy(loadThankYou);
const CaseStudyModal = lazy(loadCaseStudyModal);
const ResumeDrawer = lazy(loadResumeDrawer);

const ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DEFAULT_HEADER_HEIGHT = 72;
const SCROLL_PADDING_BUFFER = 4;

function getStickyHeaderHeight(): number {
  if (typeof document === 'undefined') return DEFAULT_HEADER_HEIGHT;
  const headerEl = document.querySelector<HTMLElement>(
    '[data-sticky-header="true"], header'
  );
  if (!headerEl || !headerEl.isConnected) return DEFAULT_HEADER_HEIGHT;
  const measured = headerEl.getBoundingClientRect().height;
  return Number.isFinite(measured) && measured > 0
    ? Math.round(measured)
    : DEFAULT_HEADER_HEIGHT;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  retryKey: number;
}

class SectionErrorBoundary extends Component<
  { label: string; children: ReactNode },
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    retryKey: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<SectionErrorBoundaryState> {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected render error',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[SectionErrorBoundary] Error rendering "${this.props.label}":`,
      error,
      info.componentStack
    );
  }

  handleRetry = () => {
    console.log(
      `[SectionErrorBoundary] Retrying "${this.props.label}" (attempt #${
        this.state.retryKey + 1
      })`
    );
    this.setState((prev) => ({
      hasError: false,
      errorMessage: '',
      retryKey: prev.retryKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto max-w-[1280px] px-5 py-16 text-center"
        >
          <p className="font-display text-sm font-semibold text-slate-800 dark:text-[#e1e2ec]">
            Unable to load the {this.props.label} section.
          </p>
          {this.state.errorMessage && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-[#94a3b8]">
              {this.state.errorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-transparent px-4 py-2 font-display text-xs font-semibold text-slate-900 dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-white/[0.06] cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      );
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}

interface SectionRevealProps {
  children: ReactNode;
  immediate?: boolean;
  forceVisible?: boolean;
  delay?: number;
}

/**
 * Wraps sections OUTSIDE Suspense boundaries and triggers as soon as ANY pixel
 * enters the viewport (amount: "some") so tall lazy-loaded sections can never
 * remain stuck at opacity: 0 on short screens or iframes.
 */
function SectionReveal({
  children,
  immediate = false,
  forceVisible = false,
  delay = 0,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const revealRef = useRef<HTMLDivElement>(null);
  const inView = useInView(revealRef, { once: true, amount: 'some' });
  const [revealed, setRevealed] = useState(immediate || forceVisible);

  useEffect(() => {
    if (inView || forceVisible || immediate) {
      setRevealed(true);
    }
  }, [inView, forceVisible, immediate]);

  // Safety check on scroll in case a tall container crosses viewport before observer fires
  useEffect(() => {
    if (revealed) return;
    const checkPosition = () => {
      const el = revealRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120 && rect.bottom > -120) {
        setRevealed(true);
      }
    };
    checkPosition();
    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [revealed]);

  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      ref={revealRef}
      initial={{ opacity: 0, y: 24 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: ENTRANCE_EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionSkeleton({ label }: { label: string }) {
  // Warn in console if a Suspense boundary stays pending unusually long
  useEffect(() => {
    const slowTimer = window.setTimeout(() => {
      console.warn(
        `[Suspense] Section "${label}" is still pending after 4000ms. Check network tab or chunk bundling.`
      );
    }, 4000);
    return () => window.clearTimeout(slowTimer);
  }, [label]);

  return (
    <div
      role="status"
      aria-label={`Loading ${label}`}
      className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-xl space-y-3 text-center">
        <div className="mx-auto h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-white/[0.08]" />
        <div className="mx-auto h-8 w-72 animate-pulse rounded-lg bg-slate-200/90 dark:bg-white/[0.1]" />
      </div>
      <div className="mt-10 min-h-[360px] animate-pulse rounded-[28px] border border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#10131a]/80" />
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [revealedSections, setRevealedSections] = useState<
    Partial<Record<SectionId, boolean>>
  >({ overview: true });
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [prefilledTopic, setPrefilledTopic] = useState<string | null>(null);

  // Untransformed outer anchor refs for exact scroll-to and scroll-spy geometry
  const mainRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    overview: null,
    'case-studies': null,
    experience: null,
    capabilities: null,
    contact: null,
  });
  const scrollLockUntilRef = useRef<number>(0);
  const pendingScrollTargetRef = useRef<SectionId | null>(null);
  const heroAnchorRef = useRef<HTMLDivElement>(null);

  const registerSectionRef = useCallback(
    (id: SectionId) => (el: HTMLDivElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  // Defensive lookup ensuring sectionRefs are non-null and connected to the live DOM
  const resolveSectionElement = useCallback((id: SectionId): HTMLElement | null => {
    const refEl = sectionRefs.current[id];
    if (refEl && refEl.isConnected) {
      return refEl;
    }

    const domEl = document.getElementById(id);
    if (domEl && domEl.isConnected) {
      if (domEl instanceof HTMLDivElement) {
        sectionRefs.current[id] = domEl;
      }
      return domEl;
    }

    return null;
  }, []);

  // Verify sectionRefs map cleanly to DOM nodes right after mount
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      const mapping: Record<string, { mapped: boolean; top: number | null }> = {};
      const missing: SectionId[] = [];

      for (const { id } of NAV_SECTIONS) {
        const el = resolveSectionElement(id);
        if (!el) {
          missing.push(id);
          mapping[id] = { mapped: false, top: null };
        } else {
          mapping[id] = {
            mapped: true,
            top: Math.round(el.getBoundingClientRect().top + window.scrollY),
          };
        }
      }

      if (missing.length > 0) {
        console.warn('[ScrollSpy] Missing sectionRefs in DOM after render:', missing);
      } else {
        console.log('[ScrollSpy] Verified sectionRefs DOM mapping:', mapping);
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [resolveSectionElement]);

  // Pre-warm lazy section chunks right after initial render so scrolling & nav jumps are seamless
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaders = [
        loadProductShowcase,
        loadCaseStudies,
        loadCareerTimeline,
        loadCapabilities,
        loadFunFacts,
        loadThankYou,
      ];
      loaders.forEach((load) => {
        void load().catch(() => {
          // Error already logged inside createLazyLoader
        });
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('portfolio-theme');
    } catch {
      // ignore storage errors in restricted iframes
    }
  }, []);

  // Unified scroll-to-section handler measuring live sticky navbar height & verified anchor refs
  const scrollToSection = useCallback(
    (id: SectionId) => {
      setActiveSection(id);
      setRevealedSections((prev) => ({ ...prev, [id]: true }));
      scrollLockUntilRef.current = performance.now() + 1000;
      pendingScrollTargetRef.current = id;

      if (id === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = resolveSectionElement(id);
      if (!targetEl) {
        console.warn(
          `[Navigation] Target section anchor "#${id}" is not yet available in DOM.`
        );
        return;
      }

      const rect = targetEl.getBoundingClientRect();
      if (!Number.isFinite(rect.top)) return;

      const headerOffset = getStickyHeaderHeight() + SCROLL_PADDING_BUFFER;
      const targetTop = rect.top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, Math.round(targetTop)),
        behavior: 'smooth',
      });
    },
    [resolveSectionElement]
  );

  const scrollToHero = useCallback(() => {
    const el = heroAnchorRef.current;
    if (!el || !el.isConnected) return;
    const headerOffset = getStickyHeaderHeight() + SCROLL_PADDING_BUFFER;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: Math.max(0, Math.round(top)),
      behavior: 'smooth',
    });
  }, []);

  // Unified scroll-spy tracking against verified section anchors & freshly queried sticky navbar height
  useEffect(() => {
    const releaseScrollLock = () => {
      scrollLockUntilRef.current = 0;
      pendingScrollTargetRef.current = null;
    };

    const updateActiveSection = () => {
      if (performance.now() < scrollLockUntilRef.current) {
        return;
      }
      pendingScrollTargetRef.current = null;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const atBottom =
        scrollTop > 40 && window.innerHeight + scrollTop >= scrollHeight - 24;

      if (atBottom) {
        setActiveSection((prev) => (prev === 'contact' ? prev : 'contact'));
        return;
      }

      // Re-query the live sticky header height on every check so triggerY stays accurate
      const headerHeight = getStickyHeaderHeight();
      const activationBand = Math.round(Math.min(120, window.innerHeight * 0.18));
      const triggerY = headerHeight + activationBand;

      let currentId: SectionId = 'overview';

      for (const { id } of NAV_SECTIONS) {
        const el = resolveSectionElement(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (!Number.isFinite(rect.top) || rect.height <= 0) continue;

        if (rect.top <= triggerY) {
          currentId = id;
        }
      }

      setActiveSection((prev) => (prev === currentId ? prev : currentId));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    window.addEventListener('wheel', releaseScrollLock, { passive: true });
    window.addEventListener('touchstart', releaseScrollLock, { passive: true });

    // Re-sync scroll-spy, pending nav jumps, and GSAP ScrollTrigger positions when lazy sections change page height
    let resizeObserver: ResizeObserver | null = null;
    let refreshTimer: number | null = null;
    if (typeof ResizeObserver !== 'undefined' && mainRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (refreshTimer !== null) {
          window.clearTimeout(refreshTimer);
        }
        refreshTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
          refreshTimer = null;
        }, 120);

        const pendingId = pendingScrollTargetRef.current;
        if (
          pendingId &&
          pendingId !== 'overview' &&
          performance.now() < scrollLockUntilRef.current
        ) {
          const targetEl = resolveSectionElement(pendingId);
          if (targetEl) {
            const headerOffset = getStickyHeaderHeight() + SCROLL_PADDING_BUFFER;
            const targetTop =
              targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({
              top: Math.max(0, Math.round(targetTop)),
              behavior: 'smooth',
            });
          }
          return;
        }
        updateActiveSection();
      });
      resizeObserver.observe(mainRef.current);
    }

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('wheel', releaseScrollLock);
      window.removeEventListener('touchstart', releaseScrollLock);
      resizeObserver?.disconnect();
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }
    };
  }, [resolveSectionElement]);

  const handleNextCaseStudy = (currentId: string) => {
    const currentIndex = CASE_STUDIES.findIndex((s) => s.id === currentId);
    const nextIndex = (currentIndex + 1) % CASE_STUDIES.length;
    setActiveCaseStudy(CASE_STUDIES[nextIndex]);
  };

  const handleDiscussStudy = (studyTitle: string) => {
    setActiveCaseStudy(null);
    setPrefilledTopic(studyTitle);
    setTimeout(() => {
      scrollToSection('contact');
    }, 80);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#ebe6dc] text-[#16181f] dark:bg-[#080a0f] dark:text-[#e4e6f0] transition-colors duration-200">
        <SectionSeoHead
          activeSection={activeSection}
          activeCaseStudy={activeCaseStudy}
          resumeOpen={resumeOpen}
          isDark={false}
        />
        <ScrollProgressBar isDark={false} />
        <MagneticCursor isDark={false} />

        <Navbar
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onOpenResume={() => setResumeOpen(true)}
        />

        <main ref={mainRef} className="no-print">
          {/* Canonical untransformed anchor containers prevent motion transform offset drift */}
          <div
            id="overview"
            ref={registerSectionRef('overview')}
            className="scroll-mt-[76px]"
          >
            <CoverSection isDark={false} onExploreBelow={scrollToHero} />

            <div ref={heroAnchorRef} className="scroll-mt-[76px]">
              <SectionReveal forceVisible={!!revealedSections.overview} delay={0.04}>
                <HeroSection
                  onOpenResume={() => setResumeOpen(true)}
                  onJumpToCaseStudies={() => scrollToSection('case-studies')}
                />
              </SectionReveal>
            </div>

            <SectionReveal delay={0.04}>
              <SectionErrorBoundary label="product showcase">
                <Suspense fallback={<SectionSkeleton label="product showcase" />}>
                  <ProductShowcaseScroll onSelectCaseStudy={setActiveCaseStudy} />
                </Suspense>
              </SectionErrorBoundary>
            </SectionReveal>
          </div>

          <div
            id="case-studies"
            ref={registerSectionRef('case-studies')}
            className="scroll-mt-[76px]"
          >
            <SectionReveal
              forceVisible={!!revealedSections['case-studies']}
              delay={0.04}
            >
              <SectionErrorBoundary label="case studies">
                <Suspense fallback={<SectionSkeleton label="case studies" />}>
                  <CaseStudiesSection onSelectCaseStudy={setActiveCaseStudy} />
                </Suspense>
              </SectionErrorBoundary>
            </SectionReveal>
          </div>

          <div
            id="experience"
            ref={registerSectionRef('experience')}
            className="scroll-mt-[76px]"
          >
            <SectionReveal
              forceVisible={!!revealedSections.experience}
              delay={0.04}
            >
              <SectionErrorBoundary label="career timeline">
                <Suspense fallback={<SectionSkeleton label="career timeline" />}>
                  <CareerTimelineSection />
                </Suspense>
              </SectionErrorBoundary>
            </SectionReveal>
          </div>

          <div
            id="capabilities"
            ref={registerSectionRef('capabilities')}
            className="scroll-mt-[76px]"
          >
            <SectionReveal
              forceVisible={!!revealedSections.capabilities}
              delay={0.04}
            >
              <SectionErrorBoundary label="capabilities and tech stack">
                <Suspense
                  fallback={<SectionSkeleton label="capabilities and tech stack" />}
                >
                  <CapabilitiesAndProofSection onSelectCaseStudy={setActiveCaseStudy} />
                </Suspense>
              </SectionErrorBoundary>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.04}>
            <SectionErrorBoundary label="fun facts">
              <Suspense fallback={<SectionSkeleton label="fun facts" />}>
                <FunFactsSection />
              </Suspense>
            </SectionErrorBoundary>
          </SectionReveal>

          <div
            id="contact"
            ref={registerSectionRef('contact')}
            className="scroll-mt-[76px]"
          >
            <SectionReveal forceVisible={!!revealedSections.contact} delay={0.04}>
              <SectionErrorBoundary label="thank you closing sheet">
                <Suspense fallback={<SectionSkeleton label="closing sheet" />}>
                  <ThankYouSection
                    prefilledTopic={prefilledTopic}
                    onClearPrefilledTopic={() => setPrefilledTopic(null)}
                    onOpenResume={() => setResumeOpen(true)}
                    onJumpToCaseStudies={() => scrollToSection('case-studies')}
                    onBackToTop={() => scrollToSection('overview')}
                  />
                </Suspense>
              </SectionErrorBoundary>
            </SectionReveal>
          </div>
        </main>

        {/* On-demand code-split interactive overlays */}
        {activeCaseStudy && (
          <SectionErrorBoundary label="case study details">
            <Suspense fallback={null}>
              <CaseStudyModal
                study={activeCaseStudy}
                onClose={() => setActiveCaseStudy(null)}
                onNextStudy={handleNextCaseStudy}
                onDiscussStudy={handleDiscussStudy}
              />
            </Suspense>
          </SectionErrorBoundary>
        )}

        {resumeOpen && (
          <SectionErrorBoundary label="resume drawer">
            <Suspense fallback={null}>
              <ResumeDrawer open={resumeOpen} onClose={() => setResumeOpen(false)} />
            </Suspense>
          </SectionErrorBoundary>
        )}
      </div>
    </MotionConfig>
  );
}
