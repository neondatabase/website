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
  <section className="hero relative z-10 grow overflow-hidden bg-black-pure py-40 md:py-24 lg:py-24 xl:pt-32 xl:pb-24">
    <Container size="1280">
      <div className="flex min-h-[578px] justify-between gap-16 lg:flex-col lg:gap-12 xl:min-h-0 xl:gap-10">
        <div className="flex max-w-[544px] flex-1 flex-col lg:max-w-full">
          <SectionLabel className="mb-5 md:mb-4 lg:mb-[18px]" theme="white">
            Talk to us
          </SectionLabel>
          <Heading
            className="text-pretty md:!text-[36px] lg:max-w-2xl xs:!text-[32px]"
            tag="h1"
            size="md-new"
            theme="white"
          >
            Start shipping faster with serverless Postgres
          </Heading>
          <div className="mt-auto flex flex-col gap-7 lg:gap-7 xl:gap-5">
            <p className="max-w-[544px] text-lg leading-normal tracking-tight text-pretty text-gray-new-70 lg:mt-[18px] lg:max-w-xl xl:text-base">
              We&apos;re happy to assist you with any questions about our tech, pricing plans,
              custom contract options, and migrations assistance.
            </p>
            <ul className="flex flex-col gap-y-5 border-t border-gray-new-20 pt-7 md:gap-x-4 md:gap-y-3.5 lg:flex-row lg:flex-wrap lg:gap-x-5 lg:gap-y-3 lg:border-t-0 lg:pt-0 xl:gap-y-3 xl:pt-5">
              {CERTIFICATES.map(({ title, description, icon }) => (
                <li className="flex items-center gap-3 sm:gap-1.5 lg:gap-2.5" key={title}>
                  <Image
                    className="size-9 shrink-0 lg:size-[22px] xl:size-8"
                    src={icon}
                    alt={title}
                    width={36}
                    height={36}
                    priority
                  />
                  <p className="flex items-center gap-1 text-lg leading-normal tracking-tight text-gray-new-60 lg:gap-1.5 lg:leading-none xl:text-base">
                    <span className="font-medium text-gray-new-90">{title}</span>
                    <span>{description}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative max-w-xl flex-1 lg:max-w-full">
          <ContactForm />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
