import CardItemsList from '../card-items-list';
import fileIcon from '../images/file.svg';
import transactionsIcon from '../images/transactions.svg';
import videoIcon from '../images/video.svg';

import CodeTabs from './code-tabs';

const items = [
  {
    icon: fileIcon,
    title: 'Docs',
    description: 'Read more about Neon API',
    url: '/',
  },
  {
    icon: transactionsIcon,
    title: 'API reference',
    description: 'Check Neon API examples',
    url: '/',
  },
  {
    icon: videoIcon,
    title: 'Video',
    description: 'Replit integration via the API',
    url: '/',
  },
];

const Api = () => (
  <div className="oauth grid-gap-x mt-[120px] grid grid-cols-10 items-center">
    <div className="order-1 col-span-5">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter">API</h3>
      <p className="mt-5 text-lg font-light leading-snug">
        The Neon API allows you to manage Neon programmatically. With the Neon API, you can create
        and manage all objects in your Neon account.
      </p>
      <CardItemsList items={items} />
    </div>
    <CodeTabs className="col-span-5" />
  </div>
);

export default Api;
