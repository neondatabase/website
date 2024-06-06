import Container from 'components/shared/container';
import Link from 'components/shared/link';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

import RiveCard from './rive-card';

const Bento = () => (
  <section className="bento safe-paddings mt-11 xl:mt-[38px] lg:mt-[74px]">
    <Container className="xl:max-w-[704px] lg:max-w-full" size="960">
      <h2 className="font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:pl-16 lg:text-[44px] sm:pl-0 sm:text-[32px]">
        Better database.
        <br />
        For&nbsp;modern workflows.
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-5 xl:mt-9 xl:gap-4 lg:mt-8 sm:mt-5 sm:gap-x-[18px]">
        <div className="relative col-span-2 grid min-h-[384px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px] xl:min-h-[282px] xl:rounded-lg lg:aspect-[2.5] lg:min-h-min sm:aspect-[1.2] sm:max-h-[325px] sm:min-h-[250px] sm:w-full">
          <div className="relative z-10 col-span-full row-span-full">
            <PauseableVideo
              videoClassName="sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-full sm:w-auto sm:max-w-none sm:-translate-x-1/2 sm:translate-y-[-65%]"
              width={960}
              height={384}
            >
              <source src="/videos/pages/home/replicas.mp4" type="video/mp4" />
              <source src="/videos/pages/home/replicas.webm" type="video/webm" />
            </PauseableVideo>
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 sm:bg-gradient-to-b sm:from-transparent sm:via-transparent sm:via-60% sm:to-black-new/30 sm:p-4">
            <p className="pointer-events-auto max-w-lg text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:max-w-md xl:text-base sm:leading-tight">
              <strong className="font-medium text-white">
                Boost your performance with instant{' '}
                <Link
                  className="underline decoration-white/40 decoration-1 underline-offset-[5px] hover:decoration-primary-1/60 lg:underline-offset-4"
                  to="/docs/introduction/read-replicas"
                  theme="white"
                >
                  read replicas
                </Link>
                .
              </strong>{' '}
              They scale&nbsp;down to zero when idle and don&apos;t use additional storage.
            </p>
          </div>
          <div
            className="border-linear pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-regions-border"
            aria-hidden
          />
        </div>
        <RiveCard animation="api">
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 sm:p-4">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:text-base sm:text-[15px] sm:leading-tight">
              <strong className="font-normal text-white">
                Easy database ops via the{' '}
                <Link
                  className="underline decoration-white/40 decoration-1 underline-offset-[5px] hover:decoration-primary-1/60 lg:underline-offset-4"
                  to={LINKS.apiReference}
                  theme="white"
                >
                  API
                </Link>{' '}
                and{' '}
                <Link
                  className="underline decoration-white/40 decoration-1 underline-offset-[5px] hover:decoration-primary-1/60 lg:underline-offset-4"
                  to={LINKS.cliReference}
                  theme="white"
                >
                  CLI
                </Link>
                .
              </strong>{' '}
              Manage thousands of databases programmatically.
            </p>
          </div>
          <div
            className="border-linear pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-api-and-cli-border"
            aria-hidden
          />
        </RiveCard>
        <RiveCard animation="clock">
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 sm:p-4">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:text-base sm:text-[15px] sm:leading-tight">
              <strong className="font-normal text-white">
                Instant{` `}
                <Link
                  className="underline decoration-white/40 decoration-1 underline-offset-[5px] hover:decoration-primary-1/60 lg:underline-offset-4"
                  to="/blog/point-in-time-recovery-in-postgres"
                  theme="white"
                >
                  Point-in-time recovery
                </Link>
                .
              </strong>{' '}
              Up to 30 days granularity down to the transaction or second.
            </p>
          </div>
          <div
            className="border-linear pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-timer-border"
            aria-hidden
          />
        </RiveCard>
      </div>
    </Container>
  </section>
);

export default Bento;
