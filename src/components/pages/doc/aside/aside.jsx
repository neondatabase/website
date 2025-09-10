import clsx from 'clsx';
import PropTypes from 'prop-types';

import Actions from 'components/pages/doc/actions';
import ChangelogForm from 'components/shared/changelog-form';
import TableOfContents from 'components/shared/table-of-contents';

const Aside = ({
  isTemplate,
  isChangelog,
  enableTableOfContents,
  tableOfContents,
  gitHubPath,
  className,
}) => (
  <div
    className={clsx(
      'relative col-span-2 -ml-12 w-full max-w-64 xl:hidden',
      isTemplate
        ? 'col-span-2 col-start-11 -ml-12 max-w-64 2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px]'
        : '',
      className
    )}
  >
    <div className="sticky top-[136px] flex max-h-[calc(100vh-136px)] flex-col pb-5">
      {enableTableOfContents && <TableOfContents items={tableOfContents} isTemplate={isTemplate} />}
      {isChangelog && <ChangelogForm isSidebar />}

      {!isChangelog && (
        <Actions
          gitHubPath={gitHubPath}
          isTemplate={isTemplate}
          withBorder={enableTableOfContents}
        />
      )}
    </div>
  </div>
);

Aside.propTypes = {
  isTemplate: PropTypes.bool,
  isChangelog: PropTypes.bool,
  enableTableOfContents: PropTypes.bool,
  tableOfContents: PropTypes.array,
  gitHubPath: PropTypes.string,
  className: PropTypes.string,
};
export default Aside;
