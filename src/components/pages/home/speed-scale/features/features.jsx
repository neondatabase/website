import clsx from 'clsx';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

import Heading from '../heading';

import DeployDatabases from './deploy-databases';
import ManageFleet from './manage-fleet';

const DATA = [
  {
    className: 'items-end',
    contentClassName: 'pb-[72px] 2xl:pb-6 lg:p-0',
    title: 'Deploy thousands of databases that turn off when idle.',
    description:
      'Inactive databases pause on their own, keeping your fleet efficient and cost-effective.',
    link: LINKS.scaleToZero,
    animation: <DeployDatabases />,
    animationClassName:
      'w-fit max-w-[calc(50vw-64px)] shrink-0 overflow-hidden 2xl:max-w-[calc(50vw+48px)] xl:max-w-[calc(50vw+32px)] lg:max-w-full',
  },
  {
    className: 'flex-row-reverse items-center',
    title: 'Manage your fleet via API.',
    description:
      'Neon databases spin up in milliseconds, with APIs for quota controls and fleet scaling.',
    link: LINKS.api,
    animation: <ManageFleet />,
    animationClassName: 'flex-1 2xl:min-w-0 2xl:max-w-full sm:w-full',
  },
];

const Features = () => (
  <ul className="mt-[168px] flex flex-col gap-[200px] md:mt-[84px] md:gap-[104px] lg:gap-[132px] xl:mt-[120px] xl:gap-44">
    {DATA.map(
      (
        { className, contentClassName, title, description, link, animation, animationClassName },
        id
      ) => (
        <li
          className={clsx(
            'flex gap-48 md:gap-[52px] lg:flex-col lg:items-start lg:gap-[72px] xl:gap-16 2xl:gap-20',
            className
          )}
          key={id}
        >
          <div
            className={clsx(
              'w-[480px] shrink-0 sm:w-full lg:w-[544px] xl:w-[352px]',
              contentClassName
            )}
          >
            <Heading>
              <strong>{title}</strong> {description}
            </Heading>
            <Link
              className={clsx(
                'mt-7 flex w-fit items-center gap-2 rounded-sm text-lg leading-none font-medium tracking-extra-tight',
                'sm:gap-1.5 sm:text-[15px] md:mt-[14px] lg:mt-5 xl:mt-[30px]',
                '[&>svg]:text-gray-new-70! [&>svg]:transition-all!',
                'hover:text-white! [&:hover>svg]:text-white!'
              )}
              theme="white"
              to={link}
              withArrow
            >
              Learn more
            </Link>
          </div>
          <div className={animationClassName}>{animation}</div>
        </li>
      )
    )}
  </ul>
);

export default Features;
