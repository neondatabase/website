import Image from 'next/image';

import CardItemsList from '../../../../shared/card-items-list';
import appStoreIcon from '../images/app-store.svg';
import bookIcon from '../images/book.svg';
import image from '../images/branching.png';
import fileIcon from '../images/file.svg';

const items = [
  {
    icon: fileIcon,
    title: 'Development',
    description: 'Keep everyone in sync with dev branches.',
    url: '/docs/introduction/branching#development',
  },
  {
    icon: appStoreIcon,
    title: 'Testing',
    description: 'Test changes on a clone of production.',
    url: '/docs/introduction/branching#testing',
  },
  {
    icon: bookIcon,
    title: 'Recovery',
    description: 'Instantly recover when things go wrong.',
    url: '/docs/introduction/branching#data-recovery',
  },
];

const Workflow = () => (
  <div className="workflow mt-[104px] grid w-full grid-cols-10 items-center gap-x-10 xl:mt-24 xl:gap-x-6 lg:mt-20 lg:gap-y-7 md:mt-10 md:gap-y-6">
    <div className="order-1 col-span-5 ml-10 justify-self-start 2xl:ml-8 lg:order-none lg:col-span-full lg:ml-0 lg:justify-self-stretch">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        Loved by your developers
      </h3>
      <p className="mt-2.5 max-w-[590px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] lg:text-center md:mt-2">
        Developers use Neon&apos;s git-like Branching to bring the database into their workflow,
        making development, testing, deployment less stressful, more automated.
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

export default Workflow;
