import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
  imgClassName?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  imgClassName = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#10131a] text-center p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 80% 15%, rgba(29, 99, 255, 0.12), transparent 60%), radial-gradient(circle at 20% 85%, rgba(217, 119, 6, 0.08), transparent 55%)',
          }}
        />
        <Layers
          className="relative z-10 h-6 w-6 text-[#1d4ed8]/80 dark:text-[#b5c4ff]/75 mb-3"
          strokeWidth={1.5}
        />
        <p className="relative z-10 font-display text-sm font-semibold text-slate-800 dark:text-[#e1e2ec] max-w-[22ch]">
          {fallbackTitle}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-[#0b0e15] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition-transform duration-500 ease-out ${imgClassName}`}
      />
    </div>
  );
}
