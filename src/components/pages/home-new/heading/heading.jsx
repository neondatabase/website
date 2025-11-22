import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import autoscalingIcon from 'icons/home-new/autoscaling.svg';
import branchingIcon from 'icons/home-new/branching.svg';
import featuresIcon from 'icons/home-new/features.svg';
import performanceIcon from 'icons/home-new/performance.svg';

const ICONS = {
  autoscaling: autoscalingIcon,
  branching: branchingIcon,
  features: featuresIcon,
  performance: performanceIcon,
};

const Heading = ({ className = '', theme = 'dark', icon, title }) => (
  <div
    className={clsx(
      'flex max-w-[960px] flex-col gap-y-14',
      'xl:max-w-[800px] xl:gap-y-12',
      'lg:max-w-xl lg:gap-y-7',
      'md:max-w-full',
      className
    )}
  >
    {icon && (
      <Image
        className="pointer-events-none xl:size-12 lg:size-10 md:size-9"
        src={ICONS[icon]}
        width={56}
        height={56}
        alt=""
      />
    )}
    <h2
      className={clsx(
        'indent-24 text-[48px] font-normal leading-dense tracking-tighter [&>strong]:font-normal',
        'xl:text-[40px] lg:indent-16 lg:text-[28px] md:indent-0 md:text-[24px]',
        theme === 'dark' && 'text-gray-new-50 [&>strong]:text-white',
        theme === 'light' && 'text-gray-new-40 [&>strong]:text-black-pure'
      )}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  </div>
);

Heading.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  icon: PropTypes.oneOf(ICONS.keys),
  title: PropTypes.string.isRequired,
};

export default Heading;
