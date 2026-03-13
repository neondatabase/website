import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import highAvailability from 'images/pages/multi-tb/high-availability/high-availability.jpg';

const HighAvailability = () => (
  <section className="high-availability mt-[242px] lg:mt-[167px] xl:mt-[224px] md:mt-[112px]">
    <Container className="lg:mx-8 md:mx-0" size="960" as="header">
      <div className="text-center">
        <h2 className="font-title text-[56px] leading-none font-medium tracking-extra-tight text-white lg:text-[40px] xl:text-[48px] md:mx-10 md:text-[32px]">
          High availability, no standbys
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-lg leading-snug tracking-extra-tight text-pretty text-gray-new-60 lg:mt-3 lg:max-w-xl lg:text-base md:mx-4">
          Multi-AZ by design. Neon replicates your data at the storage layer across multiple AZs,
          removing the need for full-size standby instances.
        </p>
        <Link
          to={LINKS.docsHighAvailability}
          className="mt-6 text-[15px] leading-none tracking-tight text-white lg:mt-5 md:mt-3.5"
          withArrow
        >
          Dive deeper
        </Link>
      </div>
    </Container>
    <Container className="mt-11 lg:mx-0 lg:mt-[35px]" size="960" as="header">
      <div className="relative shrink-0 overflow-hidden rounded-xl sm:w-full md:flex-initial">
        <Image
          className="w-full"
          src={highAvailability}
          width={960}
          height={470}
          quality={100}
          placeholder="blur"
          alt=""
        />
        <GradientBorder withBlend />
      </div>
    </Container>
  </section>
);

export default HighAvailability;
