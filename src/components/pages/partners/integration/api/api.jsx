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
    description: 'Check out Neon API examples',
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
  <div className="oauth grid-gap-x mt-40 grid grid-cols-10 items-center xl:mt-[120px] lg:mt-24 lg:gap-y-7 md:mt-14 md:gap-y-6">
    <div className="order-1 col-span-5 lg:order-none lg:col-span-full">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-center lg:text-[28px] md:text-[22px]">
        API
      </h3>
      <p className="mt-5 max-w-[590px] text-lg font-light leading-snug xl:mt-4 xl:text-base lg:mx-auto lg:max-w-[584px] lg:text-center md:mt-2.5">
        Manage Projects, branches, databases, and more. Easily integrate Neon in your Product and
        offer it to your users.
      </p>
      <CardItemsList className="lg:hidden" items={items} />
    </div>
    <CodeTabs className="col-span-5 lg:col-span-full" />
    <CardItemsList className="col-span-full hidden lg:grid" items={items} ariaHidden />
  </div>
);

export default Api;
