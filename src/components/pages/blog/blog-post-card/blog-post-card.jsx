import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, CATEGORY_COLORS } from 'constants/blog';
import LINKS from 'constants/links';
import getFormattedDate from 'utils/get-formatted-date';

const BlogPostCard = ({
  className,
  fullSize = false,
  title,
  slug,
  date,
  categories,
  pageBlogPost: { url, largeCover, authors, author },
  withAuthorPhoto = false,
  withImageHover = true,
  isPriority = false,
  imageWidth = null,
  imageHeight = null,
}) => {
  const category = categories?.nodes[0];
  const postAuthor = authors?.[0]?.author || author;

  const formattedDate = getFormattedDate(date);
  const link = url || `${LINKS.blog}/${slug}`;

  return (
    <article
      className={clsx(
        'blog-post-card flex',
        fullSize ? 'flex-row-reverse gap-6' : 'flex-col gap-4',
        className
      )}
    >
      <Link
        className={clsx(
          'group w-full overflow-hidden rounded-md',
          fullSize && 'col-span-6 xl:col-span-5'
        )}
        to={link}
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
      >
        <Image
          className={clsx(
            'w-full rounded-md transition-transform duration-200',
            withImageHover && 'group-hover:scale-110'
          )}
          src={largeCover?.mediaItemUrl || '/images/placeholder.jpg'}
          alt={largeCover?.altText || title}
          width={imageWidth}
          height={imageHeight}
          priority={isPriority}
          sizes="(max-width: 767px) 100vw"
          aria-hidden
        />
      </Link>
      <div className={clsx('flex flex-col', fullSize && 'w-[408px] shrink-0 md:w-full')}>
        <div className="flex gap-2 text-[13px] leading-none tracking-extra-tight">
          {category && (
            <Link
              className={clsx('font-medium', CATEGORY_COLORS[category?.slug] || 'text-green-45')}
              to={`${BLOG_CATEGORY_BASE_PATH}${category?.slug}`}
            >
              {category?.name}
            </Link>
          )}

          {/* date */}
          <time
            className={clsx(
              'relative block shrink-0 uppercase leading-none tracking-extra-tight text-gray-new-60',
              category &&
                'pl-[11px] before:absolute before:left-0 before:top-1/2 before:inline-block before:size-[3px] before:rounded-full before:bg-gray-new-30'
            )}
            dateTime={date}
          >
            {formattedDate}
          </time>
        </div>
        <Link
          className="group flex flex-col"
          to={link}
          target={url ? '_blank' : undefined}
          rel={url ? 'noopener noreferrer' : undefined}
        >
          <h1
            className={clsx(
              'line-clamp-2 font-title font-medium leading-dense transition-colors duration-200 group-hover:text-green-45',
              fullSize
                ? 'text-2xl tracking-tighter xl:text-3xl md:text-2xl'
                : 'text-xl tracking-tighter lg:text-2xl xs:text-base',
              category ? 'mt-2 md:mt-1.5' : 'mt-5 md:mt-4'
            )}
          >
            {title}
          </h1>
          <div
            className={clsx(
              'flex items-center',
              (fullSize || withAuthorPhoto) && 'mt-3 md:mt-2.5',
              withAuthorPhoto && 'md:mt-2.5',
              !fullSize && !withAuthorPhoto && 'mt-2 lg:mt-1.5'
            )}
          >
            {/* avatar */}
            <Image
              className={clsx(
                'rounded-full md:h-6 md:w-6 xs:mr-2 xs:block',
                fullSize || withAuthorPhoto ? 'mr-2 block' : 'hidden'
              )}
              src={postAuthor.postAuthor?.image?.mediaItemUrl}
              alt={postAuthor?.title}
              quality={85}
              width={28}
              height={28}
            />

            <div
              className={clsx(
                'flex items-center',
                withAuthorPhoto && 'xl:flex-col xl:items-start md:flex-row md:items-center'
              )}
            >
              {/* author */}
              {postAuthor && (
                <span
                  className={clsx(
                    'leading-none tracking-extra-tight',
                    fullSize ? 'text-gray-new-90' : 'text-gray-new-80',
                    'text-[15px] lg:text-sm xs:text-[13px]',
                    'text-sm leading-none lg:text-[13px]'
                  )}
                >
                  {postAuthor.title}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};

BlogPostCard.propTypes = {
  className: PropTypes.string,
  fullSize: PropTypes.bool,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  categories: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        slug: PropTypes.string,
      })
    ),
  }).isRequired,
  pageBlogPost: PropTypes.shape({
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
    author: PropTypes.shape({
      title: PropTypes.string,
    }),
    url: PropTypes.string.isRequired,
    largeCover: PropTypes.shape({
      mediaItemUrl: PropTypes.string,
      altText: PropTypes.string,
    }),
  }).isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  withAuthorPhoto: PropTypes.bool,
  withImageHover: PropTypes.bool,
  isPriority: PropTypes.bool,
};

export default BlogPostCard;
