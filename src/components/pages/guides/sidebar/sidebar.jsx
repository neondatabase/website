import InkeepTrigger from 'components/shared/inkeep-trigger';
import { GUIDES_BASE_PATH } from 'constants/guides';
import RSSLogo from 'icons/rss.inline.svg';

const Sidebar = () => (
  <aside className="col-span-3 pb-10 lt:col-span-3 lg:hidden">
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32 flex items-center gap-2.5">
          <InkeepTrigger className="w-full max-w-48" />
          <a
            className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-gray-new-94 text-gray-new-60 transition-colors duration-200 hover:text-secondary-8 dark:bg-gray-new-10 dark:text-gray-new-70 dark:hover:text-primary-1"
            href={`${GUIDES_BASE_PATH}rss.xml`}
            aria-label="Guides RSS Feed"
          >
            <RSSLogo className="size-[18px]" />
          </a>
        </nav>
      </div>
    </div>
  </aside>
);

export default Sidebar;
