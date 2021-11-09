import clsx from 'clsx';
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

const items = [
  {
    icon: PayAsYouGoIcon,
    title: 'Pay as You Go',
    description:
      'Being serverless allows using of resources on-demand, which significantly cuts the costs and brings pay as you go solution.',
  },
  {
    icon: HighAvailabilityIcon,
    title: 'High Availability',
    description: `Zenith's architecture guarantees high availability even under peak load and 99.9999% uptime for Cloud users.`,
  },
  {
    icon: AutoBackupIcon,
    title: 'Auto-Backup',
    description:
      'Cost efficient incremental auto backup functionality keeps your database save 24/7.',
  },
  {
    icon: AutoScalingIcon,
    title: 'Auto Scaling',
    description:
      'Handle peak time requests, with a flexible auto scale deployment solution, and pay for the actual usage.',
    tag: {
      className: 'text-secondary-4 border-secondary-4',
      text: 'Coming Soon',
    },
  },
  {
    icon: EdgeDeploymentIcon,
    title: 'Edge Deployment',
    description:
      'Have a database close to your users. Zenith is a perfect for serverless functions.',
    tag: {
      className: 'text-secondary-2 border-secondary-2',
      text: 'Coming Soon',
    },
  },
  {
    icon: OpenSourceIcon,
    title: 'Open Source',
    description: (
      <>
        Check{' '}
        <Link to="/" theme="underline-primary-1">
          our repository
        </Link>{' '}
        to learn more about technologies which make Zenith great.
      </>
    ),
  },
];

const Features = () => (
  <section className="pt-40 mt-48 bg-black safe-paddings 3xl:pt-36 3xl:mt-44 2xl:pt-32 2xl:mt-40 xl:pt-28 xl:mt-32 lg:pt-20 lg:mt-24 md:pt-16 md:mt-20">
    <Container>
      <Heading className="text-center lg:max-w-[460px] lg:mx-auto" tag="h2" size="md" theme="white">
        Not an ordinary PostgreSQL as a service
      </Heading>
      <p className="mt-5 text-center text-white t-3xl max-w-[940px] mx-auto 2xl:max-w-[800px] 2xl:mt-4 xl:max-w-[610px] xl:mt-3.5 lg:max-w-[580px]">
        The way Zenith extends PostgreSQL brings many essential features needed for modern projects
        development.
      </p>
      <ul className="grid grid-cols-12 mt-[92px] grid-gap gap-y-[92px] 2xl:mt-[76px] 2xl:gap-y-[76px] xl:mt-16 xl:gap-y-16 md:grid-cols-1">
        {items.map(({ icon: Icon, title, description, tag }, index) => (
          <li
            className="col-span-4 max-w-[410px] 3xl:max-w-[340px] 2xl:max-w-[312px] xl:max-w-[261px] lg:col-span-6 lg:max-w-[300px] md:max-w-none"
            key={index}
          >
            <div className="flex items-end space-x-4 xl:space-x-3.5">
              <Icon className="h-24 2xl:h-20 xl:h-[72px] lg:h-16" aria-hidden />
              {tag?.text && (
                <span
                  className={clsx(
                    'inline-block font-mono t-sm px-2.5 border-2 rounded-full mr-3 py-1',
                    tag.className
                  )}
                >
                  {tag.text}
                </span>
              )}
            </div>
            <Heading className="mt-6 xl:mt-5" tag="h3" size="sm" theme="white">
              {title}
            </Heading>
            <p className="mt-4 text-white t-xl xl:mt-3.5">{description}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
