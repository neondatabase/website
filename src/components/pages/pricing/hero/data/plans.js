import LINKS from 'constants/links';

export default [
  {
    planId: 'free',
    type: 'Free',
    title: '$0',
    subtitle: 'No card required',
    price: 0,
    description: 'For prototypes and side projects',
    features: [
      {
        icon: 'projects',
        title: '80 projects',
        info: '<p>A project is a top-level container<br/> for your database environment.</p>',
        moreLink: { text: 'Read more', href: '#what-is-a-project' },
      },
      {
        icon: 'clock',
        title: '100 CU-hours per project',
        info: '<p>CU-hour = CU x active hours (compute usage)</p><p>1 CU ≈ 4 GB RAM</p>',
        moreLink: { text: 'Read more', href: '#compute-usage' },
      },
      {
        icon: 'storage',
        title: '0.5 GB per project',
      },
      {
        icon: 'autoscale',
        title: 'Sizes to 2 CU',
        subtitle: '(8 GB RAM)',
      },
    ],
    otherFeatures: {
      title: 'Features',
      features: [
        { title: 'Auth', tag: 'new' },
        { title: 'Autoscaling' },
        { title: 'Read replicas' },
        { title: 'Built-in high availability' },
      ],
    },
    button: {
      url: LINKS.signup,
      event: 'Hero Free Tier Panel',
      analyticsEvent: 'pricing_page_get_started_with_free_plan_clicked',
    },
  },
  {
    planId: 'launch',
    type: 'Launch',
    title: 'Usage-based',
    subtitle: 'No monthly minimum',
    highlighted: true,
    price: 5,
    priceFrom: true,
    description: 'For startups and growing teams',
    features: [
      {
        icon: 'projects',
        title: '100 projects',
        info: '<p>A project is a top-level container<br/> for your database environment.</p>',
        moreLink: { text: 'Read more', href: '#what-is-a-project' },
      },
      {
        icon: 'clock',
        title: '$0.106 per CU-hour compute',
        info: '<p>CU-hour = CU x active hours (compute usage)</p><p>1 CU ≈ 4 GB RAM</p>',
        moreLink: { text: 'Read more', href: '#compute-usage' },
      },
      {
        icon: 'storage',
        title: '$0.35 per GB-month storage',
      },
      { icon: 'autoscale', title: 'Sizes up to 16 CU', subtitle: '(64 GB RAM)' },
    ],
    otherFeatures: {
      title: 'All features in Free, plus',
      features: [{ title: '7-day time travel/PITR' }, { title: '3-day monitoring retention' }],
    },
    button: {
      url: `${LINKS.console}/app/billing#plans`,
      theme: 'primary',
      event: 'Hero Launch Panel',
      analyticsEvent: 'pricing_page_get_started_with_launch_plan_clicked',
    },
  },
  {
    planId: 'scale',
    type: 'Scale',
    title: 'Usage-based',
    subtitle: 'No monthly minimum',
    price: 50,
    priceFrom: true,
    description: 'For the most demanding workloads',
    features: [
      {
        icon: 'projects',
        title: '1,000+ projects',
        info: '<p>Accounts needing more than 1k projects<br/> can contact support for a limit increase.</p>',
        moreLink: { text: 'Read more', href: '#what-is-a-project' },
      },
      {
        icon: 'clock',
        title: '$0.222 per CU-hour compute',
        info: '<p>CU-hour = CU x active hours (compute usage)</p><p>1 CU ≈ 4 GB RAM</p>',
        moreLink: { text: 'Read more', href: '#compute-usage' },
      },
      {
        icon: 'storage',
        title: '$0.35 per GB-month storage',
      },
      { icon: 'autoscale', title: 'Sizes up to 56 CU', subtitle: '(224 GB RAM)' },
    ],
    otherFeatures: {
      title: 'All features in Launch, plus',
      features: [
        { title: '30-day time travel/PITR' },
        { title: '14-day monitoring retention' },
        { title: 'Metrics / logs export' },
        { title: 'Private Network / IP Rules' },
        { title: '99.95% SLA' },
        { title: 'SOC 2 Report, HIPAA Available' },
      ],
    },
    button: {
      url: `${LINKS.console}/app/billing#plans`,
      theme: 'primary',
      event: 'Hero Scale Panel',
      analyticsEvent: 'pricing_page_get_started_with_scale_plan_clicked',
    },
  },
];
