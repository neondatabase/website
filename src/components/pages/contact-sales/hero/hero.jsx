import Image from 'next/image';

import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import SectionLabel from 'components/shared/section-label';
import certGDPRIcon from 'images/pages/contact-sales/cert-gdpr.svg';
import certISOIcon from 'images/pages/contact-sales/cert-iso.svg';
import certSOC2Icon from 'images/pages/contact-sales/cert-soc2.svg';

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

const Hero = () => (
  <section className="hero relative z-10 grow overflow-hidden bg-black-pure py-40 xl:pb-24 xl:pt-32 lg:py-24 md:py-24">
    <Container className="xl:max-w-5xl" size="1280">
      <div className="flex min-h-[578px] justify-between gap-16 xl:gap-10 lg:min-h-0 lg:flex-col lg:gap-12">
        <div className="flex max-w-[544px] flex-1 flex-col lg:max-w-full">
          <SectionLabel className="mb-5 lg:mb-[18px] md:mb-4" theme="white">
            Talk to us
          </SectionLabel>
          <Heading className="text-pretty lg:max-w-2xl" tag="h1" size="md-new" theme="white">
            Start building faster with serverless Postgres
          </Heading>
          <div className="mt-auto flex flex-col gap-7 md:gap-5">
            <p className="max-w-[544px] text-pretty text-lg leading-normal tracking-tight text-gray-new-70 lg:mt-5 lg:max-w-xl md:text-base">
              We&apos;re happy to assist you with any questions about our tech, pricing plans,
              custom contract options, and migrations assistance.
            </p>
            <ul className="flex flex-col gap-y-5 border-t border-gray-new-20 pt-7 md:gap-y-4 md:pt-5">
              {CERTIFICATES.map(({ title, description, icon }) => (
                <li className="flex items-center gap-3" key={title}>
                  <Image
                    className="size-9 shrink-0 lg:size-7"
                    src={icon}
                    alt={title}
                    width={36}
                    height={36}
                    priority
                  />
                  <p className="flex items-center gap-1 text-lg leading-normal tracking-tight text-gray-new-60 md:text-base">
                    <span className="font-medium text-gray-new-90">{title}</span>
                    <span>{description}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative w-full max-w-xl shrink-0 xl:max-w-[540px] lg:max-w-full">
          <ContactForm />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
