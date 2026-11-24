import {
  Component,
  ComponentType,
  ErrorInfo,
  lazy,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  MotionConfig,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { CoverSection } from './components/CoverSection';
import { HelloSection } from './components/HelloSection';
import { ScrollProgressBar } from './components/ui/scroll-progress-bar';
import { SectionProgressIndicator } from './components/ui/section-progress-indicator';
import { MagneticCursor } from './components/ui/magnetic-cursor';
import { SectionDivider } from './components/ui/section-divider';
import { ScrollTargetAnchor } from './components/ui/scroll-target-anchor';
import { ScrollSpyDebugLine } from './components/ui/scroll-spy-debug-line';
import { SectionHighlighter } from './components/ui/section-highlighter';
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

interface ScrollSpyMetrics {
  headerHeight: number;
  buffer: number;
  triggerY: number;
}

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

function getLiveStickyHeaderOffset(): number {
  return getStickyHeaderHeight() + SCROLL_PADDING_BUFFER;
}

function getDocumentScrollTop(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.scrollingElement?.scrollTop ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function getDocumentMaxScrollY(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  const scrollHeight = Math.max(
    document.scrollingElement?.scrollHeight ?? 0,
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  return Math.max(0, scrollHeight - window.innerHeight);
}

function computeScrollSpyMetrics(): ScrollSpyMetrics {
  const headerHeight = getStickyHeaderHeight();
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 800;
  const buffer = Math.round(Math.min(120, viewportHeight * 0.18));
  return {
    headerHeight,
    buffer,
    triggerY: headerHeight + buffer,
  };
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
  const [isThankYouVisible, setIsThankYouVisible] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [keyboardAnnouncement, setKeyboardAnnouncement] = useState('');
  const [scrollMetrics, setScrollMetrics] = useState<ScrollSpyMetrics>(() =>
    computeScrollSpyMetrics()
  );

  const stickyHeaderOffset = scrollMetrics.headerHeight + SCROLL_PADDING_BUFFER;
  const { scrollY } = useScroll();
  const lastScrollYRef = useRef<number>(0);

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
  const activeScrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const pendingRefreshAfterScrollRef = useRef<boolean>(false);
  const heroAnchorRef = useRef<HTMLDivElement>(null);

  // Keep root CSS scroll-padding-top synchronized with the live sticky header height
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.scrollPaddingTop = `${stickyHeaderOffset}px`;
  }, [stickyHeaderOffset]);

  const sectionRefCallbacks = useMemo<
    Record<SectionId, (el: HTMLDivElement | null) => void>
  >(
    () => ({
      overview: (el) => {
        sectionRefs.current.overview = el;
      },
      'case-studies': (el) => {
        sectionRefs.current['case-studies'] = el;
      },
      experience: (el) => {
        sectionRefs.current.experience = el;
      },
      capabilities: (el) => {
        sectionRefs.current.capabilities = el;
      },
      contact: (el) => {
        sectionRefs.current.contact = el;
      },
    }),
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
            top: Math.round(
              el.getBoundingClientRect().top + getDocumentScrollTop()
            ),
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

  // Hide navbar when scrolling down past top threshold; reappear immediately on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollYRef.current;
    lastScrollYRef.current = latest;

    // Keep navbar visible near the very top, while modals are open, or during programmatic nav scrolls
    if (
      latest <= 88 ||
      activeCaseStudy !== null ||
      resumeOpen ||
      activeScrollTweenRef.current !== null
    ) {
      setIsNavbarHidden((prev) => (prev ? false : prev));
      return;
    }

    const delta = latest - previous;
    if (delta < -2) {
      // Scrolling up: reappear immediately
      setIsNavbarHidden((prev) => (prev ? false : prev));
    } else if (delta > 6) {
      // Scrolling down past threshold: slide navbar out of view
      setIsNavbarHidden((prev) => (prev ? prev : true));
    }
  });

  const cancelActiveScrollTween = useCallback(() => {
    if (activeScrollTweenRef.current) {
      activeScrollTweenRef.current.kill();
      activeScrollTweenRef.current = null;
    }
  }, []);

  // Unified GSAP smooth-scroll engine: interpolates a proxy object rather than
  // relying on ScrollToPlugin's autoKill heuristic (which can falsely abort on
  // ScrollTrigger refreshes, DPR rounding, or iframe scroll clamping), while
  // dynamically tracking target anchor shifts as lazy sections hydrate.
  const smoothScrollWindowTo = useCallback(
    (fallbackTargetY: number, resolveLiveTargetY?: () => number | null) => {
      cancelActiveScrollTween();

      const computeClampedTarget = () => {
        const live = resolveLiveTargetY ? resolveLiveTargetY() : fallbackTargetY;
        const raw =
          live !== null && Number.isFinite(live) ? live : fallbackTargetY;
        return Math.max(0, Math.min(getDocumentMaxScrollY(), Math.round(raw)));
      };

      const applyScrollY = (y: number) => {
        const clamped = Math.max(0, Math.min(getDocumentMaxScrollY(), y));
        window.scrollTo({ top: clamped, left: 0, behavior: 'auto' });
        if (Math.abs(getDocumentScrollTop() - clamped) > 2) {
          if (document.scrollingElement) {
            document.scrollingElement.scrollTop = clamped;
          }
          document.documentElement.scrollTop = clamped;
          document.body.scrollTop = clamped;
        }
      };

      const finishScroll = () => {
        activeScrollTweenRef.current = null;
        pendingScrollTargetRef.current = null;
        if (pendingRefreshAfterScrollRef.current) {
          pendingRefreshAfterScrollRef.current = false;
          ScrollTrigger.refresh();
        } else {
          ScrollTrigger.update();
        }
      };

      const targetY = computeClampedTarget();
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        applyScrollY(targetY);
        finishScroll();
        return;
      }

      const startY = getDocumentScrollTop();
      if (Math.abs(targetY - startY) < 2) {
        applyScrollY(targetY);
        finishScroll();
        return;
      }

      const proxy = { progress: 0 };
      activeScrollTweenRef.current = gsap.to(proxy, {
        progress: 1,
        duration: 0.78,
        ease: 'power3.out',
        onUpdate: () => {
          const liveTarget = computeClampedTarget();
          const nextY = startY + (liveTarget - startY) * proxy.progress;
          applyScrollY(nextY);
          ScrollTrigger.update();
        },
        onComplete: () => {
          const liveTarget = computeClampedTarget();
          applyScrollY(liveTarget);
          finishScroll();
        },
      });
    },
    [cancelActiveScrollTween]
  );

  // Unified scroll-to-section handler measuring live sticky navbar height & verified anchor refs
  const scrollToSection = useCallback(
    (id: SectionId) => {
      setActiveSection(id);
      setIsThankYouVisible(id === 'contact');
      setRevealedSections((prev) => ({ ...prev, [id]: true }));
      scrollLockUntilRef.current = performance.now() + 900;
      pendingScrollTargetRef.current = id;

      if (id === 'overview') {
        smoothScrollWindowTo(0, () => 0);
        return;
      }

      const measureTargetY = (): number | null => {
        const el = resolveSectionElement(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (!Number.isFinite(rect.top)) return null;
        return rect.top + getDocumentScrollTop() - getLiveStickyHeaderOffset();
      };

      const initialTop = measureTargetY();
      if (initialTop === null) {
        console.warn(
          `[Navigation] Target section anchor "#${id}" is not yet available in DOM.`
        );
        return;
      }

      smoothScrollWindowTo(initialTop, measureTargetY);
    },
    [resolveSectionElement, smoothScrollWindowTo]
  );

  const scrollToHero = useCallback(() => {
    const measureHeroY = (): number | null => {
      const el = heroAnchorRef.current;
      if (!el || !el.isConnected) return null;
      return (
        el.getBoundingClientRect().top +
        getDocumentScrollTop() -
        getLiveStickyHeaderOffset()
      );
    };
    const top = measureHeroY();
    if (top === null) return;
    smoothScrollWindowTo(top, measureHeroY);
  }, [smoothScrollWindowTo]);

  // Unified scroll-spy tracking against verified section anchors & freshly queried sticky navbar height
  useEffect(() => {
    const releaseScrollLock = (event?: Event) => {
      if (event?.type === 'touchstart' && event.target instanceof Element) {
        if (
          event.target.closest(
            '[data-sticky-header="true"], [data-section-progress="true"]'
          )
        ) {
          return;
        }
      }
      cancelActiveScrollTween();
      scrollLockUntilRef.current = 0;
      pendingScrollTargetRef.current = null;
    };

    const syncScrollMetrics = (): ScrollSpyMetrics => {
      const next = computeScrollSpyMetrics();
      setScrollMetrics((prev) =>
        prev.headerHeight === next.headerHeight &&
        prev.buffer === next.buffer &&
        prev.triggerY === next.triggerY
          ? prev
          : next
      );
      return next;
    };

    const updateActiveSection = () => {
      // Keep live sticky-header height & triggerY metrics synced even during nav scroll locks
      const { triggerY } = syncScrollMetrics();

      if (performance.now() < scrollLockUntilRef.current) {
        return;
      }
      pendingScrollTargetRef.current = null;

      const scrollTop = getDocumentScrollTop();
      const maxScrollY = getDocumentMaxScrollY();
      const atBottom = scrollTop > 40 && maxScrollY - scrollTop <= 24;

      if (atBottom) {
        setActiveSection((prev) => (prev === 'contact' ? prev : 'contact'));
        setIsThankYouVisible(true);
        return;
      }

      let currentId: SectionId = 'overview';

      for (const { id } of NAV_SECTIONS) {
        const el = resolveSectionElement(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const isExplicitAnchor = el.dataset.scrollTarget === 'true';
        if (!Number.isFinite(rect.top) || (!isExplicitAnchor && rect.height <= 0)) {
          continue;
        }

        if (rect.top <= triggerY) {
          currentId = id;
        }
      }

      const contactEl = resolveSectionElement('contact');
      const thankYouInViewport =
        currentId === 'contact' ||
        (contactEl !== null &&
          Number.isFinite(contactEl.getBoundingClientRect().top) &&
          contactEl.getBoundingClientRect().top <= window.innerHeight * 0.55);

      setActiveSection((prev) => (prev === currentId ? prev : currentId));
      setIsThankYouVisible((prev) =>
        prev === thankYouInViewport ? prev : thankYouInViewport
      );
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    window.addEventListener('wheel', releaseScrollLock, { passive: true });
    window.addEventListener('touchstart', releaseScrollLock, { passive: true });

    // Re-sync scroll-spy & GSAP ScrollTrigger positions when lazy sections change page height
    let resizeObserver: ResizeObserver | null = null;
    let refreshTimer: number | null = null;
    if (typeof ResizeObserver !== 'undefined' && mainRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (refreshTimer !== null) {
          window.clearTimeout(refreshTimer);
        }
        refreshTimer = window.setTimeout(() => {
          // Defer ScrollTrigger.refresh until an active programmatic nav scroll completes
          if (activeScrollTweenRef.current) {
            pendingRefreshAfterScrollRef.current = true;
          } else {
            ScrollTrigger.refresh();
          }
          refreshTimer = null;
        }, 160);

        if (!activeScrollTweenRef.current) {
          updateActiveSection();
        }
      });
      resizeObserver.observe(mainRef.current);
      const headerEl = document.querySelector<HTMLElement>(
        '[data-sticky-header="true"], header'
      );
      if (headerEl) {
        resizeObserver.observe(headerEl);
      }
    }

    return () => {
      cancelActiveScrollTween();
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('wheel', releaseScrollLock);
      window.removeEventListener('touchstart', releaseScrollLock);
      resizeObserver?.disconnect();
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }
    };
  }, [cancelActiveScrollTween, resolveSectionElement]);

  // Global keyboard shortcuts: 'n' next section, 'p' previous section, 'Esc' closes active modals/drawers
  useEffect(() => {
    const isEditableElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeCaseStudy || resumeOpen) {
          event.preventDefault();
          setActiveCaseStudy(null);
          setResumeOpen(false);
          setKeyboardAnnouncement('Closed active dialog');
        }
        return;
      }

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.repeat ||
        isEditableElement(event.target)
      ) {
        return;
      }

      // Skip section shortcuts while any modal or drawer dialog is open
      const hasOpenDialog =
        activeCaseStudy !== null ||
        resumeOpen ||
        document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      if (hasOpenDialog) return;

      const key = event.key.toLowerCase();
      if (key !== 'n' && key !== 'p') return;

      const currentIdx = NAV_SECTIONS.findIndex(
        (section) => section.id === activeSection
      );
      const safeIdx = currentIdx >= 0 ? currentIdx : 0;
      const targetIdx =
        key === 'n'
          ? Math.min(NAV_SECTIONS.length - 1, safeIdx + 1)
          : Math.max(0, safeIdx - 1);

      if (targetIdx === safeIdx) return;

      event.preventDefault();
      const targetSection = NAV_SECTIONS[targetIdx];
      scrollToSection(targetSection.id);
      setKeyboardAnnouncement(`Navigated to ${targetSection.label} section`);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeSection, activeCaseStudy, resumeOpen, scrollToSection]);

  const handleSkipToContent = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const mainEl = mainRef.current;
      if (!mainEl) return;

      mainEl.focus({ preventScroll: true });
      const measureMainY = (): number | null => {
        const rect = mainEl.getBoundingClientRect();
        if (!Number.isFinite(rect.top)) return null;
        return Math.max(
          0,
          Math.round(
            rect.top + getDocumentScrollTop() - getLiveStickyHeaderOffset()
          )
        );
      };
      const targetTop = measureMainY();
      if (targetTop !== null) {
        smoothScrollWindowTo(targetTop, measureMainY);
      }
      setKeyboardAnnouncement('Skipped to main content');
    },
    [smoothScrollWindowTo]
  );

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
        {/* Top-of-DOM accessibility link for keyboard-only and screen-reader users */}
        <a
          href="#main-content"
          onClick={handleSkipToContent}
          className="no-print sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:inline-flex focus:items-center focus:rounded-lg focus:border focus:border-[#4f6df5]/40 focus:bg-[#fdfbf6] focus:px-4 focus:py-2.5 focus:font-display focus:text-sm focus:font-semibold focus:text-[#16181f] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1d63ff] focus:ring-offset-2"
        >
          Skip to content
        </a>

        {/* Screen-reader live region for global keyboard navigation feedback */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {keyboardAnnouncement}
        </div>
        <SectionSeoHead
          activeSection={activeSection}
          activeCaseStudy={activeCaseStudy}
          resumeOpen={resumeOpen}
          isDark={false}
        />
        <ScrollProgressBar isDark={false} />
        <SectionProgressIndicator
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />
        <MagneticCursor isDark={false} />
        {import.meta.env.DEV && (
          <ScrollSpyDebugLine
            headerHeight={scrollMetrics.headerHeight}
            buffer={scrollMetrics.buffer}
            triggerY={scrollMetrics.triggerY}
            activeSection={activeSection}
          />
        )}

        <Navbar
          activeSection={activeSection}
          showResumeButton={isThankYouVisible}
          isHidden={isNavbarHidden}
          onNavigate={scrollToSection}
          onOpenResume={() => setResumeOpen(true)}
        />

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className={`${resumeOpen ? 'no-print ' : ''}focus:outline-none`}
        >
          {/* Top overview container + transparent ScrollTargetAnchor markers for remaining sections */}
          <SectionHighlighter
            sectionId="overview"
            isActive={activeSection === 'overview'}
            tone="paper"
            variant="cobalt"
          >
            <div
              id="overview"
              ref={sectionRefCallbacks.overview}
              data-scroll-target="true"
              data-section-id="overview"
              data-header-offset={stickyHeaderOffset}
              style={{ scrollMarginTop: `${stickyHeaderOffset}px` }}
            >
              <CoverSection isDark={false} onExploreBelow={scrollToHero} />

              <div
                ref={heroAnchorRef}
                style={{ scrollMarginTop: `${stickyHeaderOffset}px` }}
              >
                <SectionReveal forceVisible={!!revealedSections.overview} delay={0.04}>
                  <HelloSection
                    onOpenResume={() => setResumeOpen(true)}
                    onJumpToCaseStudies={() => scrollToSection('case-studies')}
                  />
                </SectionReveal>
              </div>

              <SectionDivider variant="quill" tone="ink" />

              <SectionReveal delay={0.04}>
                <SectionErrorBoundary label="product showcase">
                  <Suspense fallback={<SectionSkeleton label="product showcase" />}>
                    <ProductShowcaseScroll onSelectCaseStudy={setActiveCaseStudy} />
                  </Suspense>
                </SectionErrorBoundary>
              </SectionReveal>
            </div>
          </SectionHighlighter>

          <SectionDivider variant="flourish" tone="champagne" />

          <SectionHighlighter
            sectionId="case-studies"
            isActive={activeSection === 'case-studies'}
            tone="paper"
            variant="champagne"
          >
            <ScrollTargetAnchor
              id="case-studies"
              label="Case Studies"
              ref={sectionRefCallbacks['case-studies']}
              headerOffset={stickyHeaderOffset}
            />
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
          </SectionHighlighter>

          <SectionDivider variant="double-rule" tone="cobalt" />

          <SectionHighlighter
            sectionId="experience"
            isActive={activeSection === 'experience'}
            tone="night"
            variant="cobalt"
          >
            <ScrollTargetAnchor
              id="experience"
              label="Experience"
              ref={sectionRefCallbacks.experience}
              headerOffset={stickyHeaderOffset}
            />
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
          </SectionHighlighter>

          <SectionDivider variant="quill" tone="ink" />

          <SectionHighlighter
            sectionId="capabilities"
            isActive={activeSection === 'capabilities'}
            tone="paper"
            variant="indigo"
          >
            <ScrollTargetAnchor
              id="capabilities"
              label="Capabilities"
              ref={sectionRefCallbacks.capabilities}
              headerOffset={stickyHeaderOffset}
            />
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
          </SectionHighlighter>

          <SectionDivider variant="flourish" tone="cobalt" />

          <SectionReveal delay={0.04}>
            <SectionErrorBoundary label="fun facts">
              <Suspense fallback={<SectionSkeleton label="fun facts" />}>
                <FunFactsSection />
              </Suspense>
            </SectionErrorBoundary>
          </SectionReveal>

          <SectionDivider variant="double-rule" tone="champagne" />

          <SectionHighlighter
            sectionId="contact"
            isActive={activeSection === 'contact'}
            tone="paper"
            variant="champagne"
          >
            <ScrollTargetAnchor
              id="contact"
              label="Contact"
              ref={sectionRefCallbacks.contact}
              headerOffset={stickyHeaderOffset}
            />
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
          </SectionHighlighter>
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
