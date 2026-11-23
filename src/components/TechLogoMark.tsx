import { TechLogoId } from '../data/portfolioData';

interface TechLogoMarkProps {
  logo: TechLogoId;
  className?: string;
}

export function TechLogoMark({ logo, className = 'h-5 w-5' }: TechLogoMarkProps) {
  switch (logo) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="2.1" fill="#0284c7" className="dark:fill-[#38bdf8]" />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            stroke="#0284c7"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            transform="rotate(60 12 12)"
            stroke="#0284c7"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            transform="rotate(120 12 12)"
            stroke="#0284c7"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="3.5"
            fill="#1d63ff"
            className="dark:fill-[#3178c6]"
          />
          <path
            d="M7.2 11.4h4.6v1.45h-1.5v5.65H8.7v-5.65H7.2V11.4zm6.2 5.38c.46.28 1.07.46 1.7.46.72 0 1.15-.29 1.15-.74 0-.42-.3-.65-1.15-.95-1.15-.4-1.88-.99-1.88-1.99 0-1.14.95-1.99 2.48-1.99.75 0 1.32.16 1.73.37l-.38 1.29a3.1 3.1 0 0 0-1.36-.33c-.66 0-1.02.31-1.02.68 0 .42.35.62 1.25.95 1.2.44 1.79 1.04 1.79 2.02 0 1.14-.86 2.09-2.66 2.09-.8 0-1.55-.22-1.95-.46l.4-1.4z"
            fill="#ffffff"
          />
        </svg>
      );

    case 'figma':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M9 3h3v6H9a3 3 0 1 1 0-6z" fill="#F24E1E" />
          <path d="M12 3h3a3 3 0 1 1 0 6h-3V3z" fill="#FF7262" />
          <path d="M9 9h3v6H9a3 3 0 1 1 0-6z" fill="#A259FF" />
          <circle cx="15" cy="12" r="3" fill="#1ABCFE" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3z" fill="#0ACF83" />
        </svg>
      );

    case 'sql-bigquery':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse
            cx="12"
            cy="6"
            rx="7.5"
            ry="2.8"
            stroke="#1d4ed8"
            className="dark:stroke-[#7bd0ff]"
            strokeWidth="1.7"
          />
          <path
            d="M4.5 6v5.5c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8V6"
            stroke="#1d4ed8"
            className="dark:stroke-[#7bd0ff]"
            strokeWidth="1.7"
          />
          <path
            d="M4.5 11.5V17c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-5.5"
            stroke="#1d4ed8"
            className="dark:stroke-[#7bd0ff]"
            strokeWidth="1.7"
          />
        </svg>
      );

    case 'cicd':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle
            cx="6"
            cy="6"
            r="2.5"
            stroke="#0f172a"
            className="dark:stroke-[#e2e8f0]"
            strokeWidth="1.7"
          />
          <circle
            cx="18"
            cy="6"
            r="2.5"
            stroke="#1d63ff"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.7"
          />
          <circle
            cx="12"
            cy="18"
            r="2.5"
            stroke="#1d63ff"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.7"
          />
          <path
            d="M6 8.5v2a3.5 3.5 0 0 0 3.5 3.5H12v1.5M18 8.5v2a3.5 3.5 0 0 1-3.5 3.5H12"
            stroke="#475569"
            className="dark:stroke-[#94a3b8]"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'playwright':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 6.5c2.2-.8 4.8-.8 7 0v6.2c0 2.5-1.6 4.7-3.5 5.6-1.9-.9-3.5-3.1-3.5-5.6V6.5z"
            fill="#059669"
            fillOpacity="0.16"
            stroke="#059669"
            className="dark:stroke-[#34d399]"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M13 5.5c2.2-.8 4.8-.8 7 0v6.7c0 2.5-1.6 4.7-3.5 5.6-1.9-.9-3.5-3.1-3.5-5.6V5.5z"
            fill="#1d63ff"
            fillOpacity="0.14"
            stroke="#1d63ff"
            className="dark:stroke-[#60a5fa]"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M6.2 12.2c.8.7 1.8.7 2.6 0M15.2 11.4c.8.7 1.8.7 2.6 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rest-api':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5.5l-3 13"
            stroke="#0f766e"
            className="dark:stroke-[#2dd4bf]"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 18.5h16"
            stroke="#64748b"
            className="dark:stroke-[#94a3b8]"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect
            x="5.5"
            y="12"
            width="3"
            height="6.5"
            rx="1"
            fill="#4f46e5"
            className="dark:fill-[#818cf8]"
          />
          <rect
            x="10.5"
            y="8.5"
            width="3"
            height="10"
            rx="1"
            fill="#1d63ff"
            className="dark:fill-[#60a5fa]"
          />
          <rect
            x="15.5"
            y="5"
            width="3"
            height="13.5"
            rx="1"
            fill="#0284c7"
            className="dark:fill-[#38bdf8]"
          />
        </svg>
      );

    case 'salesforce':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M7.8 18h9.2a3.7 3.7 0 0 0 .5-7.36A4.9 4.9 0 0 0 8.2 8.9a3.9 3.9 0 0 0-.4 9.1z"
            fill="#0284c7"
            fillOpacity="0.16"
            stroke="#0284c7"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'experimentation':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M9.5 4h5M10.5 4v5.2l-4.7 7.6A2 2 0 0 0 7.5 20h9a2 2 0 0 0 1.7-3.2l-4.7-7.6V4"
            stroke="#a16207"
            className="dark:stroke-[#efbf68]"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.6 15h8.8"
            stroke="#a16207"
            className="dark:stroke-[#efbf68]"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'plg-gtm':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4.5 16.5 9.5 11.5l3.5 3.5 6.5-7"
            stroke="#1d63ff"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 8h4.5v4.5"
            stroke="#1d63ff"
            className="dark:stroke-[#38bdf8]"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'product-strategy':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="#a16207"
            className="dark:stroke-[#efbf68]"
            strokeWidth="1.6"
          />
          <polygon
            points="15.8,8.2 13.5,13.5 8.2,15.8 10.5,10.5"
            fill="#a16207"
            fillOpacity="0.18"
            stroke="#a16207"
            className="dark:stroke-[#efbf68]"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
