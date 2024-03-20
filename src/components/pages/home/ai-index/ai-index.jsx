import Image from 'next/image';

import Container from 'components/shared/container';
import sphereImage from 'images/pages/home/ai-index/sphere.png';

const AiIndex = () => (
  <section className="ai-index safe-paddings mt-64 xl:mt-32 lg:mt-24 md:mt-20">
    <Container
      className="flex flex-col pr-24 xl:max-w-[704px] xl:pr-0 lg:!max-w-[640px] md:max-w-none"
      size="960"
    >
      <h2 className="max-w-3xl text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Unleashing Cutting-
        <br />
        Edge AI Applications.
      </h2>
      <p className="mt-7 max-w-sm self-end text-lg leading-tight tracking-extra-tight text-gray-new-50 xl:mt-6 xl:max-w-xs xl:text-base lg:mt-4 lg:max-w-[256px] lg:text-sm md:mt-3.5 md:max-w-md md:self-start md:text-base">
        <span className="text-white">The HNSW index algorithm</span> streamlines performance, making
        high-dimensional vector search remarkably efficient.
      </p>
    </Container>
    {/* TODO: replace illustration with video */}
    <Image
      className="mx-auto mt-[13px] xl:mt-1 xl:max-w-[896px] lg:mt-0 lg:max-w-[716px] md:mt-1 md:max-w-[calc(100%-12px)]"
      src={sphereImage}
      width={1216}
      height={900}
      alt=""
    />
  </section>
);

export default AiIndex;
