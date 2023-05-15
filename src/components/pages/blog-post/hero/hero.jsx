import clsx from 'clsx';
import PropTypes from 'prop-types';

import BlogPostAuthors from 'components/shared/blog-post-author';

const Hero = ({ title, description, authors, date, readingTime, className = null }) => (
  <>
    <div className={clsx('safe-paddings', className)}>
      <span className="t-base mb-3 hidden items-center leading-none text-gray-2 lg:flex">
        <span>{date}</span>
        <span className="relative ml-3 pl-4 before:absolute before:top-1/2 before:left-0 before:inline-flex before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-5">
          {readingTime} min read
        </span>
      </span>
      <h1 className="t-5xl font-medium leading-dense tracking-tighter">{title}</h1>
    </div>
    <div className={clsx('safe-paddings', className)}>
      <p className="t-2xl mt-6 text-gray-new-70 xl:mt-5 md:!text-lg">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-7 pb-8 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6 lg:hidden">
        <div className="flex items-center space-x-8">
          <BlogPostAuthors authors={authors} isBlogPost />
        </div>
        <span className="t-base flex flex-col items-end space-y-1.5 text-right leading-none text-gray-2">
          <span>{date}</span>
          <span>{readingTime} min read</span>
        </span>
      </div>
    </div>
  </>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        title: PropTypes.string.isRequired,
        postAuthor: PropTypes.shape({
          image: PropTypes.shape({
            mediaItemUrl: PropTypes.string.isRequired,
          }).isRequired,
        }),
      }),
    })
  ).isRequired,
  date: PropTypes.string.isRequired,
  readingTime: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Hero;
