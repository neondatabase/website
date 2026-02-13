import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/arrow-back.inline.svg';

const Breadcrumbs = () => (
  <div className="mb-[20px] flex items-start gap-2.5 text-sm font-normal leading-none tracking-extra-tight">
    <Link
      className="flex shrink-0 items-center gap-1 text-gray-new-50 transition-colors duration-200 hover:text-white"
      to={LINKS.branching}
    >
      <ArrowBackIcon />
      Mastering Database Branching Workflows
    </Link>
  </div>
);

export default Breadcrumbs;
