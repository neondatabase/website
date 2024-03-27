import Image from 'next/image';

import Container from 'components/shared/container';
import neonGridImage from 'images/pages/home/multitenancy/neon-grid.jpg';

// TODO: add video instead of image
const Multitenancy = () => (
  <section className="multitenancy safe-paddings mt-8 overflow-hidden xl:-mt-9 lg:-mt-8 md:mt-12">
    <Container className="relative z-10 xl:max-w-[704px] lg:pl-24" size="960">
      <h2 className="text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Next-gen multitenancy
        <br />
        for modern teams
      </h2>
    </Container>
    {/* TODO: replace illustration with video */}
    <Image
      className="relative left-1/2 z-0 mx-auto -mt-[91px] max-w-[1920px] -translate-x-1/2 xl:-mt-[60px] xl:max-w-[1380px] lg:-mt-[46px] lg:max-w-[1150px] sm:-mt-8 sm:max-w-[790px]"
      src={neonGridImage}
      width={1920}
      height={758}
      alt=""
    />
    <Container
      className="relative z-10 -mt-[84px] xl:-mt-14 xl:max-w-[704px] lg:-mt-11 lg:pl-24 sm:-mt-9"
      size="960"
    >
      <p className="max-w-[608px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:max-w-xl xl:text-lg lg:max-w-[480px] lg:text-sm sm:text-base">
        <span className="text-white">Multi-tenant architecture</span> flexibly scales to fit teams
        of any size, enabling secure data sharing across users or data isolation within
        a&nbsp;single tenant, ensuring tailored access and privacy.
      </p>
    </Container>
  </section>
);

export default Multitenancy;
