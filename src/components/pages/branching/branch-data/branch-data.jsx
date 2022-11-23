import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import InstantIcon from './images/instant.inline.svg';
import SeamlessIcon from './images/seamless.inline.svg';

const items = [
  {
    icon: InstantIcon,
    title: 'Instant branches',
    description:
      'Neon’s <a href="/">copy-on-write technique</a> makes branching instantaneous and cost-effective.',
  },
  {
    icon: SeamlessIcon,
    title: 'Seamless integration',
    description: 'Integrate branching into your CI/CD pipeline using the <a href="/">Neon API</a>.',
  },
];

const BranchData = () => (
  <section className="branch-data safe-padding bg-black pt-44 pb-28 text-white">
    <Container className="grid-gap-x grid grid-cols-10 items-start" size="sm">
      <Heading className="t-5xl col-span-3 font-bold leading-snug" tag="h2">
        Branch your data with single click or API call
      </Heading>
      <div className="grid-gap col-start-5 col-end-11 grid grid-cols-2">
        {items.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="flex max-w-[360px] flex-col items-start">
            <Icon className="h-20 w-20" />
            <Heading className="mt-5 text-[26px] font-bold leading-dense" tag="h3">
              {title}
            </Heading>
            <p
              className="with-link-primary mt-2 text-lg leading-snug"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default BranchData;
