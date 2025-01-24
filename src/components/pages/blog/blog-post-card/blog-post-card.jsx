import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { BLOG_CATEGORY_BASE_PATH, CATEGORY_COLORS } from 'constants/blog';
import LINKS from 'constants/links';
import getExcerpt from 'utils/get-excerpt';
import getFormattedDate from 'utils/get-formatted-date';

import Authors from '../authors';

const BlogPostCard = ({
  className,
  type,
  title,
  subtitle,
  excerpt,
  content,
  slug,
  date,
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
  const text = excerpt || subtitle || (content && getExcerpt(content, 160));

  const formattedDate = getFormattedDate(date);

  const link = (() => {
    switch (type) {
      case 'guide':
        return `${LINKS.guides}/${slug}`;
      case 'changelog':
        return `${LINKS.changelog}/${slug}`;
      default:
        return `${LINKS.blog}/${slug}`;
    }
  })();

  const wpCategory = categories?.nodes[0];
  const category = (() => {
    switch (type) {
      case 'guide':
        return { slug: LINKS.guides, name: 'Guides' };
      case 'changelog':
        return { slug: LINKS.changelog, name: 'Changelog' };
      default:
        return {
          slug: `${BLOG_CATEGORY_BASE_PATH}${wpCategory?.slug}`,
          name: wpCategory?.name,
        };
    }
  })();

  return (
    <article
      className={clsx(
        'blog-post-card flex',
        fullSize ? 'flex-row-reverse gap-6' : 'flex-col gap-4',
        className
      )}
    >
      {largeCover && (
        <Link
          className={clsx(
            'group w-full overflow-hidden rounded-md',
            fullSize && 'col-span-6 xl:col-span-5'
          )}
          to={link}
        >
          <Image
            className={clsx(
              'w-full rounded-md transition-transform duration-200',
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
          <Link
            className={clsx('font-medium', CATEGORY_COLORS[category.slug] || 'text-green-45')}
            to={category.slug}
          >
            {category.name}
          </Link>

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
        <Link className="group flex flex-col" to={link}>
          {/* title */}
          <h1
            className={clsx(
              'font-title font-medium leading-snug tracking-tighter transition-colors duration-200 group-hover:text-green-45',
              fullSize ? 'line-clamp-2 text-2xl' : 'line-clamp-3 text-xl'
            )}
          >
            {title}
          </h1>
          {/* excerpt */}
          {fullSize && (
            <div
              className={clsx(
                'mt-2 text-lg tracking-extra-tight text-gray-new-94',
                largeCover ? 'line-clamp-2' : 'line-clamp-3'
              )}
            >
              {text}
            </div>
          )}
          {/* authors */}
          {authorsData && (
            <Authors className={clsx(fullSize ? 'mt-4' : 'mt-2.5')} authors={authorsData} />
          )}
          {author && <Authors className={clsx(fullSize ? 'mt-4' : 'mt-2.5')} authors={[author]} />}
        </Link>
      </div>
    </article>
  );
};

BlogPostCard.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  excerpt: PropTypes.string,
  content: PropTypes.string.isRequired,
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
