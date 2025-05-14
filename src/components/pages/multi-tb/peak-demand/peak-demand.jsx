import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import automaticScaling from 'images/pages/multi-tb/peak-demand/automatic-scaling.jpg';

const PeakDemand = () => (
  <section className="peak-demand mt-[244px] lg:mt-24 md:mt-14">
    <Container className="lg:mx-8 md:mx-1 " size="768" as="header">
      <h2 className="max-w-[560px] text-balance font-title text-6xl font-medium leading-none tracking-extra-tight text-white">
        Peak demand? Bring it on.
      </h2>
    </Container>
    <Container className="mb-12 mt-14 lg:mx-8 md:mx-1" size="1100">
      <div className="mx-[38px] flex flex-row items-center gap-16 lg:mx-0 lg:gap-10 md:flex-col md:gap-8">
        <div className="relative shrink-0 overflow-hidden rounded-xl md:flex-initial sm:w-full">
          <Image
            className="sm:w-full"
            src={automaticScaling}
            width={544}
            height={392}
            quality={100}
            placeholder="blur"
            alt=""
          />
          <GradientBorder withBlend />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <ul className="flex flex-col gap-6 pr-10 lg:gap-4 md:gap-3">
            <li>
              <p className="text-xl leading-snug tracking-extra-tight text-gray-new-60">
                <span className="text-white">Never hit a full-disk error.</span> Neon&apos;s storage
                scales automatically so your database never runs out of space.
              </p>
            </li>
            <li>
              <p className="text-xl leading-snug tracking-extra-tight text-gray-new-60">
                <span className="text-white">No performance degradation.</span> Neon scales CPU,
                memory, and connections dynamically with your workload.
              </p>
            </li>
            <li>
              <p className="text-xl leading-snug tracking-extra-tight text-gray-new-60">
                <span className="text-white">Instant replicas for an extra boost.</span> Neon’s
                serverless read replicas scale compute horizontally.
              </p>
            </li>
          </ul>
          <Link
            to={LINKS.docsBranching}
            className="text-[15px] leading-none tracking-extra-tight text-white"
            withArrow
          >
            Learn more
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default PeakDemand;
