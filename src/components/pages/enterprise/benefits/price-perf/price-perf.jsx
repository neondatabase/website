import Image from 'next/image';

import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-right-rounded.inline.svg';

import image from '../images/replicas.svg';

const PricePerf = () => (
  <div className="price-perf grid w-full grid-cols-10 items-center gap-x-10 xl:items-end xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="col-span-5 lg:col-span-full lg:text-center">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        Scale performance, not costs
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] md:mt-2">
        Neon is serverless Postgres: you never pay for compute that's not being actively used.{' '}
        <Link
          className="border-b border-transparent text-green-45 no-underline transition-[border-color] duration-200 ease-in-out hover:border-green-45 sm:break-words"
          to="/docs/introduction/scale-to-zero"
        >
          Scale to zero
        </Link>{' '}
        or scale out with{' '}
        <Link
          className="border-b border-transparent text-green-45 no-underline transition-[border-color] duration-200 ease-in-out hover:border-green-45 sm:break-words"
          to="/docs/introduction/read-replicas"
        >
          read replicas
        </Link>{' '}
        on demand.
      </p>
      <Link
        className="group mt-6 inline-flex items-center rounded-[50px] bg-gray-new-15 bg-opacity-80 py-2.5 pl-4 pr-2.5 leading-tight tracking-extra-tight transition-colors duration-200 hover:bg-gray-new-20 sm:flex-1 xs:w-full"
        to="https://neon.tech/variable-load"
      >
        <span>How Neon helps with variable traffic</span>
        <ArrowIcon className="ml-6 text-gray-new-70 transition-colors duration-200 group-hover:text-white sm:ml-auto" />
      </Link>
    </div>
    <div className="col-span-5 lg:col-span-full lg:flex lg:justify-center">
      <Image
        className="rounded-2xl"
        src={image}
        width={590}
        height={387}
        alt="Autoscaling with Neon"
      />
    </div>
  </div>
);

export default PricePerf;
