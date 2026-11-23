import { ArrowRight, FileText, MapPin } from 'lucide-react';
import { HERO_METRICS, PROFILE } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';
import { ContainerScroll } from './ui/container-scroll-animation';
import { EditorialSheet } from './ui/editorial-sheet';
import { PenAnnotation, ZigZagToSwooshUnderline } from './ui/pen-annotations';

interface HeroSectionProps {
  onOpenResume: () => void;
  onJumpToCaseStudies: () => void;
}

export function HeroSection({ onOpenResume, onJumpToCaseStudies }: HeroSectionProps) {
  return (
    <section aria-label="Overview" className="relative">
      <EditorialSheet
        tone="paper"
        sheetNumber="01"
        sheetLabel="Executive Overview"
      >
        <ContainerScroll variant="hero" surface="paper">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Split-screen executive hero: items-stretch for balanced 2-column geometry */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
              {/* Left column: Typographic authority & decisive actions */}
              <div className="flex flex-col justify-between lg:col-span-7 lg:py-2">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-sm font-semibold tracking-[0.02em] pen-ink-text">
                      {PROFILE.kicker}
                    </p>
                    <PenAnnotation
                      text="4+ yrs enterprise GTM → product"
                      arrow="down-left"
                      tilt="-rotate-2"
                      className="hidden sm:inline-flex"
                    />
                  </div>

                  <h2
                    className="mt-4 font-display text-[2.15rem] leading-[2.6rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9] sm:text-[2.75rem] sm:leading-[3.25rem] lg:text-[3.35rem] lg:leading-[3.85rem] lg:tracking-[-0.03em]"
                    style={{ textWrap: 'balance' }}
                  >
                    {PROFILE.headline}
                  </h2>

                  <ZigZagToSwooshUnderline
                    align="left"
                    widthClassName="w-48 sm:w-60"
                    className="mt-3"
                  />

                  <p className="mt-5 max-w-[60ch] text-base leading-[1.7] text-slate-600 dark:text-[#c3c5d8] md:text-[1.1rem] md:leading-[1.75rem] tracking-[-0.005em]">
                    {PROFILE.subheadline}
                  </p>

                {/* Editorial meta line — clean unboxed typography */}
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-[#94a3b8]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-900 dark:text-[#e1e2ec]">
                    <MapPin
                      className="h-3.5 w-3.5 text-[#1d63ff] dark:text-[#38bdf8]"
                      aria-hidden="true"
                    />
                    {PROFILE.location}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                    ·
                  </span>
                  <span>BrowserStack Enterprise Lineage</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                    ·
                  </span>
                  <span className="text-[#a16207] dark:text-[#efbf68] font-semibold">
                    NextLeap Top 1% PM Fellow
                  </span>
                </div>
              </div>

              {/* Primary & Secondary Action Pair */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onJumpToCaseStudies}
                  className="btn-primary-electric group inline-flex items-center gap-2.5 rounded-lg px-6 py-3 font-display text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] dark:focus-visible:ring-[#38bdf8] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0e15]"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-6 py-3 font-display text-sm font-semibold text-slate-900 dark:text-[#f1f5f9] transition-colors duration-180 hover:bg-slate-50 hover:border-slate-400 dark:hover:bg-white/[0.06] dark:hover:border-white/[0.24] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff]"
                >
                  <FileText
                    className="h-4 w-4 text-[#1d4ed8] dark:text-[#b5c4ff]"
                    aria-hidden="true"
                  />
                  <span>Interactive CV &amp; Print PDF</span>
                </button>
              </div>
            </div>

            {/* Right column: Full-height executive portrait frame */}
            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[360px] lg:min-h-[440px] overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.1] bg-slate-900 dark:bg-[#10131a] shadow-sm dark:shadow-none glow-cobalt-corner">
                <ResilientImage
                  src={PROFILE.portraitUrl}
                  alt={`${PROFILE.name}, ${PROFILE.role}`}
                  fallbackTitle={PROFILE.name}
                  className="h-full w-full"
                  imgClassName="object-top hover:scale-[1.02]"
                />
                {/* Measured bottom scrim over studio photo for >= 7:1 text legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/92 via-slate-950/55 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#7bd0ff]">
                    Current Focus
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white">
                    {PROFILE.availability}
                  </p>
                  <p className="mt-1 text-xs text-slate-200">
                    Developer Platforms · B2B Workflow Automation · FinTech Infrastructure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width 4-column Executive Proof Strip below hero split */}
          <div className="mt-10 md:mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-200 dark:bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {HERO_METRICS.map((metric) => {
              const valueColor =
                metric.emphasis === 'champagne'
                  ? 'text-[#a16207] dark:text-[#efbf68]'
                  : metric.emphasis === 'cobalt'
                  ? 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                  : 'text-slate-950 dark:text-[#f1f5f9]';

              return (
                <div
                  key={metric.label}
                  className={`bg-slate-50/70 dark:bg-[#10131a] px-6 py-5 md:px-6 md:py-6 transition-colors duration-200 ${
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
                  <p className="mt-2.5 text-sm leading-[1.45] text-slate-600 dark:text-[#94a3b8]">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ContainerScroll>
      </EditorialSheet>
    </section>
  );
}
