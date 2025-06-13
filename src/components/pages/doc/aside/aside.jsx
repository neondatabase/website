import clsx from 'clsx';
import PropTypes from 'prop-types';

import Actions from 'components/pages/doc/actions';
import ChatOptions from 'components/pages/doc/chat-options';
import ChangelogForm from 'components/shared/changelog-form';
import TableOfContents from 'components/shared/table-of-contents';

const Aside = ({
  isTemplate,
  isDocsIndex,
  isChangelog,
  enableTableOfContents,
  tableOfContents,
  githubPath,
  className,
}) => (
  <div
    className={clsx(
      'relative col-span-2 -ml-12 max-w-64 xl:hidden',
      isTemplate
        ? 'col-start-11 2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px]'
        : 'col-start-10 3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6',
      className
    )}
  >
    <div className="sticky top-[136px] flex max-h-[calc(100vh-136px)] flex-col pb-5">
      {enableTableOfContents && <TableOfContents items={tableOfContents} isTemplate={isTemplate} />}
      {isDocsIndex && <ChatOptions isSidebar />}
      {isChangelog && <ChangelogForm isSidebar />}
      {!isChangelog && !isTemplate && (
        <Actions githubPath={githubPath} withBorder={enableTableOfContents} />
      )}
    </div>
  </div>
);

Aside.propTypes = {
  isTemplate: PropTypes.bool,
  isDocsIndex: PropTypes.bool,
  isChangelog: PropTypes.bool,
  enableTableOfContents: PropTypes.bool,
  tableOfContents: PropTypes.array,
  githubPath: PropTypes.string,
  className: PropTypes.string,
};
export default Aside;
