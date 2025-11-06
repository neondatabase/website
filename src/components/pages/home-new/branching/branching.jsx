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
    className="branching safe-paddings relative scroll-mt-16 pt-[160px] lg:scroll-mt-0"
    id="instant-branching"
  >
    <Container className="relative grid grid-cols-[224px_1fr] gap-x-32 before:block" size="1600">
      <div className="border-t border-gray-new-20 pt-[35px]">
        <Heading
          className="max-w-[930px]"
          icon="branching"
          theme="dark"
          title="<strong>Instant branching.</strong> Develop and test new features and migrations with data & schema branches to eliminate surprises in production deploys."
        />

        {/* TODO: replace image with animation */}
        <Image className="mt-14" src={branching} width={1184} height={500} quality={100} alt="" />

        <ul className="mt-11 grid grid-cols-3 gap-x-16">
          {ITEMS.map(({ icon, title, description }, index) => (
            <li className="" key={index}>
              <div className="flex items-center gap-x-2.5">
                <Image className="" src={icon} width={16} height={16} alt="" />
                <h3 className="text-base font-medium tracking-tight text-white">{title}</h3>
              </div>
              <p className="mt-2.5 tracking-tight text-gray-new-50">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Branching;
