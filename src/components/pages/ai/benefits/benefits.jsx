import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';

import compatibilityIcon from './images/compatibility.svg';
import scalabilityIcon from './images/scalability.svg';
import searchIcon from './images/search.svg';
import updateIcon from './images/update.svg';

const items = [
  {
    icon: updateIcon,
    title: 'Reliable, fast updates',
    description: 'pg_embedding is open-source and maintained by a team of Postgres Hackers at Neon',
  },
  {
    icon: scalabilityIcon,
    title: 'Amazing scalability',
    description: 'Grow your vector stores without a drop in search performance',
  },
  {
    icon: searchIcon,
    title: 'Blazingly fast search',
    description: 'pg_embedding uses HNSW index, optimized faster vector search',
  },
  {
    icon: compatibilityIcon,
    title: 'High compatibility',
    description: 'Easily switch to pg_embedding in your Postgres and LangChain projects',
  },
];

const Benefits = () => (
  <section className="benefits safe-paddings mt-52 xl:mt-[104px] lg:mt-20 md:mt-16">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 rounded-2xl bg-gray-new-8 p-12 xl:col-span-full xl:col-start-1 xl:items-center xl:px-8 xl:py-10 lg:px-7 lg:py-9 md:px-5 md:py-8">
        <div className="col-span-4 col-start-1 flex flex-col items-start xl:max-w-[300px] xl:justify-self-start lg:col-span-full lg:max-w-none">
          <GradientLabel>Benefits</GradientLabel>
          <h2 className="mt-3 max-w-[322px] text-[52px] font-medium leading-none tracking-[-0.02em] xl:max-w-[270px] xl:text-[44px] lg:max-w-none lg:text-4xl md:text-[32px]">
            Vector search with Neon
          </h2>
          <p className="mt-4 max-w-[362px] text-lg font-light leading-snug xl:max-w-[280px] xl:text-base lg:max-w-none md:mt-2.5">
            Use the power of HNSW index to unlock new levels of efficiency in high-dimensional
            similarity search in Postgres
          </p>
        </div>
        <ul className="col-start-5 col-end-11 -ml-1.5 mt-2 grid max-w-[640px] grid-cols-2 gap-x-[90px] gap-y-11 xl:-ml-5 xl:mt-0 xl:max-w-none xl:gap-x-10 xl:pl-0 lg:col-span-full lg:ml-0 lg:mt-10 lg:gap-y-10 md:mt-[30px] md:grid-cols-1 md:gap-y-[30px]">
          {items.map(({ icon, title, description }, index) => (
            <li className="flex items-start gap-x-3.5 md:gap-x-3" key={index}>
              <img
                className="mt-0.5 shrink-0"
                src={icon}
                alt=""
                loading="lazy"
                width={24}
                height={24}
                aria-hidden
              />
              <div className="flex flex-col">
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] xl:text-xl md:text-lg">
                  {title}
                </h3>
                <p className="md:text-2 mt-2 font-light leading-snug text-gray-new-70 xl:mt-[11px]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Benefits;
