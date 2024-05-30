import React from 'react';

import CardItemsList from 'components/shared/card-items-list';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';

import chatbotIcon from './images/chatbot.svg';
import imageSearchIcon from './images/image-search.svg';
import semanticSearchIcon from './images/semantic-search.svg';

const items = [
  {
    icon: chatbotIcon,
    title: 'Your full Neon workflow',
    description: 'Manage projects, databases, branches, roles, and more.',
    link: 'View all Neon CLI commands',
    url: LINKS.cliReference,
  },
  {
    icon: semanticSearchIcon,
    title: 'Script and automate',
    description: 'Use the Neon CLI to script almost any action in Neon.',
    link: 'Learn about branching with the CLI',
    url: LINKS.cliReference,
  },
  {
    icon: imageSearchIcon,
    title: 'Contribute',
    description: 'Neon CLI is open source. Contribute to our GitHub repo.',
    link: 'Contribute to Neon CLI',
    url: LINKS.cliReference,
  },
];

const Examples = () => (
  <section className="safe-paddings mt-40 bg-black-pure xl:mt-[120px] lg:mt-28 md:mt-20">
    <Container size="medium" className="grid grid-cols-12 gap-x-10 xl:gap-x-6 md:gap-x-4">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <Heading
          className="max-w-3xl text-center text-[52px] font-medium leading-none tracking-extra-tight xl:mt-4 xl:text-[44px] lg:text-4xl md:mt-3 md:max-w-xs md:text-[32px]"
          tag="h2"
        >
          Cut out the clicks. Command Neon Postgres from the terminal
        </Heading>
        <CardItemsList
          className="mt-14 gap-x-7 xl:mt-10 xl:gap-x-6 lg:gap-x-4 md:mt-8 md:gap-y-4"
          items={items}
          size="lg"
        />
      </div>
    </Container>
  </section>
);

export default Examples;
