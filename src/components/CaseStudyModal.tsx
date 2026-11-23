import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Copy,
  MessageSquare,
  X,
} from 'lucide-react';
import { CaseStudy } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onNextStudy: (currentId: string) => void;
  onDiscussStudy: (studyTitle: string) => void;
}

type ArtifactTab = 'prd' | 'metrics' | 'journey';

export function CaseStudyModal({
  study,
  onClose,
  onNextStudy,
  onDiscussStudy,
}: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<ArtifactTab>('prd');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!study) return;
    setActiveTab('prd');
    setCopied(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [study, onClose]);

  if (!study) return null;

  const handleCopySummary = async () => {
    const summaryText = [
      `${study.title} — ${study.organization} (${study.timeframe})`,
      `Role: ${study.role}`,
      `Problem: ${study.problemStatement}`,
      `Approach: ${study.architectureSummary}`,
      `North Star Metric: ${study.prd.northStar}`,
      `Outcomes: ${study.outcomes.map((o) => `${o.value} ${o.label}`).join(' | ')}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 dark:bg-[#06080d]/80 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      onClick={onClose}
    >
      <div
        className="surface-modal flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed blurred modal header */}
        <div className="shrink-0 border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0b0e15]/90 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-600 dark:text-[#94a3b8]">
                <span className="font-display font-semibold text-[#1d4ed8] dark:text-[#b5c4ff]">
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
                {study.distinction && (
                  <>
                    <span aria-hidden="true" className="text-slate-300 dark:text-white/25">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#a16207] dark:text-[#efbf68]">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      {study.distinction}
                    </span>
                  </>
                )}
              </div>

              <h2
                id="case-modal-title"
                className="mt-2 font-display text-xl sm:text-2xl font-bold tracking-[-0.015em] text-slate-950 dark:text-[#f1f5f9]"
              >
                {study.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study modal"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-transparent text-slate-600 dark:text-[#c3c5d8] hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/[0.06] dark:hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Artifact Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Product artifact views"
            className="mt-5 inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#06080d] p-1"
          >
            {(
              [
                { id: 'prd', label: 'Executive Brief & PRD' },
                { id: 'metrics', label: 'Metrics & RICE Matrix' },
                { id: 'journey', label: 'User Journey Flow' },
              ] as { id: ArtifactTab; label: string }[]
            ).map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-3.5 py-1.5 font-display text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* Scrollable editorial longform body */}
        <div className="editorial-scroll flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {/* Top Visual + Key Outcomes Summary */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-stretch">
            <div className="md:col-span-6 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
              <ResilientImage
                src={study.imageUrl}
                alt={study.imageAlt}
                fallbackTitle={study.title}
                className="h-48 md:h-full w-full"
              />
            </div>
            <div className="md:col-span-6 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] p-5">
              <div>
                <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
                  Executive Outcome Summary
                </p>
                <p className="mt-2 text-sm leading-[1.6] text-slate-700 dark:text-[#c3c5d8]">
                  {study.architectureSummary}
                </p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-white/[0.08] pt-4">
                {study.outcomes.map((item) => (
                  <div key={item.label}>
                    <p
                      className={`font-display text-lg font-bold tabular-nums ${
                        item.emphasis === 'champagne'
                          ? 'text-[#a16207] dark:text-[#efbf68]'
                          : item.emphasis === 'cobalt'
                          ? 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                          : 'text-slate-950 dark:text-[#f1f5f9]'
                      }`}
                    >
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-600 dark:text-[#94a3b8]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab 1: Executive PRD */}
          {activeTab === 'prd' && (
            <div className="mt-8 space-y-7">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-[#f1f5f9]">
                    01. Strategic Context &amp; Problem Framing
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-slate-600 dark:text-[#c3c5d8]">
                    {study.prd.context}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-[#f1f5f9]">
                    02. Target User Persona
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-slate-600 dark:text-[#c3c5d8]">
                    {study.prd.targetPersona}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/[0.08] pt-6">
                <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-[#f1f5f9]">
                  03. Core Product Hypothesis
                </h3>
                <p className="mt-2 text-sm md:text-[0.95rem] leading-[1.65] text-slate-800 dark:text-[#e1e2ec]">
                  {study.prd.hypothesis}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-slate-200 dark:border-white/[0.08] pt-6 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-[#1d4ed8] dark:text-[#b5c4ff]">
                    04. v1 Release Scope
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm leading-[1.6] text-slate-700 dark:text-[#c3c5d8]">
                    {study.prd.inScope.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d63ff]"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-sm font-semibold text-slate-600 dark:text-[#94a3b8]">
                    05. Deliberate Non-Goals
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm leading-[1.6] text-slate-600 dark:text-[#94a3b8]">
                    {study.prd.nonGoals.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-white/25"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Metrics & RICE Prioritization Table */}
          {activeTab === 'metrics' && (
            <div className="mt-8 space-y-7">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] p-5">
                  <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#1d4ed8] dark:text-[#b5c4ff]">
                    North Star Metric
                  </p>
                  <p className="mt-2 text-sm leading-[1.6] text-slate-900 dark:text-[#f1f5f9]">
                    {study.prd.northStar}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] p-5">
                  <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#a16207] dark:text-[#efbf68]">
                    Guardrail Metric
                  </p>
                  <p className="mt-2 text-sm leading-[1.6] text-slate-800 dark:text-[#e1e2ec]">
                    {study.prd.guardrail}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-[#f1f5f9]">
                  RICE Prioritization Matrix
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-[#94a3b8]">
                  Trade-off ranking balancing quarterly reach, activation impact, discovery
                  confidence, and engineering weeks.
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08]">
                  <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] font-display text-xs font-semibold text-slate-600 dark:text-[#94a3b8]">
                        <th className="px-4 py-3">Initiative</th>
                        <th className="px-4 py-3">Reach</th>
                        <th className="px-4 py-3">Impact</th>
                        <th className="px-4 py-3">Conf.</th>
                        <th className="px-4 py-3">Effort</th>
                        <th className="px-4 py-3 text-right">RICE</th>
                        <th className="px-4 py-3 text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06] bg-white dark:bg-[#0b0e15]">
                      {study.riceMatrix.map((row) => (
                        <tr
                          key={row.initiative}
                          className="hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3 font-medium text-slate-950 dark:text-[#f1f5f9]">
                            {row.initiative}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-[#c3c5d8] tabular-nums">
                            {row.reach}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-[#c3c5d8] tabular-nums">
                            {row.impact}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-[#c3c5d8] tabular-nums">
                            {row.confidence}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-[#c3c5d8] tabular-nums">
                            {row.effort}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-[#1d4ed8] dark:text-[#b5c4ff] tabular-nums">
                            {row.score}
                          </td>
                          <td className="px-4 py-3 text-right font-display text-xs font-semibold text-[#0369a1] dark:text-[#38bdf8] whitespace-nowrap">
                            {row.decision}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: User Journey & Friction Resolution */}
          {activeTab === 'journey' && (
            <div className="mt-8 space-y-5">
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-[#f1f5f9]">
                  End-to-End Friction &amp; Product Intervention Map
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-[#94a3b8]">
                  Tracing exact drop-off moments to shipped interface interventions and
                  instrumented telemetry signals.
                </p>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-white/[0.08] rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#10131a]">
                {study.journey.map((step) => (
                  <div
                    key={step.stage}
                    className="grid grid-cols-1 gap-4 p-5 md:grid-cols-12"
                  >
                    <div className="md:col-span-3">
                      <p className="font-display text-sm font-bold text-slate-950 dark:text-[#f1f5f9]">
                        {step.stage}
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-[#0369a1] dark:text-[#38bdf8]">
                        {step.signal}
                      </p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="font-display text-xs font-semibold text-slate-500 dark:text-[#94a3b8]">
                        Observed Friction
                      </p>
                      <p className="mt-1 text-sm leading-[1.55] text-slate-600 dark:text-[#c3c5d8]">
                        {step.friction}
                      </p>
                    </div>
                    <div className="md:col-span-5">
                      <p className="font-display text-xs font-semibold text-[#1d4ed8] dark:text-[#b5c4ff]">
                        Product Intervention
                      </p>
                      <p className="mt-1 text-sm leading-[1.55] text-slate-900 dark:text-[#f1f5f9]">
                        {step.intervention}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pinned modal bottom action bar */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-[#0b0e15]/95 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-4 py-2 font-display text-xs font-semibold text-slate-800 dark:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check
                    className="h-3.5 w-3.5 text-[#1d63ff] dark:text-[#38bdf8]"
                    aria-hidden="true"
                  />
                  <span>Brief Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy Case Brief</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDiscussStudy(study.title)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-4 py-2 font-display text-xs font-semibold text-slate-800 dark:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquare
                className="h-3.5 w-3.5 text-[#1d4ed8] dark:text-[#b5c4ff]"
                aria-hidden="true"
              />
              <span>Discuss This Case</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNextStudy(study.id)}
            className="btn-primary-electric inline-flex items-center gap-2 rounded-lg px-4 py-2 font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Next Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
