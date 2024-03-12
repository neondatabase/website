import Image from 'next/image';

import Container from 'components/shared/container';
import apiAndCliImage from 'images/pages/home/bento/api-and-cli.jpg';
import regionsImage from 'images/pages/home/bento/regions.jpg';
import timerImage from 'images/pages/home/bento/timer.jpg';

// TODO: add border gradient
const Bento = () => (
  <section className="bento safe-paddings mt-16">
    <Container size="960">
      <h2 className="max-w-3xl text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white">
        Better database. For&nbsp;modern workflows.
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-5">
        <div className="relative col-span-2 grid min-h-[384px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px]">
          <div className="relative z-10 col-span-full row-span-full">
            <Image
              className="absolute inset-0"
              src={regionsImage}
              width={960}
              height={384}
              alt=""
            />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7">
            <p className="pointer-events-auto max-w-lg text-lg font-light leading-snug tracking-extra-tight text-white/60">
              <strong className="font-medium text-white">
                Read replicas available in 6 regions.
              </strong>{' '}
              Compute scales scales dynamically to ensure you&apos;re ready for peak hours.
            </p>
          </div>
        </div>
        <div className="grid min-h-[491px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px]">
          <div className="relative z-10 col-span-full row-span-full">
            <Image
              className="absolute inset-0"
              src={apiAndCliImage}
              width={470}
              height={491}
              alt=""
            />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60">
              <strong className="font-medium text-white">API and CLI at your disposal.</strong>{' '}
              Manage your database programmatically or from the terminal.
            </p>
          </div>
        </div>
        <div className="grid min-h-[491px] grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px]">
          <div className="relative z-10 col-span-full row-span-full">
            <Image className="absolute inset-0" src={timerImage} width={470} height={491} alt="" />
          </div>
          <div className="pointer-events-none relative z-20 col-span-full row-span-full flex items-end px-6 pb-7">
            <p className="pointer-events-auto text-lg font-light leading-snug tracking-extra-tight text-white/60">
              <strong className="font-medium text-white">Point-in-Time Recovery.</strong> Instant,
              up to 30 days, granularity down to the transaction or second.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Bento;
