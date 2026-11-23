import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  CAPABILITY_GROUPS,
  CASE_STUDIES,
  CaseStudy,
  TECH_STACK_ITEMS,
  TechStackCategory,
  TESTIMONIALS,
} from '../data/portfolioData';
import { ContainerScroll } from './ui/container-scroll-animation';
import { TechLogoMark } from './TechLogoMark';

interface CapabilitiesAndProofSectionProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

const STACK_FILTER_TABS: { id: TechStackCategory; label: string }[] = [
  { id: 'all', label: 'All Stack' },
  { id: 'product', label: 'Product Craft' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'design-gtm', label: 'Design & GTM' },
];

export function CapabilitiesAndProofSection({
  onSelectCaseStudy,
}: CapabilitiesAndProofSectionProps) {
  const [stackFilter, setStackFilter] = useState<TechStackCategory>('all');

  const visibleTechItems = useMemo(
    () =>
      TECH_STACK_ITEMS.filter(
        (item) => stackFilter === 'all' || item.category === stackFilter
      ),
    [stackFilter]
  );

  const handleInspectCase = (caseStudyId: string) => {
    const study = CASE_STUDIES.find((item) => item.id === caseStudyId);
    if (study) {
      onSelectCaseStudy(study);
    }
  };

  return (
    <section
      aria-label="Capabilities and Endorsements"
      className="overflow-hidden border-t border-slate-200/80 dark:border-white/[0.06]"
    >
      <ContainerScroll
        variant="section"
        titleComponent={
          <div className="space-y-3">
            <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Operating Stack &amp; Craft
            </p>
            <h2
              className="font-display text-[1.9rem] leading-[2.35rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9] md:text-[2.75rem] md:leading-[3.2rem]"
              style={{ textWrap: 'balance' }}
            >
              Bridging Customer Discovery, Telemetry &amp; Shipping Rigor
            </h2>
          </div>
        }
      >
        <div className="p-5 sm:p-7 md:p-9 lg:p-10">
          {/* 3-Column Architectural Grid separated by hairlines — zero nested cards */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-200 dark:bg-white/[0.08] lg:grid-cols-3">
            {CAPABILITY_GROUPS.map((group) => (
              <div
                key={group.index}
                className="bg-slate-50/50 dark:bg-[#10131a] p-6 md:p-7 transition-colors duration-200"
              >
                <p className="font-mono text-xs font-semibold text-[#1d4ed8] dark:text-[#b5c4ff]">
                  {group.index}.
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]">
                  {group.title}
                </h3>
                <p className="mt-2.5 text-sm leading-[1.6] text-slate-600 dark:text-[#94a3b8]">
                  {group.description}
                </p>

                <dl className="mt-6 space-y-4 border-t border-slate-200 dark:border-white/[0.08] pt-6">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <dt className="font-display text-sm font-semibold text-slate-900 dark:text-[#e1e2ec]">
                        {item.name}
                      </dt>
                      <dd className="mt-0.5 text-xs leading-[1.5] text-slate-600 dark:text-[#94a3b8]">
                        {item.context}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* Interactive Skills & Tech Stack Matrix */}
          <div className="mt-12 md:mt-14">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
                  Skills &amp; Tech Stack
                </p>
                <h3 className="mt-1 font-display text-xl md:text-2xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]">
                  Core Technologies &amp; Product Tools Applied in Production
                </h3>
              </div>

              <div
                role="tablist"
                aria-label="Filter technologies and skills by domain"
                className="inline-flex flex-wrap items-center gap-1 self-start rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#10131a] p-1 lg:self-auto"
              >
                {STACK_FILTER_TABS.map((tab) => {
                  const isSelected = stackFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setStackFilter(tab.id)}
                      className={`rounded-md px-3.5 py-2 font-display text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] ${
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

            <div className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-200 dark:bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
              {visibleTechItems.map((tech) => (
                <div
                  key={tech.id}
                  className="group flex flex-col justify-between bg-white dark:bg-[#0d111a] p-5 md:p-6 transition-colors duration-200 hover:bg-slate-50/90 dark:hover:bg-[#131926]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 dark:border-white/[0.1] bg-slate-50 dark:bg-[#141a27]">
                          <TechLogoMark logo={tech.logo} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display text-sm font-bold tracking-[-0.01em] text-slate-950 dark:text-[#f1f5f9] truncate">
                            {tech.name}
                          </h4>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-[#8d90a2]">
                            {tech.categoryLabel}
                          </p>
                        </div>
                      </div>

                      {tech.caseStudyId && (
                        <button
                          type="button"
                          onClick={() => handleInspectCase(tech.caseStudyId!)}
                          aria-label={`Inspect case study using ${tech.name}`}
                          className="inline-flex items-center gap-0.5 font-display text-xs font-semibold text-[#1d4ed8] hover:text-[#1553e6] dark:text-[#b5c4ff] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] rounded"
                        >
                          <span>Case</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <p className="mt-3.5 text-xs leading-[1.6] text-slate-600 dark:text-[#94a3b8]">
                      {tech.usageSummary}
                    </p>
                  </div>

                  {/* Clean unboxed project attribution line */}
                  <div className="mt-4 border-t border-slate-100 dark:border-white/[0.06] pt-3">
                    <p className="text-[11px] leading-[1.5] text-slate-500 dark:text-[#8d90a2]">
                      <span className="font-semibold text-slate-700 dark:text-[#c3c5d8]">
                        Applied in:
                      </span>{' '}
                      {tech.projects.join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Claim-to-Proof Adjacency: Attributable Executive Endorsements */}
          <div className="mt-12 md:mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#a16207] dark:text-[#efbf68]">
                  Peer &amp; Leadership Endorsements
                </p>
                <h3 className="mt-1 font-display text-xl md:text-2xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]">
                  Verified Across Enterprise Sales &amp; Product Mentorship
                </h3>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {TESTIMONIALS.map((item, idx) => (
                <figure
                  key={item.author}
                  className={`surface-card flex flex-col justify-between rounded-2xl p-6 md:p-7 ${
                    idx === 1 ? 'glow-champagne-corner' : 'glow-cobalt-corner'
                  }`}
                >
                  <div>
                    <blockquote className="text-base leading-[1.7] text-slate-800 dark:text-[#e1e2ec]">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>

                    {/* Concrete before -> outcome proof line */}
                    <div className="mt-6 space-y-1.5 border-t border-slate-200 dark:border-white/[0.08] pt-5 text-xs leading-[1.5]">
                      <p className="text-slate-600 dark:text-[#94a3b8]">
                        <span className="font-semibold text-slate-800 dark:text-[#c3c5d8]">
                          Context:
                        </span>{' '}
                        {item.beforeContext}
                      </p>
                      <p className="text-slate-600 dark:text-[#94a3b8]">
                        <span
                          className={`font-semibold ${
                            idx === 1
                              ? 'text-[#a16207] dark:text-[#efbf68]'
                              : 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                          }`}
                        >
                          Verified Outcome:
                        </span>{' '}
                        <span className="font-medium text-slate-900 dark:text-[#e1e2ec]">
                          {item.outcome}
                        </span>
                      </p>
                    </div>
                  </div>

                  <figcaption className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06] pt-4">
                    <div>
                      <p className="font-display text-sm font-bold text-slate-950 dark:text-[#f1f5f9]">
                        {item.author}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-[#94a3b8]">
                        {item.role} · {item.organization}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
