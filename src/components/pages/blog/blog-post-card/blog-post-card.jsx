import he from 'he';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, EXTRA_CATEGORIES } from 'constants/blog';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';
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
      className={cn(
        'blog-post-card flex',
        fullSize ? 'min-w-0 flex-row-reverse gap-5 xl:gap-5 md:flex-col' : 'flex-col gap-5',
        isSmart &&
          'flex-row! gap-x-6 border-t border-gray-new-20 py-8 first-of-type:border-0 first-of-type:pt-0 md:flex-col! md:gap-x-0 md:gap-y-5',
        className
      )}
    >
      {largeCover && (
        <Link
          className={cn(
            'group overflow-hidden bg-[#181818]',
            isSmart ? 'shrink-0' : 'aspect-[40/21] w-full',
            fullSize && 'min-w-0 flex-1 basis-[42%] self-start'
          )}
          to={link}
        >
          <Image
            className={cn(
              'transition-transform duration-200',
              !isSmart && 'size-full',
              fullSize ? 'object-contain' : !isSmart && 'object-cover',
              withImageHover && !fullSize && 'group-hover:scale-110'
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
        className={cn(
          'flex min-w-0 flex-col md:w-full',
          fullSize && largeCover ? '' : 'mr-auto',
          !isFeatured &&
            'max-w-[684px] basis-[58%] pr-20 lt:max-w-none lt:pr-8 lg:pr-0 md:w-full md:basis-auto',
          isSmart &&
            'w-[424px]! shrink-0 flex-col-reverse 2xl:w-auto! 2xl:min-w-0 2xl:shrink 2xl:pr-0! md:w-full! md:gap-y-3'
        )}
      >
        <div
          className={cn(
            'mb-8 flex gap-2 font-mono text-[13px] leading-none tracking-extra-tight',
            isSmart && 'mt-auto mb-0!'
          )}
        >
          {/* category */}
          {cat && (
            <Link
              className={cn('font-medium uppercase', isFeatured ? 'text-green-45' : 'text-blue-70')}
              to={cat.slug}
            >
              {cat.name}
            </Link>
          )}

          {/* date */}
          <time
            className={cn(
              'relative block shrink-0 leading-none tracking-extra-tight text-gray-new-50 uppercase',
              cat &&
                'pl-4 before:absolute before:top-1/3 before:left-[3px] before:inline-block before:size-[3px] before:rounded-full before:bg-gray-new-30'
            )}
            dateTime={date}
          >
            {formattedDate}
          </time>
        </div>
        <Link className={cn('group flex flex-col', isSmart ? 'mt-0' : 'mt-auto')} to={link}>
          {/* title */}
          <h1
            className={cn(
              'tracking-tighter transition-colors duration-200 group-hover:text-gray-new-80',
              isSmart
                ? 'line-clamp-3 text-2xl leading-tight md:text-[20px] sm:text-lg'
                : 'text-[28px] leading-snug font-normal lt:text-2xl md:text-[20px] sm:text-lg'
            )}
          >
            {title}
          </h1>
          {/* excerpt */}
          {excerpt && (
            <div
              className={cn(
                'mt-2 leading-snug font-light tracking-extra-tight text-gray-new-70 lg:text-base md:text-base sm:text-[15px]',
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
