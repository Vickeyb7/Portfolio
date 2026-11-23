import { createContext, ReactNode, useContext } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SectionId } from '../../data/portfolioData';

export type InkWashTone = 'paper' | 'night';
export type InkWashVariant = 'cobalt' | 'champagne' | 'indigo';

interface SectionHighlightContextValue {
  sectionId: SectionId;
  isActive: boolean;
  variant: InkWashVariant;
}

const SectionHighlightContext = createContext<SectionHighlightContextValue | null>(
  null
);

export function useSectionHighlight() {
  return useContext(SectionHighlightContext);
}

interface InkWashOverlayProps {
  isActive: boolean;
  tone: InkWashTone;
  variant?: InkWashVariant;
  className?: string;
}

const WASH_PALETTES: Record<
  InkWashTone,
  Record<
    InkWashVariant,
    {
      primary: string;
      secondary: string;
      edgeTint: string;
      blend: 'mix-blend-multiply' | 'mix-blend-screen';
    }
  >
> = {
  paper: {
    cobalt: {
      primary:
        'radial-gradient(58% 48% at 18% 20%, rgba(79, 109, 245, 0.095) 0%, rgba(79, 109, 245, 0.032) 48%, rgba(79, 109, 245, 0) 76%)',
      secondary:
        'radial-gradient(52% 44% at 84% 78%, rgba(99, 102, 241, 0.075) 0%, rgba(196, 134, 42, 0.035) 52%, rgba(79, 109, 245, 0) 78%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(79, 109, 245, 0.22) 50%, transparent 100%)',
      blend: 'mix-blend-multiply',
    },
    champagne: {
      primary:
        'radial-gradient(56% 48% at 20% 22%, rgba(180, 126, 48, 0.09) 0%, rgba(180, 126, 48, 0.028) 48%, rgba(180, 126, 48, 0) 76%)',
      secondary:
        'radial-gradient(50% 46% at 82% 76%, rgba(79, 109, 245, 0.08) 0%, rgba(79, 109, 245, 0.025) 50%, rgba(79, 109, 245, 0) 78%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(180, 126, 48, 0.24) 50%, transparent 100%)',
      blend: 'mix-blend-multiply',
    },
    indigo: {
      primary:
        'radial-gradient(60% 48% at 78% 18%, rgba(67, 97, 238, 0.09) 0%, rgba(67, 97, 238, 0.03) 48%, rgba(67, 97, 238, 0) 76%)',
      secondary:
        'radial-gradient(50% 46% at 16% 80%, rgba(79, 109, 245, 0.075) 0%, rgba(79, 109, 245, 0) 74%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(67, 97, 238, 0.22) 50%, transparent 100%)',
      blend: 'mix-blend-multiply',
    },
  },
  night: {
    cobalt: {
      primary:
        'radial-gradient(58% 48% at 18% 20%, rgba(138, 162, 255, 0.16) 0%, rgba(79, 109, 245, 0.065) 48%, rgba(20, 23, 32, 0) 76%)',
      secondary:
        'radial-gradient(52% 46% at 84% 78%, rgba(99, 132, 255, 0.12) 0%, rgba(20, 23, 32, 0) 74%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(138, 162, 255, 0.34) 50%, transparent 100%)',
      blend: 'mix-blend-screen',
    },
    champagne: {
      primary:
        'radial-gradient(56% 48% at 22% 20%, rgba(223, 177, 91, 0.12) 0%, rgba(138, 162, 255, 0.05) 52%, rgba(20, 23, 32, 0) 78%)',
      secondary:
        'radial-gradient(50% 46% at 82% 76%, rgba(138, 162, 255, 0.12) 0%, rgba(20, 23, 32, 0) 76%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(223, 177, 91, 0.3) 50%, transparent 100%)',
      blend: 'mix-blend-screen',
    },
    indigo: {
      primary:
        'radial-gradient(58% 48% at 80% 22%, rgba(129, 140, 248, 0.15) 0%, rgba(79, 109, 245, 0.06) 48%, rgba(20, 23, 32, 0) 76%)',
      secondary:
        'radial-gradient(52% 46% at 16% 78%, rgba(138, 162, 255, 0.11) 0%, rgba(20, 23, 32, 0) 76%)',
      edgeTint:
        'linear-gradient(90deg, transparent 0%, rgba(138, 162, 255, 0.32) 50%, transparent 100%)',
      blend: 'mix-blend-screen',
    },
  },
};

/**
 * Subtle, GPU-composited watercolor ink-wash layer that blooms gently behind
 * active section content and recedes when focus moves to another section.
 */
export function SectionInkWashLayer({
  isActive,
  tone,
  variant = 'cobalt',
  className = '',
}: InkWashOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const palette = WASH_PALETTES[tone][variant];

  return (
    <div
      aria-hidden="true"
      data-ink-wash-active={isActive ? 'true' : 'false'}
      className={`no-print pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Primary organic ink-wash bloom */}
      <motion.div
        initial={false}
        animate={
          isActive
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }
            : {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.94,
                x: prefersReducedMotion ? 0 : -14,
                y: prefersReducedMotion ? 0 : 10,
              }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ backgroundImage: palette.primary }}
        className={`absolute -inset-x-10 -inset-y-8 will-change-transform ${palette.blend}`}
      />

      {/* Secondary counter-balanced watercolor wash */}
      <motion.div
        initial={false}
        animate={
          isActive
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }
            : {
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
                x: prefersReducedMotion ? 0 : 16,
                y: prefersReducedMotion ? 0 : -10,
              }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.8,
          delay: prefersReducedMotion ? 0 : 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ backgroundImage: palette.secondary }}
        className={`absolute -inset-x-10 -inset-y-8 will-change-transform ${palette.blend}`}
      />

      {/* Whisper-fine calligraphic brush veil SVG for editorial ink texture */}
      <motion.svg
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        initial={false}
        animate={
          isActive
            ? { opacity: tone === 'paper' ? 0.042 : 0.065, scale: 1 }
            : { opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }
        }
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.72,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0 h-full w-full will-change-transform"
      >
        <path
          d="M -40 120 C 210 20, 440 210, 740 110 C 960 35, 1110 150, 1250 85 L 1250 245 C 1020 320, 780 190, 510 280 C 260 365, 95 230, -40 290 Z"
          fill={tone === 'paper' ? '#4f6df5' : '#8aa2ff'}
        />
      </motion.svg>

      {/* Subtle top focal hairline that illuminates when the section is active */}
      <motion.div
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          scaleX: isActive ? 1 : prefersReducedMotion ? 1 : 0.65,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.01 : 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ backgroundImage: palette.edgeTint }}
        className="absolute inset-x-0 top-0 h-[1.5px] origin-center will-change-transform"
      />
    </div>
  );
}

export interface SectionHighlighterProps {
  sectionId: SectionId;
  isActive: boolean;
  tone?: InkWashTone;
  variant?: InkWashVariant;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps a portfolio section and coordinates subtle, animated ink-wash overlays
 * both on the outer canvas gutter and inside nested EditorialSheet surfaces
 * whenever the section becomes active in the viewport.
 */
export function SectionHighlighter({
  sectionId,
  isActive,
  tone = 'paper',
  variant = 'cobalt',
  className = '',
  children,
}: SectionHighlighterProps) {
  return (
    <SectionHighlightContext.Provider value={{ sectionId, isActive, variant }}>
      <div
        data-section-highlighter={sectionId}
        data-active-section={isActive ? 'true' : 'false'}
        className={`relative ${className}`}
      >
        {/* Outer canvas ink-wash halo behind the section wrapper */}
        <SectionInkWashLayer
          isActive={isActive}
          tone={tone}
          variant={variant}
          className="z-0"
        />

        {/* Section content above the ink wash */}
        <div className="relative z-[1]">{children}</div>
      </div>
    </SectionHighlightContext.Provider>
  );
}
