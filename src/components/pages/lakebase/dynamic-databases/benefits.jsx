import Image from 'next/image';
import PropTypes from 'prop-types';

import backendIcon from 'icons/lakebase/dynamic-databases/backend.svg';
import environmentIcon from 'icons/lakebase/dynamic-databases/environment.svg';
import programmableIcon from 'icons/lakebase/dynamic-databases/programmable.svg';

const ICONS = {
  api: { src: programmableIcon, width: 15.22, height: 9.22 },
  branching: { src: environmentIcon, width: 14, height: 13.33 },
  storage: { src: backendIcon, width: 11.97, height: 11.92 },
};

const Benefits = ({ items }) => (
  <ul className="mt-12 grid grid-cols-3 gap-x-8 md:grid-cols-1 md:gap-y-8">
    {items.map(({ title, description, icon }) => {
      const iconProps = ICONS[icon];

      return (
        <li key={title}>
          <h4 className="flex items-center gap-x-2 text-base leading-none font-medium tracking-extra-tight text-pretty text-white 2xl:leading-tight">
            <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
              <Image {...iconProps} alt="" />
            </span>
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
