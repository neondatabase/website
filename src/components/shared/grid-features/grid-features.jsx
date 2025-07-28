import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import costEffective from 'icons/migration/grid-features/cost-effective.svg';
import developerFriendly from 'icons/migration/grid-features/developer-friendly.svg';
import easy from 'icons/migration/grid-features/easy.svg';
import fullyManaged from 'icons/migration/grid-features/fully-managed.svg';
import reliability from 'icons/migration/grid-features/reliability.svg';
import serverlessAutoscaling from 'icons/migration/grid-features/serverless-autoscaling.svg';

import LogosSection from './logos-section';

const ITEMS = [
  {
    title: 'Easy',
    description: 'Simplify the life of developers with a serverless consumption model.',
    icon: easy,
  },
  {
    title: 'Reliability',
    description: 'S3 durability, multi-AZ redundancy, and point-in-time recovery.',
    icon: reliability,
  },
  {
    title: 'Cost-effective',
    description: 'With pay-as-you-go pricing that ties costs directly to usage.',
    icon: costEffective,
  },
  {
    title: 'Fully managed',
    description: 'Neon handles all database tasks — backups, updates, failovers.  ',
    icon: fullyManaged,
  },
  {
    title: 'Serverless & Autoscaling',
    description: 'Handles spiky workloads without intervention or overprovisioning.',
    icon: serverlessAutoscaling,
  },
  {
    title: 'Developer-friendly',
    description: 'Features like branching allows teams to automate tasks via CI/CD.',
    icon: developerFriendly,
  },
];

const GridFeatures = ({
  title = 'Why teams migrate to Neon',
  description = 'Neon provides a serverless, fully managed Postgres built for modern development — fast, reliable, and cost-effective.',
  link,
  linkText,
  items = ITEMS,
  className = 'mt-[202px] xl:mt-[162px] lg:mt-[136px] md:mt-[96px]',
  containerClassName,
  containerSize = '1152',
  titleClassName,
  descriptionClassName,
  ulClassName,
  headerClassName,
  logosTitle = 'Powered by Neon.',
  logos,
}) => (
  <section className={clsx('grid-features safe-paddings', className)}>
    <Container className={clsx('md:px-5 sm:!max-w-sm', containerClassName)} size={containerSize}>
      <header
        className={clsx(
          'mx-auto flex max-w-3xl flex-col items-center text-center md:max-w-[500px]',
          headerClassName
        )}
      >
        <h2
          className={clsx(
            'font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]',
            titleClassName
          )}
        >
          {title}
        </h2>
        <p
          className={clsx(
            'mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-base md:mt-3',
            descriptionClassName
          )}
        >
          {description}
        </p>
        {link && (
          <Link className="mt-5 lg:mt-4" href={link} size="sm" withArrow>
            {linkText}
          </Link>
        )}
      </header>
      <ul
        className={clsx(
          'mt-[51px] grid grid-cols-3 gap-x-11 gap-y-10 xl:mx-auto xl:mt-[54px] xl:max-w-3xl xl:grid-cols-2 lg:mt-[42px] lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10 md:mx-0 md:gap-y-12 sm:grid-cols-1',
          ulClassName
        )}
      >
        {items.map(({ title, description, icon }) => (
          <li key={title}>
            <Image
              className="relative mb-2.5 md:mb-[18px]"
              src={icon}
              alt=""
              width={22}
              height={22}
              quality={100}
            />
            <h3 className="text-xl font-semibold leading-snug tracking-extra-tight lg:text-lg">
              {title}
            </h3>
            <p
              className="mt-2 text-pretty leading-snug tracking-extra-tight text-gray-new-70 lg:text-wrap"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
      {logos && (
        <LogosSection
          logosTitle={logosTitle}
          classNameContainer="mt-[90px] xl:mt-[82px] lg:mt-20 md:mt-[66px]"
          logos={logos}
        />
      )}
    </Container>
  </section>
);

GridFeatures.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  linkText: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired,
    })
  ),
  containerClassName: PropTypes.string,
  containerSize: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  ulClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  logosTitle: PropTypes.string,
  logos: PropTypes.arrayOf(PropTypes.string),
};

export default GridFeatures;
