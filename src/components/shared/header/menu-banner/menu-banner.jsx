import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';

import bannerDesktop from './images/banner-desktop.jpg';
import bannerMobile from './images/banner-mobile.jpg';

const MenuBanner = ({ title, description, to }) => (
  <li className="mt-1 lg:-order-1 lg:mt-0">
    <Link
      className="group/banner relative block w-fit rounded-lg lg:h-20 xs:h-auto xs:min-h-[70px] xs:w-full"
      to={to}
      tagName="Menu Banner"
      tagText={title}
    >
      <Image className="rounded-xl lg:hidden" src={bannerDesktop} width={180} height={271} alt="" />
      <Image
        className="hidden w-full rounded-lg object-cover lg:block"
        src={bannerMobile}
        width={320}
        height={80}
        alt=""
      />

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 lg:justify-center xs:p-4">
        <h3 className="text-sm leading-none tracking-snug text-white">{title}</h3>
        <p
          className={clsx(
            'mt-1.5 max-w-[126px] text-xs font-light leading-snug tracking-extra-tight text-gray-new-50',
            'transition-colors duration-200 group-hover/banner:text-white'
          )}
        >
          {description}
        </p>
      </div>

      <GradientBorder className="!rounded-[11px]" withBlend />
    </Link>
  </li>
);

MenuBanner.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default MenuBanner;
