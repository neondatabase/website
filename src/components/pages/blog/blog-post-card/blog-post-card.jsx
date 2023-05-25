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

  // get the short version of the author's name, e.g. "John Doe" => "John D."
  const authorName = postAuthor?.title
    ?.split(' ')
    .map((name, index) => (index === 1 ? `${name[0]}.` : name))
    .join(' ');

  const formattedDate = getFormattedDate(date);
  const link = url || `${LINKS.blog}${slug}`;

  return (
    <article
      className={clsx(
        'flex',
        className,
        size === 'xl'
          ? 'flex-row space-x-14 xl:space-x-6 md:flex-col md:space-x-0 md:space-y-4'
          : 'flex-col'
      )}
    >
      {size !== 'xs' && (
        <Link
          className={clsx('w-full max-w-[716px] shrink-0', {
            '2xl:max-w-[600px] xl:max-w-[50%] md:max-w-full': size === 'xl',
          })}
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
              height={403}
              quality="95"
            />
          ) : (
            <Image
              className="w-full rounded-md"
              src="/images/placeholder.jpg"
              alt=""
              width={716}
              height={403}
              aria-hidden
            />
          )}
        </Link>
      )}
      <div className="flex flex-col">
        {category && size !== 'xs' && (
          <Link
            className={clsx(
              'mt-3 text-xs font-semibold uppercase leading-none tracking-[0.02em]',
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
                'text-4xl leading-dense tracking-tighter xl:text-3xl md:text-2xl': size === 'xl',
                'text-3xl leading-dense tracking-tighter lg:text-2xl xs:text-base': size === 'lg',
                'text-lg leading-tight tracking-[-0.02em] lg:text-base':
                  size === 'md' || size === 'sm' || size === 'xs',
                'mt-2': !!category,
                'mt-5': !category && size === 'lg',
                'mt-3': !category && (size === 'md' || size === 'sm'),
              }
            )}
          >
            {title}
          </h1>
          <div
            className={clsx('flex items-center', {
              'mt-3': size === 'lg' || size === 'xl',
              'mt-2': size === 'md' || size === 'sm' || size === 'xs',
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
            <div
              className={clsx('flex items-center', {
                'xl:flex-col xl:items-start md:flex-row md:items-center': size === 'sm',
              })}
            >
              <span className="text-sm leading-none tracking-[-0.02em] text-gray-new-80">
                {size === 'sm' ? (
                  <>
                    <span className="xl:hidden">{authorName}</span>
                    <span className="hidden xl:block">{postAuthor?.title}</span>
                  </>
                ) : (
                  postAuthor?.title
                )}
              </span>

              <span
                className={clsx(
                  'relative block shrink-0 pl-5 text-[13px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-2.5 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30',
                  {
                    'xl:mt-1 xl:pl-0 xl:before:hidden md:mt-0 md:pl-5 md:before:inline-block':
                      size === 'sm',
                  }
                )}
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
  size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs']),
  ...BlogPostCardPropTypes,
};

export default BlogPostCard;
