import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';

import bannerDesktop from './images/banner-desktop.jpg';
import bannerMobile from './images/banner-mobile.jpg';
import bannerTablet from './images/banner-tablet.jpg';

const MenuBanner = ({ title, description, to }) => (
  <li className="mt-1 lg:-order-1 lg:mt-0">
    <Link className="group/banner relative block w-fit rounded-lg xs:w-full" to={to}>
      <Image className="rounded-lg lg:hidden" src={bannerDesktop} width={232} height={145} alt="" />
      <Image
        className="hidden rounded-lg lg:block xs:hidden"
        src={bannerTablet}
        width={252}
        height={80}
        alt=""
      />
      <Image
        className="hidden w-full rounded-lg object-cover xs:block"
        src={bannerMobile}
        width={320}
        height={80}
        alt=""
      />

      <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-3.5 lg:justify-center lg:p-3 xs:p-4">
        <h3 className="text-sm leading-none tracking-snug text-white">{title}</h3>
        <p
          className={clsx(
            'mt-1.5 text-xs font-light leading-none tracking-extra-tight text-gray-new-50',
            'transition-colors duration-200 group-hover/banner:text-white'
          )}
        >
          {description}
        </p>
      </div>

      <GradientBorder className="border-image-header-menu-banner lg:border-image-header-menu-banner-mobile" />
    </Link>
  </li>
);

MenuBanner.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default MenuBanner;
