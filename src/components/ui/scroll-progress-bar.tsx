import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

interface ScrollProgressBarProps {
  isDark: boolean;
}

const PROGRESS_STOPS = [0, 0.25, 0.52, 0.78, 1];
const WORDS_PER_MINUTE = 210;
const FALLBACK_TOTAL_SECONDS = 240; // ~4 min baseline before lazy sections hydrate

// Archival pen-ink & champagne progression across editorial sheets
const LIGHT_COLORS = ['#4f6df5', '#3b5bdb', '#6366f1', '#b8862d', '#4f6df5'];
const DARK_COLORS = ['#8aa2ff', '#60a5fa', '#818cf8', '#efbf68', '#8aa2ff'];

const LIGHT_GLOWS = [
  '0 1px 8px rgba(79, 109, 245, 0.38)',
  '0 1px 8px rgba(59, 91, 219, 0.38)',
  '0 1px 8px rgba(99, 102, 241, 0.38)',
  '0 1px 8px rgba(184, 134, 45, 0.38)',
  '0 1px 8px rgba(79, 109, 245, 0.38)',
];

const DARK_GLOWS = [
  '0 1px 12px rgba(138, 162, 255, 0.55)',
  '0 1px 12px rgba(96, 165, 250, 0.55)',
  '0 1px 12px rgba(129, 140, 248, 0.55)',
  '0 1px 12px rgba(239, 191, 104, 0.55)',
  '0 1px 12px rgba(138, 162, 255, 0.55)',
];

function measurePortfolioReadingSeconds(): number {
  if (typeof document === 'undefined') return FALLBACK_TOTAL_SECONDS;
  const mainEl = document.querySelector('main');
  const rawText = (mainEl?.innerText || mainEl?.textContent || '').trim();
  if (!rawText) return FALLBACK_TOTAL_SECONDS;

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  // Minimum 2 minutes so initial pre-hydration state doesn't under-report drastically
  const computedSeconds = Math.round((wordCount / WORDS_PER_MINUTE) * 60);
  return Math.max(120, computedSeconds);
}

function formatRemainingReadTime(
  progress: number,
  totalSeconds: number
): { label: string; isComplete: boolean } {
  const clamped = Math.min(1, Math.max(0, progress));
  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));

  if (clamped < 0.015) {
    return {
      label: `Est. ${totalMinutes} min read`,
      isComplete: false,
    };
  }

  const remainingSeconds = Math.max(0, Math.round(totalSeconds * (1 - clamped)));

  if (clamped >= 0.96 || remainingSeconds <= 15) {
    return { label: 'Finished reading', isComplete: true };
  }

  if (remainingSeconds < 60) {
    return { label: 'Less than 1 min left', isComplete: false };
  }

  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  return {
    label: `Est. ${remainingMinutes} min left`,
    isComplete: false,
  };
}

export function ScrollProgressBar({ isDark }: ScrollProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [totalSeconds, setTotalSeconds] = useState<number>(FALLBACK_TOTAL_SECONDS);
  const [readout, setReadout] = useState<{
    label: string;
    percent: number;
    isComplete: boolean;
  }>(() => ({
    label: formatRemainingReadTime(0, FALLBACK_TOTAL_SECONDS).label,
    percent: 0,
    isComplete: false,
  }));

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  const activeProgress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  const backgroundColor = useTransform(
    activeProgress,
    PROGRESS_STOPS,
    isDark ? DARK_COLORS : LIGHT_COLORS
  );

  const boxShadow = useTransform(
    activeProgress,
    PROGRESS_STOPS,
    isDark ? DARK_GLOWS : LIGHT_GLOWS
  );

  // Measure actual portfolio prose word count and refresh as lazy sections mount
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let rafTimer: number | null = null;

    const recalc = () => {
      const measured = measurePortfolioReadingSeconds();
      setTotalSeconds((prev) => (Math.abs(prev - measured) >= 15 ? measured : prev));
    };

    recalc();

    const mainEl = document.querySelector('main');
    let observer: MutationObserver | null = null;
    if (mainEl && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        if (rafTimer !== null) window.clearTimeout(rafTimer);
        rafTimer = window.setTimeout(() => {
          recalc();
          rafTimer = null;
        }, 250);
      });
      observer.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      if (rafTimer !== null) window.clearTimeout(rafTimer);
    };
  }, []);

  // Dynamically update archival serif reading time estimate as the user scrolls
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const percent = Math.min(100, Math.max(0, Math.round(latest * 100)));
    const { label, isComplete } = formatRemainingReadTime(latest, totalSeconds);

    setReadout((prev) =>
      prev.label === label &&
      prev.percent === percent &&
      prev.isComplete === isComplete
        ? prev
        : { label, percent, isComplete }
    );
  });

  // Sync formatted label if totalSeconds finishes hydrating while scrolled
  useEffect(() => {
    const latest = scrollYProgress.get();
    const percent = Math.min(100, Math.max(0, Math.round(latest * 100)));
    const { label, isComplete } = formatRemainingReadTime(latest, totalSeconds);

    setReadout((prev) =>
      prev.label === label &&
      prev.percent === percent &&
      prev.isComplete === isComplete
        ? prev
        : { label, percent, isComplete }
    );
  }, [totalSeconds, scrollYProgress]);

  return (
    <>
      {/* Top 3px archival ink scroll progress line */}
      <div
        aria-hidden="true"
        className="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-[#2a2319]/[0.06] dark:bg-white/[0.06]"
      >
        <motion.div
          className="h-full w-full origin-left will-change-transform"
          style={{
            scaleX: activeProgress,
            backgroundColor,
            boxShadow,
          }}
        />
      </div>

      {/* Subtle archival serif reading-time indicator (unboxed folio slip, zero pill styling) */}
      <motion.aside
        aria-label="Estimated reading time"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="no-print pointer-events-none fixed right-3 bottom-3 sm:right-5 sm:bottom-4 z-30 select-none"
      >
        <div className="relative overflow-hidden border-t border-b border-[#2a2319]/15 bg-[#f6f1e7]/90 px-3 py-1.5 backdrop-blur-md shadow-[0_6px_20px_-10px_rgba(24,20,14,0.22)]">
          <div className="flex items-baseline gap-2 leading-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={readout.label}
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 3 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -3 }
                }
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic text-[13.5px] sm:text-[14.5px] font-semibold tracking-[0.015em] text-[#2a241c]"
              >
                {readout.label}
              </motion.span>
            </AnimatePresence>

            <span
              aria-hidden="true"
              className="font-serif text-[12px] text-[#9b907f]"
            >
              ·
            </span>

            <span
              className={`font-serif text-[12.5px] sm:text-[13px] font-medium tabular-nums tracking-[0.02em] ${
                readout.isComplete ? 'text-[#4f6df5]' : 'text-[#665c4e]'
              }`}
            >
              {readout.percent}%
            </span>
          </div>

          {/* Hairline archival ink progress rule mirroring live reading completion */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-[#4f6df5] will-change-transform"
            style={{ scaleX: activeProgress }}
          />
        </div>
      </motion.aside>
    </>
  );
}
