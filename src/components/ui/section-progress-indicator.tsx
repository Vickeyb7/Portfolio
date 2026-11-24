import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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

/**
 * Subtle, vertically-stacked editorial dot navigation fixed along the far right
 * of the viewport. Tracks active section dynamically, animates a GSAP
 * ScrollTrigger vertical ink filament along the rail, adapts contrast over
 * dark charcoal night sheets, and triggers App.tsx's GSAP ScrollTo navigation.
 */
export function SectionProgressIndicator({
  activeSection,
  onNavigate,
}: SectionProgressIndicatorProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const railFillRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);
  const [focusedId, setFocusedId] = useState<SectionId | null>(null);

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
          className={`pointer-events-none absolute top-[18px] bottom-[18px] left-1/2 w-px -translate-x-1/2 transition-colors duration-300 ${
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

        <ul className="relative z-10 flex flex-col items-center gap-3.5">
          {NAV_SECTIONS.map((section, idx) => {
            const isActive = section.id === activeSection;
            const isPassed = idx < activeIndex;
            const showLabel =
              hoveredId === section.id || focusedId === section.id;

            return (
              <li
                key={section.id}
                className="relative flex items-center justify-center"
              >
                {/* Unboxed archival serif tooltip slip revealed on hover or keyboard focus */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute right-9 flex items-baseline gap-1.5 whitespace-nowrap border-t border-b px-2.5 py-1 backdrop-blur-md transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOnNightSheet
                      ? 'border-white/16 bg-[#141824]/92 text-[#eef1fa] shadow-[0_8px_22px_-12px_rgba(0,0,0,0.7)]'
                      : 'border-[#2a2319]/15 bg-[#f6f1e7]/94 text-[#1c1a16] shadow-[0_8px_22px_-12px_rgba(24,20,14,0.26)]'
                  } ${
                    showLabel
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-1.5 opacity-0'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-semibold tracking-[0.06em] ${
                      isOnNightSheet ? 'text-[#8aa2ff]' : 'text-[#4f6df5]'
                    }`}
                  >
                    {SECTION_NUMBERS[section.id]}
                  </span>
                  <span className="font-serif italic text-[13.5px] font-semibold leading-none tracking-[0.015em]">
                    {section.label}
                  </span>
                </span>

                {/* One-click jump-to-section dot button */}
                <button
                  type="button"
                  onClick={() => onNavigate(section.id)}
                  onMouseEnter={() => setHoveredId(section.id)}
                  onMouseLeave={() =>
                    setHoveredId((prev) => (prev === section.id ? null : prev))
                  }
                  onFocus={() => setFocusedId(section.id)}
                  onBlur={() =>
                    setFocusedId((prev) => (prev === section.id ? null : prev))
                  }
                  aria-label={`Jump to ${section.label} section`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group relative flex h-7 w-7 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    isOnNightSheet
                      ? 'focus-visible:ring-[#8aa2ff] focus-visible:ring-offset-[#10131b]'
                      : 'focus-visible:ring-[#4f6df5] focus-visible:ring-offset-[#f6f1e7]'
                  }`}
                >
                  {/* Animated outer pen ring on active dot */}
                  {isActive && (
                    <motion.span
                      layoutId={
                        prefersReducedMotion
                          ? undefined
                          : 'section-progress-active-ring'
                      }
                      aria-hidden="true"
                      transition={{
                        type: 'spring',
                        stiffness: 360,
                        damping: 30,
                      }}
                      className={`pointer-events-none absolute h-[18px] w-[18px] rounded-full border transition-colors duration-300 ${
                        isOnNightSheet
                          ? 'border-[#8aa2ff]/80 bg-[#8aa2ff]/12'
                          : 'border-[#4f6df5]/75 bg-[#4f6df5]/10'
                      }`}
                    />
                  )}

                  {/* Core archival ink dot */}
                  <span
                    aria-hidden="true"
                    className={`relative block rounded-full transition-[transform,background-color,width,height] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? isOnNightSheet
                          ? 'h-2 w-2 bg-[#8aa2ff] shadow-[0_0_10px_rgba(138,162,255,0.65)]'
                          : 'h-2 w-2 bg-[#4f6df5] shadow-[0_0_8px_rgba(79,109,245,0.45)]'
                        : isPassed
                        ? isOnNightSheet
                          ? 'h-1.5 w-1.5 bg-[#8aa2ff]/70 group-hover:scale-125 group-hover:bg-[#8aa2ff]'
                          : 'h-1.5 w-1.5 bg-[#4f6df5]/65 group-hover:scale-125 group-hover:bg-[#4f6df5]'
                        : isOnNightSheet
                        ? 'h-1.5 w-1.5 bg-white/38 group-hover:scale-125 group-hover:bg-white/85'
                        : 'h-1.5 w-1.5 bg-[#2a2319]/30 group-hover:scale-125 group-hover:bg-[#4f6df5]/80'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
