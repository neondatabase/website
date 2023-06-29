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
  <div className="oauth grid-gap-x mt-[120px] grid grid-cols-10 items-center">
    <div className="order-1 col-span-5">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter">API</h3>
      <p className="mt-5 text-lg font-light leading-snug">
        Manage Projects, branches, databases, and more. Easily integrate Neon in your Product and
        offer it to your users.
      </p>
      <CardItemsList items={items} />
    </div>
    <CodeTabs className="col-span-5" />
  </div>
);

export default Api;
