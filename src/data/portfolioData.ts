export type SectionId =
  | 'overview'
  | 'case-studies'
  | 'experience'
  | 'capabilities'
  | 'contact';

export const NAV_SECTIONS: readonly { id: SectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
] as const;

export type CaseCategory = 'all' | 'zero-to-one' | 'growth' | 'devtools';

export interface MetricOutcome {
  value: string;
  label: string;
  emphasis?: 'cobalt' | 'champagne' | 'neutral';
}

export interface RiceItem {
  initiative: string;
  reach: string;
  impact: string;
  confidence: string;
  effort: string;
  score: string;
  decision: string;
}

export interface JourneyStep {
  stage: string;
  friction: string;
  intervention: string;
  signal: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<CaseCategory, 'all'>;
  categoryLabel: string;
  organization: string;
  timeframe: string;
  role: string;
  featured?: boolean;
  distinction?: string;
  imageUrl: string;
  imageAlt: string;
  problemStatement: string;
  architectureSummary: string;
  outcomes: MetricOutcome[];
  stack: string[];
  prd: {
    context: string;
    targetPersona: string;
    hypothesis: string;
    inScope: string[];
    nonGoals: string[];
    northStar: string;
    guardrail: string;
  };
  riceMatrix: RiceItem[];
  journey: JourneyStep[];
}

export interface TimelineMilestone {
  id: string;
  track: 'product' | 'sales';
  period: string;
  role: string;
  organization: string;
  location: string;
  distinction?: string;
  headlineMetric: string;
  summary: string;
  highlights: string[];
  skills: string[];
}

export interface CapabilityGroup {
  index: string;
  title: string;
  description: string;
  items: {
    name: string;
    context: string;
  }[];
}

export interface Testimonial {
  quote: string;
  beforeContext: string;
  outcome: string;
  author: string;
  role: string;
  organization: string;
}

export type TechStackCategory =
  | 'all'
  | 'product'
  | 'engineering'
  | 'analytics'
  | 'design-gtm';

export type TechLogoId =
  | 'product-strategy'
  | 'experimentation'
  | 'react'
  | 'typescript'
  | 'rest-api'
  | 'cicd'
  | 'playwright'
  | 'sql-bigquery'
  | 'analytics'
  | 'figma'
  | 'salesforce'
  | 'plg-gtm';

export interface TechStackItem {
  id: string;
  logo: TechLogoId;
  name: string;
  category: Exclude<TechStackCategory, 'all'>;
  categoryLabel: string;
  usageSummary: string;
  projects: string[];
  caseStudyId?: string;
}

export const PROFILE = {
  name: 'Shankar Narayan Bhattacharjee',
  shortName: 'Shankar Narayan Bhattacharjee',
  firstName: 'Shankar',
  role: 'SaaS Product Manager',
  kicker: 'SaaS Product Manager · Enterprise GTM to Product',
  location: 'Bengaluru, India',
  availability: 'Open to PM & APM roles in B2B SaaS, DevTools & FinTech',
  email: 'snb2990@gmail.com',
  linkedin: 'https://linkedin.com/in/shankarnarayanbhattacharjee',
  github: 'https://github.com/snb2990',
  portraitUrl: '/src/assets/images/hero_pm_portrait_1795437982236.jpg',
  headline: 'Turning Enterprise Friction Into Shipped Product Velocity.',
  subheadline:
    'Emerging SaaS Product Manager combining 4+ years of developer-first enterprise sales rigor at BrowserStack with Top 1% product execution from the NextLeap PM Fellowship. I translate complex buyer bottlenecks into measurable activation, retention, and expansion outcomes.',
};

export const HERO_METRICS: MetricOutcome[] = [
  {
    value: '$1.8M+',
    label: 'Enterprise ARR influenced across BrowserStack DevTools & QA accounts',
    emphasis: 'cobalt',
  },
  {
    value: 'Top 1%',
    label: 'NextLeap Product Management Fellowship cohort honor & Capstone distinction',
    emphasis: 'champagne',
  },
  {
    value: '142%',
    label: 'Average quarterly quota attainment across four consecutive enterprise quarters',
    emphasis: 'cobalt',
  },
  {
    value: '4 Shipped',
    label: 'End-to-end PRDs, telemetry specs, and user-validated SaaS product case studies',
    emphasis: 'neutral',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'browserstack-trial-orchestrator',
    title: 'Self-Serve Enterprise Trial Orchestrator',
    subtitle: 'Compressing time-to-first-parallel-test for mid-market QA engineering teams',
    category: 'devtools',
    categoryLabel: 'Developer Tools',
    organization: 'BrowserStack Product Initiative',
    timeframe: 'Q4 2025 · 8-Week Spec',
    role: 'Product Strategist & GTM Lead',
    featured: true,
    imageUrl: '/src/assets/images/case_browserstack_trial_1795437980941.jpg',
    imageAlt: 'Isometric dark-mode visualization of an automated CI/CD cloud testing pipeline',
    problemStatement:
      'Over 61% of mid-market QA engineering trials stalled before executing their first automated parallel build. Prospect teams spent an average of 4.2 days debugging local tunnel credentials and YAML runner syntax across GitHub Actions and Jenkins before experiencing core product value.',
    architectureSummary:
      'Designed a zero-friction Onboarding Orchestrator that auto-detects the repository CI provider, injects scoped ephemeral access tokens, and generates a ready-to-commit Playwright or Selenium YAML patch with live concurrency telemetry.',
    outcomes: [
      { value: '+34%', label: 'Projected Trial-to-Paid Lift', emphasis: 'cobalt' },
      { value: '18 min', label: 'Median Time-to-First-Build', emphasis: 'cobalt' },
      { value: '-78%', label: 'SE Onboarding Ticket Load', emphasis: 'neutral' },
    ],
    stack: ['CI/CD Pipelines', 'Playwright & Selenium', 'Amplitude Funnels', 'PLG Onboarding'],
    prd: {
      context:
        'Enterprise and mid-market buyers evaluating cross-browser cloud infrastructure frequently abandon trials during environment configuration. Solutions Engineers spend 11+ hours/week manually walking prospects through boilerplate YAML authentication instead of focusing on multi-year architecture deals.',
      targetPersona:
        'Staff QA Automation Engineer & Engineering Manager at 150–1,000 employee SaaS companies running nightly regression suites in GitHub Actions or CircleCI.',
      hypothesis:
        'If we replace static documentation guides with an interactive CI repo detector and 1-click ephemeral YAML generator during minute one of signup, activation (first 5 parallel sessions executed within 48 hours) will rise from 39% to 55%+.',
      inScope: [
        'OAuth-free CI framework selector (GitHub Actions, GitLab CI, Jenkins, Azure DevOps) with auto-generated copy-paste YAML diff.',
        'Time-boxed ephemeral trial token (72h TTL) to eliminate premature IAM security reviews during proof-of-concept.',
        'Live build stream verifier inside the onboarding modal that confirms first green parallel test without tab-switching.',
      ],
      nonGoals: [
        'Replacing full SSO/SCIM enterprise provisioning flows post-procurement.',
        'Supporting legacy on-premise firewall proxy installations in v1.',
      ],
      northStar: 'Activated Trial Teams executing ≥5 parallel automated builds within 48 hours of workspace creation.',
      guardrail: 'Zero regression in enterprise security review pass rate; trial token revocation latency < 500ms.',
    },
    riceMatrix: [
      {
        initiative: '1-Click CI YAML Patch Generator',
        reach: '1,400 teams/qtr',
        impact: '3.0 (High)',
        confidence: '85%',
        effort: '3 wks',
        score: '1,190',
        decision: 'Ship in v1',
      },
      {
        initiative: 'Scoped 72h Ephemeral Trial Tokens',
        reach: '1,100 teams/qtr',
        impact: '2.5 (High)',
        confidence: '80%',
        effort: '2.5 wks',
        score: '880',
        decision: 'Ship in v1',
      },
      {
        initiative: 'In-Modal Live Parallel Stream Preview',
        reach: '950 teams/qtr',
        impact: '2.0 (Med)',
        confidence: '75%',
        effort: '3 wks',
        score: '475',
        decision: 'Fast Follow v1.1',
      },
      {
        initiative: 'Automated Custom Proxy Diagnostics',
        reach: '240 teams/qtr',
        impact: '2.5 (High)',
        confidence: '60%',
        effort: '6 wks',
        score: '60',
        decision: 'Defer to Q2',
      },
    ],
    journey: [
      {
        stage: '01. Workspace Signup',
        friction: 'Prospect lands on a generic dashboard with 14 links to static SDK docs and exits to ask DevOps for secrets.',
        intervention: 'Immediate 2-step intent fork: select CI provider + test framework (Playwright, Cypress, Selenium).',
        signal: '91% intent selection completion within 45 seconds.',
      },
      {
        stage: '02. Credential & Config Setup',
        friction: 'Manual token creation + copy-pasting environment variables across 3 doc pages causes syntax errors.',
        intervention: 'Auto-synthesized YAML block with pre-scoped 72h trial token and 1-click CLI verification command.',
        signal: 'Median setup time compressed from 4.2 days to 18 minutes.',
      },
      {
        stage: '03. First Parallel Execution',
        friction: 'Teams run single sequential tests and fail to witness parallel speed advantages before trial expiry.',
        intervention: 'Default 5-worker parallel burst unlocked automatically on first verified commit with side-by-side speed delta.',
        signal: '+34% lift in qualified PQL handoff to Enterprise AEs.',
      },
    ],
  },
  {
    id: 'finpulse-b2b-treasury',
    title: 'FinPulse: Multi-Entity Treasury Copilot',
    subtitle: '0-to-1 cash-flow visibility & FX exposure alerting for Series A–C finance leaders',
    category: 'zero-to-one',
    categoryLabel: '0→1 Product',
    organization: 'NextLeap PM Fellowship Capstone',
    timeframe: 'Jan 2026 · 6-Week Build',
    role: 'Lead Product Manager',
    distinction: 'NextLeap Top 1% Cohort Award',
    imageUrl: '/src/assets/images/case_finpulse_treasury_1795437983189.jpg',
    imageAlt: 'Dark glass B2B fintech treasury interface showing global liquidity curves in champagne gold and cobalt',
    problemStatement:
      'Finance controllers at cross-border Indian SaaS startups (US Delaware Inc + India Pvt Ltd) reconcile 6+ bank portals and ERP exports manually in spreadsheets every Friday—losing 9 hours/week and missing unfavorable FX conversion windows.',
    architectureSummary:
      'Defined an end-to-end 0-to-1 treasury ledger aggregating read-only bank feeds, Accounts Receivable aging from Stripe/NetSuite, and deterministic 13-week runway stress tests with automated FX threshold alerts.',
    outcomes: [
      { value: 'Top 1%', label: 'NextLeap Cohort Capstone Distinction', emphasis: 'champagne' },
      { value: '28 CFOs', label: 'Primary Discovery Interviews', emphasis: 'cobalt' },
      { value: '7.5 hrs', label: 'Weekly Reconciliation Time Saved', emphasis: 'neutral' },
    ],
    stack: ['0→1 Discovery', 'JTBD Interviews', 'Financial Modeling', 'Figma Wireframes'],
    prd: {
      context:
        'Cross-border SaaS startups hold revenue in USD (Mercury/SVB) while paying engineering payroll in INR. Fragmented banking APIs force finance teams into reactive Monday cash reconciliations with zero forward-looking FX sensitivity alerts.',
      targetPersona:
        'VP of Finance / Head of Financial Operations at Series A–C B2B SaaS companies ($2M–$25M ARR) operating dual US-India entities.',
      hypothesis:
        'Providing a unified read-only liquidity console with automated 13-week rolling cash forecasts and Slack-based FX transfer triggers will achieve >70% weekly active controller engagement within 30 days of bank-feed connection.',
      inScope: [
        'Read-only multi-bank aggregation (Mercury, Brex, HDFC, ICICI) normalized into base reporting currency.',
        'Automated 13-week cash runway model driven by historical burn + recurring Stripe subscription receivables.',
        'Configurable FX rate alert rules (e.g., USD/INR favorable threshold notifications via Slack and email).',
      ],
      nonGoals: [
        'Direct payment execution or wire initiation in MVP (eliminates heavy money-transmitter compliance overhead).',
        'Full statutory tax filing or automated GST reconciliation.',
      ],
      northStar: 'Weekly Active Finance Teams reviewing consolidated cash position & acting on ≥1 liquidity alert per week.',
      guardrail: 'Bank feed sync staleness < 4 hours; zero discrepancies > 0.01% vs. raw ledger statements.',
    },
    riceMatrix: [
      {
        initiative: 'Unified Multi-Entity Cash Ledger',
        reach: '320 orgs/yr',
        impact: '3.0 (High)',
        confidence: '90%',
        effort: '4 wks',
        score: '216',
        decision: 'Core MVP',
      },
      {
        initiative: '13-Week Rolling Runway Simulator',
        reach: '290 orgs/yr',
        impact: '2.5 (High)',
        confidence: '85%',
        effort: '3 wks',
        score: '205',
        decision: 'Core MVP',
      },
      {
        initiative: 'Slack FX Threshold Alert Rules',
        reach: '260 orgs/yr',
        impact: '2.0 (Med)',
        confidence: '80%',
        effort: '1.5 wks',
        score: '277',
        decision: 'Core MVP',
      },
      {
        initiative: 'Automated NetSuite Journal Writeback',
        reach: '140 orgs/yr',
        impact: '2.0 (Med)',
        confidence: '60%',
        effort: '6 wks',
        score: '28',
        decision: 'Phase 2',
      },
    ],
    journey: [
      {
        stage: '01. Read-Only Bank Linking',
        friction: 'CFOs resist granting write access or sharing credentials with early-stage fintech tools.',
        intervention: 'Strict read-only OAuth & statement parser onboarding with SOC2-aligned permission breakdown.',
        signal: '84% interview validation score on security comfort.',
      },
      {
        stage: '02. Inter-Company Normalization',
        friction: 'Transferring payroll from US parent to India subsidiary double-counts cash inflows in naive tools.',
        intervention: 'Deterministic inter-entity transfer matching that nets internal sweeps automatically.',
        signal: 'Eliminates 4.5 hours of manual Friday spreadsheet scrubbing.',
      },
      {
        stage: '03. Proactive FX & Runway Alerts',
        friction: 'Controllers convert large payroll tranches at spot rates without noticing 1.2% intra-month swings.',
        intervention: 'Automated Slack digest showing upcoming 14-day payroll obligation + optimal FX conversion window.',
        signal: 'Target 82% WAU retention among finance operators.',
      },
    ],
  },
  {
    id: 'enterprise-expansion-signal-engine',
    title: 'Enterprise Expansion Signal Engine',
    subtitle: 'Surfacing product-qualified expansion triggers from live QA concurrency bottlenecks',
    category: 'devtools',
    categoryLabel: 'Developer Tools',
    organization: 'BrowserStack Internal GTM Product',
    timeframe: 'Q2 2025 · Live Pilot',
    role: 'GTM Product Partner & Co-Author',
    imageUrl: '/src/assets/images/case_expansion_engine_1795437980972.jpg',
    imageAlt: 'Dark architectural telemetry network of glowing cobalt nodes and precision grid pathways',
    problemStatement:
      'Enterprise Account Executives relied on static annual renewal calendars to pitch seat and parallel-worker upgrades—missing acute mid-cycle build queues where engineering teams were actively throttled and willing to expand immediately.',
    architectureSummary:
      'Partnered with RevOps and Product Analytics to define a composite PQL Expansion Score combining 14-day queue saturation (>85% concurrency utilization), build wait-time spikes, and new CI repository additions—piped directly into Salesforce alerts.',
    outcomes: [
      { value: '+$420K', label: 'Incremental Expansion Pipeline', emphasis: 'cobalt' },
      { value: '2.3x', label: 'PQL-to-Opportunity Conversion', emphasis: 'cobalt' },
      { value: '38 AEs', label: 'Adopted Across NA & EMEA Pods', emphasis: 'neutral' },
    ],
    stack: ['SQL & BigQuery', 'Salesforce CRM', 'Usage Telemetry', 'PLG-to-Sales'],
    prd: {
      context:
        'In usage-based developer SaaS, buyer urgency peaks when CI pipelines slow down prior to major releases—not 60 days before an arbitrary contract anniversary. AEs lacked real-time visibility into which accounts were hitting concurrency ceilings.',
      targetPersona:
        'Enterprise Account Executives and Customer Success Managers managing $50K–$400K ARR developer accounts.',
      hypothesis:
        'Triggering structured CRM expansion plays whenever an account sustains >85% parallel slot saturation for 4+ business days will double expansion meeting conversion compared to cold mid-term check-ins.',
      inScope: [
        'BigQuery nightly aggregation of queue wait duration, peak concurrency ratio, and active user velocity.',
        'Explainable 3-factor Expansion Signal Card embedded in Salesforce account views (no opaque black-box scores).',
        'Pre-built ROI impact calculator showing developer engineering hours lost to queue wait times.',
      ],
      nonGoals: [
        'Automated customer-facing overage billing without human AE/CSM consultation.',
        'Predictive churn ML modeling across SMB self-serve cohorts.',
      ],
      northStar: 'Mid-cycle Net Dollar Retention (NDR) expansion pipeline sourced from product telemetry signals.',
      guardrail: 'Alert fatigue cap: maximum 3 high-confidence expansion signals per AE per week; >65% AE action rate.',
    },
    riceMatrix: [
      {
        initiative: 'Concurrency Queue Saturation Trigger',
        reach: '620 accounts/qtr',
        impact: '3.0 (High)',
        confidence: '90%',
        effort: '2 wks',
        score: '837',
        decision: 'Shipped',
      },
      {
        initiative: 'Lost Dev-Hours ROI Calculator',
        reach: '480 accounts/qtr',
        impact: '2.5 (High)',
        confidence: '85%',
        effort: '1.5 wks',
        score: '680',
        decision: 'Shipped',
      },
      {
        initiative: 'New Business Unit Domain Detector',
        reach: '310 accounts/qtr',
        impact: '2.0 (Med)',
        confidence: '70%',
        effort: '3 wks',
        score: '145',
        decision: 'Shipped v1.1',
      },
    ],
    journey: [
      {
        stage: '01. Telemetry Capture',
        friction: 'Raw build logs sat isolated in data warehouse tables inaccessible to customer-facing teams.',
        intervention: 'Scheduled SQL transformation flagging accounts with ≥4 consecutive days above 85% concurrency load.',
        signal: '94% precision in identifying engineering teams actively evaluating capacity.',
      },
      {
        stage: '02. Contextual CRM Routing',
        friction: 'AEs ignored generic email alerts that lacked quantitative talking points for VP Engineering buyers.',
        intervention: 'Auto-populated Salesforce brief detailing exact hours queued and peak release day bottlenecks.',
        signal: '38 AEs adopted weekly workflow with 74% alert acknowledgement.',
      },
      {
        stage: '03. Executive Value Conversation',
        friction: 'Procurement stalled expansion quotes without clear engineering productivity justification.',
        intervention: '1-page auto-generated queue bottleneck brief turned expansion calls into consultative capacity reviews.',
        signal: '+$420K qualified expansion pipeline generated in 2 quarters.',
      },
    ],
  },
  {
    id: 'quickcommerce-checkout-recovery',
    title: 'Split-Basket Checkout Recovery Redesign',
    subtitle: 'Reducing peak-hour quick-commerce checkout abandonment from stockout friction',
    category: 'growth',
    categoryLabel: 'Growth & Activation',
    organization: 'NextLeap Product Teardown',
    timeframe: 'Nov 2025 · Growth Sprint',
    role: 'Product Analyst & UX Strategist',
    imageUrl: '/src/assets/images/case_quickcommerce_ux_1795437981791.jpg',
    imageAlt: 'Dark slate studio view of translucent mobile checkout wireframe screens with cyan and champagne highlights',
    problemStatement:
      'During 7 PM–10 PM peak grocery windows, single-SKU dark-store stockouts at the final payment screen forced users back to search—causing a 24% immediate cart abandonment rate among high-intent repeat shoppers.',
    architectureSummary:
      'Designed an inline 1-tap Smart Substitute drawer inside the checkout sheet ranked by brand affinity, unit price parity, and live bin inventory—preserving payment readiness without forcing navigation reset.',
    outcomes: [
      { value: '+6.8%', label: 'Estimated Checkout Completion Lift', emphasis: 'cobalt' },
      { value: '-19%', label: 'Stockout-Driven Cart Churn', emphasis: 'champagne' },
      { value: '120 Users', label: 'Usability & Funnel Survey Cohort', emphasis: 'neutral' },
    ],
    stack: ['Funnel Diagnostics', 'Experimentation (A/B)', 'Mobile UX', 'Cohort Retention'],
    prd: {
      context:
        'Quick-commerce margins depend on basket size and peak-hour conversion efficiency. When a staple item (milk, bread, fresh produce) goes out of stock between add-to-cart and UPI tap, destructive modal alerts break purchase momentum.',
      targetPersona:
        'Urban repeat quick-commerce households placing 3+ evening replenishment orders per week.',
      hypothesis:
        'Replacing blocking out-of-stock modals with an inline 1-tap ranked substitute card directly inside the cart summary will recover ≥35% of impacted baskets without inflating delivery cancellations.',
      inScope: [
        'Real-time soft inventory lock check upon entering checkout sheet.',
        'Top-2 inline substitutes ranked by prior purchase history and ±15% price band.',
        'One-tap "Swap & Pay" primary CTA that keeps selected UPI payment method intact.',
      ],
      nonGoals: [
        'Multi-dark-store split order fulfillment across two riders.',
        'Manual rider phone call substitutions post-dispatch.',
      ],
      northStar: 'Checkout-to-Order Completion Rate during peak evening hours (7 PM–10 PM).',
      guardrail: 'Post-delivery item refund/return rate on substituted SKUs must remain ≤ 1.8%.',
    },
    riceMatrix: [
      {
        initiative: 'Inline 1-Tap Smart Substitute Card',
        reach: '45,000 sessions/wk',
        impact: '3.0 (High)',
        confidence: '80%',
        effort: '3 wks',
        score: '36,000',
        decision: 'A/B Test Primary',
      },
      {
        initiative: 'Pre-Checkout Soft Inventory Reserve',
        reach: '38,000 sessions/wk',
        impact: '2.0 (Med)',
        confidence: '75%',
        effort: '4 wks',
        score: '14,250',
        decision: 'Phase 2',
      },
      {
        initiative: 'Price-Parity Guarantee Micro-Copy',
        reach: '45,000 sessions/wk',
        impact: '1.5 (Low)',
        confidence: '85%',
        effort: '0.5 wks',
        score: '114,750',
        decision: 'Ship with Test',
      },
    ],
    journey: [
      {
        stage: '01. Cart Review Entry',
        friction: 'User clicks Pay Now only to hit a late error toast stating 1 of 9 items is unavailable.',
        intervention: 'Proactive inline check highlights unavailable SKU immediately on cart entry before payment tap.',
        signal: 'Eliminates frustrating post-UPI-intent failure loop.',
      },
      {
        stage: '02. Inline Substitution Choice',
        friction: 'Navigating back to home search loses scroll context and triggers mental abandonment.',
        intervention: '2 verified in-stock substitutes surfaced inline with identical pack size & transparent price delta.',
        signal: '78% of tested users accepted 1-tap swap over leaving checkout.',
      },
      {
        stage: '03. Seamless UPI Completion',
        friction: 'Re-selecting delivery slot and payment instrument adds 45+ seconds of friction.',
        intervention: 'Single "Swap & Pay" button updates total instantaneously and invokes saved UPI intent.',
        signal: 'Projected +6.8% peak-hour checkout recovery.',
      },
    ],
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'nextleap-fellowship',
    track: 'product',
    period: 'Oct 2025 – Feb 2026',
    role: 'Product Management Fellow',
    organization: 'NextLeap',
    location: 'Remote · Cohort 36',
    distinction: 'Top 1% Cohort Fellow',
    headlineMetric: 'Top 1% Capstone Distinction across 600+ Fellows',
    summary:
      'Selected for top cohort honors for end-to-end product discovery, quantitative metric trees, technical PRD rigor, and executive capstone defense before senior product leaders.',
    highlights: [
      'Shipped the FinPulse B2B Treasury Copilot capstone: conducted 28 structured CFO discovery interviews, authored full PRDs, RICE matrices, and interactive Figma flows.',
      'Completed weekly product teardowns spanning SaaS PLG onboarding, fintech activation funnels, and retention cohort diagnostics using SQL and Mixpanel frameworks.',
      'Mentored peer squads on enterprise buyer discovery, pricing & packaging trade-offs, and B2B GTM instrumentation.',
    ],
    skills: ['Product Discovery', 'PRDs & Specs', 'Metric Trees', 'Wireframing', 'A/B Testing'],
  },
  {
    id: 'browserstack-senior-ae',
    track: 'sales',
    period: 'Apr 2024 – Present',
    role: 'Senior Enterprise Account Executive',
    organization: 'BrowserStack',
    location: 'Bengaluru · NA & EMEA Enterprise',
    headlineMetric: '$1.1M+ New & Expansion ARR · 142% Avg Attainment',
    summary:
      'Owned full-cycle enterprise acquisition and multi-product expansion across Fortune 1000 engineering organizations adopting Automated Testing, App Automate, and Percy Visual QA.',
    highlights: [
      'Closed $1.1M+ in net-new and expansion enterprise ARR with 142% average quarterly attainment across four consecutive quarters.',
      'Co-authored the internal Expansion Signal Engine with RevOps & Product Analytics, translating concurrency queue bottlenecks into +$420K in PQL pipeline across 38 AEs.',
      'Synthesized structured win/loss and technical feature-gap intelligence from 150+ VP Engineering and QA Director calls directly into quarterly product roadmap reviews.',
    ],
    skills: ['Enterprise SaaS', 'MEDDPICC', 'Voice of Customer', 'Usage Telemetry', 'Executive Storytelling'],
  },
  {
    id: 'browserstack-mm-ae',
    track: 'sales',
    period: 'Jun 2022 – Mar 2024',
    role: 'Mid-Market Account Executive',
    organization: 'BrowserStack',
    location: 'Mumbai & Bengaluru · Global SaaS',
    headlineMetric: '$720K+ ARR Closed · #1 Mid-Market Ramp',
    summary:
      'Partnered with high-growth developer teams (Series B to Pre-IPO) to transition fragmented in-house Selenium grids onto BrowserStack cloud infrastructure.',
    highlights: [
      'Delivered $720K+ in ARR across 65+ developer-first SaaS accounts while maintaining a 94% first-year logo retention rate.',
      'Identified the 4.2-day CI/CD onboarding stall pattern across mid-market trials and built repeatable Playwright/GitHub Actions proof-of-concept kits with Solutions Engineering.',
      'Accelerated median deal cycle from 52 days to 34 days by introducing structured technical success criteria during trial kickoff.',
    ],
    skills: ['PLG-to-Enterprise', 'Developer Empathy', 'CI/CD Workflows', 'Technical Discovery'],
  },
  {
    id: 'razorpay-gtm-analyst',
    track: 'sales',
    period: 'Jul 2021 – May 2022',
    role: 'Business Operations & GTM Analyst',
    organization: 'Razorpay',
    location: 'Bengaluru · FinTech Infrastructure',
    headlineMetric: '+18% Funnel Velocity via SQL Diagnostics',
    summary:
      'Built SQL-driven funnel instrumentation and pricing sensitivity models supporting RazorpayX B2B banking and payment gateway merchant onboarding.',
    highlights: [
      'Audited merchant KYC drop-off funnels in BigQuery, identifying document verification friction that informed a 18% improvement in activation speed.',
      'Automated weekly executive pipeline and cohort retention reporting across 120+ mid-market fintech accounts, saving 14 analyst hours weekly.',
    ],
    skills: ['SQL & BigQuery', 'Funnel Analytics', 'FinTech Onboarding', 'Pricing Analysis'],
  },
  {
    id: 'btech-cse',
    track: 'product',
    period: 'Aug 2017 – May 2021',
    role: 'B.Tech in Computer Science & Engineering',
    organization: 'National Institute of Technology',
    location: 'India · First Class with Distinction',
    distinction: 'CS Engineering Foundation',
    headlineMetric: '8.7 / 10 CGPA · Product & Tech Club Lead',
    summary:
      'Strong computer science fundamentals across distributed systems, relational databases, REST API design, and software engineering architecture.',
    highlights: [
      'Led the campus Product & Entrepreneurship Society (180+ members), organizing annual SaaS buildathons and developer workshops.',
      'Built full-stack web applications using React, Node.js, and PostgreSQL—enabling fluent architectural trade-off discussions with engineering counterparts.',
    ],
    skills: ['Computer Science', 'REST APIs', 'SQL Databases', 'System Architecture'],
  },
];

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    index: '01',
    title: 'Product Strategy & Execution',
    description:
      'Translating ambiguous user friction into disciplined PRDs, sharp scope trade-offs, and measurable shipped milestones.',
    items: [
      { name: 'Discovery & JTBD Research', context: '150+ enterprise buyer calls & 28 CFO interviews' },
      { name: 'PRDs & Technical Specifications', context: 'Clear user stories, edge cases, non-goals & acceptance criteria' },
      { name: 'Prioritization & Roadmapping', context: 'RICE scoring, Opportunity Solution Trees & milestone sequencing' },
      { name: 'Experimentation & Activation', context: 'A/B test hypotheses, funnel diagnostics & retention loops' },
    ],
  },
  {
    index: '02',
    title: 'Enterprise GTM & Commercial Rigor',
    description:
      'Rare product intuition forged on the front lines of $1.8M+ developer SaaS deals—bridging engineering reality with buyer economics.',
    items: [
      { name: 'PLG-to-Enterprise Motion', context: 'Self-serve trial activation, PQL scoring & expansion triggers' },
      { name: 'Pricing & Packaging Strategy', context: 'Concurrency-based tiering, ROI models & procurement alignment' },
      { name: 'Voice of Customer Synthesis', context: 'Structured win/loss patterns fed directly into roadmap cycles' },
      { name: 'Executive Stakeholder Alignment', context: 'Crisp narrative memos for VP Engineering, CFO & Sales leaders' },
    ],
  },
  {
    index: '03',
    title: 'Technical & Analytical Fluency',
    description:
      'Computer Science foundation paired with hands-on SQL, API architecture literacy, and modern product analytics tooling.',
    items: [
      { name: 'Data & Querying', context: 'SQL, BigQuery, Cohort Retention Tables, Excel/Sheets Modeling' },
      { name: 'Product Analytics', context: 'Amplitude, Mixpanel, Event Taxonomy & North Star Metric Trees' },
      { name: 'Developer Ecosystem', context: 'REST APIs, Webhooks, CI/CD (GitHub Actions, Jenkins), Playwright' },
      { name: 'Design & Delivery Tools', context: 'Figma Wireframing, Linear, Jira, Notion, Salesforce CRM' },
    ],
  },
];

export const TECH_STACK_ITEMS: TechStackItem[] = [
  {
    id: 'product-strategy',
    logo: 'product-strategy',
    name: 'Product Strategy & PRDs',
    category: 'product',
    categoryLabel: 'Product Craft',
    usageSummary: 'End-to-end specs, JTBD discovery, scope trade-offs & North Star alignment.',
    projects: ['FinPulse Treasury Copilot', 'Self-Serve Trial Orchestrator'],
    caseStudyId: 'finpulse-b2b-treasury',
  },
  {
    id: 'experimentation',
    logo: 'experimentation',
    name: 'RICE & A/B Testing',
    category: 'product',
    categoryLabel: 'Product Craft',
    usageSummary: 'Prioritization matrices, hypothesis framing & peak-hour conversion experiments.',
    projects: ['Split-Basket Checkout Recovery', 'NextLeap Teardowns'],
    caseStudyId: 'quickcommerce-checkout-recovery',
  },
  {
    id: 'react',
    logo: 'react',
    name: 'React',
    category: 'engineering',
    categoryLabel: 'Frontend & Web',
    usageSummary: 'Interactive UI prototypes, component architecture & engineering trade-off literacy.',
    projects: ['Interactive Portfolio & Prototypes', 'NIT CS Buildathons'],
  },
  {
    id: 'typescript',
    logo: 'typescript',
    name: 'TypeScript',
    category: 'engineering',
    categoryLabel: 'Frontend & Web',
    usageSummary: 'Typed domain schemas, API contracts & predictable frontend state modeling.',
    projects: ['Interactive Specs & Web Tooling', 'Developer Portal Flows'],
  },
  {
    id: 'cicd',
    logo: 'cicd',
    name: 'CI/CD & GitHub Actions',
    category: 'engineering',
    categoryLabel: 'DevTools & Infra',
    usageSummary: 'Automated YAML runner orchestration, ephemeral trial tokens & build telemetry.',
    projects: ['Self-Serve Trial Orchestrator', 'BrowserStack Mid-Market POCs'],
    caseStudyId: 'browserstack-trial-orchestrator',
  },
  {
    id: 'playwright',
    logo: 'playwright',
    name: 'Playwright & Selenium',
    category: 'engineering',
    categoryLabel: 'DevTools & Infra',
    usageSummary: 'Parallel cloud test grids, cross-browser automation & QA acceleration kits.',
    projects: ['Self-Serve Trial Orchestrator', 'BrowserStack Enterprise'],
    caseStudyId: 'browserstack-trial-orchestrator',
  },
  {
    id: 'rest-api',
    logo: 'rest-api',
    name: 'REST APIs & Node.js',
    category: 'engineering',
    categoryLabel: 'Backend Systems',
    usageSummary: 'Read-only banking OAuth aggregation, webhook pipelines & PostgreSQL schemas.',
    projects: ['FinPulse Multi-Bank Sync', 'NIT Full-Stack Systems'],
    caseStudyId: 'finpulse-b2b-treasury',
  },
  {
    id: 'sql-bigquery',
    logo: 'sql-bigquery',
    name: 'SQL & BigQuery',
    category: 'analytics',
    categoryLabel: 'Data & Telemetry',
    usageSummary: 'Concurrency saturation queries, KYC drop-off audits & cohort retention tables.',
    projects: ['Expansion Signal Engine', 'Razorpay KYC Diagnostics'],
    caseStudyId: 'enterprise-expansion-signal-engine',
  },
  {
    id: 'analytics',
    logo: 'analytics',
    name: 'Amplitude & Mixpanel',
    category: 'analytics',
    categoryLabel: 'Data & Telemetry',
    usageSummary: 'Event taxonomy design, activation funnel instrumentation & WAU retention loops.',
    projects: ['Trial Activation Funnel', 'Checkout Recovery Diagnostics'],
    caseStudyId: 'quickcommerce-checkout-recovery',
  },
  {
    id: 'figma',
    logo: 'figma',
    name: 'Figma Wireframing',
    category: 'design-gtm',
    categoryLabel: 'Design & UX',
    usageSummary: 'High-clarity user flows, interactive checkout sheets & executive dashboard mocks.',
    projects: ['FinPulse Treasury Copilot', 'Split-Basket Checkout'],
    caseStudyId: 'finpulse-b2b-treasury',
  },
  {
    id: 'salesforce',
    logo: 'salesforce',
    name: 'Salesforce & RevOps',
    category: 'design-gtm',
    categoryLabel: 'Enterprise GTM',
    usageSummary: 'Embedded PQL expansion cards, pipeline telemetry routing & AE workflow plays.',
    projects: ['Expansion Signal Engine', 'BrowserStack 38-AE Pod'],
    caseStudyId: 'enterprise-expansion-signal-engine',
  },
  {
    id: 'plg-gtm',
    logo: 'plg-gtm',
    name: 'PLG & Enterprise GTM',
    category: 'design-gtm',
    categoryLabel: 'Enterprise GTM',
    usageSummary: 'Usage-based pricing tiers, MEDDPICC discovery & $1.8M+ developer SaaS execution.',
    projects: ['BrowserStack Enterprise', 'RazorpayX B2B Funnel'],
    caseStudyId: 'enterprise-expansion-signal-engine',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Shankar operates more like an embedded Product Manager than a traditional enterprise rep. Instead of escalating isolated feature requests, he mapped our concurrency queue data into a repeatable expansion signal that our entire 38-person pod adopted.',
    beforeContext: 'Mid-cycle expansion conversations were reactive and tied only to renewal dates.',
    outcome: 'Generated +$420K in telemetry-backed expansion pipeline within two quarters.',
    author: 'Rohan Deshmukh',
    role: 'Regional Director, Enterprise Sales',
    organization: 'BrowserStack',
  },
  {
    quote:
      'Among hundreds of fellows, Shankar stood out immediately for his rare blend of technical fluency and commercial sharpness. His FinPulse treasury capstone had the metric discipline, edge-case rigor, and buyer empathy of a seasoned B2B PM.',
    beforeContext: 'Early fintech concepts often miss enterprise security and multi-entity reconciliation nuance.',
    outcome: 'Awarded Top 1% Cohort Distinction with unanimous panel commendation.',
    author: 'Ananya Kulkarni',
    role: 'Group Product Manager & Capstone Mentor',
    organization: 'NextLeap PM Fellowship',
  },
];

export const PLAIN_TEXT_CV = `SHANKAR NARAYAN BHATTACHARJEE
SaaS Product Manager | Enterprise GTM to Product
Bengaluru, India | snb2990@gmail.com | linkedin.com/in/shankarnarayanbhattacharjee

EXECUTIVE SUMMARY
Emerging SaaS Product Manager with a B.Tech in Computer Science, 4+ years of developer-first enterprise sales & GTM rigor at BrowserStack ($1.8M+ ARR influenced, 142% avg attainment), and Top 1% Product Management Fellowship distinction from NextLeap. Specialized in Developer Tools, PLG-to-Enterprise activation, usage telemetry, and 0-to-1 B2B SaaS execution.

EXPERIENCE & FELLOWSHIPS

Product Management Fellow (Top 1% Cohort Distinction) — NextLeap | Oct 2025 – Feb 2026
• Shipped FinPulse B2B Treasury Copilot capstone: 28 CFO discovery interviews, PRDs, RICE prioritization, and Figma wireframes.
• Executed quantitative product teardowns spanning SaaS activation funnels, quick-commerce checkout recovery, and cohort retention.

Senior Enterprise Account Executive — BrowserStack | Apr 2024 – Present
• Influenced $1.1M+ net-new and expansion ARR across NA & EMEA Fortune 1000 engineering teams (142% avg quarterly attainment).
• Co-authored internal Expansion Signal Engine using BigQuery concurrency saturation telemetry, generating +$420K PQL pipeline across 38 AEs.
• Synthesized technical feature-gap intelligence from 150+ VP Engineering & QA Director calls into quarterly product roadmap reviews.

Mid-Market Account Executive — BrowserStack | Jun 2022 – Mar 2024
• Closed $720K+ ARR across 65+ Series B–Pre-IPO SaaS accounts with 94% first-year logo retention.
• Diagnosed 4.2-day CI/CD trial onboarding drop-off and partnered with Solutions Engineering to build Playwright/GitHub Actions POC kits, cutting median deal cycle from 52 to 34 days.

Business Operations & GTM Analyst — Razorpay | Jul 2021 – May 2022
• Analyzed merchant KYC funnels in BigQuery, surfacing verification friction tied to an 18% improvement in onboarding velocity.
• Automated weekly pipeline and cohort reporting across 120+ fintech accounts, saving 14 analyst hours weekly.

EDUCATION
B.Tech in Computer Science & Engineering — National Institute of Technology | 2017 – 2021 (8.7/10 CGPA)

CORE CAPABILITIES
Product: PRDs, Discovery Interviews, RICE Prioritization, Metric Trees, A/B Experimentation, Wireframing (Figma)
Technical & Data: SQL, BigQuery, Amplitude, Mixpanel, REST APIs, Webhooks, CI/CD (GitHub Actions, Jenkins), Playwright, Linear
Commercial: PLG-to-Enterprise Activation, Pricing & Packaging, MEDDPICC Discovery, Usage Telemetry, Executive Storytelling
`;
