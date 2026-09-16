import Image from 'next/image';

import Container from 'components/shared/container';
import { lakebasePageContent } from 'constants/backend-platform-page-content';
import agentReadyIcon from 'icons/lakebase/architecture/agent-ready.svg';
import ephemeralComputeIcon from 'icons/lakebase/architecture/ephemeral-compute.svg';
import sharedStorageIcon from 'icons/lakebase/architecture/shared-storage.svg';
import schemaMobileImage from 'images/pages/home/architecture/schema-mobile.png';

import Animation from './animation';

const { architecture } = lakebasePageContent;
const FEATURE_ICONS = [
  { src: ephemeralComputeIcon, width: 13.33, height: 13.33 },
  { src: sharedStorageIcon, width: 12.22, height: 14.67 },
  { src: agentReadyIcon, width: 14.26, height: 14.26 },
];

const Architecture = () => (
  <section
    className="architecture scroll-mt-16 overflow-hidden bg-[#E4F1EB] pt-40 safe-paddings pb-31 xl:pt-30 xl:pb-24 lg:scroll-mt-0 lg:py-20 md:py-16"
    id="architecture"
    aria-labelledby="lakebase-architecture-heading"
    data-figma-node-id="37601:20027"
  >
    <Container size="1344">
      <h2
        className="max-w-420 indent-24 text-[3.5rem] leading-dense font-normal tracking-tighter text-black-pure xl:max-w-240 xl:indent-16 xl:text-5xl lg:max-w-180 lg:text-[2.25rem] md:max-w-full md:indent-0 md:text-[2rem] sm:text-[1.75rem]"
        id="lakebase-architecture-heading"
      >
        {architecture.title}{' '}
        <mark className="-mr-[0.15em] -ml-[0.1em] bg-transparent bg-[linear-gradient(to_bottom,transparent_0.15em,rgba(57,165,125,0.6)_0.15em)] box-decoration-clone pr-[0.15em] pl-[0.1em]">
          {architecture.highlightedTitle}
        </mark>
        {architecture.titleAfterHighlight && ` ${architecture.titleAfterHighlight}`}
      </h2>

      <figure
        className="mt-50 2xl:mt-32 md:mt-10"
        aria-label="Decoupled compute and shared versioned storage in Lakebase"
        role="img"
      >
        <div className="mx-auto 2xl:max-w-[85%] md:hidden">
          <Animation />
        </div>
        <Image
          className="hidden h-auto w-full md:block"
          src={schemaMobileImage}
          sizes="(max-width: 767px) 100vw, 1184px"
          quality={100}
          alt=""
        />
      </figure>

      <div className="mt-14 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-x-48 xl:gap-x-20 lg:grid-cols-1 lg:gap-y-10 md:mt-8 md:gap-y-10">
        <p className="text-[40px] leading-dense tracking-extra-tight text-gray-new-40 xl:text-[32px] lg:max-w-180 lg:text-[1.75rem] md:text-[1.375rem] sm:text-xl/dense">
          <span className="text-black-new">{architecture.description}</span>{' '}
          {architecture.secondaryDescription}
        </p>

        <ul className="flex flex-col gap-8 pt-2.5 lg:grid lg:grid-cols-3 lg:gap-6 lg:pt-0 md:grid-cols-1 md:gap-8">
          {architecture.features.map(({ title, description }, index) => (
            <li className="text-[16px] tracking-extra-tight" key={title}>
              <h3 className="flex items-center gap-2 leading-none font-medium text-black-pure">
                <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>
                  <Image {...FEATURE_ICONS[index]} alt="" />
                </span>
                {title}
              </h3>
              <p className="mt-2 leading-normal text-gray-new-40">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Architecture;
