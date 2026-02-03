import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import DotsPattern from 'images/dots-pattern.inline.svg';

import ConnectionsIcon from './icons/connections.inline.svg';
import DatabaseIcon from './icons/database.inline.svg';
import IncognitoIcon from './icons/incognito.inline.svg';
import ScaleFromBottomLeftIcon from './icons/scale-from-bottom-left.inline.svg';
import SparkleIcon from './icons/sparkle.inline.svg';
import WindowCodeIcon from './icons/window-code.inline.svg';
import DispatchLogo from './logos/dispatch.inline.svg';
import InvencoLogo from './logos/invenco.inline.svg';
import MindvalleyLogo from './logos/mindvalley.inline.svg';
import NeoTaxLogo from './logos/neo-tax.inline.svg';
import RetoolLogo from './logos/retool.inline.svg';
import WordwareLogo from './logos/wordware.inline.svg';

// Map icon names to imported components
const ICONS = {
  connections: ConnectionsIcon,
  'scale-from-bottom-left': ScaleFromBottomLeftIcon,
  'window-code': WindowCodeIcon,
  database: DatabaseIcon,
  'sparkle-3': SparkleIcon,
  incognito: IncognitoIcon,
};

// Map logo names to imported components
const LOGOS = {
  retool: RetoolLogo,
  invenco: InvencoLogo,
  mindvalley: MindvalleyLogo,
  'neo-tax': NeoTaxLogo,
  dispatch: DispatchLogo,
  wordware: WordwareLogo,
};

const UseCaseCard = ({ className, icon, title, description, link, logo, testimonial, tags }) => {
  const IconComponent = icon && ICONS[icon];
  const LogoComponent = logo && LOGOS[logo];

  return (
    <article
      className={clsx(
        'relative flex h-[403px] overflow-hidden border border-gray-new-30 bg-black-pure',
        'lg:h-[349px]',
        'md:h-[600px] md:flex-col',
        className
      )}
    >
      {/* Decorative dots pattern (right side) */}
      <div
        className="pointer-events-none absolute right-[5px] top-[5px] aspect-square h-full lg:right-[6px] lg:top-[6px] lg:h-[327px] lg:w-[314px] md:bottom-[6px] md:right-[6px] md:top-auto md:h-[296px] md:w-[314px]"
        style={{
          maskImage: 'linear-gradient(224deg, #000 0%, rgba(0, 0, 0, 0) 41.2%)',
          WebkitMaskImage: 'linear-gradient(224deg, #000 0%, rgba(0, 0, 0, 0) 41.2%)',
        }}
        aria-hidden
      >
        <DotsPattern className="h-full w-full rotate-180" fill="#1C503D" />
      </div>

      {/* Vertical divider (desktop/tablet) / Horizontal divider (mobile) */}
      <div
        className="pointer-events-none absolute bottom-0 left-[480px] top-0 w-px bg-gray-new-30 lg:left-1/2 md:bottom-auto md:left-0 md:right-0 md:top-[300px] md:h-px md:w-full"
        aria-hidden
      />

      {/* Left column content (top section on mobile) */}
      <div className="relative z-10 flex w-[480px] shrink-0 flex-col justify-between bg-gray-new-8/70 p-8 lg:w-1/2 lg:p-7 md:h-[300px] md:w-full md:bg-transparent md:p-5 md:pb-6">
        <div className="flex flex-col gap-6 lg:gap-5 md:gap-4">
          {/* Icon */}
          {IconComponent && (
            <IconComponent className="h-6 w-6 text-green-52 md:h-5 md:w-5" aria-hidden />
          )}

          {/* Title and description */}
          <div className="flex flex-col gap-2 md:gap-1.5">
            <h3 className="text-[28px] leading-snug tracking-tighter text-white lg:text-2xl md:text-xl">
              {title}
            </h3>
            <p className="text-base leading-normal tracking-extra-tight text-gray-new-70 lg:text-[15px] lg:leading-snug md:text-[15px] md:leading-snug">
              {description}
            </p>
          </div>

          {/* Learn more link */}
          {link && (
            <Link
              className={clsx(
                'flex w-fit items-center gap-2 text-base font-medium leading-none tracking-extra-tight lg:text-[15px]',
                '[&>svg]:!text-gray-new-70 [&>svg]:!transition-all',
                'hover:!text-white [&:hover>svg]:!text-white'
              )}
              theme="white"
              to={link}
              withArrow
            >
              Learn more
            </Link>
          )}
        </div>

        {/* Tags (desktop and mobile - inside first section) */}
        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-3.5 pt-8 lg:hidden md:flex md:gap-3 md:pt-4">
            {tags.map(({ title: tagTitle, icon: tagIcon }) => {
              const TagIconComponent = tagIcon && ICONS[tagIcon];
              return (
                <li
                  className="flex h-[30px] items-center gap-2 rounded-sm bg-gray-new-15/90 px-2 py-1.5 md:h-[26px] md:gap-1.5 md:px-1.5 md:py-[5px]"
                  key={tagTitle}
                >
                  {TagIconComponent && (
                    <TagIconComponent
                      className="h-4 w-4 text-gray-new-94 md:h-3 md:w-3"
                      aria-hidden
                    />
                  )}
                  <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80 md:text-[10px]">
                    {tagTitle}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Right column content (bottom section on mobile) */}
      <div className="relative z-10 flex flex-1 flex-col p-8 lg:p-7 md:h-[300px] md:flex-none md:p-5 md:pt-6">
        {/* Logo */}
        {LogoComponent && <LogoComponent className="mb-auto text-white" aria-hidden />}

        {/* Testimonial */}
        {testimonial && (
          <div className="mt-auto">
            <blockquote className="font-mono text-lg leading-snug tracking-extra-tight text-gray-new-80 lg:text-base md:text-[15px] [&_mark]:bg-[#1F805C] [&_mark]:text-inherit">
              {testimonial.quote}
            </blockquote>
            <p className="mt-3.5 text-[15px] leading-snug tracking-extra-tight text-gray-new-70 md:mt-3 md:text-sm">
              {testimonial.author}
            </p>
            {testimonial.caseStudyLink && (
              <Link
                className="mt-5 block w-fit border-b border-dashed border-gray-new-70/40 text-[15px] leading-none tracking-extra-tight text-gray-new-70 transition-colors duration-200 hover:border-white/70 hover:text-white lg:mt-[18px] md:mt-4 md:text-sm"
                to={testimonial.caseStudyLink}
              >
                Read case study
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Tablet tags (shown at bottom of card - hidden on mobile) */}
      {tags && tags.length > 0 && (
        <ul className="relative z-10 hidden flex-wrap gap-3.5 px-7 pb-7 lg:absolute lg:bottom-0 lg:left-0 lg:flex md:hidden">
          {tags.map(({ title: tagTitle, icon: tagIcon }) => {
            const TagIconComponent = tagIcon && ICONS[tagIcon];
            return (
              <li
                className="flex h-[30px] items-center gap-2 rounded-sm bg-gray-new-15/90 px-2 py-1.5"
                key={tagTitle}
              >
                {TagIconComponent && (
                  <TagIconComponent className="h-4 w-4 text-gray-new-94" aria-hidden />
                )}
                <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80">
                  {tagTitle}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
};

UseCaseCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  logo: PropTypes.string,
  testimonial: PropTypes.shape({
    quote: PropTypes.node.isRequired,
    author: PropTypes.string.isRequired,
    caseStudyLink: PropTypes.string,
  }),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
};

const UseCaseCards = ({ className, items }) => (
  <section className={clsx('use-case-cards safe-paddings', className)}>
    <Container className="flex flex-col gap-8" size="960">
      {items.map((item, index) => (
        <UseCaseCard key={index} {...item} />
      ))}
    </Container>
  </section>
);

UseCaseCards.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      link: PropTypes.string,
      logo: PropTypes.string,
      testimonial: PropTypes.shape({
        quote: PropTypes.node.isRequired,
        author: PropTypes.string.isRequired,
        caseStudyLink: PropTypes.string,
      }),
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          icon: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};

export default UseCaseCards;
