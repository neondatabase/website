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
    className="architecture scroll-mt-16 overflow-hidden bg-[#E4F1EB] pt-[160px] safe-paddings pb-[124px] xl:pt-[120px] xl:pb-[96px] lg:scroll-mt-0 lg:py-[80px] md:py-[64px]"
    id="architecture"
    aria-labelledby="lakebase-architecture-heading"
    data-figma-node-id="37601:20027"
  >
    <Container size="1344">
      <h2
        className="max-w-[1280px] indent-24 text-[56px] leading-dense font-normal tracking-tighter text-black-pure xl:max-w-[960px] xl:indent-16 xl:text-5xl lg:max-w-[720px] lg:text-[36px] md:max-w-full md:indent-0 md:text-[32px] sm:text-[26px]"
        id="lakebase-architecture-heading"
      >
        {architecture.title}{' '}
        <mark className="-mr-[0.15em] -ml-[0.1em] bg-transparent bg-[linear-gradient(to_bottom,transparent_0.15em,rgba(57,165,125,0.6)_0.15em)] box-decoration-clone pr-[0.15em] pl-[0.1em]">
          {architecture.highlightedTitle}
        </mark>
      </h2>

      <figure
        className="mt-[72px] md:mt-[40px]"
        aria-label="Decoupled compute and shared versioned storage in Lakebase"
        role="img"
      >
        <div className="md:hidden">
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

      <div className="mt-[56px] grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-x-48 xl:gap-x-20 lg:grid-cols-1 lg:gap-y-10 md:mt-8 md:gap-y-10">
        <p className="text-[40px] leading-dense tracking-extra-tight text-gray-new-40 xl:text-[32px] lg:max-w-[720px] lg:text-[28px] md:text-[22px] sm:text-[20px]">
          <span className="text-black-new">{architecture.description}</span>{' '}
          {architecture.secondaryDescription}
        </p>

        <ul className="flex flex-col gap-8 pt-2.5 lg:grid lg:grid-cols-3 lg:gap-6 lg:pt-0 md:grid-cols-1 md:gap-8">
          {architecture.features.map(({ title, description }, index) => (
            <li className="text-[16px] tracking-extra-tight" key={title}>
              <h3 className="flex items-center gap-2 leading-none font-medium text-black-pure">
                <span className="flex size-[16px] shrink-0 items-center justify-center" aria-hidden>
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
