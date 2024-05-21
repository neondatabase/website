import dynamic from 'next/dynamic';

const Search = dynamic(() => import('components/shared/search/search'));

const Sidebar = () => (
  <aside className="col-span-2 pb-10 lt:col-span-3 lg:hidden">
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32">
          <Search
            className="max-w-[192px]"
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
          />
        </nav>
      </div>
    </div>
  </aside>
);

export default Sidebar;
