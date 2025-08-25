import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import automaticScaling from 'images/pages/multi-tb/peak-demand/automatic-scaling.jpg';

const PeakDemand = () => (
  <section className="peak-demand mt-[157px] xl:mt-[141px] lg:mt-[77px] md:mt-[12px]">
    <Container className="lg:mx-8 md:mx-auto md:max-w-sm" size="768" as="header">
      <h2 className="max-w-[560px] text-balance font-title text-6xl font-medium leading-none tracking-extra-tight text-white xl:max-w-[500px] xl:text-[56px] lg:text-5xl md:text-[36px]">
        Peak demand? Bring it on.
      </h2>
    </Container>
    <Container
      className="mb-12 mt-14 xl:mt-[47px] lg:mx-0 lg:mt-12 md:mx-auto md:mt-8 md:max-w-sm"
      size="1100"
    >
      <div className="mx-[38px] flex flex-row items-center gap-16 xl:mx-8 xl:gap-8 lg:mx-0 lg:gap-8 md:flex-col">
        <div className="relative shrink-0 overflow-hidden rounded-xl lg:w-[384px] sm:w-full">
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
        <div className="flex flex-1 flex-col gap-6 lg:gap-5 md:gap-[18px]">
          <ul className="flex flex-col gap-6 pr-10 text-xl leading-snug tracking-extra-tight text-gray-new-60 xl:pr-0 lg:gap-5 lg:text-base md:gap-[18px]">
            <li>
              <p>
                <span className="text-white">Never hit a full-disk error.</span> Neon&apos;s storage
                scales automatically so your database never runs out of space.
              </p>
            </li>
            <li>
              <p>
                <span className="text-white">No performance degradation.</span> Neon scales CPU,
                memory, and connections dynamically with your workload.
              </p>
            </li>
            <li>
              <p>
                <span className="text-white">Instant replicas for an extra boost.</span> Neon’s
                serverless read replicas scale compute horizontally.
              </p>
            </li>
          </ul>
          <Link
            to={LINKS.autoscaling}
            className="text-[15px] leading-none tracking-extra-tight"
            theme="white"
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
