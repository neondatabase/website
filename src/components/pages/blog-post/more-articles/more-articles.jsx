import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

const MoreArticles = ({ className = null, posts }) => (
  <section className={clsx('more-articles', className)}>
    <h2 className="right-0 flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-blue">
      <span className="">More from Neon</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>
    <ul className="mt-6 grid grid-cols-3 gap-x-10 xl:gap-x-6">
      {posts.map(({ title, slug, date, categories, pageBlogPost: { authors } }) => {
        const category = categories.nodes[0];
        const author = authors[0]?.author;
        const formattedDate = new Date(date).toLocaleDateString(
          {},
          { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
        );
        return (
          <li className="flex flex-col" key={slug}>
            <Link className="flex" to={`${LINKS.blog}${slug}`}>
              <span className="h-[196px] w-[380px] rounded-md bg-gray-new-80" />
            </Link>
            <Link
              className="mt-4 text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green"
              to={`${LINKS.blog}${category.slug}`}
            >
              {category.name}
            </Link>
            <Link className="mt-2" to={`${LINKS.blog}${slug}`}>
              <h3 className="text-lg font-medium leading-tight tracking-[-0.02em]">{title}</h3>
              <div className="mt-2.5 flex items-center">
                <div className="flex items-center">
                  <Image
                    className="rounded-full"
                    src={author.postAuthor?.image?.mediaItemUrl}
                    alt={author?.title}
                    width={28}
                    height={28}
                  />
                  <span className="ml-2 text-sm text-gray-new-90">{author?.title}</span>
                </div>
                <span
                  className="relative block pl-5 text-[13px] font-light uppercase leading-none tracking-[-0.02em] text-gray-new-80 before:absolute before:left-2.5 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-30"
                  dateTime={date}
                >
                  {formattedDate}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
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
