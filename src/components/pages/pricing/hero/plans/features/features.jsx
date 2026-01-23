import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';

const Feature = ({ title, info, type, highlighted, index, subtitle, moreLink, tag }) => (
  <li className="flex gap-x-2">
    <span
      className={clsx(
        'mt-[3px] size-3.5 flex-shrink-0 border-[3px] border-black-pure',
        highlighted ? 'bg-green-52' : 'bg-gray-new-90'
      )}
      aria-hidden
    />
    <p
      className={clsx(
        'text-[15px] leading-snug tracking-extra-tight',
        highlighted ? 'text-white' : 'text-gray-new-80'
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
          className="relative top-0.5 ml-1.5 inline-block"
          tooltip={info}
          tooltipId={`${type}_tooltip_${index}`}
          link={moreLink}
          clickable
        />
      )}
      {tag && (
        <span className="ml-1.5 inline-flex h-5 items-center border border-green-52/20 bg-green-52/[0.08] px-2 font-mono text-[13px] font-medium uppercase leading-none text-green-52">
          {tag}
        </span>
      )}
    </p>
  </li>
);

Feature.propTypes = {
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
  <div className="flex flex-col gap-y-3 border-t border-dashed border-gray-new-20 p-5">
    {title && (
      <p className="text-[15px] font-normal leading-snug tracking-extra-tight text-gray-new-60">
        {title}
      </p>
    )}

    <ul className="flex flex-col gap-y-3">
      {features.map((feature, index) => (
        <Feature {...feature} type={type} highlighted={highlighted} index={index} key={index} />
      ))}
    </ul>
  </div>
);

Features.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  features: PropTypes.arrayOf(PropTypes.shape(Feature.propTypes)).isRequired,
  type: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
};

export default Features;
