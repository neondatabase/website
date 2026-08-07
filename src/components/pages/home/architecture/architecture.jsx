import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import applicationArrow from 'images/pages/home/architecture/application-arrow.svg';
import applicationIcon from 'images/pages/home/architecture/application-icon.svg';
import computeArrow from 'images/pages/home/architecture/compute-arrow.svg';
import computeIcon from 'images/pages/home/architecture/compute-icon.svg';
import diagramGridLines from 'images/pages/home/architecture/diagram-grid-lines.svg';
import diagramGridMask from 'images/pages/home/architecture/diagram-grid-mask.svg';
import popupCorners from 'images/pages/home/architecture/popup-corners.svg';
import popupPixelMask from 'images/pages/home/architecture/popup-pixel-mask.svg';
import popupPointer from 'images/pages/home/architecture/popup-pointer.svg';
import primaryInstance from 'images/pages/home/architecture/primary-instance.svg';
import replicaPattern from 'images/pages/home/architecture/replica-pattern.svg';
import serviceSymbol from 'images/pages/home/architecture/service-symbol.svg';
import storageIcon from 'images/pages/home/architecture/storage-icon.svg';

const DIAGRAM_BACKGROUND_STYLE = {
  backgroundBlendMode: 'soft-light',
  backgroundColor: '#D8E9E1',
  backgroundImage: `url(${diagramGridMask.src}), url(${diagramGridLines.src})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const POPUP_BACKGROUND_STYLE = {
  backgroundImage: `url(${popupCorners.src}), url(${popupPixelMask.src})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const PRIMARY_BACKGROUND_STYLE = {
  backgroundImage: `url(${primaryInstance.src})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const REPLICA_BACKGROUND_STYLE = {
  backgroundImage: `url(${replicaPattern.src})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const POPUP_BLOCKS = [
  'col-start-5 col-span-3 row-start-4',
  'col-start-4 col-span-4 row-start-5',
  'col-start-8 row-start-4',
  'col-start-9 row-start-4',
  'col-start-8 row-start-5',
  'col-start-6 row-start-3',
  'col-start-7 row-start-3',
  'col-start-6 row-start-2',
  'col-start-6 row-start-6',
  'col-start-7 row-start-6',
  'col-start-6 row-start-7',
  'col-start-8 col-span-2 row-start-3',
  'col-start-10 row-start-4',
  'col-start-9 col-span-2 row-start-5',
  'col-start-8 row-start-6',
  'col-start-4 col-span-2 row-start-6',
  'col-start-5 row-start-7',
  'col-start-7 row-start-7',
  'col-start-5 row-start-3',
  'col-start-5 row-start-2',
  'col-start-7 row-start-2',
  'col-start-3 col-span-2 row-start-4',
  'col-start-2 col-span-2 row-start-5',
];

const AutoscalingPopup = () => (
  <div className="w-40.5 shrink-0 bg-gray-new-10 p-2">
    <div
      className="grid h-27.25 grid-cols-12 grid-rows-8 overflow-hidden bg-gray-new-15"
      style={POPUP_BACKGROUND_STYLE}
    >
      {POPUP_BLOCKS.map((block) => (
        <span className={`bg-white ${block}`} key={block} />
      ))}
    </div>
    <p className="mt-3 font-mono text-sm leading-none font-medium tracking-wide text-white uppercase">
      Autoscaling
    </p>
    <p className="mt-2 font-mono text-xs leading-dense tracking-wider text-gray-new-80">
      Load ↑
      <br />
      Compute ↑
      <br />
      Capacity adapts
    </p>
  </div>
);

const Application = () => (
  <div className="flex w-fit items-center justify-center gap-3 border border-gray-new-10/40 bg-white px-5 py-3.75">
    <Image className="size-6 shrink-0" src={applicationIcon} width={24} height={24} alt="" />
    <p className="text-base leading-dense font-medium tracking-extra-tight whitespace-nowrap text-black-pure">
      Your application
    </p>
  </div>
);

const Compute = () => (
  <div className="flex min-w-0 flex-col border border-dashed border-gray-new-10/40 bg-[#F9FBFA] p-4.5">
    <div className="flex items-center gap-2 text-sm leading-dense tracking-extra-tight text-gray-new-30">
      <Image className="size-3" src={computeIcon} width={12} height={12} alt="" />
      Compute
    </div>

    <div
      className="mt-6 flex min-h-26 flex-col items-center justify-center gap-1 border border-gray-new-10 bg-[#CAE6DC] p-3 text-center"
      style={PRIMARY_BACKGROUND_STYLE}
    >
      <div className="flex items-center gap-2">
        <span className="size-3 border border-gray-new-10 bg-[#CAE6DC] p-0.75">
          <span className="block size-full bg-gray-new-10" />
        </span>
        <p className="text-sm leading-dense font-medium tracking-extra-tight text-black-pure">
          Postgres
        </p>
      </div>
      <p className="font-mono text-xs leading-none tracking-extra-tight text-gray-new-30">
        (primary)
      </p>
    </div>

    <div className="my-2 flex h-8 items-center justify-center" aria-hidden="true">
      <Image className="h-8 w-auto rotate-180" src={computeArrow} width={6} height={32} alt="" />
    </div>

    <div
      className="flex min-h-26 flex-col items-center justify-center gap-1 border border-gray-new-10/30 bg-[#EDF3F0] p-3 text-center opacity-40"
      style={REPLICA_BACKGROUND_STYLE}
    >
      <div className="flex items-center gap-2">
        <Image className="size-3" src={serviceSymbol} width={12} height={12} alt="" />
        <p className="text-sm leading-dense font-medium tracking-extra-tight text-black-pure">
          Postgres
        </p>
      </div>
      <p className="font-mono text-xs leading-none tracking-extra-tight text-gray-new-30">
        (replica)
      </p>
    </div>
  </div>
);

const Storage = () => (
  <div className="flex min-w-0 flex-col border border-dashed border-gray-new-10/40 bg-[#F9FBFA] p-4.5">
    <div className="flex items-center gap-2 text-sm leading-dense tracking-extra-tight text-gray-new-30">
      <Image className="size-3.5" src={storageIcon} width={14} height={14} alt="" />
      Storage
    </div>

    <div className="mt-6 flex min-h-62 flex-1 flex-col items-center justify-center gap-3 border border-gray-new-10 bg-[#CAE6DC] p-3 text-center">
      <Image className="size-3" src={serviceSymbol} width={12} height={12} alt="" />
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-dense font-medium tracking-extra-tight text-black-pure">
          Object Stores
        </p>
        <p className="font-mono text-xs leading-none tracking-extra-tight text-gray-new-30">
          (Lake)
        </p>
      </div>
      <Image className="mt-3 size-3" src={serviceSymbol} width={12} height={12} alt="" />
    </div>
  </div>
);

const Lakebase = () => (
  <div className="w-full max-w-145.5 justify-self-end border border-gray-new-10/40 bg-[#E4EFEA] p-5 xl:max-w-none">
    <p className="text-base leading-dense tracking-extra-tight text-gray-new-15">Lakebase</p>
    <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-4">
      <Compute />
      <Storage />
    </div>
  </div>
);

const ArchitectureDiagram = () => (
  <div
    className="relative border-b border-gray-new-10 py-17.5 pr-40 pl-24 xl:px-8 xl:py-12 lg:px-5 lg:py-8"
    style={DIAGRAM_BACKGROUND_STYLE}
  >
    <div className="absolute -top-15.25 left-37.25 z-10 xl:left-8 lg:static lg:mb-5">
      <AutoscalingPopup />
    </div>
    <Image
      className="pointer-events-none absolute top-0 left-77.5 h-52.75 w-54.75 xl:hidden"
      src={popupPointer}
      width={219}
      height={211}
      alt=""
    />

    <div className="grid grid-cols-[12.875rem_8.75rem_minmax(0,36.375rem)] items-center xl:grid-cols-[11.25rem_minmax(2.5rem,1fr)_minmax(0,36.375rem)] xl:gap-x-6 lg:grid-cols-1 lg:gap-y-5">
      <div className="flex min-h-96.75 flex-col justify-end pb-16 xl:min-h-90 xl:pb-10 lg:min-h-0 lg:pb-0">
        <div>
          <Application />
        </div>
      </div>

      <div className="flex min-h-96.75 flex-col justify-end pb-27 xl:min-h-90 xl:pb-23.5 lg:min-h-10 lg:flex-row lg:items-center lg:justify-start lg:pb-0">
        <div className="flex h-6 items-center justify-center overflow-visible lg:ml-23 lg:h-10 lg:w-1">
          <Image
            className="h-33.75 w-1.5 -rotate-90 lg:h-10 lg:w-auto lg:rotate-0"
            src={applicationArrow}
            width={6}
            height={135}
            alt=""
          />
        </div>
      </div>

      <Lakebase />
    </div>
  </div>
);

const Highlight = ({ children }) => (
  <mark className="relative inline bg-transparent">
    <span className="absolute top-[0.15em] -right-1 bottom-[-0.025em] left-[-0.1em] bg-green-44/60" />
    <span className="relative z-10 inline">{children}</span>
  </mark>
);

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
};

const Architecture = () => (
  <section
    className="architecture scroll-mt-16 bg-[#E4F1EB] py-40 safe-paddings xl:pt-34 xl:pb-38 lg:scroll-mt-0 lg:pt-20 lg:pb-26 md:pt-16 md:pb-20"
    id="architecture"
  >
    <Container className="md:px-5!" size="1600">
      <h2 className="max-w-320 indent-24 text-[3.5rem] leading-dense font-normal tracking-tighter text-black-pure xl:max-w-240 xl:indent-16 xl:text-5xl lg:max-w-180 lg:text-[2.25rem] md:max-w-full md:indent-0 md:text-[2rem] sm:text-[1.625rem]">
        The way we build software is changing, but the fundamentals remain the same:{' '}
        <Highlight>powerful databases,</Highlight> <Highlight>reliable infrastructure,</Highlight>{' '}
        and <Highlight>seamless scalability.</Highlight>
      </h2>

      <div className="mt-16 border-t border-gray-new-50 pt-26.5 xl:mt-12 xl:pt-16 lg:mt-10 lg:pt-12 md:mt-8 md:pt-8">
        <div className="grid grid-cols-[14rem_minmax(0,1fr)] gap-x-32 xl:grid-cols-1">
          <div aria-hidden="true" className="xl:hidden" />
          <div className="min-w-0">
            <ArchitectureDiagram />

            <p className="mt-9 max-w-248 text-4xl leading-dense tracking-tighter text-gray-new-40 xl:text-[2rem] lg:text-[1.75rem] md:text-[1.375rem] sm:text-xl">
              <span className="text-black-new">Postgres without compromise </span>gives developers
              the database ecosystem they trust with the flexibility and speed needed for modern
              applications.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Architecture;
