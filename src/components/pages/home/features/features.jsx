import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import AutoBackupIcon from './images/auto-backup.inline.svg';
import AutoScalingIcon from './images/auto-scaling.inline.svg';
import EdgeDeploymentIcon from './images/edge-deployment.inline.svg';
import HighAvailabilityIcon from './images/high-availability.inline.svg';
import OpenSourceIcon from './images/open-source.inline.svg';
import PayAsYouGoIcon from './images/pay-as-you-go.inline.svg';

const Features = () => (
  <section className="pt-40 bg-black">
    <Container>
      <Heading className="text-center" tag="h2" size="md" theme="white">
        Not an ordinary PostgreSQL as a service
      </Heading>
      <p className="mt-5 text-center text-white t-3xl max-w-[940px] mx-auto">
        The way Zenith extends PostgreSQL brings many essential features needed for modern projects
        development.
      </p>
      <ul className="grid grid-cols-12 mt-[92px] gap-x-10 gap-y-[92px]">
        <li className="col-span-3">
          <PayAsYouGoIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Pay as you go
          </Heading>
          <p className="mt-4 text-white t-xl">
            Being serverless allows using of resources on-demand, which significantly cuts the costs
            and brings pay as you go solution.
          </p>
        </li>
        <li className="col-span-3 col-start-5">
          <HighAvailabilityIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            High availability
          </Heading>
          <p className="mt-4 text-white t-xl">
            Zenith's architecture guarantees high availability even under peak load and 99.9999%
            uptime for Cloud users.
          </p>
        </li>
        <li className="col-span-3 col-start-9">
          <AutoBackupIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Auto-backup
          </Heading>
          <p className="mt-4 text-white t-xl">
            Cost efficient incremental auto backup functionality keeps your database save 24/7.
          </p>
        </li>
        <li className="col-span-3">
          <AutoScalingIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Auto scaling
          </Heading>
          <p className="mt-4 text-white t-xl">
            Handle peak time requests, with a flexible auto scale deployment solution, and pay for
            the actual usage.
          </p>
        </li>
        <li className="col-span-3 col-start-5">
          <EdgeDeploymentIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Edge deployment
          </Heading>
          <p className="mt-4 text-white t-xl">
            Have a database close to your users. Zenith is a perfect for serverless functions.
          </p>
        </li>
        <li className="col-span-3 col-start-9">
          <OpenSourceIcon />
          <Heading className="mt-6" tag="h3" size="sm" theme="white">
            Open source
          </Heading>
          <p className="mt-4 text-white t-xl">
            Check{' '}
            <Link to="/" theme="underline-primary-1">
              our repository
            </Link>{' '}
            to learn more about technologies which make Zenith great.
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Features;
