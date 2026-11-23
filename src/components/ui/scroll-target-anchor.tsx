import { forwardRef } from 'react';
import { SectionId } from '../../data/portfolioData';

export interface ScrollTargetAnchorProps {
  /** Canonical section identifier mapped to sectionRefs and URL hash links */
  id: SectionId;
  /** Live sticky header height plus scroll padding buffer in pixels */
  headerOffset: number;
  /** Optional human-readable label for accessibility/DOM inspection */
  label?: string;
  className?: string;
}

/**
 * Renders a transparent, zero-layout-impact scroll-target anchor right at the
 * top boundary of a section. Keeping the anchor outside Framer Motion transform
 * wrappers prevents translateY animations from skewing scroll-spy geometry,
 * while dynamic `scrollMarginTop` keeps hash jumps aligned beneath the sticky header.
 */
export const ScrollTargetAnchor = forwardRef<
  HTMLDivElement,
  ScrollTargetAnchorProps
>(function ScrollTargetAnchor({ id, headerOffset, label, className = '' }, ref) {
  const safeOffset = Number.isFinite(headerOffset) ? Math.max(0, Math.round(headerOffset)) : 76;

  return (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      data-scroll-target="true"
      data-section-id={id}
      data-section-label={label ?? id}
      data-header-offset={safeOffset}
      style={{ scrollMarginTop: `${safeOffset}px` }}
      className={`pointer-events-none block h-px w-full -mb-px select-none bg-transparent opacity-0 outline-none ${className}`}
    />
  );
});
