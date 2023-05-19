import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

const categoriesColor = {
  company: 'text-green-45',
  engineering: 'text-yellow-70',
  community: 'text-brown-70',
};

const BlogPostCard = ({
  className,
  title,
  date,
  categories,
  pageBlogPost: { authors, largeCover },
  size = 'lg',
}) => {
  const category = categories.nodes[0];
  const author = authors[0]?.author;

  const formattedDate = new Date(date).toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric' }
  );

  return (
    <article className={clsx('flex flex-col', className)}>
      {largeCover?.mediaItemUrl ? (
        <Image
          className="w-full rounded-md"
          src={largeCover?.mediaItemUrl}
          alt={largeCover?.altText || title}
          width={380}
          height={196}
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
      <Link
        className={clsx(
          'mt-[18px] text-xs font-semibold uppercase leading-none tracking-[0.02em]',
          categoriesColor[category?.slug] || 'text-green-45'
        )}
        to={`${LINKS.blog}${category?.slug}`}
      >
        {category?.name}
      </Link>
      <h1
        className={clsx('font-medium transition-colors duration-200 group-hover:text-green-45', {
          'mt-2 text-3xl leading-dense tracking-tighter': size === 'lg',
          'mt-2 text-lg leading-tight tracking-[-0.02em]': size === 'md',
        })}
      >
        {title}
      </h1>
      <div className="mt-2.5 flex items-center">
        {size === 'lg' && (
          <Image
            className="mr-2 rounded-full"
            src={author.postAuthor?.image?.mediaItemUrl}
            alt={author?.title}
            width={28}
            height={28}
          />
        )}
        <div className="flex items-center lg:flex-col lg:items-start md:flex-row md:items-center">
          <span className="text-sm leading-none tracking-[-0.02em] text-gray-new-90">
            {author?.title}
          </span>

          <span
            className="relative block pl-5 text-[13px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-2.5 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30 lg:mt-1 lg:pl-0 lg:before:hidden md:mt-0 md:pl-5 md:before:inline-block"
            dateTime={date}
          >
            {formattedDate}
          </span>
        </div>
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
  size: PropTypes.oneOf(['lg', 'md']),
  ...BlogPostCardPropTypes,
};

export default BlogPostCard;
