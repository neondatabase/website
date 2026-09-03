import PropTypes from 'prop-types';

import ApiIcon from 'icons/features-icon/api.inline.svg';
import BranchingIcon from 'icons/features-icon/branching.inline.svg';
import StorageIcon from 'icons/storage-icon.inline.svg';

const ICONS = {
  api: ApiIcon,
  branching: BranchingIcon,
  storage: StorageIcon,
};

const Benefits = ({ items }) => (
  <ul className="mt-12 grid grid-cols-3 gap-x-[112px] xl:gap-x-16 lg:gap-x-8 md:grid-cols-1 md:gap-y-8">
    {items.map(({ title, description, icon }) => {
      const Icon = ICONS[icon];

      return (
        <li key={title}>
          <h4 className="flex items-center gap-x-2 text-base leading-none font-medium tracking-extra-tight text-pretty text-white">
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {title}
          </h4>
          <p className="mt-2 text-base leading-normal tracking-extra-tight text-pretty text-gray-new-50">
            {description}
          </p>
        </li>
      );
    })}
  </ul>
);

Benefits.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Benefits;
