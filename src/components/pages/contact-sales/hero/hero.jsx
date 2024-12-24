import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import certGDPRIcon from 'images/pages/contact-sales/cert-gdpr.svg';
import certISOIcon from 'images/pages/contact-sales/cert-iso.svg';
import certSOC2Icon from 'images/pages/contact-sales/cert-soc2.svg';
import invenco from 'images/pages/contact-sales/invenco.svg';
import mindvalley from 'images/pages/contact-sales/mindvalley.svg';
import retool from 'images/pages/contact-sales/retool.svg';
import wordware from 'images/pages/contact-sales/wordware.svg';

import CaseStudies from './case-studies';
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
    title: '5x faster to spin up',
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

const Hero = () => (
  <section className="relative z-10 grow overflow-hidden bg-black-pure pb-36 pt-[168px] xl:pb-20 xl:pt-32 lg:py-28 md:py-[100px]">
    <Container className="xl:max-w-5xl lg:max-w-3xl md:px-5" size="1216">
      <div className="flex justify-between lg:mx-auto lg:max-w-xl lg:flex-col lg:gap-14">
        <div className="flex max-w-xl flex-1 flex-col pt-8 xl:max-w-[448px] lg:max-w-full lg:items-center lg:pt-0 lg:text-center">
          <div className="flex max-w-[544px] flex-col xl:max-w-sm lg:max-w-full lg:items-center">
            <Heading
              className="relative w-fit font-title text-[56px] font-medium leading-none tracking-tight text-white xl:text-[48px] lg:text-[40px]"
              tag="h1"
              theme="white"
            >
              Let&apos;s Connect
              <span
                className={clsx(
                  'pointer-events-none absolute left-0 top-0 -z-10 size-[706px] translate-x-[-45%] translate-y-[-40%] rounded-full',
                  'bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,41,62,.65),transparent)]',
                  'xl:size-[596px] lg:size-[596px] sm:size-[466px]'
                )}
                aria-hidden
              />
            </Heading>
            <p className="mt-4 text-pretty text-xl leading-snug tracking-tight text-gray-new-80 xl:text-lg xl:leading-normal lg:mt-3 md:text-base">
              We&apos;re happy to assist you with any questions about our technology, pricing plans,
              custom contract options, and&nbsp;migrations assistance.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3.5 xl:gap-x-[52px] lg:mt-[18px] lg:flex-row lg:justify-center lg:gap-8 lg:gap-x-5 md:flex-wrap md:gap-x-4 md:gap-y-2.5 sm:gap-x-4 sm:gap-y-2.5">
              {CERTIFICATES.map(({ title, description, icon }) => (
                <li className="flex items-center gap-2.5 sm:gap-1.5" key={title}>
                  <Image src={icon} alt={title} width={22} height={22} priority />
                  <p className="flex gap-1.5 leading-none tracking-tight text-gray-new-80 lg:text-base">
                    {title} <span className="text-gray-new-40">{description}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Link
              className="mt-7 text-lg font-medium leading-none tracking-tight sm:text-base"
              theme="green"
              to="https://calendly.com/d/ckxx-b4h-69y/neon-solutions-engineering"
              rel="noopener noreferrer"
              target="_blank"
              withArrow
            >
              Book a meeting directly
            </Link>
          </div>
          <div className="mt-auto lg:mt-14">
            <CaseStudies items={CASE_STUDIES} />
          </div>
        </div>
        <div className="relative max-w-xl shrink-0 xl:max-w-[512px] lg:max-w-full">
          <ContactForm />
          <span
            className={clsx(
              'pointer-events-none absolute bottom-0 right-0 size-[725px] translate-x-[30%] translate-y-[35%]',
              'bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,52,62,.4)_20%,rgba(30,52,62,0))]',
              'xl:size-[580px] sm:size-[464px]'
            )}
            aria-hidden
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
