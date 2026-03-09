import clsx from 'clsx';
import PropTypes from 'prop-types';

import ChangelogForm from 'components/shared/changelog-form';
import TableOfContents from 'components/shared/table-of-contents';

import SocialShare from '../social-share';

const Aside = ({ title, slug, tableOfContents }) => (
  <aside className="aside col-span-2 col-end-13 row-start-1 row-end-3 -ml-8 mt-6 max-w-[298px] xl:col-start-9 xl:col-end-13 xl:!-ml-0 lg:hidden">
    <div className="no-scrollbars sticky top-24 -m-1 max-h-[calc(100vh-100px)] overflow-y-auto p-1 pb-5">
      {tableOfContents?.length > 0 && <TableOfContents items={tableOfContents} />}
      <SocialShare
        className={clsx('lg:hidden', tableOfContents?.length > 0 ? 'mt-8' : 'mt-0')}
        title={title}
        slug={slug}
        withTopBorder={tableOfContents?.length > 0}
      />
      <ChangelogForm className="mt-12" isSidebar isBlog />
    </div>
  </aside>
);

Aside.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.object),
};

export default Aside;
