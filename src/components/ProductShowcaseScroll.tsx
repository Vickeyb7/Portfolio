import { useState } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import { CASE_STUDIES, CaseStudy } from '../data/portfolioData';
import { ContainerScroll } from './ui/container-scroll-animation';
import { ResilientImage } from './ResilientImage';

interface ProductShowcaseScrollProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

export function ProductShowcaseScroll({
  onSelectCaseStudy,
}: ProductShowcaseScrollProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentStudy = CASE_STUDIES[selectedIndex];

  return (
    <section
      aria-label="Interactive product showcase"
      className="overflow-hidden border-t border-slate-200/80 dark:border-white/[0.06]"
    >
      <ContainerScroll
        titleComponent={
          <div className="space-y-3">
            <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Interactive Product Spotlight
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-[3.25rem] md:leading-[3.75rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9]"
              style={{ textWrap: 'balance' }}
            >
              From Enterprise Discovery to
              <span className="block mt-1 text-[#1d63ff] dark:text-[#b5c4ff]">
                Shipped Product Architecture
              </span>
            </h2>
          </div>
        }
      >
        <div className="flex h-full flex-col bg-white dark:bg-[#0b0e15]">
          {/* Interactive top switcher bar inside the showcase viewport */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] px-4 py-3 sm:px-6">
            <div
              role="tablist"
              aria-label="Preview shipped case studies"
              className="flex items-center gap-1 overflow-x-auto"
            >
              {CASE_STUDIES.map((study, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={study.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedIndex(idx)}
                    className={`rounded-md px-3 py-1.5 font-display text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#1d63ff] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 dark:text-[#94a3b8] dark:hover:text-[#f1f5f9] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {study.title.split(':')[0]}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onSelectCaseStudy(currentStudy)}
              className="hidden sm:inline-flex items-center gap-1.5 font-display text-xs font-semibold text-[#1d4ed8] dark:text-[#b5c4ff] hover:text-[#1553e6] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Inspect Full PRD</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Main high-resolution product visual + bottom executive readout */}
          <div className="relative flex-1 overflow-hidden bg-[#06080d]">
            <ResilientImage
              src={currentStudy.imageUrl}
              alt={currentStudy.imageAlt}
              fallbackTitle={currentStudy.title}
              className="h-full w-full"
              imgClassName="object-cover"
            />

            {/* Measured dark scrim ensuring >= 7:1 contrast over product visual */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080d]/95 via-[#06080d]/45 to-transparent"
            />

            {/* Bottom overlay brief & quantitative outcomes */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-300">
                    <span className="font-display font-semibold text-[#7bd0ff]">
                      {currentStudy.categoryLabel}
                    </span>
                    <span aria-hidden="true" className="text-white/30">
                      ·
                    </span>
                    <span>{currentStudy.organization}</span>
                    {currentStudy.distinction && (
                      <>
                        <span aria-hidden="true" className="text-white/30">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#efbf68]">
                          <Award className="h-3.5 w-3.5" aria-hidden="true" />
                          {currentStudy.distinction}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-2 font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.015em] text-white">
                    {currentStudy.title}
                  </h3>

                  <p className="mt-2 hidden sm:block text-sm leading-[1.6] text-slate-200 max-w-xl">
                    {currentStudy.architectureSummary}
                  </p>
                </div>

                {/* Outcomes + direct CTA */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-end shrink-0">
                  <div className="flex items-center gap-5 sm:gap-7">
                    {currentStudy.outcomes.slice(0, 2).map((outcome) => (
                      <div key={outcome.label} className="text-left lg:text-right">
                        <p
                          className={`font-display text-xl sm:text-2xl font-bold tabular-nums ${
                            outcome.emphasis === 'champagne'
                              ? 'text-[#efbf68]'
                              : 'text-[#b5c4ff]'
                          }`}
                        >
                          {outcome.value}
                        </p>
                        <p className="text-[11px] text-slate-300">{outcome.label}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCaseStudy(currentStudy)}
                    className="btn-primary-electric inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Open PRD &amp; Metrics</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
