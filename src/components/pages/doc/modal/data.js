import LINKS from 'constants/links';

const MODALS = [
  {
    type: 'migrate',
    breadcrumb: 'Migrate to Neon',
    title: 'Migrating to Neon?',
    description: 'Our team can help minimize downtime.',
    link: {
      title: 'Get migration assistance',
      url: LINKS.migrationAssistance,
    },
  },
  {
    type: 'support',
    breadcrumb: 'Support',
    title: 'Need help now?',
    description: 'Please reach out to our Support team!',
    link: {
      title: 'Get support',
      url: LINKS.consoleSupport,
    },
  },
];

export default MODALS;
