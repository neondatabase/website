import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

const categoriesColor = {
  company: 'text-green',
  engineering: 'text-yellow',
  uncategorized: 'text-green',
};

const MoreArticles = ({ className = null, posts }) => (
  <section className={clsx('more-articles flex flex-col', className)}>
    <h2 className="right-0 flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-blue">
      <span className="">More from Neon</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>

    <ul className="mt-6 grid grid-cols-3 gap-x-10 xl:gap-x-6 lg:gap-x-4 md:grid-cols-1 md:gap-y-6">
      {posts.map(({ title, slug, date, categories, pageBlogPost: { authors, largeCover } }) => {
        const category = categories.nodes[0];
        const author = authors[0]?.author;
        const formattedDate = new Date(date).toLocaleDateString(
          {},
          { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric' }
        );
        return (
          <li key={slug}>
            <article className="flex flex-col">
              <Link className="flex" to={`${LINKS.blog}${slug}`}>
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
                    src={`data:image/svg+xml;charset=utf-8,%3Csvg width='${380}' height='${196}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`}
                    alt=""
                    width={380}
                    height={196}
                    aria-hidden
                  />
                )}
              </Link>
              <Link
                className={clsx(
                  'mt-4 text-xs font-semibold uppercase leading-none tracking-[0.02em]',
                  categoriesColor[category.slug]
                )}
                to={`${LINKS.blog}${category.slug}`}
              >
                {category.name}
              </Link>
              <Link className="group mt-2" to={`${LINKS.blog}${slug}`}>
                <h1 className="text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-green">
                  {title}
                </h1>
                <div className="mt-2.5 flex items-center">
                  <Image
                    className="rounded-full"
                    src={author.postAuthor?.image?.mediaItemUrl}
                    alt={author?.title}
                    width={28}
                    height={28}
                  />
                  <div className="ml-2 flex items-center lg:flex-col lg:items-start md:flex-row md:items-center">
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
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
    <Link
      className="ml-auto -mt-1 inline-flex items-center text-sm font-medium leading-none tracking-[-0.02em] xl:mt-0"
      theme="blue"
      to={LINKS.blog}
      withArrow
    >
      All News
    </Link>
  </section>
);

MoreArticles.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      categories: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string,
          })
        ),
      }),
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
      }),
    })
  ),
};

export default MoreArticles;
