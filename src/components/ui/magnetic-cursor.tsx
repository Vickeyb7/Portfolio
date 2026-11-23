import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface MagneticCursorProps {
  isDark: boolean;
}

type CursorVariant = 'default' | 'interactive' | 'card' | 'inspect' | 'input';

const INTERACTIVE_SELECTOR =
  'button, a, [role="tab"], [role="switch"], label[for], summary';
const CARD_SELECTOR =
  '[data-cursor="inspect"], [data-cursor="card"], article.surface-card-interactive';
const INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

export function MagneticCursor({ isDark }: MagneticCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isPressed, setIsPressed] = useState(false);

  const variantRef = useRef<CursorVariant>('default');
  const visibleRef = useRef(false);

  // Raw pointer coordinates for inner precision dot
  const dotRawX = useMotionValue(-100);
  const dotRawY = useMotionValue(-100);

  // Magnetic target coordinates for outer halo ring
  const ringRawX = useMotionValue(-100);
  const ringRawY = useMotionValue(-100);

  // Responsive springs (compositor-only transforms, zero layout thrash)
  const dotX = useSpring(dotRawX, { stiffness: 580, damping: 34, mass: 0.18 });
  const dotY = useSpring(dotRawY, { stiffness: 580, damping: 34, mass: 0.18 });

  const ringX = useSpring(ringRawX, { stiffness: 260, damping: 24, mass: 0.42 });
  const ringY = useSpring(ringRawY, { stiffness: 260, damping: 24, mass: 0.42 });

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const updateEnabled = () => setEnabled(mediaQuery.matches);
    updateEnabled();

    mediaQuery.addEventListener('change', updateEnabled);
    return () => mediaQuery.removeEventListener('change', updateEnabled);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const updateVariant = (next: CursorVariant) => {
      if (variantRef.current !== next) {
        variantRef.current = next;
        setVariant(next);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const x = e.clientX;
      const y = e.clientY;
      dotRawX.set(x);
      dotRawY.set(y);

      const target = e.target as HTMLElement | null;
      if (!target) {
        ringRawX.set(x);
        ringRawY.set(y);
        updateVariant('default');
        return;
      }

      // Check form inputs first so typing stays completely unobstructed
      if (target.closest(INPUT_SELECTOR)) {
        ringRawX.set(x);
        ringRawY.set(y);
        updateVariant('input');
        return;
      }

      // Check buttons, links, tabs, switches for subtle magnetic pull
      const interactiveEl = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        const isCompactControl = rect.width <= 300 && rect.height <= 96;

        if (isCompactControl) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Gentle 26% magnetic attraction toward control center, clamped to 12px max
          const pullX = Math.max(-12, Math.min(12, (centerX - x) * 0.26));
          const pullY = Math.max(-10, Math.min(10, (centerY - y) * 0.26));
          ringRawX.set(x + pullX);
          ringRawY.set(y + pullY);
        } else {
          ringRawX.set(x);
          ringRawY.set(y);
        }

        updateVariant('interactive');
        return;
      }

      // Check interactive cards (case studies & timeline cards)
      const cardEl = target.closest<HTMLElement>(CARD_SELECTOR);
      if (cardEl) {
        ringRawX.set(x);
        ringRawY.set(y);
        const mode = cardEl.getAttribute('data-cursor');
        updateVariant(mode === 'inspect' ? 'inspect' : 'card');
        return;
      }

      ringRawX.set(x);
      ringRawY.set(y);
      updateVariant('default');
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);
    const handlePointerLeave = () => {
      visibleRef.current = false;
      setVisible(false);
      setIsPressed(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
    };
  }, [enabled, dotRawX, dotRawY, ringRawX, ringRawY]);

  if (!enabled) return null;

  const ringConfig = (() => {
    switch (variant) {
      case 'interactive':
        return {
          scale: 1.08,
          borderColor: isDark
            ? 'rgba(56, 189, 248, 0.72)'
            : 'rgba(29, 99, 255, 0.65)',
          backgroundColor: isDark
            ? 'rgba(56, 189, 248, 0.14)'
            : 'rgba(29, 99, 255, 0.1)',
          opacity: 1,
        };
      case 'inspect':
        return {
          scale: 1.4,
          borderColor: isDark
            ? 'rgba(239, 191, 104, 0.72)'
            : 'rgba(29, 99, 255, 0.55)',
          backgroundColor: isDark
            ? 'rgba(239, 191, 104, 0.12)'
            : 'rgba(29, 99, 255, 0.08)',
          opacity: 1,
        };
      case 'card':
        return {
          scale: 1.22,
          borderColor: isDark
            ? 'rgba(181, 196, 255, 0.48)'
            : 'rgba(29, 99, 255, 0.42)',
          backgroundColor: isDark
            ? 'rgba(181, 196, 255, 0.07)'
            : 'rgba(29, 99, 255, 0.05)',
          opacity: 1,
        };
      case 'input':
        return {
          scale: 0.45,
          borderColor: isDark
            ? 'rgba(148, 163, 184, 0.3)'
            : 'rgba(100, 116, 139, 0.25)',
          backgroundColor: 'transparent',
          opacity: 0.35,
        };
      default:
        return {
          scale: 0.72,
          borderColor: isDark
            ? 'rgba(148, 163, 184, 0.44)'
            : 'rgba(15, 23, 42, 0.26)',
          backgroundColor: 'transparent',
          opacity: 0.9,
        };
    }
  })();

  const targetRingScale = isPressed ? ringConfig.scale * 0.84 : ringConfig.scale;

  const dotScale =
    !visible
      ? 0
      : isPressed
      ? 0.75
      : variant === 'inspect' || variant === 'input'
      ? 0
      : variant === 'interactive'
      ? 0.55
      : 1;

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {/* Magnetic outer halo ring (compositor-only transform & opacity) */}
      <motion.div
        className="fixed left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: targetRingScale,
          borderColor: ringConfig.borderColor,
          backgroundColor: ringConfig.backgroundColor,
          opacity: visible ? ringConfig.opacity : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.35,
        }}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: variant === 'inspect' && visible ? 1 : 0,
            scale: variant === 'inspect' && visible ? 0.85 : 0.3,
          }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className={isDark ? 'text-[#efbf68]' : 'text-[#1d4ed8]'}
        >
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </motion.span>
      </motion.div>

      {/* Precision inner core dot */}
      <motion.div
        className="fixed left-0 top-0 h-[5px] w-[5px] rounded-full will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isDark ? '#38bdf8' : '#1d63ff',
        }}
        animate={{
          opacity: visible && variant !== 'inspect' && variant !== 'input' ? 0.9 : 0,
          scale: dotScale,
        }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
