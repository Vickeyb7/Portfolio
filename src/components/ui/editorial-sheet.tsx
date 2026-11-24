import { ReactNode, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionInkWashLayer, useSectionHighlight } from './section-highlighter';

gsap.registerPlugin(ScrollTrigger);

export type EditorialSheetTone = 'paper' | 'night';

interface EditorialSheetProps {
  tone: EditorialSheetTone;
  sheetNumber: string;
  sheetLabel: string;
  children: ReactNode;
  className?: string;
  entranceMode?: 'scroll' | 'unfold';
}

/**
 * Alternating Archival Paper & Charcoal Night Sheet.
 * Expands via GSAP ScrollTrigger from an inset rounded card into edge-to-edge
 * full bleed using GPU-composited clip-path & subtle inset border fading,
 * keeping the outer wrapper untransformed so scroll-spy refs stay exact.
 * Supports `entranceMode="unfold"` for top-of-page sheets so they unfold
 * open like a physical archival dossier page immediately on entry.
 */
export function EditorialSheet({
  tone,
  sheetNumber,
  sheetLabel,
  children,
  className = '',
  entranceMode = 'scroll',
}: EditorialSheetProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const cardOutlineRef = useRef<HTMLDivElement>(null);
  const foldCreaseRef = useRef<HTMLDivElement>(null);
  const highlight = useSectionHighlight();

  useLayoutEffect(() => {
    const triggerEl = triggerRef.current;
    const surfaceEl = surfaceRef.current;
    const outlineEl = cardOutlineRef.current;
    const creaseEl = foldCreaseRef.current;
    if (!triggerEl || !surfaceEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktop, reduce } = context.conditions ?? {};

        if (reduce) {
          gsap.set(surfaceEl, {
            clipPath: 'inset(0px 0% 0px 0% round 0px)',
          });
          if (outlineEl) {
            gsap.set(outlineEl, { opacity: 0 });
          }
          if (creaseEl) {
            gsap.set(creaseEl, { opacity: 0 });
          }
          return;
        }

        if (entranceMode === 'unfold') {
          const startInset = desktop
            ? 'inset(0px 4.2% 8% 4.2% round 34px)'
            : 'inset(0px 2.8% 6% 2.8% round 22px)';

          gsap.set(surfaceEl, {
            clipPath: startInset,
          });

          const unfoldTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              ScrollTrigger.refresh();
            },
          });

          unfoldTl.to(
            surfaceEl,
            {
              clipPath: 'inset(0px 0% 0% 0% round 0px)',
              duration: 1.05,
            },
            0.06
          );

          if (outlineEl) {
            gsap.set(outlineEl, {
              opacity: 1,
              left: desktop ? '4.2%' : '2.8%',
              right: desktop ? '4.2%' : '2.8%',
              borderRadius: desktop ? 34 : 22,
            });

            unfoldTl.to(
              outlineEl,
              {
                left: '0%',
                right: '0%',
                borderRadius: 0,
                opacity: 0,
                duration: 1.05,
              },
              0.06
            );
          }

          if (creaseEl) {
            gsap.set(creaseEl, {
              opacity: 0.75,
              yPercent: -10,
            });

            unfoldTl.to(
              creaseEl,
              {
                yPercent: 220,
                opacity: 0,
                duration: 1.0,
                ease: 'power2.out',
              },
              0.08
            );
          }
          return;
        }

        const startInset = desktop
          ? 'inset(0px 3.6% 0px 3.6% round 34px)'
          : 'inset(0px 2.4% 0px 2.4% round 22px)';

        gsap.set(surfaceEl, {
          clipPath: startInset,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 95%',
            end: 'top 22%',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          surfaceEl,
          {
            clipPath: 'inset(0px 0% 0px 0% round 0px)',
            ease: 'power2.out',
            duration: 1,
          },
          0
        );

        if (outlineEl) {
          gsap.set(outlineEl, {
            opacity: 1,
            left: desktop ? '3.6%' : '2.4%',
            right: desktop ? '3.6%' : '2.4%',
            borderRadius: desktop ? 34 : 22,
          });

          tl.to(
            outlineEl,
            {
              left: '0%',
              right: '0%',
              borderRadius: 0,
              opacity: 0,
              ease: 'power2.out',
              duration: 1,
            },
            0
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, [entranceMode]);

  const isPaper = tone === 'paper';

  return (
    <div
      ref={triggerRef}
      className={`relative w-full py-2.5 sm:py-3.5 md:py-4 ${className}`}
    >
      {/* Subtle rounded card rim that travels outward & dissolves into full bleed */}
      <div
        ref={cardOutlineRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-2.5 sm:inset-y-3.5 md:inset-y-4 z-10 border ${
          isPaper
            ? 'border-[#332b1f]/15 shadow-[0_24px_60px_-28px_rgba(24,20,14,0.22)]'
            : 'border-white/[0.12] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.65)]'
        }`}
      />

      {/* Full-bleed expanding archival paper or charcoal night sheet */}
      <div
        ref={surfaceRef}
        data-sheet={tone}
        className={`relative w-full overflow-hidden will-change-[clip-path] ${
          isPaper ? 'editorial-sheet-paper' : 'editorial-sheet-night'
        }`}
      >
        {/* Subtle horizontal paper-fold shadow sheen that sweeps away during unfold entry */}
        {entranceMode === 'unfold' && (
          <div
            ref={foldCreaseRef}
            aria-hidden="true"
            className="no-print pointer-events-none absolute inset-x-0 top-0 z-20 h-36 opacity-0 will-change-transform"
            style={{
              background: isPaper
                ? 'linear-gradient(180deg, rgba(42,35,25,0.09) 0%, rgba(42,35,25,0.03) 42%, rgba(255,255,255,0) 100%)'
                : 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0) 100%)',
            }}
          />
        )}

        {/* Active-section animated ink-wash overlay behind sheet typography */}
        {highlight && (
          <SectionInkWashLayer
            isActive={highlight.isActive}
            tone={tone}
            variant={highlight.variant}
            className="z-0"
          />
        )}

        {/* Ultra-fine archival paper fiber / nocturnal grain overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: isPaper ? 0.032 : 0.025,
            backgroundImage: isPaper
              ? 'radial-gradient(rgba(40, 32, 20, 0.75) 0.55px, transparent 0.55px)'
              : 'radial-gradient(rgba(220, 228, 255, 0.65) 0.5px, transparent 0.5px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* Delicate top specular edge line */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
            isPaper
              ? 'bg-gradient-to-r from-transparent via-[#ffffff]/90 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#8aa2ff]/25 to-transparent'
          }`}
        />

        {/* Quiet archival folio header strip */}
        <div className="relative z-[1] mx-auto flex max-w-[1280px] items-center justify-between px-5 pt-7 sm:px-6 md:px-8 md:pt-9 lg:px-12">
          <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.12em] uppercase">
            <span className="font-semibold pen-ink-text">{sheetNumber}</span>
            <span
              aria-hidden="true"
              className={`h-px w-6 ${
                isPaper ? 'bg-[#4f6df5]/45' : 'bg-[#8aa2ff]/45'
              }`}
            />
            <span
              className={
                isPaper ? 'text-[#5b5346]' : 'text-[#9aa4c2]'
              }
            >
              {sheetLabel}
            </span>
          </div>
        </div>

        {/* Sheet body */}
        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  );
}
