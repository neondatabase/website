import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import automaticScaling from 'images/pages/multi-tb/peak-demand/automatic-scaling.jpg';

const PeakDemand = () => (
  <section className="peak-demand mt-[157px] md:mt-[12px] lg:mt-[77px] xl:mt-[141px]">
    <Container className="md:mx-auto md:max-w-sm lg:mx-8" size="768" as="header">
      <h2 className="max-w-[560px] font-title text-6xl leading-none font-medium tracking-extra-tight text-balance text-white md:text-[36px] lg:text-5xl xl:max-w-[500px] xl:text-[56px]">
        Peak demand? Bring it on.
      </h2>
    </Container>
    <Container
      className="mt-14 mb-12 md:mx-auto md:mt-8 md:max-w-sm lg:mx-0 lg:mt-12 xl:mt-[47px]"
      size="1100"
    >
      <div className="mx-[38px] flex flex-row items-center gap-16 md:flex-col lg:mx-0 lg:gap-8 xl:mx-8 xl:gap-8">
        <div className="relative shrink-0 overflow-hidden rounded-xl sm:w-full lg:w-[384px]">
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
        <div className="flex flex-1 flex-col gap-6 md:gap-[18px] lg:gap-5">
          <ul className="flex flex-col gap-6 pr-10 text-xl leading-snug tracking-extra-tight text-gray-new-60 md:gap-[18px] lg:gap-5 lg:text-base xl:pr-0">
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
