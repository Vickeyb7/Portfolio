import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EditorialSheet } from './ui/editorial-sheet';
import { PenAnnotation, ZigZagToSwooshUnderline } from './ui/pen-annotations';

gsap.registerPlugin(ScrollTrigger);

interface FunFactDoodle {
  id: string;
  index: string;
  title: string;
  fact: string;
  accentNote: string;
  paths: { d: string; strokeWidth?: number; accent?: boolean }[];
}

const FUN_FACTS: FunFactDoodle[] = [
  {
    id: 'filter-coffee',
    index: '01',
    title: '7 AM Filter Coffee & PRDs',
    fact: 'My sharpest product specs start with a brass-tumbler Bengaluru filter coffee and a blank page before Slack wakes up.',
    accentNote: 'Indiranagar roast',
    paths: [
      // Davara saucer
      { d: 'M 20 72 C 26 80, 74 80, 80 72', strokeWidth: 2.1 },
      { d: 'M 26 72 L 74 72', strokeWidth: 1.8 },
      // Tumbler cup body
      { d: 'M 32 42 L 36 70 C 37 73, 63 73, 64 70 L 68 42', strokeWidth: 2.1 },
      // Rim ellipse
      { d: 'M 30 42 C 30 37, 70 37, 70 42 C 70 46, 30 46, 30 42 Z', strokeWidth: 2 },
      // Rising steam curls in periwinkle pen
      { d: 'M 42 32 C 38 26, 46 21, 41 14', strokeWidth: 1.85, accent: true },
      { d: 'M 51 30 C 47 23, 56 18, 51 10', strokeWidth: 1.85, accent: true },
      { d: 'M 60 32 C 57 26, 64 21, 60 15', strokeWidth: 1.85, accent: true },
    ],
  },
  {
    id: 'discovery-notebook',
    index: '02',
    title: '150+ Field Call Notebooks',
    fact: 'Every VP Engineering discovery call gets distilled into three verbatim quotes by hand before a single roadmap ticket is drafted.',
    accentNote: 'Voice of customer',
    paths: [
      // Notebook cover
      { d: 'M 26 18 L 72 18 C 75 18, 77 20, 77 23 L 77 77 C 77 80, 75 82, 72 82 L 26 82 Z', strokeWidth: 2.1 },
      // Spiral rings
      { d: 'M 22 27 C 19 27, 19 32, 26 32', strokeWidth: 1.8 },
      { d: 'M 22 41 C 19 41, 19 46, 26 46', strokeWidth: 1.8 },
      { d: 'M 22 55 C 19 55, 19 60, 26 60', strokeWidth: 1.8 },
      { d: 'M 22 69 C 19 69, 19 74, 26 74', strokeWidth: 1.8 },
      // Handwritten lines
      { d: 'M 35 34 L 66 34', strokeWidth: 1.8, accent: true },
      { d: 'M 35 45 L 62 45', strokeWidth: 1.7 },
      { d: 'M 35 56 L 67 56', strokeWidth: 1.7 },
      { d: 'M 35 67 L 54 67', strokeWidth: 1.8, accent: true },
      // Fountain pen nib resting diagonally
      { d: 'M 63 63 L 84 42 L 88 46 L 67 67 L 61 69 Z', strokeWidth: 1.9, accent: true },
    ],
  },
  {
    id: 'whiteboard-matrix',
    index: '03',
    title: '4 PM Whiteboard Pruning',
    fact: 'I genuinely enjoy scoping out v1 non-goals—clear trade-offs on a messy whiteboard save quarters of polite feature creep.',
    accentNote: 'RICE & non-goals',
    paths: [
      // Board frame
      { d: 'M 14 20 L 86 20 L 86 68 L 14 68 Z', strokeWidth: 2.1 },
      // Stand legs
      { d: 'M 32 68 L 24 84', strokeWidth: 2 },
      { d: 'M 68 68 L 76 84', strokeWidth: 2 },
      // 2x2 Quadrant axes
      { d: 'M 50 27 L 50 61', strokeWidth: 1.7 },
      { d: 'M 22 44 L 78 44', strokeWidth: 1.7 },
      // High-impact top-right star & circled win
      { d: 'M 64 29 L 66 34 L 71 34 L 67 37 L 68.5 42 L 64 39 L 59.5 42 L 61 37 L 57 34 L 62 34 Z', strokeWidth: 1.7, accent: true },
      // Crossed-out low-impact bottom-left
      { d: 'M 30 51 L 40 59', strokeWidth: 1.8, accent: true },
      { d: 'M 40 51 L 30 59', strokeWidth: 1.8, accent: true },
    ],
  },
  {
    id: 'sql-terminal',
    index: '04',
    title: 'Still Reads CI & SQL Logs',
    fact: 'My B.Tech Computer Science habits never left—I happily write BigQuery cohort joins and inspect GitHub Actions YAML myself.',
    accentNote: 'CS roots',
    paths: [
      // Terminal window
      { d: 'M 14 22 C 14 18, 17 16, 21 16 L 79 16 C 83 16, 86 18, 86 22 L 86 76 C 86 80, 83 82, 79 82 L 21 82 C 17 82, 14 80, 14 76 Z', strokeWidth: 2.1 },
      // Header bar
      { d: 'M 14 31 L 86 31', strokeWidth: 1.7 },
      // Window dots
      { d: 'M 23 23.5 A 1.5 1.5 0 1 0 23.1 23.5', strokeWidth: 2.2 },
      { d: 'M 31 23.5 A 1.5 1.5 0 1 0 31.1 23.5', strokeWidth: 2.2 },
      // Prompt chevron
      { d: 'M 25 45 L 34 52 L 25 59', strokeWidth: 2.2, accent: true },
      // Command & query line
      { d: 'M 40 52 L 64 52', strokeWidth: 2, accent: true },
      { d: 'M 25 69 L 52 69', strokeWidth: 1.8 },
      // Passing green-style check in periwinkle
      { d: 'M 63 66 L 68 71 L 78 60', strokeWidth: 2.2, accent: true },
    ],
  },
  {
    id: 'test-cricket',
    index: '05',
    title: 'Test Cricket Strategist',
    fact: 'I think about retention cohorts like a five-day Test match—line, length, and compounding pressure beat flashy one-off stunts.',
    accentNote: 'Long-game bias',
    paths: [
      // Cricket bat blade & handle
      { d: 'M 29 79 L 61 36 L 71 44 L 39 87 C 35 89, 27 83, 29 79 Z', strokeWidth: 2.1 },
      { d: 'M 66 40 L 79 22', strokeWidth: 2.6 },
      { d: 'M 34 74 L 64 42', strokeWidth: 1.4 },
      // Cricket ball with curved seam
      { d: 'M 29 38 C 29 30, 41 30, 41 38 C 41 46, 29 46, 29 38 Z', strokeWidth: 2, accent: true },
      { d: 'M 31 33 C 35 36, 37 40, 39 43', strokeWidth: 1.5, accent: true },
      // Motion arc
      { d: 'M 15 24 C 24 19, 36 20, 44 25', strokeWidth: 1.65, accent: true },
    ],
  },
  {
    id: 'product-teardowns',
    index: '06',
    title: 'Weekend UX Teardowns',
    fact: 'Have documented 40+ B2B SaaS trial funnels and quick-commerce checkouts just to reverse-engineer why great flows feel effortless.',
    accentNote: '40+ teardowns',
    paths: [
      // Lightbulb glass outline
      { d: 'M 50 18 C 35 18, 27 29, 29 42 C 30 50, 37 54, 39 62 L 61 62 C 63 54, 70 50, 71 42 C 73 29, 65 18, 50 18 Z', strokeWidth: 2.1 },
      // Filament inside bulb
      { d: 'M 43 62 L 45 45 L 50 50 L 55 45 L 57 62', strokeWidth: 1.7, accent: true },
      // Screw base
      { d: 'M 41 68 L 59 68', strokeWidth: 2 },
      { d: 'M 43 74 L 57 74', strokeWidth: 2 },
      { d: 'M 46 80 L 54 80', strokeWidth: 2 },
      // Hand-drawn rays
      { d: 'M 50 8 L 50 13', strokeWidth: 1.9, accent: true },
      { d: 'M 22 22 L 26 26', strokeWidth: 1.9, accent: true },
      { d: 'M 78 22 L 74 26', strokeWidth: 1.9, accent: true },
      { d: 'M 16 42 L 22 42', strokeWidth: 1.9, accent: true },
      { d: 'M 78 42 L 84 42', strokeWidth: 1.9, accent: true },
    ],
  },
];

function DoodleCard({ item }: { item: FunFactDoodle }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [redrawCount, setRedrawCount] = useState(0);
  const [isRedrawing, setIsRedrawing] = useState(false);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initial scroll-triggered draw-in
  useLayoutEffect(() => {
    const svgEl = svgRef.current;
    const cardEl = cardRef.current;
    if (!svgEl || !cardEl) return;

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
            strokeDasharray: len + 2,
            strokeDashoffset: len + 2,
          });
        });

        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 0.65,
          stagger: 0.065,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 88%',
            once: true,
          },
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const handleHoverWiggle = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl || prefersReducedMotion()) return;

    gsap.killTweensOf(svgEl);
    gsap.fromTo(
      svgEl,
      { rotation: 0, scale: 1 },
      {
        keyframes: [
          { rotation: -6, scale: 1.07, duration: 0.1 },
          { rotation: 5.5, scale: 1.06, duration: 0.11 },
          { rotation: -4, scale: 1.04, duration: 0.1 },
          { rotation: 2.5, scale: 1.02, duration: 0.09 },
          { rotation: 0, scale: 1, duration: 0.12 },
        ],
        ease: 'power1.inOut',
        transformOrigin: '50% 50%',
      }
    );
  }, []);

  const handleClickRedraw = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    setRedrawCount((c) => c + 1);

    if (prefersReducedMotion()) {
      setIsRedrawing(true);
      window.setTimeout(() => setIsRedrawing(false), 320);
      return;
    }

    const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path'));
    if (paths.length === 0) return;

    gsap.killTweensOf(paths);
    setIsRedrawing(true);

    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, {
        strokeDasharray: len + 2,
        strokeDashoffset: len + 2,
      });
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.48,
      stagger: 0.055,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsRedrawing(false);
      },
    });
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onMouseEnter={handleHoverWiggle}
      onFocus={handleHoverWiggle}
      onClick={handleClickRedraw}
      aria-label={`${item.title}: ${item.fact} Click to redraw illustration.`}
      className="group relative flex flex-col justify-between bg-[#181c27]/90 hover:bg-[#1e2332] p-6 sm:p-7 text-left transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8aa2ff]"
    >
      <div>
        {/* Top editorial row: clean index & interactive redraw hint */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-mono font-semibold text-[#8aa2ff] tabular-nums">
            {item.index}.
          </span>
          <span
            className={`font-hand text-sm tracking-[0.01em] transition-opacity duration-200 ${
              isRedrawing
                ? 'opacity-100 text-[#8aa2ff]'
                : 'opacity-65 group-hover:opacity-100 text-[#9aa4c2] group-hover:text-[#8aa2ff]'
            }`}
          >
            {isRedrawing
              ? 'redrawing...'
              : redrawCount > 0
              ? 'click to sketch again'
              : 'click to redraw'}
          </span>
        </div>

        {/* Interactive hand-drawn SVG doodle */}
        <div className="my-5 flex h-24 items-center justify-start">
          <svg
            ref={svgRef}
            viewBox="0 0 100 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-24 w-24 overflow-visible will-change-transform"
          >
            {item.paths.map((segment, idx) => (
              <path
                key={idx}
                d={segment.d}
                stroke={segment.accent ? '#8aa2ff' : '#e8eaf4'}
                strokeWidth={segment.strokeWidth ?? 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        </div>

        <h3 className="font-display text-lg font-bold tracking-[-0.015em] text-[#f4f6fc] group-hover:text-white transition-colors">
          {item.title}
        </h3>

        <p className="mt-2 text-sm leading-[1.6] text-[#a7b0c8]">
          {item.fact}
        </p>
      </div>

      {/* Quiet unboxed footnote */}
      <p className="mt-5 border-t border-white/[0.07] pt-3.5 font-mono text-[11px] text-[#7c87a6]">
        {item.accentNote}
      </p>
    </button>
  );
}

export function FunFactsSection() {
  return (
    <section aria-label="Fun Facts">
      <EditorialSheet
        tone="night"
        sheetNumber="06"
        sheetLabel="Fun Facts"
      >
        <div className="mx-auto max-w-[1280px] px-5 pt-8 pb-16 sm:px-6 md:px-8 md:pt-12 md:pb-24 lg:px-12">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="font-display text-xs font-semibold tracking-[0.04em] pen-ink-text">
                Beyond the PRD
              </p>
              <PenAnnotation
                text="hover to wiggle · click to redraw"
                arrow="down-right"
                tilt="rotate-2"
                className="hidden sm:inline-flex"
              />
            </div>

            <h2
              className="font-display text-[1.95rem] leading-[2.4rem] font-extrabold tracking-[-0.025em] text-[#f4f6fc] md:text-[2.75rem] md:leading-[3.2rem]"
              style={{ textWrap: 'balance' }}
            >
              Six Small Truths Behind the Work
            </h2>

            <ZigZagToSwooshUnderline
              align="center"
              widthClassName="w-48 sm:w-60"
              className="pt-0.5"
            />

            <p className="mx-auto max-w-xl text-base leading-[1.65] text-[#9aa4c2]">
              Hand-drawn field notes from four years of building with engineers,
              debating scope, and chasing honest product signals.
            </p>
          </div>

          {/* 3x2 Single-elevation hairline grid of six interactive doodles */}
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2 lg:grid-cols-3">
            {FUN_FACTS.map((item) => (
              <DoodleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </EditorialSheet>
    </section>
  );
}
