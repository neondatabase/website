import clsx from 'clsx';
import PropTypes from 'prop-types';

import Actions from 'components/pages/doc/actions';
import ChatOptions from 'components/pages/doc/chat-options';
import ChangelogForm from 'components/shared/changelog-form';
import TableOfContents from 'components/shared/table-of-contents';

const Aside = ({
  isUseCase,
  isDocsIndex,
  isChangelog,
  enableTableOfContents,
  tableOfContents,
  gitHubPath,
}) => (
  <div
    className={clsx(
      'relative col-span-2 -ml-12 max-w-64 xl:hidden',
      isUseCase
        ? 'col-start-11 2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px]'
        : 'col-start-10 3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6'
    )}
  >
    <div
      className={clsx(
        'sticky flex flex-col pb-5',
        isUseCase
          ? 'top-[188px] max-h-[calc(100vh-188px)]'
          : 'top-[136px] max-h-[calc(100vh-136px)]'
      )}
    >
      {enableTableOfContents && <TableOfContents items={tableOfContents} isUseCase={isUseCase} />}
      {isDocsIndex && <ChatOptions isSidebar />}
      {isChangelog && <ChangelogForm isSidebar />}
      {!isChangelog && !isUseCase && (
        <Actions gitHubPath={gitHubPath} withBorder={enableTableOfContents} />
      )}
    </div>
  </div>
);

Aside.propTypes = {
  isUseCase: PropTypes.bool,
  isDocsIndex: PropTypes.bool,
  isChangelog: PropTypes.bool,
  enableTableOfContents: PropTypes.bool,
  tableOfContents: PropTypes.array,
  gitHubPath: PropTypes.string,
};
export default Aside;
