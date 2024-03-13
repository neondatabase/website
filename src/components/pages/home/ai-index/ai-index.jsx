import Image from 'next/image';

import Container from 'components/shared/container';
import sphereImage from 'images/pages/home/ai-index/sphere.png';

// TODO: check and fix responsive
const AiIndex = () => (
  <section className="ai-index safe-paddings mt-64 xl:mt-28 lg:mt-[92px] md:mt-16">
    <Container className="flex flex-col pr-24 xl:pr-0" size="960">
      <h2 className="max-w-3xl text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Unleashing Cutting-
        <br />
        Edge AI Applications.
      </h2>
      <p className="mt-7 max-w-sm self-end text-lg leading-tight tracking-extra-tight text-gray-new-50 xl:mt-6 xl:max-w-xs xl:text-base lg:mt-4 lg:max-w-[256px] lg:text-sm md:self-start sm:max-w-xs">
        <span className="text-white">The HNSW index algorithm</span> streamlines performance, making
        high-dimensional vector search remarkably efficient.
      </p>
    </Container>
    {/* TODO: replace illustration with video */}
    <Image
      className="mx-auto mt-[13px] xl:mt-1 lg:mt-0 md:mt-5"
      src={sphereImage}
      width={1216}
      height={900}
      alt=""
    />
  </section>
);

export default AiIndex;
