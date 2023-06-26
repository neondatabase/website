import CardItemsList from '../card-items-list';
import appStoreIcon from '../images/app-store.svg';
import bookIcon from '../images/book.svg';
import fileIcon from '../images/file.svg';

const items = [
  {
    icon: fileIcon,
    title: 'Docs',
    description: 'Read more about OAuth integration',
    url: '/',
  },
  {
    icon: appStoreIcon,
    title: 'Example app',
    description: 'Check Neon OAuth examples',
    url: '/',
  },
  {
    icon: bookIcon,
    title: 'Blog post',
    description: 'Read more about Neon OAuth',
    url: '/',
  },
];

const Oauth = () => (
  <div className="oauth grid-gap-x mt-[120px] grid grid-cols-10 items-center">
    <div className="col-span-5">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter">OAuth</h3>
      <p className="mt-5 text-lg font-light leading-snug">
        The Neon API allows you to manage Neon programmatically. With the Neon API, you can create
        and manage all objects in your Neon account.
      </p>
      <CardItemsList items={items} />
    </div>
    <div className="col-span-5 h-[395px] rounded-[10px] bg-gray-new-8" />
  </div>
);

export default Oauth;
