import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, CATEGORY_COLORS } from 'constants/blog';
import LINKS from 'constants/links';
import getFormattedDate from 'utils/get-formatted-date';

const imageSizes = {
  xl: {
    width: 716,
    height: 403,
  },
  lg: {
    width: 716,
    height: 403,
  },
  md: {
    width: 464,
    height: 260,
  },
  sm: {
    width: 212,
    height: 119,
  },
};

const BlogPostCard = ({
  className,
  title,
  slug,
  date,
  categories,
  pageBlogPost: { url, authors, largeCover, author },
  size = 'lg',
  withAuthorPhoto = false,
  withImageHover = true,
  isPriority = false,
  imageWidth = null,
  imageHeight = null,
  dataTest = null,
}) => {
  const category = categories?.nodes[0];
  const postAuthor = authors?.[0]?.author || author;

  // get the short version of the author's name, e.g. "John Doe" => "John D."
  const authorName = postAuthor?.title
    ?.split(' ')
    .map((name, index) => (index === 1 ? `${name[0]}.` : name))
    .join(' ');

  const formattedDate = getFormattedDate(date);
  const link = url || `${LINKS.blog}/${slug}`;

  return (
    <article
      className={clsx(
        `blog-post-card-${size}`,
        className,
        size === 'xl'
          ? 'grid grid-cols-10 gap-x-10 space-x-3 2xl:gap-x-6 xl:space-x-0 md:flex md:flex-col md:gap-y-4'
          : 'flex flex-col'
      )}
    >
      {size !== 'xs' && (
        <Link
          className={clsx(
            'group w-full max-w-[716px] shrink-0 overflow-hidden rounded-md md:max-w-none',
            {
              'col-span-6 xl:col-span-5 md:max-w-full': size === 'xl',
            }
          )}
          to={link}
          target={url ? '_blank' : undefined}
          rel={url ? 'noopener noreferrer' : undefined}
          data-test={dataTest}
        >
          {largeCover?.mediaItemUrl ? (
            <Image
              className={clsx('w-full rounded-md transition-transform duration-200', {
                'group-hover:scale-110': withImageHover,
              })}
              src={largeCover?.mediaItemUrl}
              alt={largeCover?.altText || title}
              width={imageWidth || imageSizes[size].width}
              height={imageHeight || imageSizes[size].height}
              quality={85}
              priority={isPriority}
              sizes="(max-width: 767px) 100vw"
            />
          ) : (
            <Image
              className={clsx('w-full rounded-md transition-transform duration-200', {
                'group-hover:scale-110': withImageHover,
              })}
              src="/images/placeholder.jpg"
              alt={title}
              width={imageWidth || imageSizes[size].width}
              height={imageHeight || imageSizes[size].height}
              priority={isPriority}
              sizes="(max-width: 767px) 100vw"
              aria-hidden
            />
          )}
        </Link>
      )}
      <div
        className={clsx('flex flex-col', {
          'col-span-4 xl:col-span-5': size === 'xl',
        })}
      >
        {category && size !== 'xs' && (
          <Link
            className={clsx(
              'text-xs font-semibold uppercase leading-none tracking-[0.02em] lg:text-[11px]',
              CATEGORY_COLORS[category?.slug] || 'text-green-45',
              size === 'lg' ? 'mt-[18px] md:mt-4' : 'mt-3'
            )}
            to={`${BLOG_CATEGORY_BASE_PATH}${category?.slug}`}
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
                'line-clamp-2 text-lg leading-tight tracking-[-0.02em] lg:text-base':
                  size === 'md' || size === 'sm' || size === 'xs',
                'mt-2 md:mt-1.5': !!category,
                'mt-5 md:mt-4': !category && size === 'lg',
                'mt-4': !category && size === 'md',
                'mt-3': !category && size === 'sm',
              }
            )}
          >
            {title}
          </h1>
          <div
            className={clsx('flex items-center', {
              'mt-3 md:mt-2.5': size === 'lg' || size === 'xl' || withAuthorPhoto,
              'md:mt-2.5': withAuthorPhoto,
              'mt-2 lg:mt-1.5':
                (size === 'md' || size === 'sm' || size === 'xs') && !withAuthorPhoto,
            })}
          >
            <Image
              className={clsx(
                'rounded-full md:h-6 md:w-6 xs:mr-2 xs:block',
                size === 'lg' || size === 'xl' || withAuthorPhoto ? 'mr-2 block' : 'hidden'
              )}
              src={postAuthor.postAuthor?.image?.mediaItemUrl}
              alt={postAuthor?.title}
              quality={85}
              width={28}
              height={28}
            />

            <div
              className={clsx('flex items-center', {
                'xl:flex-col xl:items-start lt:flex-row lt:items-center lg:flex-col lg:items-start xs:flex-row xs:items-center':
                  size === 'sm',
                'xl:flex-col xl:items-start md:flex-row md:items-center': withAuthorPhoto,
              })}
            >
              <span
                className={clsx(
                  'leading-none tracking-[-0.02em] text-gray-new-80',
                  size === 'lg' ? 'text-[15px] lg:text-sm xs:text-[13px]' : 'text-sm lg:text-[13px]'
                )}
              >
                {size === 'sm' ? (
                  <>
                    <span className="xl:hidden" aria-hidden>
                      {authorName}
                    </span>
                    <span className="hidden xl:block">{postAuthor?.title}</span>
                  </>
                ) : (
                  postAuthor?.title
                )}
              </span>

              <time
                className={clsx(
                  'relative block shrink-0 pl-[11px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-[4px] before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30',
                  size === 'lg'
                    ? 'text-[15px] lg:text-sm xs:text-xs'
                    : 'text-[13px] lg:text-xs lg:leading-none',
                  {
                    'xl:mt-1 xl:pl-0 xl:before:hidden lt:mt-0 lt:pl-[11px] lt:before:inline-block lg:mt-1 lg:pl-0 lg:before:hidden xs:mt-0 xs:pl-[11px] xs:before:inline-block':
                      size === 'sm',
                    'xl:mt-1 xl:pl-0 xl:before:hidden md:mt-0 md:pl-[11px] md:before:inline-block':
                      withAuthorPhoto,
                  }
                )}
                dateTime={date}
              >
                {formattedDate}
              </time>
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
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
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
  dataTest: PropTypes.string,
};

export default BlogPostCard;
