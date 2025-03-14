import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import Animation from './animation';

const AiIndex = () => (
  <section className="ai-index safe-paddings relative mt-64 xl:mt-32 lg:mt-24 md:mt-20">
    <Container
      className="relative z-10 flex flex-col pr-24 xl:max-w-[704px] xl:pr-0 lg:!max-w-[640px] md:max-w-none"
      size="960"
    >
      <h2 className="max-w-3xl font-title text-[68px] font-medium leading-[0.9] tracking-extra-tight text-white xl:text-[56px] lg:text-[44px] sm:text-[32px]">
        Unleashing Cutting-
        <br />
        Edge AI Applications.
      </h2>
      <div className="mt-7 max-w-sm self-end xl:mt-6 xl:max-w-xs lg:mt-4 lg:max-w-[256px] md:mt-3.5 md:max-w-md md:self-start">
        <p className="text-lg font-light leading-tight tracking-extra-tight text-gray-new-70 xl:text-base lg:text-sm md:text-base">
          <span className="font-medium text-gray-new-94">The HNSW index algorithm</span> streamlines
          performance, making high-dimensional vector&nbsp;search&nbsp;remarkably efficient.
        </p>
        {/* TODO: set link  */}
        <Link
          className="mt-2.5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em]"
          to={LINKS.ai}
          theme="white"
          withArrow
        >
          Power your AI apps with Postgres
        </Link>
      </div>
    </Container>
    <Animation />
  </section>
);

export default AiIndex;
