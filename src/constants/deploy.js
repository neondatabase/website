import annaStepanyan from 'images/agenda/anna-stepanyan.png';
import davidGomes from 'images/agenda/david-gomes.png';
import emSharnoff from 'images/agenda/em-sharnoff.png';
import georgeMacKerron from 'images/agenda/george-mackerron.png';
import heikkiLinnakangas from 'images/agenda/heikki-linnakangas.png';
import mahmoudAbdelwahab from 'images/agenda/mahmoud-abdelwahab.png';
import pranavAurora from 'images/agenda/pranav-aurora.jpeg';

const DEPLOY_AGENDA = [
  {
    event: 'Learn about the latest new features and improvements we released',
    company: 'Neon',
    time: '10:05 AM',
    speaker: { name: 'Keynote' },
    timestamp: '300',
  },
  {
    event: 'Demo #1 - New Feature',
    company: 'Neon',
    time: '10:19 AM',
    speaker: {
      name: 'David Gomes',
      role: 'Lead Engineer',
      avatar: davidGomes,
      bio: 'Lead Engineer',
      xUrl: 'https://x.com/davidrfgomes',
      linkedinUrl: 'https://www.linkedin.com/in/davidrfgomes/',
    },
    timestamp: '1140',
  },
  {
    event: 'Demo #2 - New Postgres Extension',
    company: 'Neon',
    time: '10:28 AM',
    speaker: {
      name: 'George MacKerron',
      role: 'Software Engineer',
      avatar: georgeMacKerron,
      bio: 'Software Engineer',
      xUrl: 'https://x.com/jawj',
      linkedinUrl: 'https://www.linkedin.com/in/georgemackerron/',
    },
    timestamp: '1680',
  },
  {
    event: 'Demo #3 - New Postgres Extension',
    company: 'Mooncake Labs',
    time: '10:39 AM',
    speaker: {
      name: 'Pranav Aurora',
      role: 'Co-Founder of Mooncake Labs',
      avatar: pranavAurora,
      bio: 'Co-Founder of Mooncake Labs',
      linkedinUrl: 'https://www.linkedin.com/in/pranav-aurora/',
    },
    timestamp: '2340',
  },
  {
    event: "What's new in Neon? Feature recap since GA",
    company: 'Neon',
    time: '10:44 AM',
    speaker: {
      name: 'Anna Stepanyan',
      role: 'Head of Product',
      avatar: annaStepanyan,
      bio: 'Head of Product',
      linkedinUrl: 'https://www.linkedin.com/feed/',
    },
    timestamp: '2640',
  },
  {
    event: 'Performance improvements in Postgres 17',
    company: 'Neon',
    time: '10:47 AM',
    speaker: {
      name: 'Heikki Linnakangas',
      role: 'Co-Founder & Postgres Hacker',
      avatar: heikkiLinnakangas,
      bio: 'Co-Founder & Postgres Hacker',
      linkedinUrl: 'https://www.linkedin.com/in/heikki-linnakangas-6b58bb203/',
    },
    timestamp: '2820',
  },
  {
    event: "How Neon's Autoscaling works",
    company: 'Neon',
    time: '10:50 AM',
    speaker: {
      name: 'Em Sharnoff',
      role: 'Software Engineer',
      avatar: emSharnoff,
      bio: 'Software Engineer',
      linkedinUrl: 'https://www.linkedin.com/in/em-sharnoff/',
    },
    timestamp: '3000',
  },
  {
    event: 'Postgres for AI agents and GitHub Copilot',
    description: 'Learn why Postgres on Neon is a perfect match for AI coding agents.',
    company: 'Neon',
    time: '10:54 AM',
    speaker: {
      name: 'Mahmoud Abdelwahab',
      role: 'Developer Advocate',
      avatar: mahmoudAbdelwahab,
      bio: 'Mahmoud is a Software Engineer passionate about Developer Tools. He works at the intersection of Product, Marketing, Education, and Community.',
      githubUrl: 'https://github.com/m-abdlwahab',
      linkedinUrl: 'https://www.linkedin.com/in/thisismahmoud/',
    },
    timestamp: '3240',
  },
];

export { DEPLOY_AGENDA };
