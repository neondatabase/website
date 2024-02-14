import Image from 'next/image';

import CardItemsList from '../../../../shared/card-items-list';
import image from '../images/3.png';
import appStoreIcon from '../images/app-store.svg';
import bookIcon from '../images/book.svg';
import fileIcon from '../images/file.svg';

const items = [
  {
    icon: fileIcon,
    title: 'Autoscaling',
    description: 'Compute resources scale based on demand.',
    url: '/docs/introduction/autoscaling',
  },
  {
    icon: appStoreIcon,
    title: 'Autosuspend',
    description: 'Scale computes to zero when not in use.',
    url: '/docs/introduction/auto-suspend',
  },
  {
    icon: bookIcon,
    title: 'Read Replicas',
    description: 'Scale out on demand with read replicas.',
    url: '/docs/introduction/read-replicas',
  },
];

const PricePerf = () => (
  <div className="price-perf grid w-full grid-cols-10 items-center gap-x-10 xl:items-end xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="col-span-5 lg:col-span-full">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        Increase performance not costs
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] lg:text-center md:mt-2">
        The serverless model in Neon means customers never pay for compute that&apos;s not being
        actively used.
      </p>
      <CardItemsList
        className="mt-8 max-w-[550px] gap-x-6 lg:col-span-full lg:max-w-none"
        items={items}
      />
    </div>
    <div className="col-span-5 lg:col-span-full">
      <Image className="rounded-2xl" src={image} quality={90} alt="Authorize Hasura Cloud" />
    </div>
  </div>
);

export default PricePerf;
