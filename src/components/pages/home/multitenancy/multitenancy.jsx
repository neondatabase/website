import Image from 'next/image';

import Container from 'components/shared/container';
import neonGridImage from 'images/pages/home/multitenancy/neon-grid.jpg';

// TODO: add responsive styles, video instead of image
const Multitenancy = () => (
  <section className="multitenancy safe-paddings mt-[88px] overflow-hidden xl:mt-28 lg:mt-[92px] md:mt-16">
    <Container className="relative z-10" size="960">
      <h2 className="max-w-3xl text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Next-gen multitenancy for&nbsp;modern teams
      </h2>
    </Container>
    {/* TODO: replace illustration with video */}
    <Image
      className="relative left-1/2 z-0 mx-auto -mt-[91px] max-w-[1920px] -translate-x-1/2 xl:mt-1 lg:mt-0 md:mt-5"
      src={neonGridImage}
      width={1920}
      height={758}
      alt=""
    />
    <Container className="relative z-10 -mt-28" size="960">
      <p className="mt-7 max-w-[608px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:max-w-xl xl:text-lg lg:max-w-[480px] lg:text-sm">
        <span className="text-white">Multi-tenant architecture</span> flexibly scales to fit teams
        of any size, enabling secure data sharing across users or data isolation within a single
        tenant, ensuring tailored access and privacy.
      </p>
    </Container>
  </section>
);

export default Multitenancy;
