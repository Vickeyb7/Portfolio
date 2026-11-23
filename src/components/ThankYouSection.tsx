import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ResilientImage } from './ResilientImage';
import { EditorialSheet } from './ui/editorial-sheet';
import { ZigZagToSwooshUnderline } from './ui/pen-annotations';

gsap.registerPlugin(ScrollTrigger);

interface ThankYouSectionProps {
  prefilledTopic?: string | null;
  onClearPrefilledTopic?: () => void;
  onOpenResume: () => void;
  onJumpToCaseStudies: () => void;
  onBackToTop: () => void;
}

const CLOSING_PARAGRAPHS = [
  'Dear Reader,',
  'Thank you for spending a little time here.',
  "My product journey has been shaped by years of conversations with customers, understanding business challenges, and learning that sometimes the most interesting problems aren't the ones people explicitly talk about.",
  "Moving from technology sales to studying product management has changed the way I look at technology. I'm increasingly fascinated by the space between what people need, what businesses envision, and what we can actually build.",
  'I believe great products come from curiosity, thoughtful questions, a willingness to challenge assumptions, and the courage to turn ideas into something real.',
  "If you're building something interesting, exploring an ambitious idea, or simply enjoy conversations about products, technology and the problems worth solving, I'd love to connect.",
  'Until then, keep building things that matter.',
  'Warmly,',
];

export function ThankYouSection({
  prefilledTopic,
  onClearPrefilledTopic,
  onOpenResume,
  onJumpToCaseStudies,
  onBackToTop,
}: ThankYouSectionProps) {
  const [copied, setCopied] = useState(false);
  const avatarRingRef = useRef<SVGSVGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const signatureSvgRef = useRef<SVGSVGElement>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback copy for restricted preview contexts
      const textarea = document.createElement('textarea');
      textarea.value = PROFILE.email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  // Circled avatar double-loop ink draw + paragraph-by-paragraph letter & signature reveal
  useLayoutEffect(() => {
    const ringEl = avatarRingRef.current;
    const letterEl = letterRef.current;
    const sigEl = signatureSvgRef.current;
    if (!letterEl) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduce } = context.conditions ?? {};
        const ringPaths = ringEl
          ? Array.from(ringEl.querySelectorAll<SVGPathElement>('path'))
          : [];
        const paraNodes = Array.from(
          letterEl.querySelectorAll<HTMLElement>('[data-letter-para]')
        );
        const sigWrap = letterEl.querySelector<HTMLElement>('[data-letter-signature]');
        const sigPaths = sigEl
          ? Array.from(sigEl.querySelectorAll<SVGPathElement>('path'))
          : [];

        if (reduce) {
          ringPaths.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          gsap.set(paraNodes, { opacity: 1, y: 0, clipPath: 'none' });
          if (sigWrap) gsap.set(sigWrap, { opacity: 1, y: 0 });
          sigPaths.forEach((p) => {
            p.style.strokeDasharray = 'none';
            p.style.strokeDashoffset = '0';
          });
          return;
        }

        // Prepare avatar circle strokes
        ringPaths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len + 4,
            strokeDashoffset: len + 4,
          });
        });

        if (ringEl && ringPaths.length > 0) {
          gsap.to(ringPaths, {
            strokeDashoffset: 0,
            duration: 1.05,
            stagger: 0.16,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: ringEl,
              start: 'top 86%',
              once: true,
            },
          });
        }

        // Prepare paragraph-by-paragraph handwritten closing letter
        gsap.set(paraNodes, {
          opacity: 0,
          y: 12,
          clipPath: 'inset(0 100% 0 0)',
        });

        if (sigWrap) {
          gsap.set(sigWrap, { opacity: 0, y: 8 });
        }

        sigPaths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len + 2,
            strokeDashoffset: len + 2,
          });
        });

        const letterTl = gsap.timeline({
          scrollTrigger: {
            trigger: letterEl,
            start: 'top 80%',
            once: true,
          },
        });

        paraNodes.forEach((node, idx) => {
          const isShortLine =
            idx === 0 || idx === 1 || idx >= paraNodes.length - 2;
          const dur = isShortLine ? 0.42 : 0.7;
          letterTl.to(
            node,
            {
              opacity: 1,
              y: 0,
              clipPath: 'inset(0 0% 0 0)',
              duration: dur,
              ease: 'power2.out',
            },
            idx === 0 ? 0 : '>-0.22'
          );
        });

        if (sigWrap) {
          letterTl.to(
            sigWrap,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
            },
            '>-0.1'
          );
        }

        if (sigPaths.length > 0) {
          letterTl.to(
            sigPaths,
            {
              strokeDashoffset: 0,
              duration: 0.85,
              stagger: 0.12,
              ease: 'power2.inOut',
            },
            '<0.12'
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const links = [
    {
      label: 'LinkedIn',
      meta: '/in/shankarnarayanbhattacharjee',
      href: PROFILE.linkedin,
      external: true,
    },
    {
      label: 'Product Case Studies',
      meta: '4 Shipped PRDs',
      onClick: onJumpToCaseStudies,
    },
    {
      label: 'GitHub',
      meta: '@snb2990',
      href: PROFILE.github,
      external: true,
    },
    {
      label: 'One-Page Resume',
      meta: 'PDF · 2026',
      onClick: onOpenResume,
    },
  ];

  return (
    <section aria-label="Thank You and Contact">
      <EditorialSheet
        tone="paper"
        sheetNumber="07"
        sheetLabel="Thank You"
      >
        <div className="mx-auto max-w-[1160px] px-5 pt-10 pb-14 sm:px-8 md:pt-14 md:pb-20 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0">
            {/* Left Column: Circled Avatar, Serif Closing Title, Copyable Email, Hover-Underlined Links */}
            <div className="lg:col-span-5 lg:pr-12">
              {/* Hand-circled Avatar */}
              <div className="relative inline-block">
                <div className="h-[104px] w-[104px] sm:h-[116px] sm:w-[116px] overflow-hidden rounded-full border border-[#2a2319]/10 bg-[#ebe4d6]">
                  <ResilientImage
                    src={PROFILE.portraitUrl}
                    alt={`${PROFILE.name}, ${PROFILE.role}`}
                    fallbackTitle={PROFILE.name}
                    className="h-full w-full"
                    imgClassName="object-cover object-top"
                  />
                </div>
                {/* Organic hand-drawn double-loop periwinkle circle */}
                <svg
                  ref={avatarRingRef}
                  viewBox="0 0 140 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible text-[#4f6df5]"
                >
                  <path
                    d="M 74 11 C 109 12, 132 39, 130 74 C 128 109, 100 132, 66 130 C 31 128, 8 102, 11 67 C 14 32, 42 10, 77 12"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 62 15 C 97 10, 127 33, 127 68 C 127 103, 98 128, 63 127 C 30 126, 13 98, 15 65 C 17 34, 41 16, 69 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.72"
                  />
                </svg>
              </div>

              {/* Bold Editorial Serif Title */}
              <h2
                className="mt-8 font-serif text-[2.75rem] leading-[1.03] font-bold tracking-[-0.025em] text-[#141413] sm:text-[3.35rem]"
                style={{ textWrap: 'balance' }}
              >
                Thank you
                <br />
                for reading.
              </h2>

              <ZigZagToSwooshUnderline
                align="left"
                widthClassName="w-40 sm:w-48"
                className="mt-3"
              />

              {/* One-Click Copyable Email */}
              <div className="mt-10">
                <p className="text-xs font-medium text-[#70685c]">Get in touch</p>
                {prefilledTopic && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4f6df5]">
                    <span>
                      Discussing:{' '}
                      <strong className="font-semibold">{prefilledTopic}</strong>
                    </span>
                    <a
                      href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(
                        `Case Study Walkthrough: ${prefilledTopic}`
                      )}`}
                      className="underline underline-offset-2 hover:text-[#1d4ed8]"
                    >
                      Open in mail
                    </a>
                    {onClearPrefilledTopic && (
                      <button
                        type="button"
                        onClick={onClearPrefilledTopic}
                        className="text-[#787064] hover:text-[#141413] cursor-pointer"
                      >
                        · Dismiss
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Click to copy email address"
                    className="group relative inline-flex items-center font-serif text-[1.55rem] sm:text-[1.8rem] font-bold tracking-[-0.015em] text-[#141413] hover:text-[#4f6df5] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5] rounded"
                  >
                    <span>{PROFILE.email}</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-[#4f6df5] transition-transform duration-200 group-hover:scale-x-100"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#4f6df5] hover:bg-[#4f6df5]/[0.08] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? `${PROFILE.email} copied to clipboard.` : ''}
                </span>
              </div>

              {/* Hover-Underlined Editorial Links */}
              <nav
                aria-label="Closing links"
                className="mt-8 border-t border-[#2a2319]/12 pt-5"
              >
                <ul className="space-y-3.5">
                  {links.map((link) => {
                    const innerContent = (
                      <>
                        <span className="relative inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#18191f] group-hover:text-[#4f6df5] transition-colors">
                          <span>{link.label}</span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-[#4f6df5] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-[#4f6df5] transition-transform duration-200 group-hover:scale-x-100"
                          />
                        </span>
                        <span className="font-mono text-[11px] text-[#787064] group-hover:text-[#464037] transition-colors truncate max-w-[180px] sm:max-w-none">
                          {link.meta}
                        </span>
                      </>
                    );

                    return (
                      <li key={link.label}>
                        {link.href ? (
                          <a
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noreferrer' : undefined}
                            className="group flex min-h-[36px] items-center justify-between gap-4 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5] rounded"
                          >
                            {innerContent}
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={link.onClick}
                            className="group flex min-h-[36px] w-full items-center justify-between gap-4 py-1 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5] rounded"
                          >
                            {innerContent}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Right Column: Paragraph-by-Paragraph Handwritten Closing Letter & Signature */}
            <div className="flex flex-col justify-between lg:col-span-7 lg:border-l lg:border-[#2a2319]/12 lg:pl-12">
              <div ref={letterRef} className="space-y-4 sm:space-y-5">
                {CLOSING_PARAGRAPHS.map((paragraph, idx) => (
                  <p
                    key={idx}
                    data-letter-para
                    className="font-hand text-[1.35rem] sm:text-[1.54rem] leading-[1.46] font-medium tracking-[0.005em] text-[#171923]"
                  >
                    {paragraph}
                  </p>
                ))}

                {/* Handwritten Periwinkle-Cobalt Closing Signature */}
                <div data-letter-signature className="pt-1">
                  <div className="inline-block">
                    <span className="font-hand text-[2.05rem] sm:text-[2.45rem] leading-tight font-bold tracking-[-0.01em] text-[#4f6df5]">
                      {PROFILE.name}
                    </span>
                    <svg
                      ref={signatureSvgRef}
                      viewBox="0 0 260 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="mt-1 h-5 w-64 sm:w-80 overflow-visible text-[#4f6df5]"
                    >
                      <path
                        d="M 4 15 C 54 6, 138 5, 224 11 C 239 12, 249 10, 255 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 42 19 C 98 15, 152 15, 198 18"
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        opacity="0.72"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quiet Editorial Closing Bar matching reference layout */}
              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2319]/12 pt-5 text-xs text-[#6f675b]">
                <p>
                  {PROFILE.name} · {PROFILE.role} · Bengaluru
                </p>

                <button
                  type="button"
                  onClick={onBackToTop}
                  className="group relative inline-flex min-h-[36px] items-center gap-1.5 font-display text-xs font-semibold text-[#18191f] hover:text-[#4f6df5] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f6df5] rounded"
                >
                  <span>Back to cover</span>
                  <ArrowUp
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-[1.5px] origin-left scale-x-0 bg-[#4f6df5] transition-transform duration-200 group-hover:scale-x-100"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </EditorialSheet>
    </section>
  );
}
