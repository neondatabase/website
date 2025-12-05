import Image from 'next/image';

import Container from 'components/shared/container';
import anonymIcon from 'icons/home-new/branching/anonym-icon.svg';
import copyIcon from 'icons/home-new/branching/copy-icon.svg';
import ephemeralityIcon from 'icons/home-new/branching/ephemerality-icon.svg';

import Heading from '../heading';

import Animation from './animation';

const FEATURES = [
  {
    icon: copyIcon,
    title: 'Copy-on-write',
    description:
      'Create lightweight database branches instantly by duplicating metadata, saving space and time.',
  },
  {
    icon: anonymIcon,
    title: 'Anonymization',
    description:
      'Mask sensitive data with realistic fake values, enabling safe testing and sharing of datasets.',
  },
  {
    icon: ephemeralityIcon,
    title: 'Ephemerality',
    description:
      'Temporary computes shut down automatically when idle, lowering costs and overhead.',
  },
];

const Branching = () => (
  <section
    className="branching safe-paddings relative scroll-mt-[60px] pb-60 pt-40 xl:py-[136px] lg:scroll-mt-0 lg:pb-[104px] lg:pt-20 md:pb-20 md:pt-16"
    id="branching"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
      size="1600"
    >
      <div className="min-w-0">
        <Heading
          icon="branching"
          title="<strong>Instant branching.</strong> Develop and test new features and migrations with data & schema branches to eliminate surprises in production deploys."
        />
        <Animation />
        <ul className="mt-11 grid grid-cols-3 gap-x-16 xl:mt-9 lg:mt-12 lg:gap-x-8 lg:px-8 md:mt-10 md:grid-cols-1 md:gap-y-7 md:px-0">
          {FEATURES.map(({ icon, title, description }, index) => (
            <li key={index}>
              <div className="flex items-center gap-x-2.5">
                <Image
                  className="lg:size-[14px]"
                  src={icon}
                  width={16}
                  height={16}
                  loading="lazy"
                  alt=""
                />
                <h3 className="text-base font-medium tracking-tight text-white lg:text-[14px]">
                  {title}
                </h3>
              </div>
              <p className="mt-2.5 text-base tracking-tight text-gray-new-50 lg:text-[14px] md:mt-1.5 md:pr-8">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Branching;
