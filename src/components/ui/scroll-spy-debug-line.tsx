import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SectionId } from '../../data/portfolioData';

export interface ScrollSpyDebugLineProps {
  headerHeight: number;
  buffer: number;
  triggerY: number;
  activeSection: SectionId;
}

/**
 * Development-only viewport overlay visualizing the exact `triggerY`
 * (sticky header height + activation buffer) threshold used by scroll-spy.
 * Automatically renders nothing in production builds.
 */
export function ScrollSpyDebugLine({
  headerHeight,
  buffer,
  triggerY,
  activeSection,
}: ScrollSpyDebugLineProps) {
  const [visible, setVisible] = useState(true);

  if (!import.meta.env.DEV) {
    return null;
  }

  if (!visible) {
    return (
      <div className="no-print fixed right-3 bottom-3 z-[60] pointer-events-auto">
        <button
          type="button"
          onClick={() => setVisible(true)}
          title="Show ScrollSpy triggerY debug line"
          className="inline-flex items-center gap-1.5 rounded-md border border-[#f43f5e]/40 bg-[#12141c]/90 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#fda4af] shadow-md backdrop-blur-sm hover:bg-[#1b1e2b] transition-colors cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>triggerY: {triggerY}px</span>
        </button>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-scrollspy-debug="true"
      className="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-0"
    >
      {/* Subtle shaded activation band from sticky header bottom down to triggerY */}
      <div
        style={{
          transform: `translateY(${headerHeight}px)`,
          height: `${Math.max(0, buffer)}px`,
        }}
        className="absolute inset-x-0 top-0 border-t border-dotted border-[#f43f5e]/40 bg-[#f43f5e]/[0.045]"
      />

      {/* Exact triggerY horizontal threshold line spanning full viewport width */}
      <div
        style={{ transform: `translateY(${triggerY}px)` }}
        className="absolute inset-x-0 top-0 flex items-center justify-end"
      >
        <div className="h-0 w-full border-t-[1.5px] border-dashed border-[#f43f5e] shadow-[0_1px_4px_rgba(244,63,94,0.35)]" />

        {/* Live telemetry readout anchored to the right side of the threshold line */}
        <div className="pointer-events-auto absolute right-3 -top-3.5 flex items-center gap-2 rounded-md border border-[#f43f5e]/55 bg-[#12141c]/92 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] leading-none text-[#ffe4e6] shadow-lg backdrop-blur-sm">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#f43f5e]"
            aria-hidden="true"
          />
          <span className="font-semibold text-white">
            triggerY: {triggerY}px
          </span>
          <span className="hidden sm:inline text-[#fda4af]/85">
            (header {headerHeight}px + buffer {buffer}px)
          </span>
          <span className="text-[#f43f5e]/60">|</span>
          <span className="font-semibold text-[#93c5fd]">#{activeSection}</span>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Hide ScrollSpy debug line"
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
