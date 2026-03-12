import LINKS from 'constants/links';

export default [
  {
    planId: 'free',
    type: 'Free',
    title: '$0',
    subtitle: 'Build and learn free with no time limits and no credit card required.',
    price: 0,
    features: {
      database: {
        title: 'Database',
        features: [
          {
            title: '100 projects',
            info: '<p>A project is a top-level container<br/> for your database environment.</p>',
            moreLink: { text: 'Read more', href: '#what-is-a-project' },
          },
          {
            title: '100 CU-hrs monthly per project',
            info: '<p>CU-hour = CU x active hours</p><p>1 CU ≈ 4 GB RAM</p>',
            moreLink: { text: 'Read more', href: '#compute-usage' },
          },
          {
            title: '0.5 GB of storage per project',
          },
          {
            title: 'Sizes up to 2 CU (8 GB RAM)',
          },
        ],
      },
      other: {
        title: 'Features',
        features: [
          { title: 'Neon Auth: 60K MAUs' },
          { title: '6-hr time travel/restores' },
          { title: 'Access to Autoscaling, Branching, Read Replicas' },
        ],
      },
    },
    button: {
      url: LINKS.signup,
      text: 'Try Neon',
      event: 'Hero Free Tier Panel',
    },
  },
  {
    planId: 'launch',
    type: 'Launch',
    title: 'Usage-based',
    highlighted: true,
    hasDynamicPricing: true,
    computeRate: 0.106,
    storageRate: 0.35,
    features: {
      database: {
        title: 'Database',
        features: [
          {
            title: '100 projects',
            info: '<p>A project is a top-level container<br/> for your database environment.</p>',
            moreLink: { text: 'Read more', href: '#what-is-a-project' },
          },
          {
            title: '$0.106 per CU-hr',
            info: '<p>CU-hour = CU x active hours</p><p>1 CU ≈ 4 GB RAM</p>',
            moreLink: { text: 'Read more', href: '#compute-usage' },
          },
          {
            title: '$0.35 per GB-month',
          },
          { title: 'Sizes up to 16 CU (64 GB RAM)' },
        ],
      },
      other: {
        title: 'All features in free, plus...',
        features: [
          { title: 'Neon Auth: 1M MAUs' },
          { title: '7-day time travel/restores' },
          { title: '3-day metrics/logs in UI' },
        ],
      },
    },
    button: {
      url: `${LINKS.console}/app/billing#plans`,
      text: 'Get started',
      theme: 'primary',
      event: 'Hero Launch Panel',
    },
  },
  {
    planId: 'scale',
    type: 'Scale',
    title: 'Usage-based',
    hasDynamicPricing: true,
    computeRate: 0.222,
    storageRate: 0.35,
    features: {
      database: {
        title: 'Database',
        features: [
          {
            title: '1,000+ projects',
            info: '<p>A project is a top-level container<br/> for your database environment.</p>',
            moreLink: { text: 'Read more', href: '#what-is-a-project' },
          },
          {
            title: '$0.222 per CU-hr',
            info: '<p>CU-hour = CU x active hours</p><p>1 CU ≈ 4 GB RAM</p>',
            moreLink: { text: 'Read more', href: '#compute-usage' },
          },
          {
            title: '$0.35 per GB-month',
          },
          { title: 'Sizes up to 56 CU (224 GB RAM)' },
        ],
      },
      other: {
        title: 'All features in launch, plus...',
        features: [
          { title: '30-day time travel/restores' },
          { title: '14-day metrics/logs in UI' },
          { title: 'Metrics/logs export (Otel, Datadog)' },
          { title: 'Private network, IP Allow rules' },
          {
            title: 'SLAs, SOC2, HIPAA',
            info: '<p>HIPAA incurs additional costs.</p>',
            moreLink: { text: 'Read more', href: '/docs/security/hipaa' },
          },
        ],
      },
    },
    button: {
      url: `${LINKS.console}/app/billing#plans`,
      text: 'Get started',
      theme: 'primary',
      event: 'Hero Scale Panel',
    },
  },
];
