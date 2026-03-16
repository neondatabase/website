import Image from 'next/image';
import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const TagCloud = ({ items, className, titleClassName, iconClassName }) => (
  <ul className={cn('mt-6 flex flex-wrap', className)}>
    {items.map(({ title, icon }) => (
      <li
        className="flex h-10 items-center gap-2.5 rounded-full border border-gray-new-15 px-[18px] lg:h-[34px] lg:px-3 md:h-[30px] md:gap-2"
        key={title}
      >
        <Image
          className={cn('md:size-[14px]', iconClassName)}
          src={icon}
          width="16"
          height="16"
          alt={title}
        />
        <span
          className={cn(
            'leading-none font-normal tracking-extra-tight text-gray-new-90 lg:text-sm',
            titleClassName
          )}
        >
          {title}
        </span>
      </li>
    ))}
  </ul>
);

TagCloud.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default TagCloud;
