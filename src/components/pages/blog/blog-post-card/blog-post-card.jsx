import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { CATEGORY_COLORS } from 'constants/blog';
import LINKS from 'constants/links';
import getFormattedDate from 'utils/get-formatted-date';

const BlogPostCard = ({
  className,
  title,
  slug,
  date,
  categories,
  pageBlogPost: { url, authors, largeCover, author },
  size = 'lg',
}) => {
  const category = categories?.nodes[0];
  const postAuthor = authors?.[0]?.author || author;

  const formattedDate = getFormattedDate(date);
  const link = url || `${LINKS.blog}${slug}`;

  return (
    <article
      className={clsx('flex', className, size === 'xl' ? 'flex-row space-x-14' : 'flex-col')}
    >
      {size !== 'sm' && (
        <Link
          className="w-full max-w-[716px] shrink-0"
          to={link}
          target={url ? '_blank' : undefined}
          rel={url ? 'noopener noreferrer' : undefined}
        >
          {largeCover?.mediaItemUrl ? (
            <Image
              className="w-full rounded-md"
              src={largeCover?.mediaItemUrl}
              alt={largeCover?.altText || title}
              width={716}
              height={370}
            />
          ) : (
            <img
              className="w-full rounded-md bg-gray-new-30"
              src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${716}' height='${370}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
              alt=""
              width={716}
              height={370}
              aria-hidden
            />
          )}
        </Link>
      )}
      <div className="flex flex-col">
        {category && size !== 'sm' && (
          <Link
            className={clsx(
              'mt-[18px] text-xs font-semibold uppercase leading-none tracking-[0.02em]',
              CATEGORY_COLORS[category?.slug] || 'text-green-45'
            )}
            to={`${LINKS.blog}${category?.slug}`}
          >
            {category?.name}
          </Link>
        )}
        <Link
          className="group flex flex-col"
          to={link}
          target={url ? '_blank' : undefined}
          rel={url ? 'noopener noreferrer' : undefined}
        >
          <h1
            className={clsx(
              'font-medium transition-colors duration-200 group-hover:text-green-45',
              {
                'text-4xl leading-dense tracking-tighter': size === 'xl',
                'text-3xl leading-dense tracking-tighter': size === 'lg',
                'text-lg leading-tight tracking-[-0.02em]': size === 'md' || size === 'sm',
                'mt-2': !!category,
                'mt-5': !category && (size === 'lg' || size === 'xl'),
                'mt-3': !category && size === 'md',
              }
            )}
          >
            {title}
          </h1>
          <div
            className={clsx('flex items-center', {
              'mt-3': size === 'lg' || size === 'xl',
              'mt-1': size === 'md' || size === 'sm',
            })}
          >
            {(size === 'lg' || size === 'xl') && (
              <Image
                className="mr-2 rounded-full"
                src={postAuthor.postAuthor?.image?.mediaItemUrl}
                alt={postAuthor?.title}
                width={28}
                height={28}
              />
            )}
            <div className="flex items-center lg:flex-col lg:items-start md:flex-row md:items-center">
              <span className="truncate text-sm leading-tight tracking-[-0.02em] text-gray-new-90">
                {postAuthor?.title}
              </span>

              <span
                className="relative block shrink-0 pl-5 text-[13px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-2.5 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30 lg:mt-1 lg:pl-0 lg:before:hidden md:mt-0 md:pl-5 md:before:inline-block"
                dateTime={date}
              >
                {formattedDate}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};

export const BlogPostCardPropTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  categories: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        slug: PropTypes.string,
      })
    ),
  }),
  pageBlogPost: PropTypes.shape({
    largeCover: PropTypes.shape({
      mediaItemUrl: PropTypes.string,
      altText: PropTypes.string,
    }),
    authors: PropTypes.arrayOf(
      PropTypes.shape({
        author: PropTypes.shape({
          title: PropTypes.string,
          postAuthor: PropTypes.shape({
            image: PropTypes.shape({
              mediaItemUrl: PropTypes.string,
            }),
          }),
        }),
      })
    ),
  }),
};

BlogPostCard.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm']),
  ...BlogPostCardPropTypes,
};

export default BlogPostCard;
