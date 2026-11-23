import { useEffect, useState } from 'react';
import { EyeOff } from 'lucide-react';
import { SectionId } from '../../data/portfolioData';

export interface ScrollSpyDebugLineProps {
  headerHeight: number;
  buffer: number;
  triggerY: number;
  activeSection: SectionId;
}

/**
 * Development-only visual debug overlay showing:
 *  - Exact sticky navbar bottom hairline (`y = headerHeight px`)
 *  - Vertical pixel ruler from viewport top (`0px`) → navbar bottom → `triggerY`
 *  - Full-width `triggerY` horizontal threshold line with live pixel Y-coordinate,
 *    document Y-coordinate, and responsive breakpoint readout.
 * Automatically renders nothing in production builds.
 */
function isDebugExplicitlyRequested(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (
    params.get('debug') === 'scrollspy' ||
    params.get('scrollspyDebug') === '1'
  ) {
    return true;
  }
  try {
    return window.localStorage.getItem('scrollspy-debug') === 'true';
  } catch {
    return false;
  }
}

export function ScrollSpyDebugLine({
  headerHeight,
  buffer,
  triggerY,
  activeSection,
}: ScrollSpyDebugLineProps) {
  const [visible, setVisible] = useState<boolean>(() =>
    import.meta.env.DEV ? isDebugExplicitlyRequested() : false
  );
  const [viewportInfo, setViewportInfo] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    scrollY: typeof window !== 'undefined' ? Math.round(window.scrollY) : 0,
  }));

  // Allow opting in/out on demand in dev mode via Alt+Shift+D
  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setVisible((prev) => {
          const next = !prev;
          try {
            if (next) {
              window.localStorage.setItem('scrollspy-debug', 'true');
            } else {
              window.localStorage.removeItem('scrollspy-debug');
            }
          } catch {
            // ignore storage errors in restricted iframes
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV || !visible || typeof window === 'undefined') return;

    const syncViewport = () => {
      const nextWidth = window.innerWidth;
      const nextScrollY = Math.round(window.scrollY);
      setViewportInfo((prev) =>
        prev.width === nextWidth && prev.scrollY === nextScrollY
          ? prev
          : { width: nextWidth, scrollY: nextScrollY }
      );
    };

    syncViewport();
    window.addEventListener('scroll', syncViewport, { passive: true });
    window.addEventListener('resize', syncViewport, { passive: true });
    return () => {
      window.removeEventListener('scroll', syncViewport);
      window.removeEventListener('resize', syncViewport);
    };
  }, [visible]);

  if (!import.meta.env.DEV || !visible) {
    return null;
  }

  const handleHide = () => {
    setVisible(false);
    try {
      window.localStorage.removeItem('scrollspy-debug');
    } catch {
      // ignore storage errors
    }
  };

  const breakpointLabel =
    viewportInfo.width < 480
      ? 'compact'
      : viewportInfo.width < 1024
      ? 'tablet'
      : 'desktop';
  const documentTriggerY = viewportInfo.scrollY + triggerY;

  return (
    <div
      aria-hidden="true"
      data-scrollspy-debug="true"
      data-trigger-y={triggerY}
      data-header-height={headerHeight}
      className="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-0"
    >
      {/* Vertical left-edge pixel measurement rail from y=0 down to y=triggerY */}
      <div
        style={{ height: `${Math.max(0, triggerY)}px` }}
        className="absolute left-2.5 top-0 w-px bg-gradient-to-b from-[#38bdf8]/70 via-[#38bdf8]/80 to-[#f43f5e]"
      >
        {/* Top tick (y = 0px) */}
        <span className="absolute -left-1 top-0 h-px w-2.5 bg-[#38bdf8]/80" />
        {/* Navbar bottom tick (y = headerHeight px) */}
        <span
          style={{ transform: `translateY(${headerHeight}px)` }}
          className="absolute -left-1 top-0 h-px w-3 bg-[#38bdf8]"
        />
        {/* Mid-buffer delta badge (+buffer px) */}
        {buffer >= 28 && (
          <span
            style={{
              transform: `translateY(${headerHeight + Math.round(buffer / 2) - 8}px)`,
            }}
            className="absolute left-2.5 top-0 whitespace-nowrap rounded bg-[#12141c]/88 px-1.5 py-0.5 font-mono text-[9px] font-semibold tabular-nums text-[#fda4af] shadow-sm"
          >
            +{buffer}px
          </span>
        )}
      </div>

      {/* Exact sticky navbar bottom boundary line (y = headerHeight px) */}
      <div
        style={{ transform: `translateY(${headerHeight}px)` }}
        className="absolute inset-x-0 top-0 flex items-center"
      >
        <div className="h-0 w-full border-t border-dotted border-[#38bdf8]/85 shadow-[0_0_4px_rgba(56,189,248,0.35)]" />
        <div className="absolute left-5 -top-2.5 rounded border border-[#38bdf8]/50 bg-[#0d1424]/92 px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold tabular-nums text-[#7dd3fc] shadow-sm backdrop-blur-sm">
          navbar y={headerHeight}px
        </div>
      </div>

      {/* Subtle shaded activation buffer band between navbar bottom and triggerY */}
      <div
        style={{
          transform: `translateY(${headerHeight}px)`,
          height: `${Math.max(0, buffer)}px`,
        }}
        className="absolute inset-x-0 top-0 bg-[#f43f5e]/[0.045]"
      />

      {/* Exact triggerY horizontal threshold line spanning full viewport width */}
      <div
        style={{ transform: `translateY(${triggerY}px)` }}
        className="absolute inset-x-0 top-0 flex items-center justify-between"
      >
        <div className="h-0 w-full border-t-[1.5px] border-dashed border-[#f43f5e] shadow-[0_1px_5px_rgba(244,63,94,0.4)]" />

        {/* Left pixel Y-coordinate callout directly pinned to the triggerY line */}
        <div className="absolute left-5 -top-3 flex items-center gap-1.5 rounded-md border border-[#f43f5e]/60 bg-[#12141c]/94 px-2 py-1 font-mono text-[10px] sm:text-[11px] leading-none font-semibold tabular-nums text-white shadow-lg backdrop-blur-sm">
          <span className="text-[#fda4af]">Y</span>
          <span>{triggerY}px</span>
          <span className="hidden md:inline text-[#94a3b8] font-normal">
            (doc {documentTriggerY}px)
          </span>
        </div>

        {/* Right live telemetry & screen-size readout with hide toggle */}
        <div className="pointer-events-auto absolute right-3 -top-3.5 flex items-center gap-2 rounded-md border border-[#f43f5e]/55 bg-[#12141c]/94 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] leading-none tabular-nums text-[#ffe4e6] shadow-lg backdrop-blur-sm">
          <span className="font-semibold text-white">
            triggerY: {triggerY}px
          </span>
          <span className="hidden sm:inline text-[#fda4af]/90">
            ({headerHeight}+{buffer})
          </span>
          <span className="hidden md:inline text-[#f43f5e]/55">|</span>
          <span className="hidden md:inline text-[#7dd3fc]">
            {viewportInfo.width}px {breakpointLabel}
          </span>
          <span className="text-[#f43f5e]/55">|</span>
          <span className="font-semibold text-[#93c5fd]">#{activeSection}</span>
          <button
            type="button"
            onClick={handleHide}
            aria-label="Hide ScrollSpy debug overlay"
            title="Hide debug overlay"
            className="ml-0.5 inline-flex items-center justify-center rounded p-0.5 text-[#fda4af]/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <EyeOff className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
