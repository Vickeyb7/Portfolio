import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'motion/react';

const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface EditorialStaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

/**
 * Viewport-triggered Framer Motion stagger container tuned for editorial sheets.
 * Uses amount: "some" plus a passive viewport fallback so tall grids or
 * lazy-loaded sections never remain hidden on shorter viewports.
 */
export function EditorialStaggerGroup({
  children,
  className = '',
  staggerDelay = 0.075,
  delayChildren = 0.05,
}: EditorialStaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);
  const inView = useInView(groupRef, { once: true, amount: 'some' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setVisible(true);
    }
  }, [inView]);

  useEffect(() => {
    if (visible || prefersReducedMotion) return;
    const checkViewport = () => {
      const el = groupRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
        setVisible(true);
      }
    };
    checkViewport();
    window.addEventListener('scroll', checkViewport, { passive: true });
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkViewport);
      window.removeEventListener('resize', checkViewport);
    };
  }, [visible, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      ref={groupRef}
      variants={containerVariants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface EditorialStaggerItemProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
}

/**
 * Child item orchestrated by EditorialStaggerGroup using compositor-only
 * opacity and translateY transitions.
 */
export function EditorialStaggerItem({
  children,
  className = '',
  yOffset = 18,
}: EditorialStaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.52,
        ease: EDITORIAL_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
