import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-right.inline.svg';

const Breadcrumbs = () => (
  <div className="absolute left-8 top-11 lg:hidden">
    <div className="sticky top-28">
      <Link
        className="flex w-fit items-center gap-1 border-b border-transparent leading-tight text-gray-new-40 transition-colors duration-200 hover:border-secondary-8 hover:text-secondary-8 dark:text-gray-new-60 dark:hover:border-green-45 dark:hover:text-green-45"
        to={LINKS.guides}
      >
        <ArrowIcon className="shrink-0 rotate-180" />
        All guides
      </Link>
    </div>
  </div>
);

export default Breadcrumbs;
