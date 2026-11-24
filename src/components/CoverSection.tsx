import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface CoverSectionProps {
  isDark: boolean;
  onExploreBelow: () => void;
}

const TITLE_LETTERS = 'Portfolio'.split('');
const CENTER_INDEX = (TITLE_LETTERS.length - 1) / 2;

// Identical 4-cubic-segment topology (top -> right -> bottom -> left -> top)
// enables true organic SVG path morphing between star and heart.
const STAR_PATH =
  'M 12 2 C 13.4 8.2 15.8 10.6 22 12 C 15.8 13.4 13.4 15.8 12 22 C 10.6 15.8 8.2 13.4 2 12 C 8.2 10.6 10.6 8.2 12 2 Z';
const HEART_PATH =
  'M 12 6.4 C 14.6 2.3 21.2 3.1 21.2 8.7 C 21.2 13.8 16.2 17.5 12 21.2 C 7.8 17.5 2.8 13.8 2.8 8.7 C 2.8 3.1 9.4 2.3 12 6.4 Z';

interface TrailPoint {
  x: number;
  y: number;
  t: number;
  speed: number;
}

interface OrbitingCelestialProps {
  isHeart: boolean;
  isDark: boolean;
  reducedMotion: boolean;
}

function OrbitingCelestial({
  isHeart,
  isDark,
  reducedMotion,
}: OrbitingCelestialProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0.35);

  useAnimationFrame((_, delta) => {
    const node = orbRef.current;
    if (!node) return;

    if (!reducedMotion) {
      // Smooth continuous elliptical orbit (~6.4s per revolution)
      angleRef.current += (delta / 1000) * 0.98;
    }

    const theta = angleRef.current;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // Horizontal & vertical orbit radii in em units relative to the final "o"
    const rx = 0.62;
    const ry = 0.24;
    const tilt = -0.18;

    const xEm = cos * rx;
    const yEm = sin * ry + cos * tilt;
    const z = sin; // > 0 in front of the "o", <= 0 behind the "o"

    const inFront = z > 0;
    const depthScale = inFront ? 0.94 + z * 0.24 : 0.94 + z * 0.22;
    // Noticeably dims as it swings behind the letter strokes
    const depthOpacity = inFront ? 0.88 + z * 0.12 : 0.26 + (1 + z) * 0.34;
    const blurPx = inFront ? 0 : Math.abs(z) * 0.7;

    node.style.zIndex = inFront ? '20' : '0';
    node.style.opacity = depthOpacity.toFixed(3);
    node.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : 'none';
    node.style.transform = `translate3d(calc(-50% + ${xEm.toFixed(
      4
    )}em), calc(-50% + ${yEm.toFixed(4)}em), 0) scale(${depthScale.toFixed(3)})`;
  });

  const fillColor = isHeart
    ? isDark
      ? '#fb7185'
      : '#e11d48'
    : isDark
    ? '#efbf68'
    : '#d97706';

  const glowShadow = isHeart
    ? isDark
      ? 'drop-shadow(0 0 10px rgba(251, 113, 133, 0.75))'
      : 'drop-shadow(0 0 8px rgba(225, 29, 72, 0.45))'
    : isDark
    ? 'drop-shadow(0 0 10px rgba(239, 191, 104, 0.7))'
    : 'drop-shadow(0 0 6px rgba(217, 119, 6, 0.4))';

  return (
    <div
      ref={orbRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[56%] will-change-transform"
      style={{
        zIndex: 20,
        transform: 'translate3d(calc(-50% + 0.58em), calc(-50% - 0.1em), 0)',
      }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-[0.23em] w-[0.23em] min-h-[18px] min-w-[18px] overflow-visible"
        animate={{
          scale: isHeart ? 1.18 : 1,
          rotate: isHeart ? 0 : 12,
        }}
        transition={{
          type: 'spring',
          stiffness: 360,
          damping: 16,
        }}
        style={{ filter: glowShadow }}
      >
        <motion.path
          initial={{ d: STAR_PATH, fill: fillColor }}
          animate={{
            d: isHeart ? HEART_PATH : STAR_PATH,
            fill: fillColor,
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.svg>
    </div>
  );
}

interface DriftLetterProps {
  char: string;
  index: number;
  isFinalO: boolean;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
  signatureHovered: boolean;
  isDark: boolean;
}

function DriftLetter({
  char,
  index,
  isFinalO,
  scrollYProgress,
  reducedMotion,
  signatureHovered,
  isDark,
}: DriftLetterProps) {
  const offsetFromCenter = index - CENTER_INDEX;
  const spreadX = offsetFromCenter * 38;
  const spreadY = -26 - Math.abs(offsetFromCenter) * 14;
  const spreadRotate = offsetFromCenter * 2.6;

  const x = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, spreadX]);
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, spreadY]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, spreadRotate]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.25, 0.95],
    reducedMotion ? [1, 1] : [1, 0.14]
  );

  return (
    <motion.span
      style={{ x, y, rotate, opacity }}
      className={`relative inline-block will-change-transform ${
        isFinalO ? 'isolate' : ''
      }`}
    >
      <motion.span
        initial={reducedMotion ? false : { y: '68%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          duration: 0.88,
          delay: 0.08 + index * 0.048,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 inline-block"
      >
        {char}
      </motion.span>

      {isFinalO && (
        <OrbitingCelestial
          isHeart={signatureHovered}
          isDark={isDark}
          reducedMotion={reducedMotion}
        />
      )}
    </motion.span>
  );
}

export function CoverSection({ isDark, onExploreBelow }: CoverSectionProps) {
  const prefersReducedMotion = !!useReducedMotion();
  const coverRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number | null>(null);
  const signatureHoveredRef = useRef(false);
  const isDarkRef = useRef(isDark);

  const [signatureHovered, setSignatureHovered] = useState(false);

  useEffect(() => {
    signatureHoveredRef.current = signatureHovered;
  }, [signatureHovered]);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ['start start', 'end start'],
  });

  // Drift handwritten signature and circled role gently as user scrolls down
  const metaY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -48]
  );
  const metaOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.75],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );

  // Sync canvas dimensions to cover container with HiDPI sharpness
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = coverRef.current;
    if (!canvas || !section || prefersReducedMotion) return;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    return () => ro.disconnect();
  }, [prefersReducedMotion]);

  // Fading calligraphic pointer ink trail loop (runs only while trail points exist)
  const renderInkTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = null;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      rafRef.current = null;
      return;
    }

    const now = performance.now();
    const maxAge = 680;
    const points = trailRef.current.filter((p) => now - p.t < maxAge);
    trailRef.current = points;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    if (points.length >= 2) {
      const dark = isDarkRef.current;
      const heartMode = signatureHoveredRef.current;
      const rgb = heartMode
        ? dark
          ? '251, 113, 133'
          : '225, 29, 72'
        : dark
        ? '123, 208, 255'
        : '29, 99, 255';

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        // Skip large jumps (e.g. re-entering canvas from another edge)
        if (dist > 140) continue;

        const life = Math.max(0, 1 - (now - p1.t) / maxAge);
        const easedAlpha = life * life * (dark ? 0.55 : 0.42);
        // Velocity-sensitive calligraphy stroke width
        const baseWidth = Math.max(1.1, Math.min(3.3, 3.3 - p1.speed * 0.045));
        const width = baseWidth * (0.35 + life * 0.65);

        const prev = i > 1 ? points[i - 2] : p0;
        const midX0 = (prev.x + p0.x) / 2;
        const midY0 = (prev.y + p0.y) / 2;
        const midX1 = (p0.x + p1.x) / 2;
        const midY1 = (p0.y + p1.y) / 2;

        ctx.beginPath();
        ctx.moveTo(midX0, midY0);
        ctx.quadraticCurveTo(p0.x, p0.y, midX1, midY1);
        ctx.strokeStyle = `rgba(${rgb}, ${easedAlpha.toFixed(3)})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }
    }

    if (points.length > 0) {
      rafRef.current = requestAnimationFrame(renderInkTrail);
    } else {
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
      return;
    }

    const section = coverRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const list = trailRef.current;
    const last = list[list.length - 1];
    const dist = last ? Math.hypot(x - last.x, y - last.y) : 0;
    if (last && dist < 2.5) return;

    const dt = last ? Math.max(1, now - last.t) : 16;
    const speed = (dist / dt) * 16;

    list.push({ x, y, t: now, speed });
    if (list.length > 72) {
      list.shift();
    }

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(renderInkTrail);
    }
  };

  return (
    <section
      ref={coverRef}
      aria-label="Editorial Portfolio Cover"
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[calc(100svh-72px)] flex-col justify-between overflow-hidden px-5 pb-10 pt-8 sm:px-8 md:px-12"
    >
      {/* Subtle architectural paper grain & soft radial vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_45%,rgba(29,99,255,0.045)_0%,transparent_72%)] dark:bg-[radial-gradient(65%_55%_at_50%_45%,rgba(56,189,248,0.065)_0%,transparent_72%)]"
      />

      {/* Fading pointer ink trail canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* Top quiet editorial folio line */}
      <motion.div
        style={{ opacity: metaOpacity }}
        className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-between text-xs font-medium text-slate-500 dark:text-[#8d90a2]"
      >
        <span className="font-mono tracking-[0.02em]">
          Selected Works &amp; Interactive CV
        </span>
        <span className="hidden sm:inline font-mono tabular-nums">
          {PROFILE.location ? `${PROFILE.location} · 2026` : 'Edition · 2026'}
        </span>
      </motion.div>

      {/* Center Monumental Editorial Cover Lockup */}
      <div className="relative z-20 mx-auto my-auto flex w-full max-w-[1160px] flex-col items-center py-10 sm:py-14">
        {/* Self-Writing Handwritten Signature + Curly Arrow into the Title */}
        <motion.div
          style={{ y: metaY, opacity: metaOpacity }}
          className="relative mb-1 self-start sm:ml-[6%] md:ml-[10%] lg:ml-[12%]"
        >
          <button
            type="button"
            onMouseEnter={() => setSignatureHovered(true)}
            onMouseLeave={() => setSignatureHovered(false)}
            onFocus={() => setSignatureHovered(true)}
            onBlur={() => setSignatureHovered(false)}
            onClick={onExploreBelow}
            aria-label="Shankar Narayan Bhattacharjee handwritten signature — hover to morph the orbiting star into a heart"
            className="group relative flex flex-col items-start text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] rounded-xl px-2 py-1"
          >
            {/* Self-writing calligraphic signature ("Shankar") + curly arrow pointing into "Portfolio" */}
            <svg
              viewBox="0 0 310 112"
              fill="none"
              className="h-[74px] w-[205px] sm:h-[92px] sm:w-[255px] md:h-[104px] md:w-[288px] overflow-visible"
              aria-hidden="true"
            >
              {/* Cursive "S" flourish */}
              <motion.path
                d="M 46 21 C 32 14, 15 21, 18 34 C 21 47, 50 43, 47 59 C 44 74, 21 76, 13 65"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${
                  signatureHovered
                    ? 'text-[#e11d48] dark:text-[#fb7185]'
                    : 'text-[#1d4ed8] dark:text-[#7bd0ff]'
                }`}
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Continuous handwritten "hankar" strokes */}
              <motion.path
                d="M 55 15 C 53 34, 51 54, 49 67 C 53 53, 62 43, 67 47 C 71 50, 66 64, 72 65 C 78 66, 84 48, 92 48 C 98 48, 96 63, 89 65 C 83 66, 81 55, 88 49 C 95 44, 98 56, 102 64 C 107 52, 114 45, 118 49 C 121 53, 118 64, 124 64 C 129 64, 135 52, 139 18 C 137 36, 134 54, 133 65 M 136 53 C 143 46, 151 43, 154 46 C 148 51, 141 55, 139 56 C 145 58, 150 65, 157 65 C 165 65, 171 48, 179 48 C 185 48, 182 63, 175 65 C 169 66, 168 55, 175 49 C 181 45, 185 57, 189 64 C 195 55, 200 45, 207 46 C 212 47, 211 58, 222 57"
                stroke="currentColor"
                strokeWidth="2.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${
                  signatureHovered
                    ? 'text-[#e11d48] dark:text-[#fb7185]'
                    : 'text-[#1d4ed8] dark:text-[#7bd0ff]'
                }`}
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Subtle pen underscore flourish */}
              <motion.path
                d="M 28 77 C 74 71, 142 68, 205 70"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-colors duration-300 ${
                  signatureHovered
                    ? 'text-[#e11d48]/70 dark:text-[#fb7185]/70'
                    : 'text-[#1d4ed8]/55 dark:text-[#7bd0ff]/55'
                }`}
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 1.72, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Curly hand-drawn loop-de-loop arrow sweeping from signature into the serif title */}
              <motion.path
                d="M 225 57 C 254 55, 276 64, 270 79 C 264 92, 244 88, 246 76 C 248 64, 272 68, 281 84 C 287 94, 287 101, 285 107"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${
                  signatureHovered
                    ? 'text-[#e11d48] dark:text-[#fb7185]'
                    : 'text-slate-600 dark:text-[#b5c4ff]'
                }`}
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.72, delay: 1.92, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Arrowhead ticks pointing directly down into "Portfolio" */}
              <motion.path
                d="M 277 99 L 285 108 L 293 99"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${
                  signatureHovered
                    ? 'text-[#e11d48] dark:text-[#fb7185]'
                    : 'text-slate-600 dark:text-[#b5c4ff]'
                }`}
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.28, delay: 2.52, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </button>
        </motion.div>

        {/* Monumental Rising Serif Title ("Portfolio") with scroll-drift letters & orbiting star/heart on final "o" */}
        <h1
          aria-label="Portfolio"
          className="font-serif select-none text-center font-semibold leading-[0.88] tracking-[-0.03em] text-slate-950 dark:text-[#f8fafc] text-[clamp(4.25rem,16vw,13.5rem)]"
        >
          <span className="inline-flex items-baseline justify-center">
            {TITLE_LETTERS.map((char, idx) => (
              <DriftLetter
                key={`${char}-${idx}`}
                char={char}
                index={idx}
                isFinalO={idx === TITLE_LETTERS.length - 1}
                scrollYProgress={scrollYProgress}
                reducedMotion={prefersReducedMotion}
                signatureHovered={signatureHovered}
                isDark={isDark}
              />
            ))}
          </span>
        </h1>

        {/* Circled Role + Editorial Byline below the serif baseline */}
        <motion.div
          style={{ y: metaY, opacity: metaOpacity }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8"
        >
          {/* Hand-drawn circled role */}
          <div className="relative inline-flex items-center justify-center px-7 py-3">
            <svg
              viewBox="0 0 280 76"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 48 13 C 110 3, 218 5, 256 22 C 279 33, 276 55, 236 65 C 180 77, 68 74, 24 58 C -2 48, 3 24, 34 15 C 62 7, 118 6, 152 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-[#a16207] dark:text-[#efbf68]"
                initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.95, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <span className="relative font-display text-sm sm:text-base font-semibold tracking-[0.01em] text-slate-900 dark:text-[#f1f5f9] whitespace-nowrap">
              {PROFILE.role}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="hidden sm:inline-block h-4 w-px bg-slate-300 dark:bg-white/15"
          />

          <p className="text-center sm:text-left text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-[#94a3b8]">
            <span className="font-display font-semibold text-slate-900 dark:text-[#e1e2ec]">
              {PROFILE.name}
            </span>
            <span aria-hidden="true" className="mx-2 text-slate-300 dark:text-white/25">
              ·
            </span>
            <span>BrowserStack Enterprise GTM → NextLeap Top 1% PM</span>
          </p>
        </motion.div>
      </div>

      {/* Bottom Scroll Affordance */}
      <motion.div
        style={{ opacity: metaOpacity }}
        className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-between"
      >
        <p className="hidden md:block text-xs text-slate-500 dark:text-[#8d90a2]">
          Hover the signature or draw across the canvas
        </p>
        <button
          type="button"
          onClick={onExploreBelow}
          className="mx-auto md:mx-0 group inline-flex items-center gap-2 font-display text-xs font-semibold text-slate-700 hover:text-[#1d4ed8] dark:text-[#c3c5d8] dark:hover:text-[#7bd0ff] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d63ff] rounded px-2 py-1"
        >
          <span>Enter Portfolio</span>
          <ArrowDown
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </motion.div>
    </section>
  );
}
