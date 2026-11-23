import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Mail,
  Send,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ContainerScroll } from './ui/container-scroll-animation';

interface ContactSectionProps {
  prefilledTopic: string | null;
  onClearPrefilledTopic: () => void;
  onOpenResume: () => void;
}

export function ContactSection({
  prefilledTopic,
  onClearPrefilledTopic,
  onOpenResume,
}: ContactSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('PM / APM Role Opportunity');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefilledTopic) {
      setTopic(`Case Study Walkthrough: ${prefilledTopic}`);
      setMessage(
        `Hi ${PROFILE.firstName}, I reviewed your "${prefilledTopic}" case study and would love to discuss your product approach and potential opportunities.`
      );
      setSubmitted(false);
    }
  }, [prefilledTopic]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please enter your name, work email, and a short note.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please provide a valid email address so I can reply directly.');
      return;
    }

    setSubmitted(true);
    onClearPrefilledTopic();
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setTopic('PM / APM Role Opportunity');
    setMessage('');
    setErrorMessage('');
  };

  return (
    <section
      aria-label="Contact"
      className="overflow-hidden border-t border-slate-200/80 dark:border-white/[0.06]"
    >
      <ContainerScroll
        variant="section"
        titleComponent={
          <div className="space-y-3">
            <p className="font-display text-xs font-semibold tracking-[0.04em] text-[#0369a1] dark:text-[#38bdf8]">
              Direct Inquiry
            </p>
            <h2
              className="font-display text-[1.9rem] leading-[2.35rem] font-extrabold tracking-[-0.025em] text-slate-950 dark:text-[#f1f5f9] md:text-[2.75rem] md:leading-[3.2rem]"
              style={{ textWrap: 'balance' }}
            >
              Let&rsquo;s Talk Product, Growth &amp; Enterprise Scale.
            </h2>
          </div>
        }
      >
        <div className="p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: Executive Direct Channels */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-base leading-[1.65] text-slate-600 dark:text-[#94a3b8]">
                  Currently exploring Product Manager and Associate Product Manager roles
                  across developer platforms, B2B SaaS, and FinTech infrastructure. Happy
                  to walk through any PRD, telemetry model, or experiment live.
                </p>

                {/* Direct Email Copy Tile */}
                <div className="mt-7 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#10131a] p-5 transition-colors duration-200">
                  <p className="font-display text-xs font-semibold text-slate-500 dark:text-[#94a3b8]">
                    Direct Email
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="inline-flex items-center gap-2 font-display text-base font-semibold text-slate-950 dark:text-[#f1f5f9] hover:text-[#1d4ed8] dark:hover:text-[#b5c4ff] transition-colors truncate"
                    >
                      <Mail
                        className="h-4 w-4 shrink-0 text-[#1d63ff] dark:text-[#38bdf8]"
                        aria-hidden="true"
                      />
                      <span className="truncate">{PROFILE.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/[0.12] bg-white dark:bg-transparent px-3 py-1.5 font-display text-xs font-semibold text-slate-800 dark:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check
                            className="h-3.5 w-3.5 text-[#1d63ff] dark:text-[#38bdf8]"
                            aria-hidden="true"
                          />
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
                </div>

                {/* Clean external & resume links */}
                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-display font-semibold text-slate-700 hover:text-slate-950 dark:text-[#c3c5d8] dark:hover:text-[#f1f5f9] transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-slate-400 dark:text-[#8d90a2]"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-display font-semibold text-slate-700 hover:text-slate-950 dark:text-[#c3c5d8] dark:hover:text-[#f1f5f9] transition-colors"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-slate-400 dark:text-[#8d90a2]"
                      aria-hidden="true"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={onOpenResume}
                    className="inline-flex items-center gap-1.5 font-display font-semibold text-[#1d4ed8] hover:text-[#1553e6] dark:text-[#b5c4ff] dark:hover:text-[#f1f5f9] transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span>Open Printable CV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Structured Executive Note Form */}
            <div className="lg:col-span-7">
              <div className="surface-card glow-cobalt-corner rounded-2xl p-6 sm:p-7">
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1d63ff]/25 dark:border-[#1d63ff]/40 bg-[#1d63ff]/10 dark:bg-[#1d63ff]/15 text-[#1d4ed8] dark:text-[#b5c4ff]">
                      <Check className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-slate-950 dark:text-[#f1f5f9]">
                      Note Prepared for {PROFILE.name}
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-[1.6] text-slate-600 dark:text-[#94a3b8]">
                      Thank you,{' '}
                      <span className="font-medium text-slate-900 dark:text-[#e1e2ec]">
                        {name}
                      </span>
                      . Your brief regarding{' '}
                      <span className="font-medium text-slate-900 dark:text-[#e1e2ec]">
                        {topic}
                      </span>{' '}
                      is ready—you can also open it directly in your email client below.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(
                          topic
                        )}&body=${encodeURIComponent(
                          `From: ${name} (${email})\n\n${message}`
                        )}`}
                        className="btn-primary-electric inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-display text-sm font-semibold whitespace-nowrap shrink-0"
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        <span>Send via Email Client</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center rounded-lg border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-transparent px-5 py-2.5 font-display text-sm font-semibold text-slate-800 dark:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-white/[0.06] cursor-pointer"
                      >
                        Write Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-[#f1f5f9]">
                        Request a Case Walkthrough or Coffee Chat
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-[#94a3b8]">
                        Typical response within 24 hours · Bengaluru (IST) / Global Remote
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block font-display text-xs font-semibold text-slate-700 dark:text-[#c3c5d8]"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Priya Nair"
                          className="recessed-input mt-1.5 w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-950 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-[#8d90a2]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block font-display text-xs font-semibold text-slate-700 dark:text-[#c3c5d8]"
                        >
                          Work Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="priya@company.com"
                          className="recessed-input mt-1.5 w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-950 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-[#8d90a2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block font-display text-xs font-semibold text-slate-700 dark:text-[#c3c5d8]"
                      >
                        Topic
                      </label>
                      <input
                        id="contact-topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="recessed-input mt-1.5 w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-950 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-[#8d90a2]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block font-display text-xs font-semibold text-slate-700 dark:text-[#c3c5d8]"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share details about the role, team, or product problem you'd like to discuss..."
                        className="recessed-input mt-1.5 w-full resize-y rounded-lg px-3.5 py-2.5 text-sm text-slate-950 dark:text-[#f1f5f9] placeholder:text-slate-400 dark:placeholder:text-[#8d90a2]"
                      />
                    </div>

                    {errorMessage && (
                      <p
                        role="alert"
                        className="text-xs font-medium text-red-700 dark:text-[#ffb4ab]"
                      >
                        {errorMessage}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                      <span className="text-xs text-slate-500 dark:text-[#8d90a2]">
                        Direct to {PROFILE.email}
                      </span>
                      <button
                        type="submit"
                        className="btn-primary-electric inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-display text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>Send Note</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
