import clsx from 'clsx';
import Image from 'next/image';

import Link from 'components/shared/link';
// import LINKS from 'constants/links';
import ArrowIcon from 'icons/home-new/link-arrow.inline.svg';
import deploy from 'images/pages/home-new/speed-scale/deploy.svg';
import manage from 'images/pages/home-new/speed-scale/manage.jpg';

import Heading from '../heading';

const DATA = [
  {
    className: 'gap-48 items-end 2xl:gap-20',
    contentClassName: 'pb-[72px] 2xl:pb-6 lg:p-0',
    title: 'Deploy thousands of databases that turn off when idle.',
    description:
      'Inactive databases pause on their own, keeping your fleet efficient and cost-effective.',
    link: '#',
    image: {
      className: '2xl:w-[720px] xl:w-[604px]',
      src: deploy,
      width: 832,
      height: 460,
    },
  },
  {
    className: 'gap-40 flex-row-reverse items-center 2xl:gap-16',
    title: 'Manage your fleet via API.',
    description:
      'Neon databases spin up in milliseconds, with APIs for quota controls and fleet scaling.',
    link: '#',
    image: {
      className: '2xl:w-[640px] xl:w-[512px]',
      src: manage,
      width: 736,
      height: 464,
    },
  },
];

const Features = () => (
  <ul className="mt-[168px] flex flex-col gap-[200px] xl:mt-[120px] xl:gap-44 lg:gap-[132px] md:mt-[84px] md:gap-[104px]">
    {DATA.map(({ className, contentClassName, title, description, link, image }) => (
      <li
        key={title}
        className={clsx(
          'flex xl:gap-16 lg:flex-col lg:items-start lg:gap-[72px] md:gap-[52px]',
          className
        )}
      >
        <div
          className={clsx(
            'w-[480px] shrink-0 xl:w-[352px] lg:w-[544px] sm:w-full',
            contentClassName
          )}
        >
          <Heading>
            <strong>{title}</strong> {description}
          </Heading>
          <Link
            className={clsx(
              'medium mt-7 flex w-fit items-center gap-2 text-lg font-medium leading-none tracking-extra-tight',
              'xl:mt-[30px] lg:mt-5 md:mt-[14px] sm:gap-1.5 sm:text-[15px]'
            )}
            theme="white"
            to={link}
          >
            Learn more
            <ArrowIcon className="sm:size-3" />
          </Link>
        </div>
        <div className="flex-1">
          <Image
            className={clsx('max-w-none lg:w-full', image.className)}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={title}
          />
        </div>
      </li>
    ))}
  </ul>
);

export default Features;
