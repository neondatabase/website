import LINKS from 'constants/links';

// pagesToShow - array of page titles and sections where the modal should be shown
// 'Neon Docs' - show modal on the introduction page
const MODALS = [
  {
    id: 'migrate',
    pagesToShow: ['Migrate to Neon'],
    title: 'Migrating to Neon?',
    description: 'Our team can help minimize downtime.',
    link: {
      title: 'Get migration assistance',
      url: LINKS.migrationAssistance,
    },
  },
  {
    id: 'support',
    pagesToShow: ['Support'],
    title: 'Need help now?',
    description: 'Please reach out to our Support team!',
    link: {
      title: 'Get support',
      url: LINKS.consoleSupport,
    },
  },
];

export default MODALS;
