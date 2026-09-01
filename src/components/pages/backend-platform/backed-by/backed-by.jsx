import Image from 'next/image';

import Quotes from 'components/pages/home/backed-by/quotes';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import { sharedBackendPlatformContent } from 'constants/backend-platform-page-content';
import bgNoise from 'images/pages/home/backed-by/bg-noise.jpg';

const { backedBy } = sharedBackendPlatformContent;

const BackedBy = () => (
  <section
    id="backed-by-giants"
    className="backed-by relative overflow-hidden bg-[#E4F1EB] pt-40 safe-paddings pb-41 text-black-pure xl:py-32 lg:py-24 md:py-20"
  >
    <Container className="z-10" size="1600">
      <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(22.5rem,0.62fr)] gap-x-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] md:grid-cols-1 md:gap-y-20">
        <div className="flex flex-col border-l border-gray-new-50 pl-8 lg:pl-6 md:border-l-0 md:pl-0">
          <SectionLabel className="mb-5">{backedBy.label}</SectionLabel>
          <h2 className="max-w-200 text-[2.75rem] leading-dense tracking-tighter text-gray-new-40 xl:text-[2.25rem] lg:text-[2rem] md:text-[1.75rem]">
            <strong className="font-normal text-black-pure">{backedBy.title}</strong>{' '}
            {backedBy.highlightedTitle}
          </h2>

          <ul className="mt-auto flex gap-x-24 xl:gap-x-16 lg:gap-x-8 md:mt-9 md:flex-col md:gap-y-7">
            {backedBy.metrics.map(({ value, description }) => (
              <li className="max-w-62.5" key={value}>
                <h3 className="text-[4.5rem] leading-dense tracking-tighter xl:text-[3.25rem] lg:text-[2.75rem]">
                  {value}
                </h3>
                <p className="mt-1.5 text-base leading-[1.45] tracking-extra-tight text-gray-new-40 lg:text-[0.9375rem]">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-h-113.5 flex-col border-l border-gray-new-50 px-8 lg:min-h-105 lg:px-6 md:min-h-0 md:gap-y-4 md:border-l-0 md:px-0">
          <SectionLabel>{backedBy.trustedByLabel}</SectionLabel>
          <div className="mt-auto [&_blockquote]:text-[1.125rem]! [&_blockquote]:leading-[1.5]! lg:[&_blockquote]:text-base! md:[&_blockquote]:h-fit md:[&_blockquote]:min-h-40 md:[&_blockquote]:text-base! [&_figcaption>.block]:inline! [&_figcaption>.block]:after:content-['_–_'] md:[&_figure]:relative md:[&_figure]:bottom-auto">
            <Quotes items={backedBy.quotes} />
          </div>
        </div>
      </div>
    </Container>
    <Image
      className="pointer-events-none absolute top-0 right-[-10%] h-full w-auto max-w-none 2xl:right-[-20%] sm:right-[-50%]"
      src={bgNoise}
      alt=""
      width={1175}
      height={927}
      quality={100}
    />
  </section>
);

export default BackedBy;
