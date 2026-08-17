import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowTopRightIcon from 'icons/arrow-right.inline.svg';
import { cn } from 'utils/cn';

const DatabaseIcon = ({ className }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <ellipse cx="14" cy="7" rx="8" ry="3.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M6 7v14c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V7"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M6 14c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

DatabaseIcon.propTypes = {
  className: PropTypes.string,
};

const NeonMark = ({ className }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect width="28" height="28" rx="6" className="fill-green-45" />
    <path
      d="M22.5 4.5v19.5L15.1 17.4v6.6H4.5V4.5h18Zm-16.7 17h7V11.7l7.5 6.7V6.9h-14.5v14.6Z"
      className="fill-black-pure"
    />
  </svg>
);

NeonMark.propTypes = {
  className: PropTypes.string,
};

const AgentsGraphic = () => (
  <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-x-2 sm:right-2">
    <NeonMark className="shrink-0" />
    <svg
      width="28"
      height="52"
      viewBox="0 0 28 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-gray-new-80 dark:text-gray-new-20"
    >
      <path d="M0 26h10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 26v-18h10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 26h10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 26v18h10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
    <div className="flex flex-col gap-y-1.5 text-gray-new-50 dark:text-gray-new-60">
      <DatabaseIcon className="text-green-45" />
      <DatabaseIcon />
      <DatabaseIcon />
    </div>
  </div>
);

const PLATFORM_TILES = [false, true, false, true, false, false, false, false, true];

const PlatformsGraphic = () => (
  <div className="pointer-events-none absolute top-1/2 right-4 grid -translate-y-1/2 grid-cols-3 gap-1.5 sm:right-2">
    {PLATFORM_TILES.map((isHighlighted, index) => (
      <DatabaseIcon
        key={index}
        className={cn(
          'size-7',
          isHighlighted ? 'text-green-45' : 'text-gray-new-80 dark:text-gray-new-30'
        )}
      />
    ))}
  </div>
);

const GRAPHICS = {
  agents: AgentsGraphic,
  platforms: PlatformsGraphic,
};

const MenuFeatureCards = ({
  items,
  linkProps: { className, ...linkProps } = {},
  className: wrapperClassName,
}) => (
  <ul
    className={cn(
      'flex h-full w-[340px] flex-1 flex-col gap-y-3 lg:w-auto md:w-[320px]',
      wrapperClassName
    )}
  >
    {items.map(({ title, description, to, isExternal, graphic }) => {
      const Graphic = GRAPHICS[graphic];

      return (
        <li key={title} className="min-h-0 flex-1" role="none">
          <Link
            className={cn(
              'group relative flex h-full min-h-[104px] items-end overflow-hidden rounded border border-gray-new-90 bg-gray-new-98 p-5 pr-32 transition-colors duration-200',
              'hover:border-gray-new-80 dark:border-gray-new-15 dark:bg-gray-new-8 dark:hover:border-gray-new-30',
              'lg:pr-24 md:pr-20',
              className
            )}
            to={to}
            isExternal={isExternal}
            tagName="Navigation"
            tagText={title}
            role="menuitem"
            {...linkProps}
          >
            {Graphic && <Graphic />}
            <div className="relative z-10 flex max-w-[200px] flex-col gap-y-2 lg:max-w-[170px]">
              <p className="flex items-baseline gap-x-2 text-lg leading-none font-medium tracking-extra-tight text-black-pure dark:text-white">
                {title}
                <ArrowTopRightIcon className="-translate-x-2 scale-75 text-black-pure opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 dark:text-white" />
              </p>
              <p className="text-[13px] leading-tight tracking-snug text-gray-new-40 dark:text-gray-new-60">
                {description}
              </p>
            </div>
          </Link>
        </li>
      );
    })}
  </ul>
);

MenuFeatureCards.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      to: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
      graphic: PropTypes.oneOf(['agents', 'platforms']),
    })
  ).isRequired,
  linkProps: Link.propTypes,
  className: PropTypes.string,
};

export default MenuFeatureCards;
