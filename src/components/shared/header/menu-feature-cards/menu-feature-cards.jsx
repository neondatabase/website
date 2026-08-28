import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowTopRightIcon from 'icons/arrow-right.inline.svg';
import { cn } from 'utils/cn';

import noise from './images/noise.svg';

const DatabaseIcon = ({ className }) => (
  <svg
    className={cn('size-5 shrink-0', className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

DatabaseIcon.propTypes = {
  className: PropTypes.string,
};

const AiChip = () => (
  <span
    className={cn(
      'flex size-6 shrink-0 items-center justify-center rounded-[5px] border text-[11px] leading-none font-medium tracking-tight',
      'border-gray-new-80 text-black-pure dark:border-gray-new-30 dark:text-white'
    )}
    aria-hidden
  >
    AI
  </span>
);

const Connector = () => (
  <svg
    width="23"
    height="62"
    viewBox="0 0 23 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className="shrink-0 text-gray-new-80 dark:text-gray-new-20"
  >
    <path d="M0 31h11M11 1v60M11 1h12M11 31h12M11 61h12" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const AgentsGraphic = () => (
  <div className="pointer-events-none relative z-10 flex shrink-0 items-center gap-x-2 self-center">
    <AiChip />
    <Connector />
    <div className="flex flex-col gap-y-[10px] text-gray-new-80 dark:text-gray-new-20">
      <DatabaseIcon className="text-green-52" />
      <DatabaseIcon />
      <DatabaseIcon />
    </div>
  </div>
);

// Which tiles in the 3x3 grid read as "provisioned", per the design
const PLATFORM_TILES = [false, true, false, true, false, false, false, false, true];

const PlatformsGraphic = () => (
  <div className="pointer-events-none relative z-10 grid shrink-0 grid-cols-3 gap-x-[10px] gap-y-[10px] self-center">
    {PLATFORM_TILES.map((isProvisioned, index) => (
      <DatabaseIcon
        key={index}
        className={isProvisioned ? 'text-green-52' : 'text-gray-new-80 dark:text-gray-new-20'}
      />
    ))}
  </div>
);

const GRAPHICS = {
  agents: AgentsGraphic,
  platforms: PlatformsGraphic,
};

// `menuitem` requires a menu/menubar ancestor. The desktop submenu provides one;
// the mobile menu is an ordinary nav > ul, so there the cards stay plain links.
const MenuFeatureCards = ({
  items,
  linkProps: { className, ...linkProps } = {},
  className: wrapperClassName,
  ariaLabelledBy,
  withMenuSemantics = false,
}) => (
  <ul
    className={cn('flex w-full min-w-0 flex-col gap-y-4', wrapperClassName)}
    role={withMenuSemantics ? 'group' : undefined}
    aria-labelledby={ariaLabelledBy}
  >
    {items.map(({ title, description, to, isExternal, graphic }) => {
      const Graphic = GRAPHICS[graphic];

      return (
        <li key={title} className="min-h-0 flex-1" role={withMenuSemantics ? 'none' : undefined}>
          <Link
            className={cn(
              'group relative flex h-full min-h-[112px] items-stretch justify-between gap-x-4 overflow-hidden p-4 ring-1 transition-colors duration-200 ring-inset',
              'bg-white ring-gray-new-90',
              'dark:bg-black-pure dark:ring-gray-new-20',
              className
            )}
            to={to}
            isExternal={isExternal}
            tagName="Navigation"
            tagText={title}
            role={withMenuSemantics ? 'menuitem' : undefined}
            {...linkProps}
          >
            <span
              className="pointer-events-none absolute inset-px z-0 bg-black-pure opacity-[0.075] dark:bg-white"
              style={{
                maskImage: `url(${noise.src})`,
                WebkitMaskImage: `url(${noise.src})`,
                maskSize: '330px 112px',
                WebkitMaskSize: '330px 112px',
              }}
              aria-hidden
            />
            <div
              className={cn(
                'relative z-10 flex min-w-0 flex-1 flex-col justify-end gap-y-2',
                Graphic && 'max-w-[154px]'
              )}
            >
              <p className="flex items-baseline gap-x-2 text-lg leading-none font-medium tracking-extra-tight text-black-pure dark:text-white">
                {title}
                <ArrowTopRightIcon className="-translate-x-2 scale-75 text-black-pure opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 dark:text-white" />
              </p>
              <p className="text-[13px] leading-[18px] tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
                {description}
              </p>
            </div>
            {Graphic && <Graphic />}
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
  linkProps: PropTypes.shape({
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    onKeyDown: PropTypes.func,
    tagName: PropTypes.string,
  }),
  className: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  withMenuSemantics: PropTypes.bool,
};

export default MenuFeatureCards;
