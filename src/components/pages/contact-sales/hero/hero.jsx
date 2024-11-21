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
  },
];

const Hero = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  return (
    <section className="relative z-10 grow overflow-hidden bg-black-pure pb-36 pt-[136px] xl:py-32 lg:py-28 md:pb-20 md:pt-[100px]">
      <Container className="xl:px-8 md:px-5" size="1152">
        <div className="flex gap-[90px] xl:gap-8 lg:mx-auto lg:max-w-xl lg:flex-col lg:gap-14 sm:gap-10">
          <div className="w-[480px] pt-8 xl:w-96 lg:w-full lg:pt-0 lg:text-center">
            <Heading
              className="font-title text-[68px] font-medium leading-none tracking-tight text-white xl:text-[56px] lg:text-[48px] md:text-[40px]"
              tag="h1"
              theme="white"
            >
              Let&apos;s Connect
            </Heading>
            <p className="mt-4 text-xl tracking-tight text-gray-new-80 lg:mt-3 lg:text-lg md:text-base">
              We&apos;re happy to assist you with any questions about our tech, pricing plans,
              custom contract options, and&nbsp;migrations assistance.
            </p>
            <div className="mt-5 flex flex-col gap-3.5 lg:mt-[18px] lg:flex-row lg:justify-center lg:gap-8 md:flex-wrap md:gap-x-4 md:gap-y-2.5">
              {CERTIFICATES.map(({ title, description, icon }) => (
                <div className="flex items-center gap-4 lg:gap-2" key={title}>
                  <Image src={icon} alt={title} width={24} height={24} />
                  <p className="flex gap-2 text-lg leading-none tracking-tight text-gray-new-80 lg:text-base">
                    {title} <span className="text-gray-new-40">{description}</span>
                  </p>
                </div>
              ))}
            </div>
            <Link
              className="mt-9 text-lg font-medium leading-none tracking-tight lg:mx-auto lg:mt-8 sm:mt-7 sm:text-base"
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
        <div className="mt-[88px] grid grid-cols-4 gap-8 xl:mt-20 xl:gap-5 lg:grid-cols-2 md:mt-20 sm:mt-16 sm:grid-cols-1">
          {CASE_STUDIES.map(({ title, description, logo, link }, index) => (
            <Link
              className={clsx(
                'group relative h-44 rounded-xl border border-gray-new-10 bg-[#0A0A0C] p-5 shadow-contact xl:h-[168px] xl:p-[18px] lg:h-[134px] md:h-32 md:p-4',
                index === 0 && 'lg:-order-1',
                index === 3 && 'lg:-order-1 sm:-order-2'
              )}
              to={link}
              key={title}
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
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
              </div>
              {index === 3 && (
                <div
                  className={clsx(
                    'pointer-events-none absolute -inset-px rounded-[inherit] bg-[radial-gradient(85%_58%_at_70%_0%,rgba(14,23,27,.9),#151E2300)]',
                    'transition-opacity duration-300 group-hover:opacity-0',
                    'before:absolute before:inset-px before:rounded-[inherit] before:bg-[#0A0A0C] before:bg-[radial-gradient(100%_132%_at_63%_-27%,#0E171BE6,#0E171B00)]'
                  )}
                  aria-hidden
                />
              )}
              <div
                className={clsx(
                  'pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(67deg,rgba(82,156,160,.14)_16%,rgba(82,156,160,.7))]',
                  'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                  'before:absolute before:inset-px before:rounded-[inherit] before:bg-[radial-gradient(75%_95%_at_84%_0%,rgba(24,62,65,.8),rgba(10,18,18,.9))]'
                )}
                aria-hidden
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
