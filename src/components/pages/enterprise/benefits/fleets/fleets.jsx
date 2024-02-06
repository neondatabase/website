import Image from 'next/image';

import CardItemsList from '../../../../shared/card-items-list';
import appStoreIcon from '../images/app-store.svg';
import bookIcon from '../images/book.svg';
import fileIcon from '../images/file.svg';
import image from '../images/fleets.gif';

const items = [
  {
    icon: fileIcon,
    title: '50x faster',
    description: 'Create, clone, restore actions 50x faster than RDS',
    url: '#',
  },
  {
    icon: bookIcon,
    title: 'API/CLI',
    description: 'Automate with the Neon API and CLI',
    url: '/docs/reference/neon-cli',
  },
  {
    icon: appStoreIcon,
    title: 'Automated',
    description: 'No manual config, backups, failovers, resizes, patches.',
    url: 'https://neon-experimental.vercel.app/',
  },
];

const Fleets = () => (
  <div className="fleets mt-[104px] grid w-full grid-cols-10 items-center gap-x-10 xl:mt-[104px] xl:items-end xl:gap-x-6 lg:mt-20 lg:gap-y-7 md:mt-10 md:gap-y-6">
    <div className="col-span-5 lg:col-span-full">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        More databases, less work
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] lg:text-center md:mt-2">
        Use Neon as a single pane of glass for fleets of Postgres databases: Instant provisioning,
        autoscaling, and scale to zero.
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

export default Fleets;
