import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import Link from 'components/shared/link';
import ScrollLoader from 'components/shared/scroll-loader';
import chevronIcon from 'icons/chevron-red.svg';
import generateChangelogPath from 'utils/generate-changelog-path';
import getFormattedDate from 'utils/get-formatted-date';

const ChangelogPost = (post) => {
  const { slug, date, content } = post;
  const changelogPath = generateChangelogPath(slug);
  const dateLabel = getFormattedDate(date);

  return (
    <article className="group flex first:mt-0 lg:flex-col lg:space-y-3">
      <div
        className={clsx(
          'relative w-full pb-24 pt-10',
          'before:absolute before:-left-40 before:right-0 before:top-0 before:h-px before:w-[calc(100%+160px)] before:bg-gray-new-90 dark:before:bg-gray-new-20',
          'group-last:pb-0 dark:before:bg-gray-new-20',
          'md:pb-7 sm:ml-0 sm:max-w-full sm:pb-0 sm:pl-0 sm:before:hidden sm:after:hidden'
        )}
      >
        <Link
          className="absolute -left-40 right-0 top-10 shrink-0 whitespace-nowrap font-mono text-[13px] leading-none text-gray-new-20 transition-colors duration-200 hover:text-black-pure dark:text-gray-new-80 dark:hover:text-white"
          to={changelogPath}
        >
          <div className="flex w-32 items-center gap-1.5 py-3">
            <Image className="h-3.5 w-3 shrink-0" src={chevronIcon} alt="" width={12} height={14} />
            <time dateTime={date}>{dateLabel}</time>
          </div>
        </Link>

        <Content
          className="-mt-7 prose-h3:mt-[18px] prose-h3:text-lg"
          content={content}
          withoutAnchorHeading
          isReleaseNote
        />
      </div>
    </article>
  );
};

const ChangelogList = ({ className, posts }) => (
  <div className={clsx('changelog-list sm:space-y-7', className)}>
    {posts.slice(0, 3).map((item) => (
      <ChangelogPost key={item.slug} {...item} />
    ))}
    {posts.length > 3 && (
      <ScrollLoader className={clsx('sm:space-y-7', className)} itemsCount={3}>
        {posts.slice(3).map((item) => (
          <ChangelogPost key={item.slug} {...item} />
        ))}
      </ScrollLoader>
    )}
  </div>
);

ChangelogList.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChangelogList;
