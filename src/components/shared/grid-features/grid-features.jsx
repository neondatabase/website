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

import { LogosWall } from '../logos';

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
  className,
  containerClassName,
  containerSize = '1152',
  ulClassName,
  headerClassName,
  logosTitle = 'Powered by Neon.',
  logos,
}) => (
  <section
    className={clsx(
      'grid-features safe-paddings pt-[202px] xl:pt-[162px] lg:pt-[136px] md:pt-[96px]',
      className
    )}
  >
    <Container className={clsx('md:px-5 sm:!max-w-sm', containerClassName)} size={containerSize}>
      <header
        className={clsx(
          'mx-auto flex max-w-[768px] flex-col items-center text-center lg:max-w-[560px] md:max-w-[500px]',
          headerClassName
        )}
      >
        <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-balance md:text-[32px]">
          {title}
        </h2>
        <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:max-w-[480px] lg:text-base">
          {description}
        </p>
        {link && (
          <Link className="mt-5" href={link} size="sm" withArrow>
            {linkText}
          </Link>
        )}
      </header>
      <ul
        className={clsx(
          'mt-[51px] grid grid-cols-3 gap-x-11 gap-y-10 xl:mx-auto xl:max-w-[832px] lg:mx-16 lg:mt-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10 md:mx-0 sm:grid-cols-1',
          ulClassName
        )}
      >
        {items.map(({ title, description, icon }) => (
          <li key={title}>
            <Image
              className="relative mb-3"
              src={icon}
              alt=""
              width={22}
              height={22}
              quality={100}
            />
            <h3 className="text-xl font-semibold leading-dense tracking-extra-tight lg:text-lg lg:tracking-tighter">
              {title}
            </h3>
            <p
              className="mt-2 text-pretty tracking-extra-tight text-gray-new-70"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </li>
        ))}
      </ul>
      {logos && (
        <div className="mx-auto mt-[84px] flex max-w-3xl items-center gap-10 lg:mt-[88px] md:mt-14 md:flex-col md:gap-8">
          <p className="w-[206px] text-lg font-medium leading-none tracking-extra-tight text-gray-new-70 md:max-w-full md:text-center md:text-sm">
            {logosTitle}
          </p>
          <LogosWall logos={logos} size="sm" gap="gap-9" />
        </div>
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
  ulClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  logosTitle: PropTypes.string,
  logos: PropTypes.arrayOf(PropTypes.string),
};

export default GridFeatures;
