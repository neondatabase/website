import annaStepanyan from 'images/agenda/anna-stepanyan.png';
import davidGomes from 'images/agenda/david-gomes.png';
import emSharnoff from 'images/agenda/em-sharnoff.png';
import georgeMacKerron from 'images/agenda/george-mackerron.png';
import heikkiLinnakangas from 'images/agenda/heikki-linnakangas.png';
import mahmoudAbdelwahab from 'images/agenda/mahmoud-abdelwahab.png';

const DEPLOY_AGENDA = [
  {
    event: 'Learn about the latest new features and improvements we released',
    company: 'Neon',
    time: '10:05 AM',
    speaker: { name: 'Keynote' },
    timestamp: '300',
  },
  {
    event: 'New Feature Demo',
    company: 'Neon',
    time: '11:45 AM', // Example time, adjust as needed
    speaker: {
      name: 'David Gomes',
      role: 'Lead Engineer',
      avatar: davidGomes,
      bio: 'Lead Engineer',
      xUrl: 'https://x.com/davidrfgomes',
      linkedinUrl: 'https://www.linkedin.com/in/davidrfgomes/',
    },
    timestamp: '6300', // Example timestamp, adjust as needed
  },
  {
    event: 'New Postgres Extension',
    company: 'Neon',
    time: '12:00 PM', // Example time, adjust as needed
    speaker: {
      name: 'George MacKerron',
      role: 'Software Engineer',
      avatar: georgeMacKerron,
      bio: 'Software Engineer',
      xUrl: 'https://x.com/jawj',
      linkedinUrl: 'https://www.linkedin.com/in/georgemackerron/',
    },
    timestamp: '7200', // Example timestamp, adjust as needed
  },
  {
    event: "What's new in Neon? Feature recap since GA",
    company: 'Neon',
    time: '12:15 PM', // Example time, adjust as needed
    speaker: {
      name: 'Anna Stepanyan',
      role: 'Head of Product',
      avatar: annaStepanyan,
      bio: 'Head of Product',
      linkedinUrl: 'https://www.linkedin.com/feed/',
    },
    timestamp: '8100', // Example timestamp, adjust as needed
  },
  {
    event: 'Performance improvements in Postgres 17',
    company: 'Neon',
    time: '12:45 PM', // Example time, adjust as needed
    speaker: {
      name: 'Heikki Linnakangas',
      role: 'Co-Founder & Postgres Hacker',
      avatar: heikkiLinnakangas,
      bio: 'Co-Founder & Postgres Hacker',
      linkedinUrl: 'https://www.linkedin.com/in/heikki-linnakangas-6b58bb203/',
    },
    timestamp: '9900', // Example timestamp, adjust as needed
  },
  {
    event: "How Neon's Autoscaling works",
    company: 'Neon',
    time: '12:30 PM', // Example time, adjust as needed
    speaker: {
      name: 'Em Sharnoff',
      role: 'Software Engineer',
      avatar: emSharnoff,
      bio: 'Software Engineer',
      linkedinUrl: 'https://www.linkedin.com/in/em-sharnoff/',
    },
    timestamp: '9000', // Example timestamp, adjust as needed
  },

  {
    event: 'Postgres for Agents: databases for the next generation of apps',
    description: 'Learn why Postgres on Neon is a perfect match for AI coding agents.',
    company: 'Neon',
    time: '10:20 AM',
    speaker: {
      name: 'Mahmoud Abdelwahab',
      role: 'Developer Advocate',
      avatar: mahmoudAbdelwahab,
      bio: 'Mahmoud is a Software Engineer passionate about Developer Tools. He works at the intersection of Product, Marketing, Education, and Community.',
      githubUrl: 'https://github.com/m-abdlwahab',
      linkedinUrl: 'https://www.linkedin.com/in/thisismahmoud/',
    },
    timestamp: '1200',
  },
];

export { DEPLOY_AGENDA };
