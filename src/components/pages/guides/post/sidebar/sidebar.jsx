import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import ArrowIcon from './images/arrow.inline.svg';

const Sidebar = () => (
  <aside className="col-span-2 xl:col-span-full xl:pb-6 sm:pb-4">
    <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
      <Link
        className="flex w-fit items-center gap-1 border-b border-transparent leading-tight text-gray-new-40 transition-colors duration-200 hover:border-secondary-8 hover:text-secondary-8 dark:text-gray-new-60 dark:hover:border-green-45 dark:hover:text-green-45"
        to={LINKS.guides}
      >
        <ArrowIcon className="shrink-0" />
        All guides
      </Link>
    </div>
  </aside>
);

export default Sidebar;
