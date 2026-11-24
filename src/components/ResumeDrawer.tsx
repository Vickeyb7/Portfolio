import { useEffect, useState } from 'react';
import { Award, Check, Copy, Printer, X } from 'lucide-react';
import {
  CAPABILITY_GROUPS,
  CASE_STUDIES,
  PLAIN_TEXT_CV,
  PROFILE,
  TIMELINE_MILESTONES,
} from '../data/portfolioData';

interface ResumeDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeDrawer({ open, onClose }: ResumeDrawerProps) {
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyPlainText = async () => {
    try {
      await navigator.clipboard.writeText(PLAIN_TEXT_CV);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      setCopiedText(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 dark:bg-[#06080d]/82 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      <div
        className="surface-modal print-only-sheet flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Action Header (hidden when printing) */}
        <div className="no-print shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0b0e15]/95 px-6 py-4 sm:px-8">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Interactive Curriculum Vitae
            </p>
            <h2
              id="resume-modal-title"
              className="font-display text-lg font-bold text-slate-950 dark:text-[#f1f5f9]"
            >
              {PROFILE.name} — Executive Resume
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyPlainText}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-3.5 py-2 font-display text-xs font-semibold text-slate-800 dark:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check
                    className="h-3.5 w-3.5 text-[#1d63ff] dark:text-[#38bdf8]"
                    aria-hidden="true"
                  />
                  <span>CV Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy Plain Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary-electric inline-flex items-center gap-2 rounded-lg px-4 py-2 font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume view"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-transparent text-slate-600 dark:text-[#c3c5d8] hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/[0.06] dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Structured Executive CV Document Body */}
        <div className="editorial-scroll flex-1 overflow-y-auto px-6 py-7 sm:px-10 sm:py-8">
          {/* CV Header Block */}
          <div className="border-b border-slate-200 dark:border-white/[0.1] pb-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-slate-950 dark:text-[#f1f5f9]">
                {PROFILE.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-[#94a3b8]">
                {PROFILE.location ? `${PROFILE.location} · ${PROFILE.email}` : PROFILE.email}
              </p>
            </div>
            <p className="mt-1 font-display text-sm font-semibold text-[#1d4ed8] dark:text-[#b5c4ff]">
              {PROFILE.kicker}
            </p>
            <p className="mt-3 text-sm leading-[1.6] text-slate-600 dark:text-[#c3c5d8]">
              {PROFILE.subheadline}
            </p>
          </div>

          {/* Experience & Fellowships */}
          <div className="mt-6">
            <h3 className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Experience &amp; Product Fellowship
            </h3>
            <div className="mt-4 space-y-5">
              {TIMELINE_MILESTONES.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-slate-200/80 dark:border-white/[0.06] pb-5 last:border-b-0"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h4 className="font-display text-base font-bold text-slate-950 dark:text-[#f1f5f9]">
                      {item.role}{' '}
                      <span className="font-medium text-slate-600 dark:text-[#94a3b8]">
                        — {item.organization}
                      </span>
                    </h4>
                    <span className="font-mono text-xs text-slate-500 dark:text-[#94a3b8] tabular-nums">
                      {item.period}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span
                      className={`font-semibold ${
                        item.track === 'product'
                          ? 'text-[#a16207] dark:text-[#efbf68]'
                          : 'text-[#1d4ed8] dark:text-[#b5c4ff]'
                      }`}
                    >
                      {item.headlineMetric}
                    </span>
                    {item.distinction && (
                      <span className="inline-flex items-center gap-1 text-[#a16207] dark:text-[#efbf68]">
                        <Award className="h-3 w-3" aria-hidden="true" />
                        {item.distinction}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-sm leading-[1.55] text-slate-700 dark:text-[#c3c5d8]">
                    {item.highlights.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-white/40"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Shipped Case Studies */}
          <div className="mt-6 border-t border-slate-200 dark:border-white/[0.1] pt-6">
            <h3 className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Selected Product Case Studies
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CASE_STUDIES.map((study) => (
                <div
                  key={study.id}
                  className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#10131a] p-4"
                >
                  <p className="font-display text-sm font-bold text-slate-950 dark:text-[#f1f5f9]">
                    {study.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-[#94a3b8]">
                    {study.organization} · {study.timeframe}
                  </p>
                  <p className="mt-2 text-xs leading-[1.5] text-slate-700 dark:text-[#c3c5d8]">
                    {study.outcomes.map((o) => `${o.value} ${o.label}`).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities Summary */}
          <div className="mt-6 border-t border-slate-200 dark:border-white/[0.1] pt-6">
            <h3 className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Core Product &amp; Technical Stack
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-[#c3c5d8]">
              {CAPABILITY_GROUPS.map((group) => (
                <p key={group.index}>
                  <span className="font-display font-semibold text-slate-950 dark:text-[#f1f5f9]">
                    {group.title}:
                  </span>{' '}
                  {group.items.map((i) => i.name).join(', ')}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
