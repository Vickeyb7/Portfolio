import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type PenAnnotationKind = 'underline' | 'oval' | 'highlight';

interface MeasuredBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OverlayStroke {
  id: string;
  kind: PenAnnotationKind | 'margin';
  layer: 'under' | 'over';
  role: 'primary' | 'secondary';
  d: string;
  strokeWidth: number;
  opacity: number;
  order: number;
}

interface OverlayGeometry {
  width: number;
  height: number;
  strokes: OverlayStroke[];
}

interface PenAnnotationProps {
  children: ReactNode;
  /** ScrollTrigger start position (defaults to 'top 80%') */
  triggerStart?: string;
  /** Show subtle hand-drawn editorial margin bracket alongside the bio on md+ screens */
  showMarginBracket?: boolean;
  /** Color tone for hand-drawn highlighter strokes */
  highlightColor?: string;
  className?: string;
}

interface PenAnnotationMarkProps {
  kind: PenAnnotationKind;
  children: ReactNode;
  className?: string;
}

/**
 * Semantic inline marker paired with the `PenAnnotation` overlay component.
 * Uses natural inline flow for `underline` and `highlight` so multi-line phrases
 * wrap organically and receive per-line hand-drawn strokes via `getClientRects()`.
 */
export function PenAnnotationMark({
  kind,
  children,
  className = '',
}: PenAnnotationMarkProps) {
  const kindClasses =
    kind === 'oval'
      ? 'mx-0.5 inline-block whitespace-nowrap px-2 py-0.5 font-semibold text-[#141720]'
      : kind === 'highlight'
      ? 'font-medium text-[#141720]'
      : 'font-medium text-[#141720]';

  return (
    <span
      data-pen-annotation={kind}
      className={`relative ${kindClasses} ${className}`}
    >
      {children}
    </span>
  );
}

/** Deterministic pseudo-random signed offset in [-1, 1] for organic pen variation */
function seededJitter(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

function r(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

/**
 * Merges fragmented horizontal client rects that sit on the same visual line
 * (e.g., kerning splits) so each wrapped line receives one continuous pen stroke.
 */
function mergeLineRects(rects: MeasuredBox[]): MeasuredBox[] {
  if (rects.length <= 1) return rects;

  const sorted = [...rects].sort((a, b) =>
    Math.abs(a.y - b.y) > 6 ? a.y - b.y : a.x - b.x
  );
  const merged: MeasuredBox[] = [];

  for (const box of sorted) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      Math.abs(box.y - prev.y) <= Math.max(6, prev.height * 0.45) &&
      box.x <= prev.x + prev.width + 8
    ) {
      const right = Math.max(prev.x + prev.width, box.x + box.width);
      const bottom = Math.max(prev.y + prev.height, box.y + box.height);
      prev.x = Math.min(prev.x, box.x);
      prev.y = Math.min(prev.y, box.y);
      prev.width = right - prev.x;
      prev.height = bottom - prev.y;
    } else {
      merged.push({ ...box });
    }
  }

  return merged;
}

function buildUnderlineStrokes(
  box: MeasuredBox,
  seed: number,
  order: number,
  idPrefix: string
): OverlayStroke[] {
  const j1 = seededJitter(seed + 1);
  const j2 = seededJitter(seed + 2);
  const j3 = seededJitter(seed + 3);

  const x0 = box.x - 1.5;
  const x1 = box.x + box.width + 2;
  const w = Math.max(12, x1 - x0);
  const baseY = box.y + box.height + 1.5;

  const cx1 = x0 + w * 0.31;
  const cy1 = baseY - 2.6 + j1 * 1.1;
  const cx2 = x0 + w * 0.72;
  const cy2 = baseY - 1.4 + j2 * 1.1;
  const endY = baseY + 0.4 + j3 * 0.9;

  const primaryD = `M ${r(x0)} ${r(baseY + 1.1)} C ${r(cx1)} ${r(cy1)}, ${r(cx2)} ${r(cy2)}, ${r(x1)} ${r(endY)}`;

  const sx0 = x0 + w * 0.12;
  const sx1 = x1 - w * 0.08;
  const sw = Math.max(8, sx1 - sx0);
  const subY = baseY + 4.1;
  const secondaryD = `M ${r(sx0)} ${r(subY + 0.6)} C ${r(sx0 + sw * 0.38)} ${r(subY - 1.5 + j2 * 0.7)}, ${r(sx0 + sw * 0.72)} ${r(subY - 1.1 + j1 * 0.7)}, ${r(sx1)} ${r(subY + 0.4)}`;

  return [
    {
      id: `${idPrefix}-u1`,
      kind: 'underline',
      layer: 'over',
      role: 'primary',
      d: primaryD,
      strokeWidth: 2.15,
      opacity: 0.94,
      order,
    },
    {
      id: `${idPrefix}-u2`,
      kind: 'underline',
      layer: 'over',
      role: 'secondary',
      d: secondaryD,
      strokeWidth: 1.15,
      opacity: 0.64,
      order,
    },
  ];
}

function buildOvalStrokes(
  box: MeasuredBox,
  seed: number,
  order: number,
  idPrefix: string
): OverlayStroke[] {
  const j1 = seededJitter(seed + 11);
  const j2 = seededJitter(seed + 17);

  const padX = 7;
  const padY = 4;
  const left = box.x - padX;
  const right = box.x + box.width + padX;
  const top = box.y - padY;
  const bottom = box.y + box.height + padY;
  const w = right - left;
  const h = bottom - top;

  // Hand-penned clockwise loop with subtle top-left entry & organic overshoot
  const startX = left + w * 0.22;
  const startY = top + h * 0.08;
  const topRightX = right - w * 0.03;
  const topRightY = top + h * 0.34;
  const bottomMidX = left + w * 0.52;
  const bottomMidY = bottom - h * 0.02 + j1 * 1.2;
  const midLeftX = left + w * 0.02;
  const midLeftY = top + h * 0.56;
  const endX = left + w * 0.36;
  const endY = top + h * 0.02 + j2 * 1.1;

  const primaryD = [
    `M ${r(startX)} ${r(startY)}`,
    `C ${r(left + w * 0.56)} ${r(top - 3.2 + j1)}, ${r(right + 2)} ${r(top + h * 0.02)}, ${r(topRightX)} ${r(topRightY)}`,
    `C ${r(right + 4)} ${r(top + h * 0.72)}, ${r(right - w * 0.14)} ${r(bottom + 2.5)}, ${r(bottomMidX)} ${r(bottomMidY)}`,
    `C ${r(left + w * 0.16)} ${r(bottom + 2.8)}, ${r(left - 4.5)} ${r(bottom - h * 0.14)}, ${r(midLeftX)} ${r(midLeftY)}`,
    `C ${r(left - 2.5)} ${r(top + h * 0.2)}, ${r(left + w * 0.12)} ${r(top - 2.5)}, ${r(endX)} ${r(endY)}`,
  ].join(' ');

  const secondaryD = `M ${r(left + w * 0.28)} ${r(top + h * 0.1)} C ${r(left + w * 0.58)} ${r(top + 0.5)}, ${r(right - w * 0.14)} ${r(top + h * 0.08)}, ${r(right - w * 0.05)} ${r(top + h * 0.28)}`;

  return [
    {
      id: `${idPrefix}-o1`,
      kind: 'oval',
      layer: 'over',
      role: 'primary',
      d: primaryD,
      strokeWidth: 2.05,
      opacity: 0.92,
      order,
    },
    {
      id: `${idPrefix}-o2`,
      kind: 'oval',
      layer: 'over',
      role: 'secondary',
      d: secondaryD,
      strokeWidth: 1.05,
      opacity: 0.52,
      order,
    },
  ];
}

function buildHighlightStrokes(
  box: MeasuredBox,
  seed: number,
  order: number,
  idPrefix: string
): OverlayStroke[] {
  const j1 = seededJitter(seed + 23);
  const j2 = seededJitter(seed + 29);

  const x0 = box.x - 3;
  const x1 = box.x + box.width + 3.5;
  const w = Math.max(14, x1 - x0);
  const midY = box.y + box.height * 0.58;
  const bandThickness = Math.max(12, Math.min(20, box.height * 0.62));

  // Soft chisel-tip marker wash drawn behind the text
  const sweepD = `M ${r(x0)} ${r(midY + 1.4 + j1 * 0.8)} C ${r(x0 + w * 0.34)} ${r(midY - 1.2 + j2 * 0.9)}, ${r(x0 + w * 0.68)} ${r(midY + 1.1 + j1 * 0.7)}, ${r(x1)} ${r(midY - 0.9 + j2 * 0.8)}`;

  // Delicate secondary dry-brush feather along the lower edge for hand-crafted texture
  const edgeY = box.y + box.height * 0.86;
  const featherD = `M ${r(x0 + w * 0.06)} ${r(edgeY + 0.4)} C ${r(x0 + w * 0.4)} ${r(edgeY - 1.2)}, ${r(x0 + w * 0.75)} ${r(edgeY + 0.8)}, ${r(x1 - w * 0.04)} ${r(edgeY - 0.3)}`;

  return [
    {
      id: `${idPrefix}-h1`,
      kind: 'highlight',
      layer: 'under',
      role: 'primary',
      d: sweepD,
      strokeWidth: bandThickness,
      opacity: 0.9,
      order,
    },
    {
      id: `${idPrefix}-h2`,
      kind: 'highlight',
      layer: 'over',
      role: 'secondary',
      d: featherD,
      strokeWidth: 1.15,
      opacity: 0.42,
      order,
    },
  ];
}

function buildMarginBracketStroke(height: number): OverlayStroke {
  const top = 6;
  const bottom = Math.max(48, height - 6);
  const mid = (top + bottom) * 0.5;
  const x = -22;

  const d = `M ${r(x + 8)} ${r(top)} C ${r(x + 1)} ${r(top + 2)}, ${r(x - 1)} ${r(top + 14)}, ${r(x + 0.5)} ${r(mid - 14)} C ${r(x + 1.2)} ${r(mid)}, ${r(x - 4.5)} ${r(mid + 1)}, ${r(x - 5)} ${r(mid + 2)} C ${r(x - 1.2)} ${r(mid + 4)}, ${r(x + 1.2)} ${r(mid + 16)}, ${r(x + 0.2)} ${r(bottom - 14)} C ${r(x - 0.8)} ${r(bottom - 2)}, ${r(x + 2)} ${r(bottom)}, ${r(x + 8)} ${r(bottom + 1)}`;

  return {
    id: 'margin-bracket',
    kind: 'margin',
    layer: 'over',
    role: 'primary',
    d,
    strokeWidth: 1.55,
    opacity: 0.55,
    order: -1,
  };
}

/**
 * Dynamic hand-drawn SVG overlay for editorial biography text.
 * Measures live DOM client rects of `<PenAnnotationMark>` phrases inside its
 * children (supporting wrapped multi-line spans and responsive resizes),
 * synthesizes pixel-accurate hand-penned strokes, and uses GSAP ScrollTrigger
 * to draw highlights, ovals, and underlines cleanly once the bio enters view.
 */
export function PenAnnotation({
  children,
  triggerStart = 'top 80%',
  showMarginBracket = true,
  highlightColor = 'rgba(217, 159, 64, 0.24)',
  className = '',
}: PenAnnotationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const underSvgRef = useRef<SVGSVGElement>(null);
  const overSvgRef = useRef<SVGSVGElement>(null);
  const hasPlayedRef = useRef(false);

  const [geometry, setGeometry] = useState<OverlayGeometry>({
    width: 0,
    height: 0,
    strokes: [],
  });

  const measureAnnotations = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width <= 0 || containerRect.height <= 0) return;

    const markElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-pen-annotation]')
    );

    const strokes: OverlayStroke[] = [];

    if (showMarginBracket && containerRect.width >= 540) {
      strokes.push(buildMarginBracketStroke(containerRect.height));
    }

    let orderCounter = 0;

    markElements.forEach((markEl, markIdx) => {
      const kind = markEl.dataset.penAnnotation as PenAnnotationKind | undefined;
      if (!kind) return;

      const rawClientRects = Array.from(markEl.getClientRects()).filter(
        (rect) => rect.width > 2 && rect.height > 2
      );

      const relativeBoxes: MeasuredBox[] =
        kind === 'oval' || rawClientRects.length === 0
          ? (() => {
              const b = markEl.getBoundingClientRect();
              if (b.width <= 2 || b.height <= 2) return [];
              return [
                {
                  x: b.left - containerRect.left,
                  y: b.top - containerRect.top,
                  width: b.width,
                  height: b.height,
                },
              ];
            })()
          : mergeLineRects(
              rawClientRects.map((rect) => ({
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height,
              }))
            );

      relativeBoxes.forEach((box, lineIdx) => {
        const seed = (markIdx + 1) * 31 + lineIdx * 13;
        const idPrefix = `ann-${markIdx}-${lineIdx}`;
        const order = orderCounter++;

        if (kind === 'underline') {
          strokes.push(...buildUnderlineStrokes(box, seed, order, idPrefix));
        } else if (kind === 'oval') {
          strokes.push(...buildOvalStrokes(box, seed, order, idPrefix));
        } else if (kind === 'highlight') {
          strokes.push(...buildHighlightStrokes(box, seed, order, idPrefix));
        }
      });
    });

    const nextWidth = Math.ceil(containerRect.width);
    const nextHeight = Math.ceil(containerRect.height);

    setGeometry((prev) => {
      if (
        prev.width === nextWidth &&
        prev.height === nextHeight &&
        prev.strokes.length === strokes.length &&
        prev.strokes.every((s, idx) => s.d === strokes[idx]?.d)
      ) {
        return prev;
      }
      return {
        width: nextWidth,
        height: nextHeight,
        strokes,
      };
    });
  }, [showMarginBracket]);

  // Measure on mount, ResizeObserver changes, and after web fonts finish loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = window.requestAnimationFrame(measureAnnotations);

    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(measureAnnotations);
    });
    resizeObserver.observe(container);

    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          measureAnnotations();
        }
      });
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [measureAnnotations]);

  // GSAP ScrollTrigger stroke-drawing animation over the biography text
  useLayoutEffect(() => {
    const container = containerRef.current;
    const underSvg = underSvgRef.current;
    const overSvg = overSvgRef.current;
    if (!container || (!underSvg && !overSvg) || geometry.strokes.length === 0) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};

        const allPathEls = [
          ...(underSvg
            ? Array.from(underSvg.querySelectorAll<SVGPathElement>('[data-pen-stroke-id]'))
            : []),
          ...(overSvg
            ? Array.from(overSvg.querySelectorAll<SVGPathElement>('[data-pen-stroke-id]'))
            : []),
        ];

        if (allPathEls.length === 0) return;

        // If user prefers reduced motion OR the draw sequence already completed
        // prior to a viewport resize, show all strokes cleanly in final drawn state.
        if (reduce || hasPlayedRef.current) {
          allPathEls.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          return;
        }

        // Prime every stroke invisible at full dash offset before ScrollTrigger fires
        const pathById = new Map<string, SVGPathElement>();
        allPathEls.forEach((p) => {
          const id = p.dataset.penStrokeId;
          if (id) pathById.set(id, p);
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len + 3,
            strokeDashoffset: len + 3,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: triggerStart,
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            hasPlayedRef.current = true;
            // Clear dasharray once settled so subsequent font/zoom rendering is crisp
            allPathEls.forEach((p) => {
              p.style.strokeDasharray = 'none';
              p.style.strokeDashoffset = '0';
            });
          },
        });

        // Group strokes by reading-order slot so primary + secondary strokes pair organically
        const groups = new Map<number, OverlayStroke[]>();
        geometry.strokes.forEach((stroke) => {
          const bucket = groups.get(stroke.order) ?? [];
          bucket.push(stroke);
          groups.set(stroke.order, bucket);
        });

        const sortedOrders = Array.from(groups.keys()).sort((a, b) => a - b);

        let cursorTime = 0;

        sortedOrders.forEach((order) => {
          const bucket = groups.get(order) ?? [];
          const primary = bucket.find((s) => s.role === 'primary');
          const secondary = bucket.find((s) => s.role === 'secondary');

          if (primary) {
            const el = pathById.get(primary.id);
            if (el) {
              const duration =
                primary.kind === 'margin'
                  ? 0.55
                  : primary.kind === 'oval'
                  ? 0.56
                  : primary.kind === 'highlight'
                  ? 0.44
                  : 0.46;

              const ease =
                primary.kind === 'highlight'
                  ? 'power2.out'
                  : 'power2.inOut';

              tl.to(
                el,
                {
                  strokeDashoffset: 0,
                  duration,
                  ease,
                },
                cursorTime
              );

              if (secondary) {
                const secEl = pathById.get(secondary.id);
                if (secEl) {
                  tl.to(
                    secEl,
                    {
                      strokeDashoffset: 0,
                      duration: 0.28,
                      ease: 'power2.out',
                    },
                    cursorTime + duration * 0.52
                  );
                }
              }

              // Cadenced editorial rhythm between phrases in reading order
              cursorTime +=
                primary.kind === 'margin'
                  ? 0.16
                  : Math.max(0.24, duration * 0.62);
            }
          }
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, [geometry, triggerStart]);

  const underStrokes = geometry.strokes.filter((s) => s.layer === 'under');
  const overStrokes = geometry.strokes.filter((s) => s.layer === 'over');

  return (
    <div ref={containerRef} className="relative">
      {/* Underlay SVG: translucent chisel-tip hand-drawn highlights behind the prose */}
      {geometry.width > 0 && geometry.height > 0 && (
        <svg
          ref={underSvgRef}
          data-pen-annotation-overlay="true"
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-visible select-none mix-blend-multiply"
        >
          {underStrokes.map((stroke) => (
            <path
              key={stroke.id}
              data-pen-stroke-id={stroke.id}
              d={stroke.d}
              stroke={highlightColor}
              strokeWidth={stroke.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.opacity}
            />
          ))}
        </svg>
      )}

      {/* Biography prose layer (always crisp and legible above highlights) */}
      <div className={`relative z-[1] ${className}`}>{children}</div>

      {/* Overlay SVG: crisp fountain-pen underlines, hand-drawn ovals, and margin bracket */}
      {geometry.width > 0 && geometry.height > 0 && (
        <svg
          ref={overSvgRef}
          data-pen-annotation-overlay="true"
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-visible select-none pen-ink-text"
        >
          {overStrokes.map((stroke) => (
            <path
              key={stroke.id}
              data-pen-stroke-id={stroke.id}
              d={stroke.d}
              stroke={
                stroke.kind === 'highlight'
                  ? 'rgba(186, 128, 34, 0.58)'
                  : 'currentColor'
              }
              strokeWidth={stroke.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={stroke.opacity}
            />
          ))}
        </svg>
      )}
    </div>
  );
}

export { PenAnnotation as PenAnnotationOverlay };
