import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container/container';
import aiIcon from 'icons/serverless-apps/features/ai.svg';
import autoScalingIcon from 'icons/serverless-apps/features/auto-scaling.svg';
import checkIcon from 'icons/serverless-apps/features/check.svg';
import costIcon from 'icons/serverless-apps/features/cost.svg';
import handIcon from 'icons/serverless-apps/features/hand.svg';
import maintenanceIcon from 'icons/serverless-apps/features/maintenance.svg';
import peakIcon from 'icons/serverless-apps/features/peak.svg';
import perfomanceIcon from 'icons/serverless-apps/features/perfomance.svg';
import scalingIcon from 'icons/serverless-apps/features/scaling.svg';
import speedIcon from 'icons/serverless-apps/features/speed.svg';
import storageIcon from 'icons/serverless-apps/features/storage.svg';
import timerIcon from 'icons/serverless-apps/features/timer.svg';
import noServer from 'images/pages/serverless-apps/features/no-server.jpg';
import pay from 'images/pages/serverless-apps/features/pay.jpg';
import provisioning from 'images/pages/serverless-apps/features/provisioning.jpg';
import separation from 'images/pages/serverless-apps/features/separation.jpg';

const items = [
  {
    title: 'Separation of compute and storage',
    desctiprion:
      '<a href="/docs/introduction/architecture-overview">Neon’s architecture</a> decouples compute and storage layers. Compute nodes handle query execution, while the storage layer persists data on distributed, highly durable object storage.</a>',
    features: [
      {
        title: 'Elastic scaling',
        icon: scalingIcon,
      },
      {
        title: 'Durable storage',
        icon: storageIcon,
      },
      {
        title: 'Optimized performance',
        icon: perfomanceIcon,
      },
    ],
    image: {
      src: separation,
      height: 304,
    },
  },
  {
    title: 'Instant provisioning',
    desctiprion:
      'You can spin up Postgres databases in seconds, a big win when integrating Neon into database-per-user platforms and AI agents.',
    features: [
      {
        title: 'Fast deployment',
        icon: speedIcon,
      },
      {
        title: 'Ready in seconds',
        icon: timerIcon,
      },
      {
        title: 'AI & SaaS-friendly',
        icon: aiIcon,
      },
    ],
    image: {
      src: provisioning,
      height: 326,
    },
  },
  {
    title: 'No server management',
    desctiprion:
      'In Neon there’s <a href="/docs/introduction/serverless">no provisioning or manual resizing</a> of servers. The platform automatically scales resources based on workload demands, not only up but also down.',
    features: [
      {
        title: 'Hands-free scaling',
        icon: handIcon,
      },
      {
        title: 'Auto-scaling',
        icon: autoScalingIcon,
      },
      {
        title: 'Zero maintenance',
        icon: maintenanceIcon,
      },
    ],
    image: {
      src: noServer,
      height: 304,
    },
  },
  {
    title: 'Pay for what you use',
    desctiprion:
      "Your costs are directly tied to the resources your workload consumes — both compute and storage. There's no need to over-provision or pay for idle capacity.",
    features: [
      {
        title: 'Cost efficiency',
        icon: costIcon,
      },
      {
        title: 'Peak-aware scaling',
        icon: peakIcon,
      },
      {
        title: 'Optimized compute',
        icon: checkIcon,
      },
    ],
    image: {
      src: pay,
      height: 326,
    },
  },
];

const Features = () => (
  <section className="features safe-paddings pt-40 xl:pt-[136px] lg:pt-[104px] md:pt-20">
    <Container size="960">
      <h2 className="text-center font-title text-[52px] font-medium leading-none tracking-tighter xl:text-[48px] lg:text-[44px] md:text-4xl">
        True serverless Postgres
      </h2>
      <ul className="mt-20 flex flex-col gap-[120px] lg:mt-16 lg:gap-[104px] md:mx-auto md:mt-14 md:max-w-[448px] md:gap-14">
        {items.map(({ title, desctiprion, features, image }, index) => (
          <li
            className="grid grid-cols-2 items-center gap-16 lg:gap-8 md:grid-cols-1 md:gap-[18px]"
            key={title}
          >
            <div className="relative rounded-[10px]">
              <Image
                className="rounded-[inherit]"
                src={image.src}
                width="448"
                height={image.height}
              />
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-gray-new-20/30" />
            </div>
            <div className={clsx(index % 2 === 1 && '-order-1 md:order-none')}>
              <h3 className="text-2xl font-medium leading-snug tracking-extra-tight lg:text-xl md:text-lg">
                {title}
              </h3>
              <p
                className={clsx(
                  'mt-2 text-lg font-light leading-snug tracking-extra-tight text-gray-new-70',
                  '[&_a:hover]:border-white [&_a]:border-b [&_a]:border-gray-new-70 [&_a]:transition-colors [&_a]:duration-300'
                )}
                dangerouslySetInnerHTML={{ __html: desctiprion }}
              />
              <ul className="mt-6 flex flex-wrap gap-3 lg:mt-4 lg:gap-x-2">
                {features.map(({ title, icon }) => (
                  <li
                    className="flex items-center gap-2.5 rounded-full border border-gray-new-15 px-5 py-3 lg:px-4 lg:py-2.5 md:px-3 md:py-2"
                    key={title}
                  >
                    <Image className="md:size-[4.5]" src={icon} width="16" height="16" />
                    <span className="text-[15px] font-medium leading-none text-[#E3E4E9] lg:text-sm md:text-xs">
                      {title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
