import Image from 'next/image';

import Container from 'components/shared/container';
import boltIcon from 'icons/home-new/features/bolt-lightning.svg';
import chartIcon from 'icons/home-new/features/chart.svg';
import clockIcon from 'icons/home-new/features/clock.svg';
import connectionsIcon from 'icons/home-new/features/connections.svg';
import keyIcon from 'icons/home-new/features/key.svg';
import shieldIcon from 'icons/home-new/features/shield.svg';

import Heading from '../heading';

const ITEMS = [
  {
    icon: shieldIcon,
    title: 'HIPAA and SOC2.',
    description: 'Access the compliance you need without high spend commitments.',
  },
  {
    icon: connectionsIcon,
    title: 'Private networking.',
    description: 'Keep traffic off the public internet via PrivateLink, no additional costs.',
  },
  {
    icon: chartIcon,
    title: 'Logs & metrics export.',
    description: 'Forward them directly to Datadog or any OTel-compatible service — no extra fees.',
  },
  {
    icon: clockIcon,
    title: 'Uptime SLAs.',
    description: '99.95% uptime guaranteed by SLA for all workloads in Scale.',
  },
  {
    icon: boltIcon,
    title: 'Point-in-time recovery.',
    description: 'Restore your database instantly to any moment in time without flat monthly fees.',
  },
  {
    icon: keyIcon,
    title: 'Single sign-on. ',
    description: 'Centralize your team access with SSO to manage logins securely.',
  },
];

const Features = () => (
  <section
    className="features safe-paddings relative scroll-mt-16 pb-60 xl:pb-40 lg:scroll-mt-0 lg:pb-32"
    id="features"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-16"
      size="1600"
    >
      <div className="min-w-0 border-t border-gray-new-20 pt-[35px] lg:pt-7">
        <Heading
          className="max-w-[960px] xl:max-w-[800px] lg:max-w-[600px] md:max-w-full md:pr-4"
          icon="features"
          theme="dark"
          title="<strong>No feature locks, just usage.</strong> Enterprise-grade features are accessible to everyone with just a <strong>$5</strong> monthly minimum."
        />
        <div className="relative mt-20 xl:mt-16 lg:mt-14 lg:max-w-[800px]">
          <ul className="grid grid-cols-3 gap-x-16 gap-y-[72px] lg:grid-cols-2 lg:gap-x-0 lg:gap-y-11">
            {ITEMS.map(({ icon, title, description }, index) => (
              <li className="flex flex-col gap-y-[18px] lg:gap-y-4" key={index}>
                <Image className="lg:size-5" src={icon} width={24} height={24} alt="" />
                <p className="w-[320px] text-[18px] leading-normal tracking-tight text-gray-new-50 xl:w-[256px] lg:w-[288px] lg:text-base lg:leading-snug">
                  <span className="mr-1 text-white">{title}</span>
                  {description}
                </p>
              </li>
            ))}
          </ul>
          <span className="absolute -left-[2.666%] bottom-0 top-0 w-px bg-gray-new-20" />
          <span className="absolute bottom-0 left-[32.333%] top-0 w-px bg-gray-new-20 lg:left-[47.333%]" />
          <span className="absolute bottom-0 left-[67.444%] top-0 w-px bg-gray-new-20 lg:hidden" />
        </div>
      </div>
    </Container>
  </section>
);

export default Features;
