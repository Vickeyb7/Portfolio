import { useId, useLayoutEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type HandDrawnDividerVariant = 'loop' | 'wave' | 'diamond';

interface HandDrawnDividerProps {
  variant?: HandDrawnDividerVariant;
  className?: string;
}

const DIVIDER_SHAPES: Record<
  HandDrawnDividerVariant,
  {
    primary: string;
    secondary: string;
    ornament?: string;
  }
> = {
  loop: {
    primary:
      'M 8 18 C 148 16.5, 294 20.5, 434 17.5 C 454 17, 468 7, 480 8 C 492 9, 494 24, 480 25 C 466 26, 469 14, 496 16.5 C 638 20.5, 788 16, 952 18.5',
    secondary:
      'M 122 21.5 C 254 20, 352 21.5, 438 20 M 522 19.5 C 630 21, 742 19, 838 20.5',
  },
  wave: {
    primary:
      'M 8 18 C 122 15, 238 22, 356 17.5 C 414 15.5, 444 17, 464 17.5 M 496 17.5 C 520 17, 560 15.5, 616 18 C 728 22.5, 842 15.5, 952 18',
    secondary:
      'M 164 21 C 266 23, 358 19.5, 436 20.5 M 526 20 C 618 22, 712 19, 796 20.5',
    ornament:
      'M 480 9 L 482.2 15.2 L 488.5 17.5 L 482.2 19.8 L 480 26 L 477.8 19.8 L 471.5 17.5 L 477.8 15.2 Z',
  },
  diamond: {
    primary:
      'M 8 18.5 C 156 20, 312 15.5, 460 17.5 M 500 17.5 C 648 19.5, 804 16, 952 18',
    secondary:
      'M 190 21 C 292 19.5, 376 20.5, 446 20 M 514 20 C 594 21, 686 19, 770 20.5',
    ornament:
      'M 480 10 L 491 17.5 L 480 25 L 469 17.5 Z',
  },
};

/**
 * Subtle hand-drawn periwinkle-cobalt horizontal pen divider for editorial
 * section breaks. Draws itself smoothly via GSAP ScrollTrigger and adds an
 * understated Framer Motion ink-flow shimmer while in view, respecting
 * prefers-reduced-motion.
 */
export function HandDrawnDivider({
  variant = 'loop',
  className = '',
}: HandDrawnDividerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shimmerGradientId = useId();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isInView = useInView(wrapRef, { amount: 0.25 });

  const shape = DIVIDER_SHAPES[variant];

  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const svgEl = svgRef.current;
    if (!wrapEl || !svgEl) return;

    const paths = Array.from(
      svgEl.querySelectorAll<SVGPathElement>('[data-divider-draw="true"]')
    );
    if (paths.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};
        if (reduce) {
          paths.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          return;
        }

        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len + 4,
            strokeDashoffset: len + 4,
          });
        });

        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.05,
          stagger: 0.14,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wrapEl,
            start: 'top 90%',
            once: true,
          },
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, [variant]);

  const shouldAnimateShimmer = isInView && !prefersReducedMotion;

  return (
    <div
      ref={wrapRef}
      role="separator"
      aria-hidden="true"
      className={`no-print mx-auto flex w-full max-w-[1120px] items-center justify-center px-6 py-3 sm:py-4 md:px-10 ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 960 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="h-6 w-full overflow-visible text-[#4f6df5]/70"
      >
        <defs>
          <linearGradient
            id={shimmerGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#4f6df5" stopOpacity="0" />
            <stop offset="32%" stopColor="#7c96ff" stopOpacity="0.85" />
            <stop offset="52%" stopColor="#dce5ff" stopOpacity="0.98" />
            <stop offset="70%" stopColor="#d8b56c" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#4f6df5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base GSAP ScrollTrigger self-drawing fountain-pen strokes */}
        <path
          data-divider-draw="true"
          d={shape.primary}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-divider-draw="true"
          d={shape.secondary}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
        {shape.ornament && (
          <path
            data-divider-draw="true"
            d={shape.ornament}
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Framer Motion wet-ink flow shimmer gliding along the pen curve when in view */}
        {!prefersReducedMotion && (
          <>
            <motion.path
              d={shape.primary}
              stroke={`url(#${shimmerGradientId})`}
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.14, pathOffset: 0, opacity: 0 }}
              animate={
                shouldAnimateShimmer
                  ? {
                      pathOffset: [0, 0.86],
                      opacity: [0, 0.88, 0.92, 0],
                    }
                  : { pathOffset: 0, opacity: 0 }
              }
              transition={{
                duration: 2.6,
                delay: 0.85,
                ease: [0.42, 0, 0.24, 1],
                repeat: Infinity,
                repeatDelay: 3.6,
              }}
            />

            {/* Subtle secondary counter-flow glint on the lower ink taper */}
            <motion.path
              d={shape.secondary}
              stroke={`url(#${shimmerGradientId})`}
              strokeWidth="1.35"
              strokeLinecap="round"
              initial={{ pathLength: 0.22, pathOffset: 0.78, opacity: 0 }}
              animate={
                shouldAnimateShimmer
                  ? {
                      pathOffset: [0.78, 0],
                      opacity: [0, 0.55, 0.5, 0],
                    }
                  : { pathOffset: 0.78, opacity: 0 }
              }
              transition={{
                duration: 3.0,
                delay: 2.1,
                ease: [0.42, 0, 0.24, 1],
                repeat: Infinity,
                repeatDelay: 3.2,
              }}
            />

            {/* Gentle center ornament glint synced as the shimmer crosses center */}
            {shape.ornament && (
              <motion.path
                d={shape.ornament}
                stroke="#9eb2ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transformOrigin: '480px 17.5px' }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={
                  shouldAnimateShimmer
                    ? {
                        opacity: [0, 0, 0.85, 0, 0],
                        scale: [0.96, 0.98, 1.07, 1, 0.96],
                      }
                    : { opacity: 0, scale: 0.94 }
                }
                transition={{
                  duration: 2.6,
                  delay: 0.85,
                  times: [0, 0.36, 0.5, 0.66, 1],
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 3.6,
                }}
              />
            )}
          </>
        )}
      </svg>
    </div>
  );
}

