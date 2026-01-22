import clsx from 'clsx';
import Image from 'next/image';

import TagCloud from 'components/pages/use-case/tag-cloud';
import Container from 'components/shared/container/container';
import aiIcon from 'icons/serverless-apps/features/ai.svg';
import autoScalingIcon from 'icons/serverless-apps/features/auto-scaling.svg';
import checkIcon from 'icons/serverless-apps/features/check.svg';
import costIcon from 'icons/serverless-apps/features/cost.svg';
import handIcon from 'icons/serverless-apps/features/hand.svg';
import maintenanceIcon from 'icons/serverless-apps/features/maintenance.svg';
import peakIcon from 'icons/serverless-apps/features/peak.svg';
import performanceIcon from 'icons/serverless-apps/features/performance.svg';
import scalingIcon from 'icons/serverless-apps/features/scaling.svg';
import speedIcon from 'icons/serverless-apps/features/speed.svg';
import storageIcon from 'icons/serverless-apps/features/storage.svg';
import timerIcon from 'icons/serverless-apps/features/timer.svg';
import noServer from 'images/pages/serverless-apps/features/no-server.jpg';
import paySm from 'images/pages/serverless-apps/features/pay-sm.jpg';
import pay from 'images/pages/serverless-apps/features/pay.jpg';
import provisioning from 'images/pages/serverless-apps/features/provisioning.jpg';
import separation from 'images/pages/serverless-apps/features/separation.jpg';

const items = [
  {
    title: 'Separation of compute and storage',
    desctiprion:
      '<a href="/blog/architecture-decisions-in-neon">Neon’s architecture</a> decouples compute and storage layers. Compute nodes handle query execution, while the storage layer persists data on distributed, highly durable object storage.</a>',
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
        icon: performanceIcon,
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
    imageSm: {
      src: paySm,
      height: 244,
    },
    imageText:
      'Typical CPU utilization pattern in a production database in RDS. Traffic peaks once per day up to 60% capacity, going down to 10% capacity for the rest of the day. Based on a real use case.',
  },
];

const Features = () => (
  <section className="features safe-paddings pt-40 xl:pt-[136px] lg:pt-[104px] md:pt-20">
    <Container size="960">
      <h2 className="text-center font-title text-[52px] font-medium leading-none tracking-tighter xl:text-[48px] lg:text-[44px] md:text-4xl">
        True serverless Postgres
      </h2>
      <ul className="mt-20 flex flex-col gap-[120px] lg:mx-auto lg:mt-16 lg:max-w-3xl lg:gap-[104px] md:mt-14 md:max-w-sm md:gap-14">
        {items.map(({ title, desctiprion, features, image, imageSm, imageText }, index) => (
          <li
            className="grid grid-cols-2 items-center gap-16 lg:gap-8 md:grid-cols-1 md:gap-[18px]"
            key={title}
          >
            <div className="relative overflow-hidden rounded-[10px] lg:rounded-lg">
              <Image
                className={clsx('rounded-[inherit]', imageSm && 'lg:hidden')}
                src={image.src}
                width="448"
                height={image.height}
                alt={title}
                quality={99}
              />
              {imageSm && (
                <Image
                  className={clsx('hidden rounded-[inherit] lg:block')}
                  src={imageSm.src}
                  width="448"
                  height={imageSm.height}
                  alt={title}
                  quality={99}
                />
              )}
              {imageText && (
                <p className="absolute inset-x-0 bottom-0 text-pretty p-4 text-sm font-light leading-snug tracking-extra-tight text-gray-new-50 lg:px-3 lg:py-2.5 lg:text-[13px] sm:px-2.5 sm:py-2 xs:text-[3.6vw]">
                  {imageText}
                </p>
              )}
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-gray-new-20/30" />
            </div>
            <div className={clsx('relative', index % 2 === 1 && '-order-1 md:order-none')}>
              <h3 className="text-2xl font-medium leading-snug tracking-extra-tight lg:text-xl md:text-lg">
                {title}
              </h3>
              <p
                className={clsx(
                  'mt-2 text-lg font-light leading-snug tracking-extra-tight text-gray-new-70 lg:text-base',
                  '[&_a:hover]:border-gray-new-70 [&_a]:border-b [&_a]:border-gray-new-70/40 [&_a]:font-normal [&_a]:transition-colors [&_a]:duration-300'
                )}
                dangerouslySetInnerHTML={{ __html: desctiprion }}
              />
              {/* // add tag cloud here */}
              <TagCloud
                items={features}
                className="gap-3 lg:gap-x-2"
                titleClassName="text-[15px]"
              />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Features;
