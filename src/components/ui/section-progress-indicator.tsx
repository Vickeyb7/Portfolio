import {
  PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NAV_SECTIONS, SectionId } from '../../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface SectionProgressIndicatorProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

const SECTION_NUMBERS: Record<SectionId, string> = {
  overview: '01',
  'case-studies': '02',
  experience: '03',
  capabilities: '04',
  contact: '05',
};

const MAGNETIC_PULL_STRENGTH = 0.4;
const MAGNETIC_MAX_OFFSET = 7;
const TOOLTIP_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PenInkTooltipProps {
  id: string;
  sectionNumber: string;
  label: string;
  isActive: boolean;
  isOnNightSheet: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Editorial pen-ink marginalia tooltip revealed on hover or focus of a
 * SectionProgressIndicator dot. Pairs the portfolio's handwritten Caveat
 * pen-ink aesthetic with a live self-drawing fountain-pen underline swoosh
 * and curved ink arrow pointing directly to the active rail dot.
 */
function PenInkTooltip({
  id,
  sectionNumber,
  label,
  isActive,
  isOnNightSheet,
  prefersReducedMotion,
}: PenInkTooltipProps) {
  const inkStrokeColor = isOnNightSheet ? '#8aa2ff' : '#4f6df5';

  return (
    <motion.div
      id={id}
      role="tooltip"
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 9, rotate: -1.8, scale: 0.96 }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, x: 0, rotate: -0.6, scale: 1 }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 6, rotate: -1.2, scale: 0.97 }
      }
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.19,
        ease: TOOLTIP_EASE,
      }}
      className="pointer-events-none absolute right-9 z-20 flex items-center gap-1 select-none"
    >
      {/* Archival paper / charcoal night marginalia slip */}
      <div
        className={`relative rounded-[3px] px-3 pt-1.5 pb-2 backdrop-blur-md transition-colors duration-300 ${
          isOnNightSheet
            ? 'border border-[#8aa2ff]/25 bg-[#141720]/95 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.8)]'
            : 'border border-[#4f6df5]/22 bg-[#f6f1e7]/96 shadow-[0_12px_26px_-14px_rgba(24,20,14,0.28)]'
        }`}
      >
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span
            className={`font-mono text-[10px] font-semibold tracking-[0.06em] tabular-nums ${
              isOnNightSheet ? 'text-[#a4adc4]' : 'text-[#665d50]'
            }`}
          >
            {sectionNumber}
          </span>
          <span
            aria-hidden="true"
            className={isOnNightSheet ? 'text-white/25' : 'text-[#2a2319]/25'}
          >
            ·
          </span>
          <span
            className={`font-hand text-[1.24rem] leading-none font-bold tracking-[0.015em] ${
              isOnNightSheet ? 'text-[#9db3ff]' : 'text-[#2e4de0]'
            }`}
          >
            {label}
          </span>
        </div>

        {/* Self-drawing hand-penned fountain-ink swoosh underline */}
        <svg
          viewBox="0 0 120 12"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="mt-0.5 block h-[7px] w-full overflow-visible"
        >
          <motion.path
            d="M 2 7.5 C 32 3.2, 78 2.8, 118 6.4"
            stroke={inkStrokeColor}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.92 : 0.35 }}
            animate={{ pathLength: 1, opacity: 0.94 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.28,
              delay: prefersReducedMotion ? 0 : 0.04,
              ease: TOOLTIP_EASE,
            }}
          />
          {isActive && (
            <motion.path
              d="M 16 10.2 C 48 8.2, 84 8.0, 108 9.6"
              stroke={inkStrokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.65 : 0 }}
              animate={{ pathLength: 1, opacity: 0.65 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.22,
                delay: prefersReducedMotion ? 0 : 0.14,
                ease: TOOLTIP_EASE,
              }}
            />
          )}
        </svg>
      </div>

      {/* Hand-drawn curved fountain-pen arrow pointing directly to the hovered dot */}
      <svg
        viewBox="0 0 22 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-3.5 w-5 shrink-0 overflow-visible"
      >
        <motion.path
          d="M 1 8.5 C 7 5.2, 13 5.2, 19.5 7.2"
          stroke={inkStrokeColor}
          strokeWidth="1.65"
          strokeLinecap="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.22,
            delay: prefersReducedMotion ? 0 : 0.06,
            ease: TOOLTIP_EASE,
          }}
        />
        <motion.path
          d="M 14.5 3.6 L 20.2 7.2 L 14.8 10.6"
          stroke={inkStrokeColor}
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.16,
            delay: prefersReducedMotion ? 0 : 0.16,
            ease: TOOLTIP_EASE,
          }}
        />
      </svg>
    </motion.div>
  );
}

interface MagneticProgressDotProps {
  section: { readonly id: SectionId; readonly label: string };
  isActive: boolean;
  isPassed: boolean;
  isOnNightSheet: boolean;
  prefersReducedMotion: boolean;
  onNavigate: (id: SectionId) => void;
}

function MagneticProgressDot({
  section,
  isActive,
  isPassed,
  isOnNightSheet,
  prefersReducedMotion,
  onNavigate,
}: MagneticProgressDotProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 360, damping: 22, mass: 0.35 });
  const springY = useSpring(rawY, { stiffness: 360, damping: 22, mass: 0.35 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || event.pointerType === 'touch') return;
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * MAGNETIC_PULL_STRENGTH;
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * MAGNETIC_PULL_STRENGTH;

    rawX.set(
      Math.max(-MAGNETIC_MAX_OFFSET, Math.min(MAGNETIC_MAX_OFFSET, offsetX))
    );
    rawY.set(
      Math.max(-MAGNETIC_MAX_OFFSET, Math.min(MAGNETIC_MAX_OFFSET, offsetY))
    );
  };

  const resetMagnetic = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const showLabel = isHovered || isFocused;
  const isEngaged = isHovered || isFocused;
  const tooltipId = `section-progress-tooltip-${section.id}`;

  return (
    <li className="relative flex items-center justify-center">
      {/* Custom pen-ink marginalia tooltip revealed on hover or keyboard focus */}
      <AnimatePresence>
        {showLabel && (
          <PenInkTooltip
            id={tooltipId}
            sectionNumber={SECTION_NUMBERS[section.id]}
            label={section.label}
            isActive={isActive}
            isOnNightSheet={isOnNightSheet}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      {/* One-click magnetic jump-to-section dot button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onNavigate(section.id)}
        onPointerEnter={() => setIsHovered(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          setIsHovered(false);
          resetMagnetic();
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          resetMagnetic();
        }}
        aria-label={`Jump to ${section.label} section`}
        aria-describedby={showLabel ? tooltipId : undefined}
        aria-current={isActive ? 'location' : undefined}
        className={`group relative flex h-8 w-8 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isOnNightSheet
            ? 'focus-visible:ring-[#8aa2ff] focus-visible:ring-offset-[#10131b]'
            : 'focus-visible:ring-[#4f6df5] focus-visible:ring-offset-[#f6f1e7]'
        }`}
      >
        {/* Magnetically-tracked indicator assembly */}
        <motion.span
          aria-hidden="true"
          style={
            prefersReducedMotion ? undefined : { x: springX, y: springY }
          }
          className="pointer-events-none relative flex items-center justify-center will-change-transform"
        >
          {/* Animated outer pen ring on active dot */}
          {isActive && (
            <motion.span
              layoutId={
                prefersReducedMotion
                  ? undefined
                  : 'section-progress-active-ring'
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : { scale: isEngaged ? 1.2 : 1 }
              }
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 26,
              }}
              className={`pointer-events-none absolute h-[18px] w-[18px] rounded-full border transition-colors duration-300 ${
                isOnNightSheet
                  ? 'border-[#8aa2ff]/80 bg-[#8aa2ff]/12'
                  : 'border-[#4f6df5]/75 bg-[#4f6df5]/10'
              }`}
            />
          )}

          {/* Subtle magnetic hover halo for inactive dots */}
          {!isActive && (
            <motion.span
              initial={false}
              animate={
                prefersReducedMotion
                  ? { opacity: isEngaged ? 0.85 : 0 }
                  : {
                      opacity: isEngaged ? 1 : 0,
                      scale: isEngaged ? 1 : 0.65,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 26,
              }}
              className={`pointer-events-none absolute h-[18px] w-[18px] rounded-full border ${
                isOnNightSheet
                  ? 'border-[#8aa2ff]/50 bg-[#8aa2ff]/10'
                  : 'border-[#4f6df5]/45 bg-[#4f6df5]/8'
              }`}
            />
          )}

          {/* Core archival ink dot with Framer Motion scale-up on hover */}
          <motion.span
            initial={false}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    scale: isEngaged ? (isActive ? 1.28 : 1.5) : 1,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 440,
              damping: 22,
            }}
            className={`relative block rounded-full transition-colors duration-200 ${
              isActive
                ? isOnNightSheet
                  ? 'h-2 w-2 bg-[#8aa2ff] shadow-[0_0_10px_rgba(138,162,255,0.65)]'
                  : 'h-2 w-2 bg-[#4f6df5] shadow-[0_0_8px_rgba(79,109,245,0.45)]'
                : isPassed
                ? isOnNightSheet
                  ? 'h-1.5 w-1.5 bg-[#8aa2ff]/70 group-hover:bg-[#8aa2ff]'
                  : 'h-1.5 w-1.5 bg-[#4f6df5]/65 group-hover:bg-[#4f6df5]'
                : isOnNightSheet
                ? 'h-1.5 w-1.5 bg-white/38 group-hover:bg-white/90'
                : 'h-1.5 w-1.5 bg-[#2a2319]/30 group-hover:bg-[#4f6df5]'
            }`}
          />
        </motion.span>
      </button>
    </li>
  );
}

/**
 * Subtle, vertically-stacked editorial dot navigation fixed along the far right
 * of the viewport. Tracks active section dynamically, animates a GSAP
 * ScrollTrigger vertical ink filament along the rail, applies a magnetic
 * cursor-snap spring on dot hover, adapts contrast over dark charcoal night
 * sheets, and triggers App.tsx's GSAP scroll navigation.
 */
export function SectionProgressIndicator({
  activeSection,
  onNavigate,
}: SectionProgressIndicatorProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const railFillRef = useRef<HTMLDivElement>(null);

  const isOnNightSheet = activeSection === 'experience';

  // GSAP ScrollTrigger-driven vertical ink filament along the dot rail
  useLayoutEffect(() => {
    const fillEl = railFillRef.current;
    if (!fillEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};

        gsap.set(fillEl, { scaleY: 0, transformOrigin: 'top center' });

        gsap.to(fillEl, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: reduce ? true : 0.35,
            invalidateOnRefresh: true,
          },
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const activeIndex = Math.max(
    0,
    NAV_SECTIONS.findIndex((section) => section.id === activeSection)
  );

  return (
    <nav
      aria-label="Section progress navigation"
      data-section-progress="true"
      className="no-print fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 select-none md:flex xl:right-5"
    >
      <div className="relative flex flex-col items-center py-1">
        {/* Hairline vertical guide track spanning dot centers */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-[20px] bottom-[20px] left-1/2 w-px -translate-x-1/2 transition-colors duration-300 ${
            isOnNightSheet ? 'bg-white/18' : 'bg-[#2a2319]/15'
          }`}
        >
          <div
            ref={railFillRef}
            className={`h-full w-full origin-top will-change-transform transition-colors duration-300 ${
              isOnNightSheet ? 'bg-[#8aa2ff]' : 'bg-[#4f6df5]'
            }`}
          />
        </div>

        <ul className="relative z-10 flex flex-col items-center gap-3">
          {NAV_SECTIONS.map((section, idx) => (
            <MagneticProgressDot
              key={section.id}
              section={section}
              isActive={section.id === activeSection}
              isPassed={idx < activeIndex}
              isOnNightSheet={isOnNightSheet}
              prefersReducedMotion={prefersReducedMotion}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

