import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import anonymIcon from 'icons/home-new/branching/anonym-icon.svg';
import squareIcon from 'icons/home-new/branching/square-icon.svg';
import branching from 'images/pages/home-new/branching/branching-illustration.png';

import Heading from '../heading';

const ITEMS = [
  {
    icon: squareIcon,
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
    icon: squareIcon,
    title: 'Ephemerality',
    description:
      'Temporary computes shut down automatically when idle, lowering costs and overhead.',
  },
];

const Branching = () => (
  <section
    className="branching safe-paddings relative scroll-mt-16 pt-[160px] xl:pt-[100px] lg:scroll-mt-0 lg:pt-11 md:pt-[30px]"
    id="branching"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-16"
      size="1600"
    >
      <div className="min-w-0 border-t border-gray-new-20 pt-[35px] xl:border-none">
        <Heading
          icon="branching"
          theme="dark"
          title="<strong>Instant branching.</strong> Develop and test new features and migrations with data & schema branches to eliminate surprises in production deploys."
        />

        {/* TODO: replace image with animation */}
        <Image
          className={clsx(
            'pointer-events-none relative -ml-[34px] mt-14 max-w-none',
            'xl:mt-12 xl:w-[94vw] lg:-ml-4 lg:w-[96vw] md:left-1/2 md:-ml-[50vw] md:w-screen'
          )}
          src={branching}
          width={1184}
          height={500}
          quality={100}
          alt=""
        />

        <ul className="mt-11 grid grid-cols-3 gap-x-16 xl:mt-9 lg:mt-12 lg:gap-x-8 lg:px-8 md:mt-10 md:grid-cols-1 md:gap-y-7 md:px-0">
          {ITEMS.map(({ icon, title, description }, index) => (
            <li key={index}>
              <div className="flex items-center gap-x-2.5">
                <Image className="" src={icon} width={16} height={16} alt="" />
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
