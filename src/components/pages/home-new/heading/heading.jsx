import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import autoscalingIcon from 'icons/home-new/autoscaling.svg';
import branchingIcon from 'icons/home-new/branching.svg';
import featuresIcon from 'icons/home-new/features.svg';
import perfomanceIcon from 'icons/home-new/perfomance.svg';

const ICONS = {
  autoscaling: autoscalingIcon,
  branching: branchingIcon,
  features: featuresIcon,
  perfomance: perfomanceIcon,
};

const Heading = ({ className = '', icon, title }) => {
  const iconSrc = ICONS[icon];

  return (
    <div className={clsx('flex flex-col gap-y-14', className)}>
      {iconSrc && <Image src={iconSrc} width={56} height={56} alt="" />}
      <h2
        className="indent-24 text-[48px] font-normal leading-dense tracking-tighter text-gray-new-40 [&>strong]:font-normal [&>strong]:text-black-pure "
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
};

Heading.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOf(ICONS.keys).isRequired,
  title: PropTypes.string.isRequired,
};

export default Heading;
