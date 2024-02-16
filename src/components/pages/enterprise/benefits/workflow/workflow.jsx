import Image from 'next/image';

import ArrowIcon from 'components/pages/pricing/forecasting/images/arrow.inline.svg';
import Link from 'components/shared/link/link';

import image from '../images/branching.jpg';

const Workflow = () => (
  <div className="workflow grid w-full grid-cols-10 items-center gap-x-10 xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="order-1 col-span-5 ml-10 justify-self-start 2xl:ml-8 lg:order-none lg:col-span-full lg:ml-0 lg:justify-self-stretch lg:text-center">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        Loved by your developers
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] md:mt-2">
        Developers use Neon's git-like Branching to bring the database into their workflow, making{' '}
        <Link
          className="border-b border-transparent text-green-45 no-underline transition-[border-color] duration-200 ease-in-out hover:border-green-45 sm:break-words"
          to="/docs/introduction/branching#development"
        >
          development
        </Link>
        ,{' '}
        <Link
          className="border-b border-transparent text-green-45 no-underline transition-[border-color] duration-200 ease-in-out hover:border-green-45 sm:break-words"
          to="/docs/introduction/branching#testing"
        >
          testing
        </Link>
        , deployment less stressful, more automated.
      </p>
      <Link
        className="group mt-6 inline-flex items-center rounded-[50px] bg-gray-new-10 py-2.5 pl-4 pr-2.5 leading-tight tracking-extra-tight transition-colors duration-200 hover:bg-gray-new-20 sm:flex-1 xs:w-full"
        to="/docs/introduction/branching#data-recovery"
      >
        <span>Explore instant recovery</span>
        <ArrowIcon className="ml-6 text-gray-new-70 transition-colors duration-200 group-hover:text-white sm:ml-auto" />
      </Link>
    </div>
    <div className="col-span-5 lg:col-span-full lg:flex lg:justify-center">
      <Image
        className="rounded-2xl"
        src={image}
        width={590}
        height={384}
        quality={90}
        alt="Neon branching interface"
      />
    </div>
  </div>
);

export default Workflow;
