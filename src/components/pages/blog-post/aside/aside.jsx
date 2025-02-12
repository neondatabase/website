import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import SocialShare from '../social-share';

const Aside = ({ className, title, slug, authors, posts }) => (
  <aside className={clsx('aside ml-auto max-w-[298px] lg:ml-0 lg:max-w-full', className)}>
    <div className="sticky top-24">
      {Array.isArray(authors) && authors.length > 0 && (
        <>
          <h3 className="mb-5 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-blue-80 lg:hidden">
            Posted by
          </h3>
          <div className="flex flex-col space-y-4">
            {authors.map(({ author }, index) => {
              const Tag = author.postAuthor?.url ? Link : 'div';
              const isExternal =
                author.postAuthor?.url?.startsWith('http') ||
                !author.postAuthor?.url?.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL);
              return (
                <Tag
                  className="group flex items-start space-x-2.5"
                  to={author.postAuthor?.url}
                  key={author.title}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  <Image
                    className="h-10 w-10 shrink-0 rounded-full"
                    src={author.postAuthor?.image?.mediaItemUrl}
                    width={40}
                    height={40}
                    alt={author.title || author.postAuthor?.image?.altText}
                  />
                  <div className="flex flex-col">
                    <span
                      className={clsx(
                        index === 0 && 'post-author',
                        'font-semibold leading-dense tracking-[-0.02em] transition-colors duration-200',
                        { 'group-hover:text-green-45': author.postAuthor?.url }
                      )}
                    >
                      {author.title}
                    </span>
                    <span className="mt-1 text-sm leading-dense tracking-[-0.02em] text-gray-new-70">
                      {author.postAuthor?.role}
                    </span>
                  </div>
                </Tag>
              );
            })}
          </div>
        </>
      )}
      <h3
        className={clsx(
          'text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-blue-80 lg:hidden',
          {
            'mt-16': Array.isArray(authors) && authors.length > 0,
          }
        )}
      >
        More articles
      </h3>
      <ul className="mt-5 flex flex-col space-y-6 lg:hidden">
        {posts.map(({ title, slug, pageBlogPost: { authors, largeCover } }) => (
          <li key={slug}>
            <Link className="group" to={`${LINKS.blog}/${slug}`}>
              <article className="flex items-center space-x-3">
                <div>
                  <h1 className="line-clamp-2 font-title font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-green-45">
                    {title}
                  </h1>
                  <span className="mt-1.5 text-sm leading-none tracking-[-0.02em] text-gray-new-80">
                    {authors[0]?.author?.title}
                  </span>
                </div>
                {largeCover?.mediaItemUrl ? (
                  <Image
                    className="h-[59px] w-[104px] shrink-0 rounded-md"
                    src={largeCover?.mediaItemUrl}
                    width={104}
                    height={59}
                    quality={85}
                    alt={largeCover?.altText || title}
                  />
                ) : (
                  <span className="h-16 w-[104px] shrink-0 rounded-md bg-gray-new-30" />
                )}
              </article>
            </Link>
          </li>
        ))}
      </ul>
      <SocialShare className="mt-16 lg:hidden" title={title} slug={slug} withTopBorder />
    </div>
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
