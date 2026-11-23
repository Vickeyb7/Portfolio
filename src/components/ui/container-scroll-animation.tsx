import React, { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
  MotionValue,
} from "motion/react";

export type ContainerScrollVariant = "fixed" | "section" | "hero";

export const ContainerScroll = ({
  titleComponent,
  children,
  variant = "fixed",
  className = "",
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
  variant?: ContainerScrollVariant;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scrollOffset: NonNullable<Parameters<typeof useScroll>[0]>["offset"] =
    variant === "hero"
      ? ["start start", "end start"]
      : variant === "section"
      ? ["start end", "start 24%"]
      : ["start end", "center center"];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollOffset,
  });

  const rotateRange: [number, number] = prefersReducedMotion
    ? [0, 0]
    : variant === "hero"
    ? [0, isMobile ? -8 : -14]
    : variant === "section"
    ? [isMobile ? 12 : 18, 0]
    : [isMobile ? 14 : 20, 0];

  const scaleRange: [number, number] = prefersReducedMotion
    ? [1, 1]
    : variant === "hero"
    ? [1, isMobile ? 0.97 : 0.95]
    : variant === "section"
    ? [isMobile ? 0.96 : 0.94, 1]
    : isMobile
    ? [0.88, 1]
    : [1.05, 1];

  const translateRange: [number, number] = prefersReducedMotion
    ? [0, 0]
    : variant === "hero"
    ? [0, -28]
    : variant === "section"
    ? [28, 0]
    : [0, -48];

  const opacityRange: [number, number] = prefersReducedMotion
    ? [1, 1]
    : variant === "hero"
    ? [1, 0.88]
    : [0.82, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], translateRange);
  const opacity = useTransform(scrollYProgress, [0, 1], opacityRange);

  return (
    <div
      className={`relative flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 ${
        variant === "hero"
          ? "pt-6 pb-14 md:pt-10 md:pb-20"
          : variant === "section"
          ? "py-14 md:py-20 lg:py-24"
          : "py-12 md:py-20"
      } ${className}`}
      ref={containerRef}
    >
      <div
        className="relative w-full max-w-[1280px]"
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% 45%",
        }}
      >
        {titleComponent && (
          <Header translate={translate} titleComponent={titleComponent} />
        )}
        <Card
          rotate={rotate}
          translate={translate}
          scale={scale}
          opacity={opacity}
          variant={variant}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-4xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  opacity,
  variant = "fixed",
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  opacity?: MotionValue<number>;
  variant?: ContainerScrollVariant;
  children: React.ReactNode;
}) => {
  const isFixed = variant === "fixed";
  const isHero = variant === "hero";

  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        opacity,
        transformOrigin: isHero ? "50% 100%" : "50% 0%",
        willChange: "transform",
        boxShadow:
          "0 0 #00000033, 0 9px 20px rgba(15, 23, 42, 0.14), 0 32px 36px rgba(15, 23, 42, 0.11), 0 72px 48px rgba(15, 23, 42, 0.06)",
      }}
      className={`mx-auto w-full rounded-[28px] border-[3px] sm:border-[4px] border-slate-300/90 dark:border-[#32353d] bg-slate-200/85 dark:bg-[#191b23] p-2 sm:p-3.5 md:p-4 ${
        isFixed
          ? "mt-6 md:mt-8 h-[32rem] sm:h-[36rem] md:h-[42rem] max-w-5xl"
          : isHero
          ? "max-w-[1280px]"
          : "mt-8 md:mt-10 max-w-[1280px]"
      }`}
    >
      <div
        className={`w-full overflow-hidden rounded-2xl bg-white dark:bg-[#0b0e15] border border-slate-200/90 dark:border-white/[0.08] ${
          isFixed ? "h-full" : ""
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
};
