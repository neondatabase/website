import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';

const icons = {
  projects: 'pricing-projects-icon',
  storage: 'pricing-storage-icon',
  clock: 'pricing-clock-icon',
  autoscale: 'pricing-autoscale-icon',
};

const Feature = ({ icon, title, info, type, highlighted, index, subtitle, moreLink, tag }) => (
  <li className="flex gap-x-2">
    <span
      className={clsx(
        icon ? icons[icon] : 'pricing-check-icon',
        'mt-px size-4 flex-shrink-0 translate-y-px',
        highlighted ? 'bg-green-45' : 'bg-gray-new-60'
      )}
      aria-hidden
    />
    <p
      className={clsx(
        'text-[15px] leading-normal tracking-extra-tight',
        highlighted ? 'text-gray-new-98' : 'text-gray-new-80'
      )}
    >
      <span className="with-link-primary">
        {Array.isArray(title) ? (
          title.map((part, i) =>
            typeof part === 'string' ? (
              <Fragment key={i} dangerouslySetInnerHTML={{ __html: part }} />
            ) : (
              <Link key={i} to={part.href} onClick={part.onClick}>
                {part.text}
              </Link>
            )
          )
        ) : (
          <span dangerouslySetInnerHTML={{ __html: title }} />
        )}
        {subtitle ? <span className="ml-1 text-gray-new-50">{subtitle}</span> : ''}
      </span>
      {info && (
        <InfoIcon
          className="relative top-0.5 ml-1 inline-block"
          tooltip={info}
          tooltipId={`${type}_tooltip_${index}`}
          link={moreLink}
          clickable
        />
      )}
      {tag && (
        <span className="ml-1.5 rounded-full bg-green-45/20 px-[5px] py-0.5 text-[11px] font-medium uppercase leading-none tracking-extra-tight text-green-45">
          {tag}
        </span>
      )}
    </p>
  </li>
);

Feature.propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons)),
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  subtitle: PropTypes.string,
  type: PropTypes.string,
  highlighted: PropTypes.bool,
  index: PropTypes.number,
  moreLink: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
  tag: PropTypes.string,
};

const Features = ({ title, features, type, highlighted }) => (
  <div
    className={clsx(
      'mt-5 space-y-4 border-t border-dashed border-gray-new-20 pt-5',
      'text-[15px] leading-none tracking-extra-tight',
      highlighted ? 'text-white' : 'text-gray-new-80'
    )}
  >
    {title && <p className="text-[15px] font-medium leading-none tracking-extra-tight">{title}</p>}

    <ul className="space-y-3">
      {features.map((feature, index) => (
        <Feature {...feature} type={type} highlighted={highlighted} index={index} key={index} />
      ))}
    </ul>
  </div>
);

Features.propTypes = {
  title: PropTypes.string,
  features: PropTypes.arrayOf(Feature.propTypes).isRequired,
  type: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
};

export default Features;
