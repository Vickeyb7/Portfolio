import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const ZIGZAG_PATH =
  'M 6 19 L 21 8 L 36 21 L 52 8 L 69 21 L 86 8 L 103 21 L 120 8 L 137 21 L 154 8 L 171 20 L 188 9 L 205 20 L 222 9 L 239 19 L 256 10 L 274 17';

const SWOOSH_PATH =
  'M 6 18 C 58 24, 126 11, 202 10 C 234 10, 256 12, 274 15';

interface ZigZagToSwooshUnderlineProps {
  align?: 'center' | 'left';
  widthClassName?: string;
  className?: string;
}

/**
 * Periwinkle-cobalt section heading underline that morphs via GSAP
 * ScrollTrigger + MorphSVGPlugin from a nervous hand-drawn zig-zag
 * into a poised calligraphic swoosh as the heading enters focus.
 */
export function ZigZagToSwooshUnderline({
  align = 'center',
  widthClassName = 'w-44 sm:w-56 md:w-64',
  className = '',
}: ZigZagToSwooshUnderlineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const flickRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const pathEl = pathRef.current;
    const flickEl = flickRef.current;
    if (!wrapEl || !pathEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};

        if (reduce) {
          pathEl.setAttribute('d', SWOOSH_PATH);
          if (flickEl) {
            gsap.set(flickEl, { opacity: 0.7, strokeDashoffset: 0 });
          }
          return;
        }

        // Start cleanly in the nervous zig-zag shape
        pathEl.setAttribute('d', ZIGZAG_PATH);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapEl,
            start: 'top 88%',
            end: 'top 44%',
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          pathEl,
          {
            morphSVG: {
              shape: SWOOSH_PATH,
              shapeIndex: 'auto',
            },
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        if (flickEl) {
          const flickLen = flickEl.getTotalLength();
          gsap.set(flickEl, {
            strokeDasharray: flickLen,
            strokeDashoffset: flickLen,
            opacity: 0,
          });

          tl.to(
            flickEl,
            {
              strokeDashoffset: 0,
              opacity: 0.72,
              ease: 'power2.out',
              duration: 0.45,
            },
            0.55
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${
        align === 'center' ? 'mx-auto flex justify-center' : 'flex justify-start'
      } ${className}`}
    >
      <svg
        viewBox="0 0 280 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 sm:h-6 overflow-visible pen-ink-text ${widthClassName}`}
      >
        <path
          ref={pathRef}
          d={ZIGZAG_PATH}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle secondary pen-taper accent revealed once the swoosh resolves */}
        <path
          ref={flickRef}
          d="M 94 22 C 148 18, 206 16, 250 18"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

export type PenArrowVariant = 'down-left' | 'down-right' | 'right-loop' | 'left-loop';

interface PenAnnotationProps {
  text: string;
  arrow?: PenArrowVariant;
  tilt?: string;
  className?: string;
}

const ARROW_SHAPES: Record<
  PenArrowVariant,
  { viewBox: string; stem: string; head: string; sizeClass: string }
> = {
  'down-left': {
    viewBox: '0 0 58 34',
    stem: 'M 52 5 C 38 6, 20 13, 9 27',
    head: 'M 6 19 L 8.5 28 L 17.5 25',
    sizeClass: 'h-7 w-12',
  },
  'down-right': {
    viewBox: '0 0 58 34',
    stem: 'M 6 5 C 20 6, 38 13, 49 27',
    head: 'M 52 19 L 49.5 28 L 40.5 25',
    sizeClass: 'h-7 w-12',
  },
  'right-loop': {
    viewBox: '0 0 68 32',
    stem: 'M 4 22 C 18 26, 34 8, 26 7 C 19 6, 22 22, 42 19 C 50 18, 56 15, 62 12',
    head: 'M 55 8 L 63 12 L 58 19.5',
    sizeClass: 'h-7 w-14',
  },
  'left-loop': {
    viewBox: '0 0 68 32',
    stem: 'M 64 22 C 50 26, 34 8, 42 7 C 49 6, 46 22, 26 19 C 18 18, 12 15, 6 12',
    head: 'M 13 8 L 5 12 L 10 19.5',
    sizeClass: 'h-7 w-14',
  },
};

/**
 * Hand-drawn periwinkle-cobalt editorial marginalia with a GSAP ScrollTrigger
 * self-drawing fountain-pen arrow.
 */
export function PenAnnotation({
  text,
  arrow = 'down-left',
  tilt = '-rotate-2',
  className = '',
}: PenAnnotationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const shape = ARROW_SHAPES[arrow];

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const stemEl = stemRef.current;
    const headEl = headRef.current;
    const labelEl = textRef.current;
    if (!rootEl || !stemEl || !headEl || !labelEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};
        if (reduce) return;

        const stemLen = stemEl.getTotalLength();
        const headLen = headEl.getTotalLength();

        gsap.set(stemEl, {
          strokeDasharray: stemLen,
          strokeDashoffset: stemLen,
        });
        gsap.set(headEl, {
          strokeDasharray: headLen,
          strokeDashoffset: headLen,
        });
        gsap.set(labelEl, {
          opacity: 0,
          y: 6,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: 'top 88%',
            once: true,
          },
        });

        tl.to(labelEl, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        })
          .to(
            stemEl,
            {
              strokeDashoffset: 0,
              duration: 0.55,
              ease: 'power2.inOut',
            },
            '-=0.22'
          )
          .to(
            headEl,
            {
              strokeDashoffset: 0,
              duration: 0.25,
              ease: 'power2.out',
            },
            '-=0.1'
          );
      }
    );

    return () => {
      mm.revert();
    };
  }, [arrow]);

  const isArrowBefore = arrow === 'down-left' || arrow === 'left-loop';

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none inline-flex items-center gap-1.5 select-none pen-ink-text ${tilt} ${className}`}
    >
      {isArrowBefore && (
        <svg
          viewBox={shape.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${shape.sizeClass} shrink-0 overflow-visible`}
        >
          <path
            ref={stemRef}
            d={shape.stem}
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={headRef}
            d={shape.head}
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <span
        ref={textRef}
        className="font-hand text-[1.15rem] sm:text-[1.28rem] leading-none font-semibold tracking-[0.01em] whitespace-nowrap"
      >
        {text}
      </span>

      {!isArrowBefore && (
        <svg
          viewBox={shape.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${shape.sizeClass} shrink-0 overflow-visible`}
        >
          <path
            ref={stemRef}
            d={shape.stem}
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={headRef}
            d={shape.head}
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
