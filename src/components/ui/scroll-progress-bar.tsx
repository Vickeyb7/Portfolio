import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

interface ScrollProgressBarProps {
  isDark: boolean;
}

const PROGRESS_STOPS = [0, 0.25, 0.52, 0.78, 1];

// Curated executive palette progression across Overview -> Case Studies -> Experience -> Capabilities -> Contact
const LIGHT_COLORS = ['#1d63ff', '#0284c7', '#4f46e5', '#d97706', '#059669'];
const DARK_COLORS = ['#3b82f6', '#38bdf8', '#818cf8', '#efbf68', '#34d399'];

const LIGHT_GLOWS = [
  '0 1px 8px rgba(29, 99, 255, 0.45)',
  '0 1px 8px rgba(2, 132, 199, 0.45)',
  '0 1px 8px rgba(79, 70, 229, 0.45)',
  '0 1px 8px rgba(217, 119, 6, 0.45)',
  '0 1px 8px rgba(5, 150, 105, 0.45)',
];

const DARK_GLOWS = [
  '0 1px 12px rgba(59, 130, 246, 0.65)',
  '0 1px 12px rgba(56, 189, 248, 0.65)',
  '0 1px 12px rgba(129, 140, 248, 0.65)',
  '0 1px 12px rgba(239, 191, 104, 0.65)',
  '0 1px 12px rgba(52, 211, 153, 0.65)',
];

export function ScrollProgressBar({ isDark }: ScrollProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

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

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-slate-900/[0.04] dark:bg-white/[0.05]"
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
  );
}
