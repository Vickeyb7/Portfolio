import { useState } from 'react';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { TIMELINE_MILESTONES } from '../data/portfolioData';
import { ContainerScroll } from './ui/container-scroll-animation';
import { EditorialSheet } from './ui/editorial-sheet';
import { EditorialStaggerGroup, EditorialStaggerItem } from './ui/editorial-stagger';
import { PenAnnotation, ZigZagToSwooshUnderline } from './ui/pen-annotations';

type TimelineTrackFilter = 'all' | 'product' | 'sales';

export function CareerTimelineSection() {
  const [trackFilter, setTrackFilter] = useState<TimelineTrackFilter>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'nextleap-fellowship': true,
    'browserstack-senior-ae': true,
  });

  const visibleMilestones = TIMELINE_MILESTONES.filter(
    (m) => trackFilter === 'all' || m.track === trackFilter
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section aria-label="Experience">
      <EditorialSheet
        tone="night"
        sheetNumber="04"
        sheetLabel="Career Ledger"
      >
        <ContainerScroll
          variant="section"
          surface="night"
          titleComponent={
            <EditorialStaggerGroup staggerDelay={0.075} className="space-y-3">
              <EditorialStaggerItem yOffset={12}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <p className="font-display text-xs font-semibold tracking-[0.04em] pen-ink-text">
                    Career Progression &amp; Honors
                  </p>
                  <PenAnnotation
                    text="Top 1% cohort · 142% avg quota"
                    arrow="right-loop"
                    tilt="rotate-1"
                    className="hidden sm:inline-flex"
                  />
                </div>
              </EditorialStaggerItem>
              <EditorialStaggerItem yOffset={16}>
                <h2
                  className="font-display text-[1.9rem] leading-[2.35rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9] md:text-[2.75rem] md:leading-[3.2rem]"
                  style={{ textWrap: 'balance' }}
                >
                  Enterprise Sales Rigor Meets Product Craft
                </h2>
                <ZigZagToSwooshUnderline
                  align="center"
                  widthClassName="w-48 sm:w-60"
                  className="pt-0.5"
                />
              </EditorialStaggerItem>
              <EditorialStaggerItem yOffset={14}>
                <p className="mx-auto max-w-2xl text-base leading-[1.7] text-slate-600 dark:text-[#94a3b8]">
                  Dual-track milestone rail highlighting enterprise execution across
                  BrowserStack &amp; Razorpay alongside product fellowship honors at NextLeap.
                </p>
              </EditorialStaggerItem>
            </EditorialStaggerGroup>
          }
        >
          <div className="p-5 sm:p-7 md:p-9 lg:p-10">
          {/* Dual-Track Filter & Legend Toolbar */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-[#94a3b8]">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-[#1d63ff] dark:border-[#1d63ff]/60 bg-[#1d63ff]/10 dark:bg-[#1d63ff]/15"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1d63ff]" />
                </span>
                <span>Enterprise Execution &amp; GTM (BrowserStack, Razorpay)</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-[#d97706] dark:border-[#dfb15b]/60 bg-[#d97706]/10 dark:bg-[#dfb15b]/15"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b45309] dark:bg-[#dfb15b]" />
                </span>
                <span>Product Fellowship &amp; Academic Honors (NextLeap, B.Tech CS)</span>
              </span>
            </div>

            <div
              role="tablist"
              aria-label="Filter career timeline"
              className="inline-flex flex-wrap items-center gap-1 self-start rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#10131a] p-1 lg:self-auto"
            >
              {(
                [
                  { id: 'all', label: 'Full Timeline' },
                  { id: 'product', label: 'Product & Honors' },
                  { id: 'sales', label: 'Enterprise GTM' },
                ] as { id: TimelineTrackFilter; label: string }[]
              ).map((tab) => {
                const isSelected = trackFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setTrackFilter(tab.id)}
                    className={`rounded-md px-3.5 py-2 font-display text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1d63ff] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/70 dark:text-[#94a3b8] dark:hover:text-[#f1f5f9] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous 2px Milestone Rail Spine */}
          <div className="relative mt-9 pl-8 md:pl-12">
            {/* 2px spine line */}
            <div
              aria-hidden="true"
              className="absolute bottom-4 left-[7px] top-4 w-[2px] bg-slate-200 dark:bg-white/[0.1] md:left-[15px]"
            />

            <EditorialStaggerGroup staggerDelay={0.085} className="space-y-6">
              {visibleMilestones.map((milestone) => {
                const isGold = milestone.track === 'product';
                const isExpanded = !!expandedIds[milestone.id];

                return (
                  <EditorialStaggerItem key={milestone.id} yOffset={18} className="relative">
                    {/* 16px outer ring milestone node with central active pip */}
                    <div
                      aria-hidden="true"
                      className={`absolute -left-8 top-7 flex h-4 w-4 items-center justify-center rounded-full border bg-white dark:bg-[#0b0e15] md:-left-12 md:translate-x-[8px] ${
                        isGold
                          ? 'border-[#d97706] dark:border-[#dfb15b] shadow-[0_0_0_4px_rgba(217,119,6,0.12)] dark:shadow-[0_0_12px_rgba(223,177,91,0.4)]'
                          : 'border-[#1d63ff] shadow-[0_0_0_4px_rgba(29,99,255,0.12)] dark:shadow-[0_0_12px_rgba(29,99,255,0.45)]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isGold ? 'bg-[#b45309] dark:bg-[#dfb15b]' : 'bg-[#1d63ff]'
                        }`}
                      />
                    </div>

                    {/* Subtle horizontal stem linking node to card */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-4 top-[35px] hidden h-px w-4 bg-slate-200 dark:bg-white/[0.12] md:block md:-left-6 md:w-6"
                    />

                    <article
                      className={`surface-card surface-card-interactive rounded-2xl p-6 md:p-7 ${
                        isGold ? 'glow-champagne-corner' : 'glow-cobalt-corner'
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          {/* Clean unboxed metadata row */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-600 dark:text-[#94a3b8]">
                            <span className="font-mono tabular-nums text-slate-700 dark:text-[#c3c5d8]">
                              {milestone.period}
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                              ·
                            </span>
                            <span
                              className={`font-display font-semibold ${
                                isGold
                                  ? 'text-[#a16207] dark:text-[#efbf68]'
                                  : 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                              }`}
                            >
                              {milestone.organization}
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                              ·
                            </span>
                            <span>{milestone.location}</span>
                          </div>

                          <h3 className="mt-2 font-display text-lg md:text-xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]">
                            {milestone.role}
                          </h3>

                          {milestone.distinction && (
                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#a16207] dark:text-[#efbf68]">
                              <Award className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{milestone.distinction}</span>
                            </p>
                          )}
                        </div>

                        {/* Quantitative Headline Impact */}
                        <div className="shrink-0 md:text-right">
                          <p
                            className={`font-display text-sm font-semibold tabular-nums ${
                              isGold
                                ? 'text-[#a16207] dark:text-[#efbf68]'
                                : 'text-[#0369a1] dark:text-[#38bdf8]'
                            }`}
                          >
                            {milestone.headlineMetric}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleExpand(milestone.id)}
                            aria-expanded={isExpanded}
                            className="mt-2 inline-flex items-center gap-1 font-display text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-[#94a3b8] dark:hover:text-[#f1f5f9] transition-colors cursor-pointer"
                          >
                            <span>
                              {isExpanded ? 'Hide Impact Details' : 'View Impact Details'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-sm md:text-[0.95rem] leading-[1.6] text-slate-600 dark:text-[#c3c5d8] max-w-4xl">
                        {milestone.summary}
                      </p>

                      {isExpanded && (
                        <div className="mt-5 border-t border-slate-200 dark:border-white/[0.08] pt-5">
                          <ul className="space-y-2.5 text-sm leading-[1.6] text-slate-700 dark:text-[#c3c5d8]">
                            {milestone.highlights.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-3">
                                <span
                                  aria-hidden="true"
                                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                                    isGold
                                      ? 'bg-[#b45309] dark:bg-[#dfb15b]'
                                      : 'bg-[#1d63ff]'
                                  }`}
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          <p className="mt-4 text-xs text-slate-500 dark:text-[#8d90a2]">
                            Focus Areas:{' '}
                            <span className="font-medium text-slate-700 dark:text-[#c3c5d8]">
                              {milestone.skills.join(' · ')}
                            </span>
                          </p>
                        </div>
                      )}
                    </article>
                  </EditorialStaggerItem>
                );
              })}
            </EditorialStaggerGroup>
          </div>
        </div>
      </ContainerScroll>
      </EditorialSheet>
    </section>
  );
}
