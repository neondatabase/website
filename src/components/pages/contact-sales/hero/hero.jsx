'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';

import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link/link';
import { FORM_STATES } from 'constants/forms';
import LINKS from 'constants/links';
import certGDPRIcon from 'images/pages/contact-sales/cert-gdpr.svg';
import certISOIcon from 'images/pages/contact-sales/cert-iso.svg';
import certSOC2Icon from 'images/pages/contact-sales/cert-soc2.svg';
import invenco from 'images/pages/contact-sales/invenco.svg';
import mindvalley from 'images/pages/contact-sales/mindvalley.svg';
import retool from 'images/pages/contact-sales/retool.svg';
import wordware from 'images/pages/contact-sales/wordware.svg';

import ContactForm from './contact-form';

const CERTIFICATES = [
  {
    title: 'SOC 2',
    description: 'Certified',
    icon: certSOC2Icon,
  },
  {
    title: 'GDPR',
    description: 'Compliant',
    icon: certGDPRIcon,
  },
  {
    title: 'ISO 27001',
    description: 'Compliant',
    icon: certISOIcon,
  },
];

const CASE_STUDIES = [
  {
    title: '5x faster to spin upficient',
    description: 'environments via branching',
    logo: {
      src: mindvalley,
      alt: 'Mindvalley',
      width: 118,
      height: 24,
    },
    link: `${LINKS.blog}/how-mindvalley-minimizes-time-to-launch-with-neon-branches`,
  },
  {
    title: '300k+ databases',
    description: 'managed by 1 engineer',
    logo: {
      src: retool,
      alt: 'Retool',
      width: 100,
      height: 24,
    },
    link: `${LINKS.blog}/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases`,
  },
  {
    title: '95% fewer migration issues',
    description: 'thanks to preview branches',
    logo: {
      src: wordware,
      alt: 'Wordware',
      width: 125,
      height: 24,
    },
    link: `${LINKS.blog}/building-ai-agents-just-got-faster-with-wordware-and-neon`,
  },
  {
    title: '80% savings',
    description: 'in&nbsp;database costs',
    logo: {
      src: invenco,
      alt: 'Invenco',
      width: 98,
      height: 24,
    },
    link: `${LINKS.blog}/why-invenco-migrated-from-aurora-serverless-v2-to-neon`,
    className:
      'border-0 bg-gray-new-10 bg-[radial-gradient(85.43%_58.72%_at_70.83%_0%,#1D2930,#151E2300)] hover:bg-gray-new-50 hover:bg-none ' +
      'before:pointer-events-none before:absolute before:inset-px before:rounded-[inherit] ' +
      'before:bg-[#0A0A0C] before:bg-[radial-gradient(100%_132%_at_63%_-27%,#0E171BE6,#0E171B00)]',
  },
];

const Hero = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  return (
    <section className="relative z-10 grow overflow-hidden bg-black-pure pb-36 pt-[136px] lg:pb-28 lg:pt-20 md:pb-24 md:pt-16">
      <Container className="xl:px-8 md:px-5" size="1152">
        <div className="flex gap-[90px] xl:gap-12 lg:flex-col lg:gap-10">
          <div className="w-[480px] pt-7 xl:w-[400px] lg:w-full">
            <Heading
              className="font-title text-[68px] font-medium leading-none tracking-tight text-white 2xl:text-[56px] md:text-[36px]"
              tag="h1"
              theme="white"
            >
              Let's Connect
            </Heading>
            <p className="mt-4 text-xl tracking-tight text-gray-new-80 md:text-base">
              We're happy to assist you with any questions about our tech, pricing plans, custom
              contract options, and&nbsp;migrations assistance.
            </p>
            <div className="mt-6 space-y-4">
              {CERTIFICATES.map(({ title, description, icon }) => (
                <div className="flex items-center gap-4" key={title}>
                  <Image src={icon} alt={title} width={24} height={24} />
                  <p className="flex gap-2 text-lg leading-none tracking-tight text-gray-new-80">
                    {title} <span className="text-gray-new-40">{description}</span>
                  </p>
                </div>
              ))}
            </div>
            <Link
              className="mt-9 text-lg font-medium tracking-tight"
              theme="green"
              to={LINKS.contactSales}
              withArrow
            >
              Book a meeting directly
            </Link>
          </div>
          <div className="relative flex-1">
            <ContactForm formState={formState} setFormState={setFormState} />
          </div>
        </div>
        <div className="mt-[88px] grid grid-cols-4 gap-8 xl:gap-6 lg:grid-cols-2 md:mt-20 sm:mt-16 sm:grid-cols-1">
          {CASE_STUDIES.map(({ title, description, logo, link, className }) => (
            <Link
              className={clsx(
                'group relative flex h-44 flex-col justify-between rounded-xl border border-gray-new-10 bg-[#0A0A0C] p-5 shadow-contact',
                'transition-colors hover:border-gray-new-50',
                className
              )}
              to={link}
              key={title}
            >
              <p className="relative text-xl font-medium leading-snug tracking-tight text-white xl:text-lg">
                {title}{' '}
                <span
                  className="font-light text-gray-new-60"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </p>
              <Image
                className="relative"
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
              />
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -left-[324px] -top-[273px] size-[706px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,41,62,.55),rgba(30,41,62,0))]" />
          <div className="absolute -right-[214px] bottom-2 size-[725px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,52,62,.4)_20%,rgba(30,52,62,0))]" />
        </div>
      </Container>
    </section>
  );
};

export default Hero;
