import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import boltIcon from 'icons/home/features/bolt-lightning.svg';
import chartIcon from 'icons/home/features/chart.svg';
import clockIcon from 'icons/home/features/clock.svg';
import connectionsIcon from 'icons/home/features/connections.svg';
import keyIcon from 'icons/home/features/key.svg';
import shieldIcon from 'icons/home/features/shield.svg';

import Heading from '../heading';

const ITEMS = [
  {
    icon: shieldIcon,
    title: 'HIPAA and SOC2.',
    description: 'Meet your compliance requirements without high spend commitments.',
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
    title: 'Single sign-on.',
    description: 'Centralize your team access with SSO to manage logins securely.',
  },
];

const BORDER_CLASSNAME = 'absolute -bottom-1 -top-2 w-px bg-gray-new-20 xl:top-0 md:hidden';

const Features = () => (
  <section
    className="features safe-paddings relative scroll-mt-[60px] pb-60 xl:pb-40 lg:scroll-mt-0 lg:pb-32 md:pb-24"
    id="features"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
      size="1600"
    >
      <div className="min-w-0 border-t border-gray-new-20 pt-9 lg:pt-7">
        <Heading
          icon="features"
          title="<strong>No platform fees.</strong> Enterprise-grade features available to everyone, without fixed fees or monthly minimums."
        />
        <div className="relative mt-20 xl:mt-16 lg:mt-14 lg:max-w-[800px] md:mt-16">
          <ul className="grid grid-cols-3 gap-x-16 gap-y-[72px] xl:gap-y-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-11 md:grid-cols-1 md:gap-y-7">
            {ITEMS.map(({ icon, title, description }, index) => (
              <li className="flex flex-col gap-y-[18px] lg:gap-y-4 md:gap-y-3" key={index}>
                <Image
                  className="pointer-events-none lg:size-5 md:size-4"
                  src={icon}
                  width={24}
                  height={24}
                  loading="lazy"
                  alt=""
                />
                <p
                  className={clsx(
                    'max-w-[320px] text-pretty text-[18px] leading-normal tracking-extra-tight text-gray-new-50',
                    'xl:w-[256px] lg:w-[288px] lg:text-base lg:leading-snug md:w-full md:max-w-full md:text-[15px]'
                  )}
                >
                  <span className="text-white">{title}</span> {description}
                </p>
              </li>
            ))}
          </ul>
          <span className={clsx(BORDER_CLASSNAME, '-left-8 xl:-left-6 lg:-left-5 md:hidden')} />
          <span
            className={clsx(
              BORDER_CLASSNAME,
              'left-[calc((100%-128px)/3+32px)] xl:left-[calc((100%-128px)/3+38px)] lg:left-[calc(100%/2+12px)] md:hidden'
            )}
          />
          <span
            className={clsx(
              BORDER_CLASSNAME,
              'right-[calc((100%-128px)/3+32px)] xl:right-[calc((100%-128px)/3+24px)] lg:hidden'
            )}
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Features;
