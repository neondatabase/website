import CardItemsList from '../card-items-list';
import fileIcon from '../images/file.svg';
import transactionsIcon from '../images/transactions.svg';
import videoIcon from '../images/video.svg';

import CodeTabs from './code-tabs';

const items = [
  {
    icon: fileIcon,
    title: 'Docs',
    description: 'Learn more about Neon API',
    url: '/docs/reference/api-reference',
  },
  {
    icon: transactionsIcon,
    title: 'API reference',
    description: 'Check Neon API examples',
    url: 'https://api-docs.neon.tech/reference/getting-started-with-neon-api',
  },

  {
    icon: videoIcon,
    title: 'Video',
    description: 'Replit integration via the API',
    url: 'https://www.youtube.com/watch?v=aufotqDSmmE',
  },
];

const Api = () => (
  <div className="api mt-[104px] grid w-full grid-cols-10 items-center gap-x-10 xl:mt-24 xl:gap-x-6 lg:mt-20 lg:gap-y-7 md:mt-14 md:gap-y-6">
    <div className="order-1 col-span-5 justify-self-end lg:order-none lg:col-span-full lg:justify-self-center">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        API
      </h3>
      <p className="mt-2.5 max-w-[550px] text-lg font-light leading-snug xl:text-base lg:mx-auto lg:max-w-[584px] lg:text-center md:mt-2">
        Manage Projects, branches, databases, and more. Easily integrate Neon in your Product and
        offer it to your users.
      </p>
      <CardItemsList className="lg:col-span-full lg:mt-8" items={items} />
    </div>
    <CodeTabs className="col-span-5 lg:col-span-full" />
  </div>
);

export default Api;
