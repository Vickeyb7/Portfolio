import { useLayoutEffect, useRef } from 'react';
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
 * section breaks. Draws itself smoothly via GSAP ScrollTrigger and respects
 * prefers-reduced-motion.
 */
export function HandDrawnDivider({
  variant = 'loop',
  className = '',
}: HandDrawnDividerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const shape = DIVIDER_SHAPES[variant];

  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const svgEl = svgRef.current;
    if (!wrapEl || !svgEl) return;

    const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path'));
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
        <path
          d={shape.primary}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={shape.secondary}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.45"
        />
        {shape.ornament && (
          <path
            d={shape.ornament}
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}
