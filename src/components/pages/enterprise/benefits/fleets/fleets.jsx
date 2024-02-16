import Image from 'next/image';

import ArrowIcon from 'components/pages/pricing/forecasting/images/arrow.inline.svg';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import image from '../images/fleets.svg';

const Fleets = () => (
  <div className="fleets grid w-full grid-cols-10 items-center gap-x-10 xl:items-end xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="col-span-5 lg:col-span-full lg:text-center">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        More databases, less work
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] md:mt-2">
        Use Neon as a single pane for managing fleets of Postgres databases, 50x faster create times
        than RDS.{' '}
        <Link
          className="border-b border-transparent text-green-45 no-underline transition-[border-color] duration-200 ease-in-out hover:border-green-45 sm:break-words"
          to="https://neon-experimental.vercel.app/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Automate
        </Link>{' '}
        tasks eliminating manual configuration and backups.
      </p>
      <Link
        className="group mt-6 inline-flex items-center rounded-[50px] bg-gray-new-10 py-2.5 pl-4 pr-2.5 leading-tight tracking-extra-tight transition-colors duration-200 hover:bg-gray-new-20 sm:flex-1 xs:w-full"
        to={LINKS.cliReference}
      >
        <span>Learn more about the Neon API/CLI</span>
        <ArrowIcon className="ml-6 text-gray-new-70 transition-colors duration-200 group-hover:text-white sm:ml-auto" />
      </Link>
    </div>
    <div className="col-span-5 lg:col-span-full lg:flex lg:justify-center">
      <Image
        className="rounded-2xl"
        width={590}
        height={387}
        src={image}
        alt="Neon database creation interface"
      />
    </div>
  </div>
);

export default Fleets;
