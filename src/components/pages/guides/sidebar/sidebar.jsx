import dynamic from 'next/dynamic';

import RssButton from 'components/shared/rss-button';
import { GUIDES_BASE_PATH } from 'constants/guides';

const AlgoliaSearch = dynamic(() => import('components/shared/algolia-search'));

const Sidebar = () => (
  <aside className="col-span-3 pb-10 lt:col-span-3 lg:hidden">
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32 flex items-center gap-2.5">
          <AlgoliaSearch
            className="w-[192px] lt:w-full"
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}
          />
          <RssButton basePath={GUIDES_BASE_PATH} title="Guides" />
        </nav>
      </div>
    </div>
  </aside>
);

export default Sidebar;
