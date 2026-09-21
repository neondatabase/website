import Image from 'next/image';

import Container from 'components/shared/container';
import { lakebasePageContent } from 'constants/backend-platform-page-content';
import bgNoise from 'images/pages/home/backed-by/bg-noise.jpg';

import Carousel from './carousel';

const { fromFirstLine } = lakebasePageContent;

const FromFirstLine = () => (
  <section
    className="relative overflow-hidden bg-[#E4F1EB] py-40 safe-paddings text-black-pure xl:py-32 lg:py-24 md:py-20 sm:py-16"
    aria-labelledby="lakebase-from-first-line-title"
  >
    <Image
      className="pointer-events-none absolute top-0 right-[-10%] h-full w-auto max-w-none 2xl:right-[-20%] md:right-[-55%]"
      src={bgNoise}
      alt=""
      width={1175}
      height={927}
      sizes="(max-width: 767px) 130vw, (max-width: 1199px) 90vw, 62vw"
      quality={100}
    />

    <Container className="z-10" size="1344">
      <h2
        className="max-w-[1056px] text-[5rem] leading-none tracking-tighter xl:max-w-[880px] xl:text-[4rem] lg:max-w-[760px] lg:text-[3.25rem] md:text-[2.5rem] sm:text-[2.25rem]"
        id="lakebase-from-first-line-title"
      >
        {fromFirstLine.titleLines[0]}
        <br className="md:hidden" /> {fromFirstLine.titleLines[1]}
      </h2>

      <p className="mt-6 max-w-[792px] text-lg leading-normal tracking-extra-tight text-gray-new-40 md:max-w-[680px] md:text-base">
        {fromFirstLine.description}
      </p>

      <Carousel slides={fromFirstLine.slides} />
    </Container>
  </section>
);

export default FromFirstLine;
