import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import SocialShare from '../social-share';

const Aside = ({ className, title, slug, authors, posts }) => (
  <aside className={clsx('aside ml-auto max-w-[252px] lg:ml-0 lg:max-w-full', className)}>
    <h3 className="mb-5 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-blue lg:hidden">
      Posted by
    </h3>
    <div className="flex flex-col space-y-4">
      {authors.map(({ author }) => (
        <div key={author.title}>
          <div className="flex items-center space-x-2.5">
            <Image
              className="h-10 w-10 shrink-0 rounded-full"
              src={author.postAuthor?.image?.mediaItemUrl}
              width={40}
              height={40}
              alt={author.title}
            />
            <div className="flex flex-col">
              <span className="font-semibold leading-none tracking-[0.02em]">{author.title}</span>
              <span className="mt-0.5 text-sm leading-tight tracking-[-0.02em] text-gray-new-70">
                {author.postAuthor?.role}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <h3 className="mt-16 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-blue lg:hidden">
      Related articles
    </h3>
    <ul className="mt-5 flex flex-col space-y-6 lg:hidden">
      {posts.map(({ title, slug, pageBlogPost: { authors, smallCover } }) => (
        <li key={slug}>
          <Link className="group" to={`${LINKS.blog}${slug}`}>
            <article className="flex items-center space-x-3">
              <div className="tracking-[-0.02em]">
                <h1 className="font-medium leading-tight transition-colors duration-200 line-clamp-2 group-hover:text-green">
                  {title}
                </h1>
                <span className="mt-1.5 text-sm leading-none text-gray-new-70">
                  {authors[0]?.author?.title}
                </span>
              </div>
              {smallCover?.mediaItemUrl ? (
                <Image
                  className="h-16 w-16 shrink-0 rounded-md"
                  src={smallCover?.mediaItemUrl}
                  width={64}
                  height={64}
                  alt={smallCover?.altText || title}
                />
              ) : (
                <span className="h-16 w-16 shrink-0 rounded-md bg-gray-new-30" />
              )}
            </article>
          </Link>
        </li>
      ))}
    </ul>
    <SocialShare className="mt-16 lg:hidden" title={title} slug={slug} withTopBorder />
  </aside>
);

Aside.propTypes = {
  className: PropTypes.string,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        title: PropTypes.string.isRequired,
        postAuthor: PropTypes.shape({
          url: PropTypes.string,
          role: PropTypes.string,
          image: PropTypes.shape({
            mediaItemUrl: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      pageBlogPost: PropTypes.shape({
        authors: PropTypes.arrayOf(
          PropTypes.shape({
            author: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }).isRequired,
          })
        ).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Aside;
