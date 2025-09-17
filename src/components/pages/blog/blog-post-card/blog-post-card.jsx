import clsx from 'clsx';
import he from 'he';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, CATEGORY_COLORS, EXTRA_CATEGORIES } from 'constants/blog';
import LINKS from 'constants/links';
import getExcerpt from 'utils/get-excerpt';
import getFormattedDate from 'utils/get-formatted-date';

import Authors from '../authors';

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
  author,
  fullSize = false,
  withImageHover = true,
  imageWidth = null,
  imageHeight = null,
  isPriority = false,
}) => {
  const { largeCover, authors } = pageBlogPost || {};
  const authorsData = authors?.map(({ author: { title, postAuthor } }) => ({
    name: title,
    photo: postAuthor?.image?.mediaItemUrl,
  }));

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
        fullSize ? 'flex-row-reverse items-start gap-6 xl:gap-5 md:flex-col' : 'flex-col gap-4',
        className
      )}
    >
      {largeCover && (
        <Link
          className={clsx(
            'group aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#181818]',
            fullSize && 'col-span-6 xl:col-span-5'
          )}
          to={link}
        >
          <Image
            className={clsx(
              'size-full rounded-lg object-cover transition-transform duration-200',
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
          fullSize && largeCover ? 'w-[408px] shrink-0 md:w-full' : 'w-full'
        )}
      >
        <div
          className={clsx(
            'flex gap-2 text-[13px] leading-none tracking-extra-tight',
            fullSize ? 'mb-4' : 'mb-2'
          )}
        >
          {/* category */}
          {cat && (
            <Link
              className={clsx(
                'font-med<a class="font-medium text-green-45" href="/blog/category/company">Company</a>ium',
                CATEGORY_COLORS[cat.slug] || 'text-green-45'
              )}
              to={cat.slug}
            >
              {cat.name}
            </Link>
          )}

          {/* date */}
          <time
            className={clsx(
              'relative block shrink-0 uppercase leading-none tracking-extra-tight text-gray-new-60',
              cat &&
                'pl-[11px] before:absolute before:left-0 before:top-1/2 before:inline-block before:size-[3px] before:rounded-full before:bg-gray-new-30'
            )}
            dateTime={date}
          >
            {formattedDate}
          </time>
        </div>
        <Link className="group flex flex-col" to={link}>
          {/* title */}
          <h1
            className={clsx(
              'font-medium leading-snug tracking-tighter transition-colors duration-200 group-hover:text-gray-new-80 md:text-lg',
              fullSize ? 'text-2xl lg:text-xl' : 'text-xl'
            )}
          >
            {title}
          </h1>
          {/* excerpt */}
          {fullSize && (
            <div
              className={clsx(
                'mt-2 font-light tracking-extra-tight text-gray-new-90 lg:text-base md:text-[15px]',
                largeCover ? 'line-clamp-2' : 'line-clamp-3'
              )}
            >
              {excerpt}
            </div>
          )}
          {/* authors */}
          {authorsData || author ? (
            <Authors
              className={clsx(fullSize ? 'mt-4' : 'mt-2.5')}
              authors={authorsData || [author]}
            />
          ) : null}
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
  author: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string,
  }),
  fullSize: PropTypes.bool,
  withImageHover: PropTypes.bool,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  isPriority: PropTypes.bool,
};

export default BlogPostCard;
