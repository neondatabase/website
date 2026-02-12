import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import DotsPattern from 'images/dots-pattern.inline.svg';

import ApiDrivenIcon from './icons/api-driven.inline.svg';
import AutomationIcon from './icons/automation.inline.svg';
import AutoscalingIcon from './icons/autoscaling.inline.svg';
import BranchingIcon from './icons/branching.inline.svg';
import CiWorkflowsIcon from './icons/ci-workflows.inline.svg';
import ConnectionPoolingIcon from './icons/connection-pooling.inline.svg';
import ConnectionsIcon from './icons/connections.inline.svg';
import CostEfficiencyIcon from './icons/cost-efficiency.inline.svg';
import DataIsolationIcon from './icons/data-isolation.inline.svg';
import DatabaseIcon from './icons/database.inline.svg';
import ElasticScalingIcon from './icons/elastic-scaling.inline.svg';
import IncognitoIcon from './icons/incognito.inline.svg';
import InstantProvisioningIcon from './icons/instant-provisioning.inline.svg';
import InstantRestoresIcon from './icons/instant-restores.inline.svg';
import MultiTenancyIcon from './icons/multi-tenancy.inline.svg';
import SaasAppsIcon from './icons/saas-apps.inline.svg';
import ScaleFromBottomLeftIcon from './icons/scale-from-bottom-left.inline.svg';
import ScaleToZeroIcon from './icons/scale-to-zero.inline.svg';
import SchemaIcon from './icons/schema.inline.svg';
import SparkleIcon from './icons/sparkle.inline.svg';
import UsageBasedIcon from './icons/usage-based.inline.svg';
import WindowCodeIcon from './icons/window-code.inline.svg';

// Map icon names to imported components
const ICONS = {
  'api-driven': ApiDrivenIcon,
  automation: AutomationIcon,
  autoscaling: AutoscalingIcon,
  branching: BranchingIcon,
  'ci-workflows': CiWorkflowsIcon,
  'connection-pooling': ConnectionPoolingIcon,
  connections: ConnectionsIcon,
  'cost-efficiency': CostEfficiencyIcon,
  'data-isolation': DataIsolationIcon,
  'elastic-scaling': ElasticScalingIcon,
  'instant-provisioning': InstantProvisioningIcon,
  'instant-restores': InstantRestoresIcon,
  'multi-tenancy': MultiTenancyIcon,
  'saas-apps': SaasAppsIcon,
  'scale-from-bottom-left': ScaleFromBottomLeftIcon,
  'scale-to-zero': ScaleToZeroIcon,
  schema: SchemaIcon,
  'usage-based': UsageBasedIcon,
  'window-code': WindowCodeIcon,
  database: DatabaseIcon,
  sparkle: SparkleIcon,
  incognito: IncognitoIcon,
};

const UseCaseCard = ({
  className,
  icon,
  title,
  description,
  link,
  logo,
  testimonial,
  tags,
  index,
}) => {
  const IconComponent = icon && ICONS[icon];

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
        className="pointer-events-none absolute right-2 top-2 aspect-square h-full lg:h-[328px] lg:w-[312px] md:bottom-2 md:top-auto md:h-[296px] md:w-[312px]"
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
            <h3 className="text-[1.75rem] leading-snug tracking-tighter text-white lg:text-2xl md:text-xl">
              {title}
            </h3>
            <p className="text-base leading-normal tracking-extra-tight text-gray-new-70 lg:text-[0.9375rem] lg:leading-snug md:text-[0.9375rem] md:leading-snug">
              {description}
            </p>
          </div>

          {/* Learn more link */}
          {link && (
            <Link
              className={clsx(
                'flex w-fit items-center gap-2 text-base font-medium leading-none tracking-extra-tight lg:text-[0.9375rem]',
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

        {/* Tags - footer of left section */}
        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-3.5 md:gap-3">
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
                  <span className="font-mono text-xs font-medium uppercase leading-none text-gray-new-80 md:text-[0.625rem]">
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
        {logo && (
          <Image
            className="max-h-7 w-fit lg:max-h-6 md:max-h-5"
            src={logo.mediaItemUrl}
            alt={title}
            width={logo.mediaDetails.width}
            height={logo.mediaDetails.height}
            priority={index <= 1}
          />
        )}

        {/* Testimonial */}
        {testimonial && (
          <div className="mt-auto">
            <blockquote
              className="font-mono text-lg leading-snug tracking-extra-tight text-gray-new-80 before:content-['“'] after:content-['”'] lg:text-base md:text-[0.9375rem] [&_mark]:bg-[#1F805C] [&_mark]:text-inherit [&_p]:inline"
              dangerouslySetInnerHTML={{ __html: testimonial.quote }}
            />
            <p className="mt-3.5 text-[0.9375rem] leading-snug tracking-extra-tight text-gray-new-70 md:mt-3 md:text-sm">
              {testimonial.author}
            </p>
            {testimonial.caseStudyLink && (
              <Link
                className="mt-5 block w-fit border-b border-dashed border-gray-new-70/40 text-[0.9375rem] leading-none tracking-extra-tight text-gray-new-70 transition-colors duration-200 hover:border-white/70 hover:text-white lg:mt-[18px] md:mt-4 md:text-sm"
                to={testimonial.caseStudyLink}
              >
                Read case study
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

UseCaseCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  logo: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
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
  index: PropTypes.number.isRequired,
};

const UseCaseCards = ({ className, items }) => (
  <section
    className={clsx('use-case-cards safe-paddings pt-24 xl:pt-[88px] lg:pt-20 md:pt-16', className)}
  >
    <Container className="flex flex-col gap-11 xl:gap-10 lg:gap-8" size="960">
      {items.map((item, index) => (
        <UseCaseCard key={index} {...item} index={index} />
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
      logo: PropTypes.shape({
        mediaItemUrl: PropTypes.string.isRequired,
        mediaDetails: PropTypes.shape({
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        }).isRequired,
      }),
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
