import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/arrow-back.inline.svg';

const Breadcrumbs = ({ title }) => (
  <div className="mb-[18px] flex items-start gap-2.5 text-sm leading-none tracking-tight">
    <Link
      className="flex shrink-0 items-center gap-1 text-gray-new-50 transition-colors duration-200 hover:text-white"
      to={`${LINKS.branching}`}
    >
      <ArrowBackIcon />
      Branching
    </Link>
    <span className="shrink-0 text-gray-new-50">/</span>
    <span className="text-green-45">{title}</span>
  </div>
);

Breadcrumbs.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Breadcrumbs;
