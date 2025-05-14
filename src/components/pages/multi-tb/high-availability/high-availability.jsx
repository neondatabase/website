import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import highAvailability from 'images/pages/multi-tb/high-availability/high-availability.jpg';

const HighAvailability = () => (
  <section className="high-availability mt-[242px] lg:mt-24 md:mt-14">
    <Container className="lg:mx-8 md:mx-1" size="960" as="header">
      <div className="flex flex-col gap-11 text-center">
        <div>
          <h2 className="font-title text-[56px] font-medium leading-none tracking-extra-tight text-white">
            High availability, no standbys
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-pretty text-lg leading-snug tracking-extra-tight text-gray-new-60">
            Multi-AZ by design. Neon replicates your data at the storage layer across multiple AZs,
            removing the need for full-size standby instances.
          </p>
          <Link
            to={LINKS.docsBranching}
            className="mt-6 text-[15px] leading-none tracking-tight text-white"
            withArrow
          >
            Dive deeper
          </Link>
        </div>
        <div className="relative shrink-0 overflow-hidden rounded-xl md:flex-initial sm:w-full">
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
      </div>
    </Container>
  </section>
);

export default HighAvailability;
