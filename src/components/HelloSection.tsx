import {
  Fragment,
  PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText } from 'lucide-react';
import { HERO_METRICS, PROFILE } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';
import { EditorialSheet } from './ui/editorial-sheet';
import { EditorialStaggerGroup, EditorialStaggerItem } from './ui/editorial-stagger';
import { ZigZagToSwooshUnderline } from './ui/pen-annotations';

gsap.registerPlugin(ScrollTrigger);

interface HelloSectionProps {
  onOpenResume: () => void;
  onJumpToCaseStudies: () => void;
}

interface TraitCallout {
  id: string;
  label: string;
  subnote: string;
  side: 'left' | 'right';
  depthX: number;
  depthY: number;
  tiltClass: string;
  arrowViewBox: string;
  arrowPath: string;
  arrowHead: string;
}

const PM_TRAITS: TraitCallout[] = [
  {
    id: 'buyer-empathy',
    label: 'Enterprise buyer empathy',
    subnote: '150+ VP Eng & QA calls',
    side: 'left',
    depthX: -16,
    depthY: -10,
    tiltClass: '-rotate-2',
    arrowViewBox: '0 0 76 34',
    arrowPath: 'M 4 8 C 28 4, 50 11, 70 26',
    arrowHead: 'M 61 27 L 71 27 L 67 17',
  },
  {
    id: 'prd-rigor',
    label: '0 → 1 PRD rigor',
    subnote: 'clear trade-offs & edge cases',
    side: 'left',
    depthX: -22,
    depthY: 6,
    tiltClass: 'rotate-1',
    arrowViewBox: '0 0 80 28',
    arrowPath: 'M 4 16 C 26 24, 48 6, 74 14',
    arrowHead: 'M 65 9 L 75 14 L 66 21',
  },
  {
    id: 'sql-ci',
    label: 'Reads SQL & CI logs',
    subnote: 'CS roots · BigQuery cohorts',
    side: 'left',
    depthX: -14,
    depthY: 14,
    tiltClass: '-rotate-1',
    arrowViewBox: '0 0 76 36',
    arrowPath: 'M 6 30 C 28 28, 48 18, 70 7',
    arrowHead: 'M 60 6 L 71 6 L 67 16',
  },
  {
    id: 'nextleap-top',
    label: 'Top 1% NextLeap Fellow',
    subnote: 'product craft & teardown',
    side: 'right',
    depthX: 16,
    depthY: -12,
    tiltClass: 'rotate-2',
    arrowViewBox: '0 0 76 34',
    arrowPath: 'M 72 8 C 48 4, 26 11, 6 26',
    arrowHead: 'M 15 27 L 5 27 L 9 17',
  },
  {
    id: 'rice-nongoals',
    label: 'RICE & sharp non-goals',
    subnote: 'prunes scope early',
    side: 'right',
    depthX: 22,
    depthY: 5,
    tiltClass: '-rotate-1',
    arrowViewBox: '0 0 80 28',
    arrowPath: 'M 76 15 C 54 6, 32 24, 6 14',
    arrowHead: 'M 15 9 L 5 14 L 14 21',
  },
  {
    id: 'outcome-shipping',
    label: 'Outcome-first shipping',
    subnote: 'activation & NRR focus',
    side: 'right',
    depthX: 15,
    depthY: 13,
    tiltClass: 'rotate-1',
    arrowViewBox: '0 0 76 36',
    arrowPath: 'M 70 30 C 48 28, 28 18, 6 7',
    arrowHead: 'M 16 6 L 5 6 L 9 16',
  },
];

const MARKED_UP_BIO_PARAGRAPHS = [
  "I'm an emerging SaaS Product Manager combining [4+ years] of developer-first enterprise sales rigor at BrowserStack with *structured product discovery*—translating complex buyer bottlenecks into requirements engineers genuinely enjoy building.",
  'Graduating in the [Top 1%] of the NextLeap PM Fellowship sharpened how I bridge *commercial intuition* with BigQuery cohort SQL, sharp non-goals, and ruthless v1 scoping.',
  'Whether pruning a noisy roadmap or shipping [zero-to-one] workflows, I obsess over *measurable activation, retention, and expansion*—and products customers would genuinely miss if they disappeared.',
];

type BioToken =
  | { type: 'text'; value: string }
  | { type: 'underline'; value: string }
  | { type: 'oval'; value: string };

/**
 * Parses inline editorial markup:
 *  - `*phrase*` -> animated hand-drawn pen underline
 *  - `[phrase]` -> animated hand-drawn pen oval
 */
function parseBioMarkup(input: string): BioToken[] {
  const tokens: BioToken[] = [];
  const pattern = /(\*[^*]+\*|\[[^\]]+\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push({ type: 'underline', value: raw.slice(1, -1) });
    } else if (raw.startsWith('[') && raw.endsWith(']')) {
      tokens.push({ type: 'oval', value: raw.slice(1, -1) });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return tokens;
}

function PenUnderlinePhrase({ children }: { children: string }) {
  return (
    <span
      data-hello-bio-mark="underline"
      className="relative inline-block font-medium text-[#141720]"
    >
      <span className="relative z-[1]">{children}</span>
      <svg
        viewBox="0 0 180 16"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1.5 left-0 h-[10px] w-full overflow-visible pen-ink-text"
      >
        <path
          data-hello-bio-stroke="true"
          data-hello-bio-stroke-role="primary"
          d="M 2 10.5 C 44 4.8, 118 4.4, 178 8.6"
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-hello-bio-stroke="true"
          data-hello-bio-stroke-role="secondary"
          d="M 18 13.6 C 68 10.8, 128 10.2, 166 12.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}

function PenOvalPhrase({ children }: { children: string }) {
  return (
    <span
      data-hello-bio-mark="oval"
      className="relative mx-0.5 inline-block whitespace-nowrap px-2 py-0.5 font-semibold text-[#141720]"
    >
      <span className="relative z-[1]">{children}</span>
      <svg
        viewBox="0 0 144 50"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+12px)] overflow-visible pen-ink-text"
      >
        <path
          data-hello-bio-stroke="true"
          data-hello-bio-stroke-role="primary"
          d="M 24 8 C 62 1.8, 116 3.8, 135 16.5 C 145 25, 136 40.5, 109 45 C 72 49.5, 22 46.5, 9 33.5 C -1 23, 9 10, 36 6.2"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-hello-bio-stroke="true"
          data-hello-bio-stroke-role="secondary"
          d="M 32 7.4 C 66 4.2, 106 5.4, 127 14.2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.58"
        />
      </svg>
    </span>
  );
}

function ParallaxTraitItem({
  trait,
  smoothX,
  smoothY,
  prefersReducedMotion,
}: {
  trait: TraitCallout;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  prefersReducedMotion: boolean;
}) {
  const x = useTransform(smoothX, [-1, 1], [-trait.depthX, trait.depthX]);
  const y = useTransform(smoothY, [-1, 1], [-trait.depthY, trait.depthY]);
  const isLeft = trait.side === 'left';

  return (
    <motion.div
      style={prefersReducedMotion ? undefined : { x, y }}
      className={`flex items-center gap-2.5 will-change-transform ${
        isLeft
          ? 'lg:flex-row lg:justify-end lg:text-right'
          : 'lg:flex-row-reverse lg:justify-end lg:text-left'
      }`}
    >
      <div className={`max-w-[195px] ${trait.tiltClass}`}>
        <p className="font-hand text-[1.28rem] leading-[1.15] font-bold text-[#1a2033]">
          {trait.label}
        </p>
        <p className="mt-0.5 font-mono text-[10.5px] leading-tight text-[#665d50]">
          {trait.subnote}
        </p>
      </div>

      {/* Bespoke hand-drawn periwinkle arrow pointing toward the portrait */}
      <svg
        viewBox={trait.arrowViewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="hidden h-8 w-14 xl:w-16 shrink-0 overflow-visible pen-ink-text lg:block"
      >
        <path
          data-hello-arrow-stroke="true"
          d={trait.arrowPath}
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          data-hello-arrow-stroke="true"
          d={trait.arrowHead}
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

export function HelloSection({
  onOpenResume,
  onJumpToCaseStudies,
}: HelloSectionProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitBoxRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const [colorPinned, setColorPinned] = useState(false);

  // Normalized pointer coordinates (-1..1) for smooth GPU parallax across the 6 PM traits
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 140, damping: 22, mass: 0.55 });
  const smoothY = useSpring(rawY, { stiffness: 140, damping: 22, mass: 0.55 });

  const handleStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse') return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(Math.max(-1, Math.min(1, normX)));
    rawY.set(Math.max(-1, Math.min(1, normY)));
  };

  const handleStagePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // GSAP ScrollTrigger stroke-draw for dual sketchy boxes, 6 trait arrows,
  // and scroll-linked pen underlines (*phrase*) & ovals ([phrase]) across the PM bio
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    const bioEl = bioRef.current;
    if (!stageEl || !bioEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};
        const boxPaths = Array.from(
          stageEl.querySelectorAll<SVGPathElement>('[data-hello-box-stroke="true"]')
        );
        const arrowPaths = Array.from(
          stageEl.querySelectorAll<SVGPathElement>('[data-hello-arrow-stroke="true"]')
        );
        const bioParagraphs = Array.from(
          bioEl.querySelectorAll<HTMLParagraphElement>('[data-hello-bio-paragraph="true"]')
        );
        const bioPaths = Array.from(
          bioEl.querySelectorAll<SVGPathElement>('[data-hello-bio-stroke="true"]')
        );

        const allPaths = [...boxPaths, ...arrowPaths, ...bioPaths];

        if (reduce) {
          allPaths.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          return;
        }

        const prepPaths = (paths: SVGPathElement[]) => {
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, {
              strokeDasharray: len + 4,
              strokeDashoffset: len + 4,
            });
          });
        };

        prepPaths(allPaths);

        // 1. Dual sketchy pen boxes + 6 hand-drawn trait arrows
        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: stageEl,
            start: 'top 84%',
            once: true,
            invalidateOnRefresh: true,
          },
        });

        if (boxPaths.length > 0) {
          stageTl.to(boxPaths, {
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.16,
            ease: 'power2.inOut',
          });
        }

        if (arrowPaths.length > 0) {
          stageTl.to(
            arrowPaths,
            {
              strokeDashoffset: 0,
              duration: 0.55,
              stagger: 0.055,
              ease: 'power2.out',
            },
            '-=0.45'
          );
        }

        // 2. Scroll-linked pen-line underlines (*phrase*) & ovals ([phrase])
        // Each paragraph sketches its editorial annotations smoothly as the reader scrolls past it
        bioParagraphs.forEach((paragraphEl) => {
          const marks = Array.from(
            paragraphEl.querySelectorAll<HTMLElement>('[data-hello-bio-mark]')
          );
          if (marks.length === 0) return;

          const paragraphTl = gsap.timeline({
            scrollTrigger: {
              trigger: paragraphEl,
              start: 'top 86%',
              end: 'bottom 46%',
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });

          marks.forEach((markEl, markIdx) => {
            const primaryStroke = markEl.querySelector<SVGPathElement>(
              '[data-hello-bio-stroke-role="primary"]'
            );
            const secondaryStroke = markEl.querySelector<SVGPathElement>(
              '[data-hello-bio-stroke-role="secondary"]'
            );
            const isOval = markEl.dataset.helloBioMark === 'oval';
            const slotStart = markIdx * 0.52;

            if (primaryStroke) {
              paragraphTl.to(
                primaryStroke,
                {
                  strokeDashoffset: 0,
                  duration: isOval ? 0.62 : 0.48,
                  ease: 'power2.inOut',
                },
                slotStart
              );
            }

            if (secondaryStroke) {
              paragraphTl.to(
                secondaryStroke,
                {
                  strokeDashoffset: 0,
                  duration: 0.34,
                  ease: 'power2.out',
                },
                slotStart + (isOval ? 0.36 : 0.24)
              );
            }
          });
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const leftTraits = PM_TRAITS.filter((t) => t.side === 'left');
  const rightTraits = PM_TRAITS.filter((t) => t.side === 'right');

  return (
    <section aria-label="Hello and Overview" className="relative">
      <EditorialSheet tone="paper" sheetNumber="01" sheetLabel="Hello · Overview">
        <div className="mx-auto max-w-[1220px] px-5 pt-6 pb-16 sm:px-8 md:pt-10 md:pb-22 lg:px-12">
          {/* Editorial Heading + Executive Positioning */}
          <EditorialStaggerGroup
            staggerDelay={0.075}
            className="mx-auto max-w-3xl text-center"
          >
            <EditorialStaggerItem yOffset={12}>
              <p className="font-display text-xs sm:text-sm font-semibold tracking-[0.03em] pen-ink-text">
                {PROFILE.kicker}
              </p>
            </EditorialStaggerItem>

            <EditorialStaggerItem yOffset={16}>
              <h2
                className="mt-3 font-serif text-[2.65rem] leading-[1.04] font-bold tracking-[-0.025em] text-[#141413] sm:text-[3.5rem] md:text-[4rem]"
                style={{ textWrap: 'balance' }}
              >
                Hello, I&rsquo;m Shankar.
              </h2>
            </EditorialStaggerItem>

            <EditorialStaggerItem yOffset={16}>
              <p
                className="mt-3.5 font-display text-lg font-bold tracking-[-0.02em] text-[#1f2432] sm:text-xl md:text-[1.4rem]"
                style={{ textWrap: 'balance' }}
              >
                {PROFILE.headline}
              </p>
              <ZigZagToSwooshUnderline
                align="center"
                widthClassName="w-44 sm:w-56"
                className="mt-2.5"
              />
            </EditorialStaggerItem>
          </EditorialStaggerGroup>

          {/* Interactive Portrait Stage: 6 Pointer-Parallaxed PM Traits + Dual Sketchy Pen Boxes */}
          <div
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
            className="mt-10 md:mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-4"
          >
            {/* Left Flank: 3 Pointer-Parallaxed PM Traits (Desktop) */}
            <div className="hidden lg:flex lg:col-span-4 lg:flex-col lg:items-end lg:justify-between lg:gap-12 lg:py-6">
              {leftTraits.map((trait) => (
                <ParallaxTraitItem
                  key={trait.id}
                  trait={trait}
                  smoothX={smoothX}
                  smoothY={smoothY}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Center Focal Anchor: Greyscale -> Full-Color Portrait inside Dual Sketchy Pen Boxes */}
            <div className="mx-auto w-full max-w-[300px] sm:max-w-[330px] lg:col-span-4">
              <div
                ref={portraitBoxRef}
                role="button"
                tabIndex={0}
                aria-pressed={colorPinned}
                aria-label="Editorial portrait of Shankar Narayan Bhattacharjee. Hover or press to reveal full color."
                onClick={() => setColorPinned((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setColorPinned((prev) => !prev);
                  }
                }}
                className="group relative aspect-[4/5] w-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1e7]"
              >
                {/* Dual Sketchy Hand-Drawn SVG Pen Boxes */}
                <svg
                  viewBox="0 0 320 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 z-20 h-[calc(100%+32px)] w-[calc(100%+32px)] overflow-visible transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.012]"
                >
                  {/* Box 1: Graphite archival ink sketchy frame (slight counter-clockwise tilt) */}
                  <path
                    data-hello-box-stroke="true"
                    d="M 16 18 C 98 12, 224 14, 304 20 C 309 112, 307 286, 301 384 C 216 389, 102 387, 14 381 C 10 278, 12 114, 17 17"
                    stroke="#1c202c"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.78"
                  />
                  {/* Box 2: Offset periwinkle-cobalt sketchy frame (slight clockwise tilt) */}
                  <path
                    data-hello-box-stroke="true"
                    d="M 24 11 C 118 16, 232 9, 311 14 C 314 126, 310 296, 308 391 C 214 385, 92 392, 20 387 C 17 288, 22 124, 24 11"
                    stroke="#4f6df5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.92"
                  />
                </svg>

                {/* Portrait Frame: Greyscale Editorial -> Full Color on Hover / Tap */}
                <div className="relative z-10 h-full w-full overflow-hidden bg-[#e8e1d3] shadow-[0_18px_40px_-24px_rgba(24,20,14,0.32)]">
                  <ResilientImage
                    src={PROFILE.portraitUrl}
                    alt={`${PROFILE.name}, ${PROFILE.role}`}
                    fallbackTitle={PROFILE.name}
                    className="h-full w-full"
                    imgClassName={`object-cover object-[50%_26%] transition-[filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      colorPinned
                        ? 'grayscale-0 contrast-100 brightness-100 scale-[1.025]'
                        : 'grayscale contrast-[1.06] brightness-[0.98] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-[1.025] group-focus-visible:grayscale-0'
                    }`}
                  />
                </div>
              </div>

              {/* Quiet handwritten caption below the dual sketchy frame */}
              <p className="no-print mt-5 text-center font-hand text-[1.1rem] pen-ink-text">
                {colorPinned
                  ? 'in living color · tap to return to monochrome'
                  : 'hover or tap portrait for full color'}
              </p>
            </div>

            {/* Right Flank: 3 Pointer-Parallaxed PM Traits (Desktop) */}
            <div className="hidden lg:flex lg:col-span-4 lg:flex-col lg:items-start lg:justify-between lg:gap-12 lg:py-6">
              {rightTraits.map((trait) => (
                <ParallaxTraitItem
                  key={trait.id}
                  trait={trait}
                  smoothX={smoothX}
                  smoothY={smoothY}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Compact Responsive Trait Constellation (Mobile & Tablet < lg) */}
            <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#2a2319]/12 pt-6 sm:grid-cols-3 lg:hidden">
              {PM_TRAITS.map((trait) => (
                <div key={trait.id} className="space-y-0.5">
                  <p className="font-hand text-[1.22rem] leading-tight font-bold text-[#1a2033]">
                    {trait.label}
                  </p>
                  <p className="font-mono text-[10.5px] leading-snug text-[#665d50]">
                    {trait.subnote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marked-Up PM Bio with Scroll-Linked Pen Underlines (*phrase*) & Ovals ([phrase]) */}
          <div
            ref={bioRef}
            className="mx-auto mt-12 md:mt-16 max-w-[68ch] border-t border-[#2a2319]/12 pt-9 md:pt-11"
          >
            <div className="space-y-6 text-[1.05rem] sm:text-[1.15rem] leading-[1.9] tracking-[0.012em] text-[#2b2721]">
              {MARKED_UP_BIO_PARAGRAPHS.map((paragraph, pIndex) => {
                const tokens = parseBioMarkup(paragraph);
                return (
                  <p key={pIndex} data-hello-bio-paragraph="true">
                    {tokens.map((token, tIndex) => {
                      if (token.type === 'underline') {
                        return (
                          <PenUnderlinePhrase key={tIndex}>
                            {token.value}
                          </PenUnderlinePhrase>
                        );
                      }
                      if (token.type === 'oval') {
                        return (
                          <PenOvalPhrase key={tIndex}>
                            {token.value}
                          </PenOvalPhrase>
                        );
                      }
                      return <Fragment key={tIndex}>{token.value}</Fragment>;
                    })}
                  </p>
                );
              })}
            </div>

            {/* Executive Focus, Lineage Meta & Action Pair (merged from Executive Overview) */}
            <div className="mt-10 border-t border-[#2a2319]/12 pt-7">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#574f43]">
                <span className="font-semibold text-[#181b24]">
                  BrowserStack Enterprise Lineage
                </span>
                <span aria-hidden="true" className="text-[#2a2319]/25">
                  ·
                </span>
                <span className="font-semibold text-[#a16207]">
                  NextLeap Top 1% PM Fellow
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-[#2a2319]/12 bg-[#fbf8f1]/80 px-5 py-4">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] pen-ink-text">
                  Current Focus
                </p>
                <p className="mt-1 font-display text-[0.98rem] font-semibold text-[#16181f]">
                  {PROFILE.availability}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5b5346]">
                  Developer Platforms · B2B Workflow Automation · FinTech Infrastructure
                </p>
              </div>

              {/* Primary & Secondary Action Pair */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={onJumpToCaseStudies}
                  className="btn-primary-electric group inline-flex items-center gap-2.5 rounded-lg px-6 py-3 font-display text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e7]"
                >
                  <span>Explore Case Studies</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2a2319]/20 bg-[#fdfbf6] px-6 py-3 font-display text-sm font-semibold text-[#16181f] transition-colors duration-180 hover:border-[#2a2319]/35 hover:bg-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e7]"
                >
                  <FileText
                    className="h-4 w-4 text-[#1d4ed8]"
                    aria-hidden="true"
                  />
                  <span>Interactive CV &amp; Print PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4-Column Executive Proof Strip (merged from Executive Overview) */}
          <EditorialStaggerGroup
            staggerDelay={0.07}
            delayChildren={0.08}
            className="mt-12 md:mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#2a2319]/14 bg-[#2a2319]/12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HERO_METRICS.map((metric) => {
              const valueColor =
                metric.emphasis === 'champagne'
                  ? 'text-[#a16207]'
                  : metric.emphasis === 'cobalt'
                  ? 'text-[#1d4ed8]'
                  : 'text-[#141720]';

              return (
                <EditorialStaggerItem
                  key={metric.label}
                  yOffset={14}
                  className={`bg-[#fbf8f1] px-6 py-5 md:px-6 md:py-6 transition-colors duration-200 ${
                    metric.emphasis === 'champagne'
                      ? 'glow-champagne-corner'
                      : metric.emphasis === 'cobalt'
                      ? 'glow-cobalt-corner'
                      : ''
                  }`}
                >
                  <p
                    className={`font-display text-[1.75rem] leading-none font-bold tracking-[-0.02em] tabular-nums ${valueColor}`}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2.5 text-sm leading-[1.55] text-[#574f43]">
                    {metric.label}
                  </p>
                </EditorialStaggerItem>
              );
            })}
          </EditorialStaggerGroup>
        </div>
      </EditorialSheet>
    </section>
  );
}
