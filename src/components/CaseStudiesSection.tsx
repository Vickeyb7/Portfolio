import { useMemo, useState } from 'react';
import { Award, ChevronRight, Search, X } from 'lucide-react';
import { CASE_STUDIES, CaseCategory, CaseStudy } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';
import { ContainerScroll } from './ui/container-scroll-animation';
import { EditorialSheet } from './ui/editorial-sheet';
import { PenAnnotation, ZigZagToSwooshUnderline } from './ui/pen-annotations';

interface CaseStudiesSectionProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

const FILTER_TABS: { id: CaseCategory; label: string }[] = [
  { id: 'all', label: 'All Work' },
  { id: 'devtools', label: 'Developer Tools' },
  { id: 'zero-to-one', label: '0→1 Product' },
  { id: 'growth', label: 'Growth & Activation' },
];

export function CaseStudiesSection({ onSelectCaseStudy }: CaseStudiesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CaseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return CASE_STUDIES.filter((study) => {
      const matchesCategory = activeFilter === 'all' || study.category === activeFilter;
      if (!matchesCategory) return false;
      if (!query) return true;

      const searchable = [
        study.title,
        study.subtitle,
        study.organization,
        study.categoryLabel,
        study.problemStatement,
        ...study.stack,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [activeFilter, searchQuery]);

  return (
    <section aria-label="Case Studies">
      <EditorialSheet
        tone="paper"
        sheetNumber="03"
        sheetLabel="Product Briefs"
      >
        <ContainerScroll
          variant="section"
          surface="paper"
          titleComponent={
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <p className="font-display text-xs font-semibold tracking-[0.04em] pen-ink-text">
                  Selected Product Artifacts
                </p>
                <PenAnnotation
                  text="click any brief for full PRD + RICE"
                  arrow="down-left"
                  tilt="-rotate-2"
                  className="hidden sm:inline-flex"
                />
              </div>
              <h2
                className="font-display text-[1.9rem] leading-[2.35rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9] md:text-[2.75rem] md:leading-[3.2rem]"
                style={{ textWrap: 'balance' }}
              >
                Product Case Studies &amp; Shipped Specs
              </h2>
              <ZigZagToSwooshUnderline
                align="center"
                widthClassName="w-48 sm:w-60"
                className="pt-0.5"
              />
              <p className="mx-auto max-w-2xl text-base leading-[1.6] text-slate-600 dark:text-[#94a3b8]">
                Each brief opens an interactive artifact drawer with full PRD framing, RICE
                prioritization tables, and user journey diagnostics.
              </p>
            </div>
          }
        >
          <div className="p-5 sm:p-7 md:p-9 lg:p-10">
          {/* Interactive segmented filter bar + search input */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Filter case studies by category"
              className="inline-flex flex-wrap items-center gap-1 self-start rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#10131a] p-1"
            >
              {FILTER_TABS.map((tab) => {
                const isSelected = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`rounded-md px-4 py-2 font-display text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] ${
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

            {/* Dual-mode recessed search input */}
            <div className="w-full lg:w-72 shrink-0">
              <label htmlFor="case-search" className="sr-only">
                Filter case studies by keyword
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-[#8d90a2]"
                  aria-hidden="true"
                />
                <input
                  id="case-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PRDs, SQL, CI/CD..."
                  className="recessed-input w-full rounded-lg py-2.5 pl-10 pr-9 text-sm text-slate-900 dark:text-[#f1f5f9] placeholder:text-slate-500 dark:placeholder:text-[#8d90a2]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-900 dark:text-[#8d90a2] dark:hover:text-[#f1f5f9] cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Empty state when search returns no matches */}
          {filteredStudies.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] p-12 text-center">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-[#f1f5f9]">
                No case studies match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-[#94a3b8]">
                Try resetting your category filter or searching for BrowserStack, FinPulse,
                or Funnel Diagnostics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="mt-5 inline-flex items-center rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-4 py-2 font-display text-sm font-semibold text-slate-900 dark:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-white/[0.06] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredStudies.map((study, index) => {
                const isWideFeatured =
                  activeFilter === 'all' && !searchQuery && index === 0;

                return (
                  <article
                    key={study.id}
                    data-cursor="inspect"
                    onClick={() => onSelectCaseStudy(study)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCaseStudy(study);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open deep-dive PRD and metrics for ${study.title}`}
                    className={`surface-card surface-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-2xl text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] ${
                      isWideFeatured ? 'lg:col-span-2 lg:grid lg:grid-cols-12' : ''
                    } ${
                      study.distinction ? 'glow-champagne-corner' : 'glow-cobalt-corner'
                    }`}
                  >
                    {/* Media visual frame */}
                    <div
                      className={`relative overflow-hidden border-b border-slate-200/80 dark:border-white/[0.06] ${
                        isWideFeatured
                          ? 'aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:h-full lg:border-b-0 lg:border-r'
                          : 'aspect-[16/9]'
                      }`}
                    >
                      <ResilientImage
                        src={study.imageUrl}
                        alt={study.imageAlt}
                        fallbackTitle={study.title}
                        className="h-full w-full"
                        imgClassName="group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Editorial narrative + bottom quantitative outcomes strip */}
                    <div
                      className={`flex flex-1 flex-col justify-between p-6 md:p-7 ${
                        isWideFeatured ? 'lg:col-span-7 lg:p-8' : ''
                      }`}
                    >
                      <div>
                        {/* Clean unboxed metadata kicker */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-600 dark:text-[#94a3b8]">
                          <span className="text-[#1d4ed8] dark:text-[#b5c4ff] font-display font-semibold">
                            {study.categoryLabel}
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                            ·
                          </span>
                          <span>{study.organization}</span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                            ·
                          </span>
                          <span className="tabular-nums">{study.timeframe}</span>
                        </div>

                        {study.distinction && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#a16207] dark:text-[#efbf68]">
                            <Award className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{study.distinction}</span>
                          </div>
                        )}

                        <h3 className="mt-3 font-display text-xl md:text-2xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9] group-hover:text-[#1d4ed8] dark:group-hover:text-white transition-colors">
                          {study.title}
                        </h3>

                        <p className="mt-2.5 text-sm md:text-[0.95rem] leading-[1.6] text-slate-600 dark:text-[#c3c5d8]">
                          {study.problemStatement}
                        </p>

                        {/* Clean typographic capability list */}
                        <p className="mt-4 text-xs text-slate-500 dark:text-[#8d90a2]">
                          {study.stack.join('  ·  ')}
                        </p>
                      </div>

                      {/* Bottom Quantitative Outcome Strip */}
                      <div className="mt-6 border-t border-slate-200/80 dark:border-white/[0.08] pt-5">
                        <div className="grid grid-cols-3 gap-4">
                          {study.outcomes.map((outcome) => (
                            <div key={outcome.label}>
                              <p
                                className={`font-display text-lg md:text-xl font-bold tracking-[-0.015em] tabular-nums ${
                                  outcome.emphasis === 'champagne'
                                    ? 'text-[#a16207] dark:text-[#efbf68]'
                                    : outcome.emphasis === 'cobalt'
                                    ? 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                                    : 'text-slate-950 dark:text-[#f1f5f9]'
                                }`}
                              >
                                {outcome.value}
                              </p>
                              <p className="mt-0.5 text-xs leading-[1.35] text-slate-600 dark:text-[#94a3b8]">
                                {outcome.label}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Tertiary inline action with rightward chevron hover translate */}
                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-[#8d90a2]">
                            Role:{' '}
                            <span className="font-medium text-slate-800 dark:text-[#c3c5d8]">
                              {study.role}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 font-display text-sm font-semibold text-[#1d4ed8] group-hover:text-[#1553e6] dark:text-[#b5c4ff] dark:group-hover:text-[#f1f5f9] transition-colors whitespace-nowrap shrink-0">
                            <span>Inspect PRD &amp; Metrics</span>
                            <ChevronRight
                              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </ContainerScroll>
      </EditorialSheet>
    </section>
  );
}
