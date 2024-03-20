import Image from 'next/image';

import Container from 'components/shared/container';
import apiAndCliImage from 'images/pages/home/bento/api-and-cli.jpg';
import regionsImage from 'images/pages/home/bento/regions.jpg';
import timerImage from 'images/pages/home/bento/timer.jpg';

const Bento = () => (
  <section className="bento safe-paddings mt-16 xl:mt-10">
    <Container className="xl:max-w-[704px] lg:max-w-full md:max-w-lg" size="960">
      <h2 className="text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:pl-16 lg:text-[44px] md:pl-0 md:text-[32px]">
        Better database.
        <br />
        For&nbsp;modern workflows.
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-5 xl:mt-9 xl:gap-4 lg:mt-8 sm:mt-5 sm:gap-x-[18px]">
        <div className="relative col-span-2 grid min-h-[384px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px] xl:min-h-[282px] lg:aspect-[2.5] md:min-h-[250px] md:w-full">
          <div className="relative z-10 col-span-full row-span-full">
            <Image
              className="absolute inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:h-full md:w-auto md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2"
              src={regionsImage}
              width={960}
              height={384}
              alt=""
            />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 md:p-4">
            <p className="pointer-events-auto max-w-lg text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:max-w-[412px] xl:text-base sm:leading-tight">
              <strong className="font-medium text-white">
                Read replicas available in 6 regions.
              </strong>{' '}
              Compute scales scales dynamically to ensure you&apos;re ready for peak hours.
            </p>
          </div>
          <div
            className="border-linear absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-regions-border"
            aria-hidden
          />
        </div>
        <div className="relative grid min-h-[491px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px] xl:min-h-[360px] lg:aspect-[0.9572] md:col-span-full md:min-h-[250px]">
          <div className="relative z-10 col-span-full row-span-full">
            <Image
              className="absolute inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:h-full md:w-auto md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2"
              src={apiAndCliImage}
              width={470}
              height={491}
              alt=""
            />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 md:p-4">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:text-base md:text-[15px] sm:leading-tight">
              <strong className="font-medium text-white">API and CLI at your disposal.</strong>{' '}
              Manage your database programmatically or from the terminal.
            </p>
          </div>
          <div
            className="border-linear absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-api-and-cli-border"
            aria-hidden
          />
        </div>
        <div className="relative grid min-h-[491px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px] bg-home-bento-timer-border xl:min-h-[360px] lg:aspect-[0.9572] md:col-span-full md:min-h-[250px]">
          <div className="relative z-10 col-span-full row-span-full">
            <Image
              className="absolute inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:h-full md:w-auto md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2"
              src={timerImage}
              width={470}
              height={491}
              alt=""
            />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7 xl:px-5 xl:pb-6 md:p-4">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60 xl:text-base md:text-[15px] sm:leading-tight">
              <strong className="font-medium text-white">Point-in-Time Recovery.</strong> Instant,
              up to 30 days, granularity down to the transaction or second.
            </p>
          </div>
          <div
            className="border-linear absolute inset-0 z-10 rounded-[inherit] border-image-home-bento-timer-border"
            aria-hidden
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Bento;
