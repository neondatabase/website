import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Actions from 'components/pages/doc/actions';
import ChangelogForm from 'components/shared/changelog-form';
import Link from 'components/shared/link';
import TableOfContents from 'components/shared/table-of-contents';

const Aside = ({
  isTemplate,
  isChangelog,
  enableTableOfContents,
  tableOfContents,
  gitHubPath,
  className,
  author,
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

      {author && (
        <div className="mt-4 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70 lg:rounded-lg lg:bg-gray-new-95 lg:p-5 dark:lg:bg-gray-new-10">
          <p className="mb-5 text-[12px] font-semibold uppercase leading-none -tracking-extra-tight text-gray-new-60 dark:text-gray-new-50 lg:hidden">
            Author
          </p>
          <div className="flex items-start gap-2.5">
            {author.photo && (
              <Image
                className="block rounded-full"
                src={author.photo}
                alt={author.name}
                width={40}
                height={40}
              />
            )}
            <div>
              <span className="post-author block leading-tight">{author.name}</span>
              {author.position && (
                <span className="mt-1 block text-[14px] text-gray-new-50 dark:text-gray-new-60">
                  {author.position}
                </span>
              )}
            </div>
          </div>
          {author.bio && (
            <p className="mt-4 text-[14px] leading-normal text-gray-new-40 dark:text-gray-new-80 lg:text-sm md:mt-3">
              {author.bio}
            </p>
          )}
          {author.link && (
            <Link
              className="mt-2 block w-fit border-b border-secondary-8 text-[14px] leading-tight text-secondary-8 transition-colors duration-200 hover:!border-transparent dark:border-green-45 dark:text-green-45 md:mt-1.5"
              to={author.link.url}
              target="_blank"
            >
              {author.link.title}
            </Link>
          )}
        </div>
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
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }),
};

export default Aside;
