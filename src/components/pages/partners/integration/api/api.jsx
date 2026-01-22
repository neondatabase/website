import Link from 'components/shared/link';
import LINKS from 'constants/links';

import CodeTabs from './code-tabs';

const Api = () => (
  <div className="api grid w-full grid-cols-12 items-center gap-x-10 xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="order-1 col-span-5 col-start-2 justify-self-start 2xl:ml-8 lg:order-none lg:col-span-10 lg:col-start-2 lg:ml-0 sm:col-span-full">
      <h3 className="font-title text-4xl font-medium leading-tight tracking-tighter xl:text-[28px] lg:text-[24px] md:text-[22px]">
        Full automation
      </h3>
      <p className="mt-2.5 max-w-[550px] text-lg font-light leading-snug xl:text-base lg:max-w-none md:mt-2">
        Handle all database tasks via our API endpoints for easy management.
      </p>
      <Link
        className="mt-3 flex items-center text-[15px] leading-none tracking-extra-tight md:mt-2"
        to={LINKS.apiReference}
        theme="green"
        withArrow
      >
        Explore API reference
      </Link>
    </div>
    <CodeTabs className="order-2 col-span-5 translate-x-10 lg:col-span-10 lg:col-start-2 lg:translate-x-0 sm:col-span-full" />
  </div>
);

export default Api;
