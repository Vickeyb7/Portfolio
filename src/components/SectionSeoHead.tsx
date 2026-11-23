import { Helmet } from 'react-helmet';
import { CaseStudy, PROFILE, SectionId } from '../data/portfolioData';

interface SectionSeoHeadProps {
  activeSection: SectionId;
  activeCaseStudy: CaseStudy | null;
  resumeOpen: boolean;
  isDark: boolean;
}

interface SeoMetadata {
  title: string;
  description: string;
  hash?: string;
}

const SECTION_SEO_MAP: Record<SectionId, SeoMetadata> = {
  overview: {
    title: 'Shankar Narayan Bhattacharjee — SaaS Product Portfolio & CV',
    description:
      'Explore SaaS product case studies, PRDs, and enterprise GTM experience by Shankar Narayan Bhattacharjee—BrowserStack to NextLeap Top 1% PM Fellow.',
  },
  'case-studies': {
    title: 'Product Case Studies & PRDs | Shankar Narayan Bhattacharjee',
    description:
      'Inspect shipped PRDs, RICE prioritization matrices, and user journey diagnostics across DevTools, FinTech treasury, and checkout recovery.',
    hash: '#case-studies',
  },
  experience: {
    title: 'Career Timeline & Experience | Shankar Narayan Bhattacharjee',
    description:
      'Review $1.8M+ ARR enterprise execution at BrowserStack, GTM analytics at Razorpay, and Top 1% NextLeap Product Management Fellowship honors.',
    hash: '#experience',
  },
  capabilities: {
    title: 'Capabilities & Tech Stack | Shankar Narayan Bhattacharjee',
    description:
      'Discover product strategy, SQL, BigQuery, React, TypeScript, Figma, CI/CD, and enterprise GTM capabilities verified by leadership endorsements.',
    hash: '#capabilities',
  },
  contact: {
    title: 'Contact & Case Walkthroughs | Shankar Narayan Bhattacharjee',
    description:
      'Connect with Shankar Narayan Bhattacharjee for Product Manager and APM roles in B2B SaaS, developer platforms, and FinTech infrastructure.',
    hash: '#contact',
  },
};

export function SectionSeoHead({
  activeSection,
  activeCaseStudy,
  resumeOpen,
  isDark,
}: SectionSeoHeadProps) {
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';

  let meta: SeoMetadata = SECTION_SEO_MAP[activeSection];

  if (resumeOpen) {
    meta = {
      title: `Interactive CV & Resume | ${PROFILE.name}`,
      description:
        'View and print the executive SaaS Product Manager CV for Shankar Narayan Bhattacharjee covering BrowserStack, Razorpay, and NextLeap.',
      hash: '#resume',
    };
  } else if (activeCaseStudy) {
    meta = {
      title: `${activeCaseStudy.title} | ${PROFILE.name}`,
      description: `${activeCaseStudy.subtitle}. Inspect the full PRD, RICE prioritization matrix, and measurable product outcomes.`,
      hash: `#case-studies/${activeCaseStudy.id}`,
    };
  }

  const canonicalUrl = baseUrl ? `${baseUrl}${meta.hash ?? ''}` : '';

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={PROFILE.name} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="theme-color" content={isDark ? '#0a0d14' : '#f8fafc'} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
    </Helmet>
  );
}
