import dynamic from 'next/dynamic';

import Socials from '../../../shared/socials';

const Search = dynamic(() => import('components/shared/search/search'));

const Sidebar = () => (
  <aside className="col-span-2 pb-10 lt:col-span-full lt:pb-0">
    <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32 lt:flex lt:items-end lt:justify-between lt:pt-8 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
          <Search
            className="z-30 max-w-[206px] 3xl:max-w-[170px] 2xl:max-w-[200px] lt:order-1 lt:w-full lg:hidden"
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}
          />
        </nav>
      </div>
      <div className="sticky bottom-10 lt:hidden">
        <Socials />
      </div>
    </div>
  </aside>
);

export default Sidebar;
