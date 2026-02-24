import clsx from 'clsx';
import he from 'he';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, EXTRA_CATEGORIES } from 'constants/blog';
import LINKS from 'constants/links';
import getExcerpt from 'utils/get-excerpt';
import getFormattedDate from 'utils/get-formatted-date';

const BlogPostCard = ({
  className,
  title,
  subtitle,
  excerpt: content,
  slug,
  date,
  category,
  categories,
  pageBlogPost,
  isFeatured = false,
  isSmart = false,
  fullSize = false,
  withImageHover = true,
  imageWidth = null,
  imageHeight = null,
  isPriority = false,
}) => {
  const { largeCover } = pageBlogPost || {};

  const excerpt = subtitle || (content && getExcerpt(he.decode(content), 280));

  const formattedDate = getFormattedDate(date);

  const extraCategory = category && EXTRA_CATEGORIES.find((cat) => cat.slug === category);

  const link = (() => {
    if (extraCategory) return `${extraCategory.basePath}${slug}`;
    return `${LINKS.blog}/${slug}`;
  })();

  const cat = (() => {
    if (extraCategory) {
      return {
        slug: `${BLOG_CATEGORY_BASE_PATH}${extraCategory.slug}`,
        name: extraCategory.name,
      };
    }

    const wpCategory = category || categories?.nodes[0];

    return {
      slug: `${BLOG_CATEGORY_BASE_PATH}${wpCategory?.slug}`,
      name: wpCategory?.name,
    };
  })();

  return (
    <article
      className={clsx(
        'blog-post-card flex',
        fullSize ? 'flex-row-reverse gap-5 xl:gap-5 md:flex-col' : 'flex-col gap-5',
        isSmart &&
          '!flex-row gap-x-6 border-t border-gray-new-20 py-5 first-of-type:border-0 first-of-type:pt-0',
        className
      )}
    >
      {largeCover && (
        <Link
          className={clsx(
            'group aspect-[16/9] w-full overflow-hidden bg-[#181818]',
            fullSize && 'col-span-6 xl:col-span-5'
          )}
          to={link}
        >
          <Image
            className={clsx(
              'size-full object-cover transition-transform duration-200',
              withImageHover && 'group-hover:scale-110'
            )}
            src={largeCover?.mediaItemUrl}
            alt={largeCover?.altText || title}
            width={imageWidth}
            height={imageHeight}
            priority={isPriority}
            sizes="(max-width: 767px) 100vw"
            aria-hidden
          />
        </Link>
      )}
      <div
        className={clsx(
          'flex flex-col',
          fullSize && largeCover ? 'w-[684px] shrink-0 pr-20 md:w-full' : 'w-full',
          isSmart && '!w-[424px] shrink-0 flex-col-reverse'
        )}
      >
        <div
          className={clsx(
            'flex gap-2 font-mono text-[13px] leading-none tracking-extra-tight',
            fullSize ? 'mb-4' : 'mb-8',
            isSmart && '!mb-0 mt-auto'
          )}
        >
          {/* category */}
          {cat && (
            <Link
              className={clsx(
                'font-medium uppercase',
                isFeatured ? 'text-green-45' : 'text-blue-70'
              )}
              to={cat.slug}
            >
              {cat.name}
            </Link>
          )}

          {/* date */}
          <time
            className={clsx(
              'relative block shrink-0 uppercase leading-none tracking-extra-tight text-gray-new-50',
              cat &&
                'pl-4 before:absolute before:left-[3px] before:top-1/3 before:inline-block before:size-[3px] before:rounded-full before:bg-gray-new-30'
            )}
            dateTime={date}
          >
            {formattedDate}
          </time>
        </div>
        <Link className={clsx('group flex flex-col', isSmart ? 'mt-0' : 'mt-auto')} to={link}>
          {/* title */}
          <h1
            className={clsx(
              'tracking-tighter transition-colors duration-200 group-hover:text-gray-new-80',
              isSmart
                ? 'text-2xl leading-tight md:text-lg'
                : 'text-[28px] font-medium leading-snug md:text-lg'
            )}
          >
            {title}
          </h1>
          {/* excerpt */}
          {excerpt && (
            <div
              className={clsx(
                'mt-2 font-light leading-snug tracking-extra-tight text-gray-new-70 lg:text-base md:text-[15px]',
                largeCover ? 'line-clamp-3' : 'line-clamp-2'
              )}
            >
              {excerpt}
            </div>
          )}
        </Link>
      </div>
    </article>
  );
};

BlogPostCard.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  excerpt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.string,
  categories: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        slug: PropTypes.string,
      })
    ),
  }).isRequired,
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
  isFeatured: PropTypes.bool,
  isSmart: PropTypes.bool,
  fullSize: PropTypes.bool,
  withImageHover: PropTypes.bool,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  isPriority: PropTypes.bool,
};

export default BlogPostCard;
