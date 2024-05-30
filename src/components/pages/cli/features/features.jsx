import React from 'react';

import CardItemsList from 'components/shared/card-items-list';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

import contributeIcon from './images/contribute.svg';
import scriptIcon from './images/script.svg';
import workflowIcon from './images/workflow.svg';

const items = [
  {
    icon: contributeIcon,
    title: 'Your full Neon workflow',
    description: 'Manage projects, databases, branches, roles, and more.',
    linkText: 'View all Neon CLI commands',
    url: LINKS.cliReference,
  },
  {
    icon: scriptIcon,
    title: 'Script and automate',
    description: 'Use the Neon CLI to script almost any action in Neon.',
    linkText: 'Learn about branching with the CLI',
    url: '/docs/guides/branching-neon-cli',
  },
  {
    icon: workflowIcon,
    title: 'Contribute',
    description: 'Neon CLI is open source. Contribute to our GitHub repo.',
    linkText: 'Contribute to Neon CLI',
    url: 'https://github.com/neondatabase/neonctl',
  },
];

const Features = () => (
  <section className="safe-paddings py-[80px] md:py-16 sm:py-10">
    <Container size="960">
      <Heading
        className="mx-auto max-w-3xl text-center text-[52px] font-medium leading-none tracking-extra-tight xl:max-w-[640px] xl:text-[44px] lg:max-w-xl lg:text-4xl md:max-w-md md:text-[32px]"
        tag="h2"
      >
        Cut out the clicks. Command Neon Postgres from the terminal
      </Heading>
      <CardItemsList
        className="mt-14 gap-x-[18px] xl:mt-10 xl:gap-x-6 lg:gap-x-4 md:mt-8 md:gap-y-4"
        items={items}
        size="lg"
      />
    </Container>
  </section>
);

export default Features;
