import clsx from 'clsx';
import Image from 'next/image';

import Link from 'components/shared/link';
import links from 'constants/links';
import ArrowTopRightIcon from 'icons/arrow-top-right.inline.svg';

import bannerImage from './image/banner-pattern.svg';
import noiseBackground from './image/noise-background.svg';

const MenuBanner = ({ linkProps: { className, ...linkProps } = {} }) => (
  <Link
    className={clsx(
      'group relative flex h-[340px] w-[320px] !items-end overflow-hidden border border-gray-new-10 bg-black-pure p-6 lg:w-auto md:h-[240px] md:w-[320px]',
      className
    )}
    to={links.whyNeon}
    tagName="Menu Banner"
    tagText="What is Neon"
    {...linkProps}
  >
    <Image
      className="pointer-events-none absolute -bottom-4 left-[-11px] z-0 max-w-none md:-bottom-0.5"
      src={noiseBackground}
      width={383}
      height={365}
      alt=""
    />
    <Image
      className="pointer-events-none absolute -bottom-4 left-[-11px] z-[1] max-w-none md:-bottom-0.5"
      src={bannerImage}
      width={383}
      height={365}
      alt=""
    />

    <div className="flex flex-col gap-y-2">
      <h3 className="flex items-baseline gap-x-2.5 whitespace-nowrap text-2xl font-medium leading-none tracking-tighter text-white lg:text-lg md:text-base">
        What is Neon
        <ArrowTopRightIcon className="-translate-x-2 scale-75 text-white opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100" />
      </h3>
      <p className="text-[15px] leading-tight tracking-extra-tight text-gray-new-60 lg:text-[13px]">
        Serverless Postgres, by Databricks
      </p>
    </div>
  </Link>
);

MenuBanner.propTypes = {
  linkProps: Link.propTypes,
};

export default MenuBanner;
