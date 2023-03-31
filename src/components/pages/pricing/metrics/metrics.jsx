'use client';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import ComputeTimeIcon from './svg/compute-time.inline.svg';
import DataTransferIcon from './svg/data-transfer.inline.svg';
import ProjectStorageIcon from './svg/project-storage.inline.svg';
import WrittenDataIcon from './svg/written-data.inline.svg';

const items = [
  {
    icon: ComputeTimeIcon,
    name: 'Compute time',
    price: 'From $0.072 /Compute-hour',
    details: 'The amount time that your Neon compute resources are active.',
  },
  {
    icon: ProjectStorageIcon,
    name: 'Project storage',
    price: 'From $0.072 /Gigabyte-hour',
    details: 'The amount of data stored in your Neon projects.',
  },
  {
    icon: WrittenDataIcon,
    name: 'Written data',
    price: 'From $0.072 /Gigabyte',
    details: 'The amount of data written to Neon storage to ensure durability.',
  },
  {
    icon: DataTransferIcon,
    name: 'Data transfer',
    price: 'From $0.072 /Gigabyte',
    details: 'The amount of data transferred out of Neon.',
  },
];

const Metrics = () => (
  <section className="metrics safe-paddings mt-32 lg:mt-24 md:mt-20">
    <Container className="flex flex-col items-center" size="mdDoc">
      <span className="text-center text-lg uppercase leading-snug text-primary-1">Metrics</span>
      <h2 className="mt-2.5 inline-flex flex-col text-center text-5xl font-bold leading-tight 2xl:max-w-[968px] 2xl:text-[44px] 2xl:leading-snug xl:text-4xl lg:inline lg:text-[36px] lg:leading-tight">
        Neon charges on four metrics
      </h2>
      <ul className="mt-14 grid w-full grid-cols-4 gap-x-9 xl:gap-x-5 lg:grid-cols-2 lg:gap-4 sm:grid-cols-1">
        {items.map(({ icon: Icon, name, price, details }, index) => (
          <li className="rounded-[20px] bg-gray-1 p-7" key={index}>
            <Icon className="" aria-hidden />
            <h2 className="mt-5 text-2xl font-semibold leading-tight">{name}</h2>
            <span className="mt-3 block text-base font-light leading-normal text-code-gray-1">
              {price}
            </span>
            <p className="mt-2 mr-2 text-base leading-normal">{details}</p>
          </li>
        ))}
      </ul>
      <p className="mt-7 text-center text-xl 2xl:mt-5 xl:text-base">
        Refer to our{' '}
        <Link
          className="font-semibold"
          theme="underline-primary-1"
          to={`${LINKS.docs}introduction/billing`}
        >
          billing
        </Link>{' '}
        documentation for rates per region.
      </p>
    </Container>
  </section>
);

export default Metrics;
