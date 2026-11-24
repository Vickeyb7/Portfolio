import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type SectionDividerVariant = 'quill' | 'flourish' | 'double-rule';
export type SectionDividerTone = 'ink' | 'cobalt' | 'champagne';

interface SectionDividerProps {
  variant?: SectionDividerVariant;
  tone?: SectionDividerTone;
  /** ScrollTrigger start position (defaults to 'top 90%') */
  triggerStart?: string;
  className?: string;
}

interface DividerStrokeSpec {
  primary: string;
  secondary: string;
  accent?: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}

const STROKE_SPECS: Record<SectionDividerVariant, DividerStrokeSpec> = {
  quill: {
    primary:
      'M 18 17.5 C 165 15.2, 322 19.8, 492 16.4 C 608 14.2, 694 18.6, 818 16.8 C 884 15.8, 938 17.4, 982 16.2',
    secondary:
      'M 96 20.6 C 248 19.2, 412 21.4, 578 19.4 C 712 17.9, 824 20.4, 916 19.2',
    accent:
      'M 476 16.5 C 488 12.2, 502 11.8, 512 16.2 C 504 20.4, 490 20.2, 482 16.8',
    startPoint: { x: 18, y: 17.5 },
    endPoint: { x: 982, y: 16.2 },
  },
  flourish: {
    primary:
      'M 18 16.8 C 174 18.6, 336 14.8, 468 16.4 C 484 16.6, 492 7.5, 502 8.2 C 512 9, 512 24.4, 498 24.8 C 484 25.2, 487 14.6, 518 16.2 C 668 18.8, 828 14.6, 982 17.2',
    secondary:
      'M 134 20.4 C 258 19.2, 370 20.8, 456 19.6 M 544 19.4 C 652 21, 768 18.8, 868 20.2',
    startPoint: { x: 18, y: 16.8 },
    endPoint: { x: 982, y: 17.2 },
  },
  'double-rule': {
    primary:
      'M 18 14.8 C 192 13.4, 384 16.4, 582 14.4 C 734 12.8, 868 15.6, 982 14.2',
    secondary:
      'M 72 20.2 C 238 21.6, 428 18.8, 622 20.6 C 756 21.8, 858 19.4, 928 20.4',
    accent:
      'M 494 17.4 L 500 12.2 L 506 17.4 L 500 22.6 Z',
    startPoint: { x: 18, y: 14.8 },
    endPoint: { x: 982, y: 14.2 },
  },
};

const TONE_PALETTE: Record<
  SectionDividerTone,
  {
    primary: string;
    secondary: string;
    accent: string;
    nib: string;
  }
> = {
  ink: {
    primary: 'rgba(38, 34, 29, 0.56)',
    secondary: 'rgba(79, 109, 245, 0.36)',
    accent: 'rgba(79, 109, 245, 0.72)',
    nib: '#4f6df5',
  },
  cobalt: {
    primary: 'rgba(79, 109, 245, 0.68)',
    secondary: 'rgba(42, 35, 25, 0.28)',
    accent: 'rgba(79, 109, 245, 0.82)',
    nib: '#4f6df5',
  },
  champagne: {
    primary: 'rgba(158, 114, 38, 0.64)',
    secondary: 'rgba(79, 109, 245, 0.34)',
    accent: 'rgba(158, 114, 38, 0.82)',
    nib: '#b47d24',
  },
};

/**
 * Editorial hand-drawn, fountain-pen ink horizontal divider that smoothly
 * "writes" itself onto the page via GSAP ScrollTrigger as the reader scrolls
 * into view, complete with a traveling ink-nib tip and subtle dry-nib echo.
 */
export function SectionDivider({
  variant = 'quill',
  tone = 'ink',
  triggerStart = 'top 90%',
  className = '',
}: SectionDividerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<SVGPathElement>(null);
  const secondaryRef = useRef<SVGPathElement>(null);
  const accentRef = useRef<SVGPathElement>(null);
  const startDotRef = useRef<SVGCircleElement>(null);
  const endDotRef = useRef<SVGCircleElement>(null);
  const nibRef = useRef<SVGGElement>(null);

  const spec = STROKE_SPECS[variant];
  const palette = TONE_PALETTE[tone];

  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const primaryEl = primaryRef.current;
    const secondaryEl = secondaryRef.current;
    const accentEl = accentRef.current;
    const startDotEl = startDotRef.current;
    const endDotEl = endDotRef.current;
    const nibEl = nibRef.current;
    if (!wrapEl || !primaryEl) return;

    const strokeEls = [primaryEl, secondaryEl, accentEl].filter(
      (el): el is SVGPathElement => el !== null
    );

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};

        if (reduce) {
          strokeEls.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          if (startDotEl) gsap.set(startDotEl, { opacity: 0.72, scale: 1 });
          if (endDotEl) gsap.set(endDotEl, { opacity: 0.72, scale: 1 });
          if (nibEl) gsap.set(nibEl, { opacity: 0 });
          return;
        }

        const primaryLen = primaryEl.getTotalLength();
        strokeEls.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len + 4,
            strokeDashoffset: len + 4,
          });
        });

        if (startDotEl) {
          gsap.set(startDotEl, {
            opacity: 0,
            scale: 0,
            transformOrigin: 'center center',
          });
        }
        if (endDotEl) {
          gsap.set(endDotEl, {
            opacity: 0,
            scale: 0,
            transformOrigin: 'center center',
          });
        }
        if (nibEl) {
          const startPt = primaryEl.getPointAtLength(0);
          gsap.set(nibEl, {
            x: startPt.x,
            y: startPt.y,
            opacity: 0,
            scale: 0.65,
            transformOrigin: 'center center',
          });
        }

        const penProgress = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapEl,
            start: triggerStart,
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            strokeEls.forEach((p) => {
              p.style.strokeDasharray = 'none';
              p.style.strokeDashoffset = '0';
            });
          },
        });

        // 1. Fountain-pen touch-down mark on left edge
        if (startDotEl) {
          tl.to(
            startDotEl,
            {
              opacity: 0.72,
              scale: 1,
              duration: 0.16,
              ease: 'power2.out',
            },
            0
          );
        }

        // 2. Main ink stroke writes itself smoothly left-to-right
        tl.to(
          primaryEl,
          {
            strokeDashoffset: 0,
            duration: 1.15,
            ease: 'power2.inOut',
          },
          0.05
        );

        // 3. Traveling ink-nib glint synced to the active writing tip
        if (nibEl) {
          tl.to(
            nibEl,
            {
              opacity: 0.92,
              scale: 1,
              duration: 0.14,
              ease: 'power2.out',
            },
            0.05
          );

          tl.to(
            penProgress,
            {
              t: 1,
              duration: 1.15,
              ease: 'power2.inOut',
              onUpdate: () => {
                const pt = primaryEl.getPointAtLength(penProgress.t * primaryLen);
                gsap.set(nibEl, { x: pt.x, y: pt.y });
              },
            },
            0.05
          );

          tl.to(
            nibEl,
            {
              opacity: 0,
              scale: 0.45,
              duration: 0.2,
              ease: 'power2.in',
            },
            1.04
          );
        }

        // 4. Dry-nib secondary whisper trail following slightly behind
        if (secondaryEl) {
          tl.to(
            secondaryEl,
            {
              strokeDashoffset: 0,
              duration: 0.92,
              ease: 'power2.out',
            },
            0.3
          );
        }

        // 5. Optional center ink accent settling once pen passes midpoint
        if (accentEl) {
          tl.to(
            accentEl,
            {
              strokeDashoffset: 0,
              duration: 0.48,
              ease: 'power2.out',
            },
            0.54
          );
        }

        // 6. Pen-lift dot settles cleanly at right terminal
        if (endDotEl) {
          tl.to(
            endDotEl,
            {
              opacity: 0.72,
              scale: 1,
              duration: 0.22,
              ease: 'back.out(2)',
            },
            1.08
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, [variant, triggerStart]);

  return (
    <div
      ref={wrapRef}
      role="separator"
      aria-hidden="true"
      data-section-divider={variant}
      className={`no-print mx-auto flex w-full max-w-[1160px] items-center justify-center px-6 py-3 sm:px-8 sm:py-4 md:px-10 ${className}`}
    >
      <svg
        viewBox="0 0 1000 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="h-6 sm:h-7 w-full overflow-visible"
      >
        {/* Subtle ink touch-down dot */}
        <circle
          ref={startDotRef}
          cx={spec.startPoint.x}
          cy={spec.startPoint.y}
          r="2.1"
          fill={palette.primary}
        />

        {/* Primary hand-drawn ink horizontal rule */}
        <path
          ref={primaryRef}
          d={spec.primary}
          stroke={palette.primary}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Secondary dry-nib whisper stroke */}
        <path
          ref={secondaryRef}
          d={spec.secondary}
          stroke={palette.secondary}
          strokeWidth="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optional calligraphic center mark */}
        {spec.accent && (
          <path
            ref={accentRef}
            d={spec.accent}
            stroke={palette.accent}
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Ink pen-lift dot at right terminal */}
        <circle
          ref={endDotRef}
          cx={spec.endPoint.x}
          cy={spec.endPoint.y}
          r="2.1"
          fill={palette.primary}
        />

        {/* Traveling wet-ink fountain nib glint */}
        <g ref={nibRef} aria-hidden="true">
          <circle cx="0" cy="0" r="5.5" fill={palette.nib} opacity="0.2" />
          <circle cx="0" cy="0" r="2.3" fill={palette.nib} opacity="0.95" />
        </g>
      </svg>
    </div>
  );
}
