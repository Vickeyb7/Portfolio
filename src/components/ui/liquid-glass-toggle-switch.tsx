import React, { useState, useRef, useId } from "react";

export interface LiquidGlassSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  ariaLabel?: string;
}

export function LiquidGlassSwitch({
  checked: controlledChecked,
  onCheckedChange,
  label = "Dark Mode",
  description = "Switch to dark interface",
  ariaLabel = "Liquid glass toggle",
}: LiquidGlassSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const trackRef = useRef<HTMLButtonElement>(null);
  const didDragRef = useRef(false);
  const filterId = useId().replace(/:/g, "");

  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const progress = dragProgress !== null ? dragProgress : isChecked ? 1 : 0;

  // Track width = 82px, padding = 3px (usable width = 76px), pill width = 48px -> travel = 28px
  const maxTravel = 28;

  const commitToggle = (next: boolean) => {
    if (controlledChecked === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  const updateFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const usable = rect.width - 54;
    const raw = (clientX - rect.left - 27) / Math.max(usable, 1);
    setDragProgress(Math.min(1, Math.max(0, raw)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPressed(true);
    didDragRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressed) return;
    didDragRef.current = true;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isPressed) return;
    setIsPressed(false);

    const next =
      didDragRef.current && dragProgress !== null
        ? dragProgress >= 0.5
        : !isChecked;

    setDragProgress(null);
    commitToggle(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      commitToggle(!isChecked);
    }
  };

  const handleLabelClick = () => {
    commitToggle(!isChecked);
  };

  // Smooth track color interpolation (#dcdce0 -> #bef264)
  const r = Math.round(220 + (190 - 220) * progress);
  const g = Math.round(220 + (242 - 220) * progress);
  const b = Math.round(224 + (100 - 224) * progress);
  const trackColor = `rgb(${r}, ${g}, ${b})`;

  const translateX = progress * maxTravel;

  return (
    <div className="inline-flex items-center gap-3.5 select-none">
      {/* SVG optical refraction filter for liquid lens edge distortion */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id={`liquid-lens-${filterId}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.03"
              numOctaves="1"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <button
        ref={trackRef}
        id={`switch-${filterId}`}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label || ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative inline-flex h-[36px] w-[82px] shrink-0 cursor-pointer touch-none items-center rounded-full p-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        style={{
          backgroundColor: trackColor,
          boxShadow:
            progress > 0.5
              ? "inset 0 1px 2px rgba(63, 98, 18, 0.14)"
              : "inset 0 1px 2px rgba(0, 0, 0, 0.08)",
          transition:
            dragProgress !== null
              ? "none"
              : "background-color 0.28s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Elongated pill (48x30px): solid white at rest, refractive crystal glass while pressed */}
        <span
          aria-hidden="true"
          className="pointer-events-none relative block h-[30px] w-[48px] rounded-full"
          style={{
            transform: `translateX(${translateX}px) scale(${
              isPressed ? 1.24 : 1
            }, ${isPressed ? 1.32 : 1})`,
            transition:
              dragProgress !== null
                ? "transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1), background-color 0.14s ease, box-shadow 0.14s ease"
                : "transform 0.34s cubic-bezier(0.32, 1.35, 0.55, 1), background-color 0.2s ease, box-shadow 0.2s ease",
            backgroundColor: isPressed
              ? "rgba(255, 255, 255, 0.02)"
              : "#ffffff",
            backdropFilter: isPressed
              ? `url(#liquid-lens-${filterId}) contrast(1.05)`
              : "none",
            WebkitBackdropFilter: isPressed
              ? `url(#liquid-lens-${filterId}) contrast(1.05)`
              : "none",
            boxShadow: isPressed
              ? [
                  "0 0 0 1px rgba(0, 0, 0, 0.18)",
                  "inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95)",
                  "inset 0 -1.5px 1.5px rgba(255, 255, 255, 0.7)",
                  "inset 2px 0 2px rgba(255, 255, 255, 0.45)",
                  "inset -2px 0 2px rgba(255, 255, 255, 0.45)",
                ].join(", ")
              : "0 1px 4px rgba(0, 0, 0, 0.14), 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
          }}
        />
      </button>

      {(label || description) && (
        <div
          onClick={handleLabelClick}
          className="flex cursor-pointer flex-col text-left"
        >
          {label && (
            <span className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
              {label}
            </span>
          )}
          {description && (
            <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default LiquidGlassSwitch;
