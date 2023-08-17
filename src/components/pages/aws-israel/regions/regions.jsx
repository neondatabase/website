import Image from 'next/image';

import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';

import map from './images/map.jpg';

const Regions = () => (
  <section className="regions safe-paddings mt-48">
    <Container className="grid grid-cols-12 items-center gap-x-10" size="medium">
      <div className="col-span-4 col-start-2 flex flex-col items-start">
        <GradientLabel>Regions</GradientLabel>
        <h2 className="mt-5 text-5xl font-medium leading-none tracking-extra-tight">
          Database that is close to your users
        </h2>
        <p className="mt-3 max-w-[440px] text-lg font-light leading-snug">
          Neon supports multiple regions worldwide to create the fastest Postgres experience.
        </p>
      </div>
      <div className="col-span-5 col-end-12">
        <Image
          src={map}
          alt="Israel map"
          width={590}
          height={532}
          quality={90}
          sizes="(max-width: 768px) 590px, 100vw"
        />
      </div>
    </Container>
  </section>
);

export default Regions;
