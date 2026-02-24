import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BLOG_BASE_PATH, BLOG_CATEGORY_BASE_PATH } from 'constants/blog';
import ArrowLeft from 'icons/arrow-back.inline.svg';

const Hero = ({ title, description, date, category, authors, className = null }) => (
  <div className={className}>
    <div className="flex items-center gap-x-1.5">
      <Link
        className={clsx(
          'flex items-center gap-x-1.5 py-2 text-sm leading-none -tracking-extra-tight text-gray-new-50 sm:text-[10px]'
        )}
        to={BLOG_BASE_PATH}
      >
        <ArrowLeft className="" />
        <span className="sr-only">Back to </span>
        Blog
      </Link>
      <span className="text-sm leading-none text-gray-new-50">/</span>
      <Link
        className="py-2 font-mono text-[13px] font-medium uppercase leading-none -tracking-extra-tight text-blue-70 sm:text-[10px]"
        to={`${BLOG_CATEGORY_BASE_PATH}${category.slug}`}
      >
        {category.name}
      </Link>
    </div>
    <h1 className="post-title mt-4 text-5xl font-medium leading-dense tracking-tighter xl:text-[44px] md:text-4xl sm:text-[32px] xs:text-3xl">
      {title}
    </h1>
    <p className="mt-5 text-xl leading-snug tracking-tight text-gray-new-70 xl:text-xl md:text-lg">
      {description}
    </p>
    <div className="mt-4 flex items-center justify-between border-t border-[#303236] py-4">
      <div className="group flex items-center gap-x-2.5">
        {authors.length === 1 ? (
          <Image
            className="h-8 w-8 shrink-0 rounded-full"
            src={authors[0].author.postAuthor?.image?.mediaItemUrl}
            width={32}
            height={32}
            alt={authors[0].author.title || authors[0].author.postAuthor?.image?.altText}
          />
        ) : (
          authors.map(({ author }, index) => (
            <Image
              className={clsx(
                'h-8 w-8 shrink-0 rounded-full border-2 border-black-pure',
                index > 0 && '-ml-5'
              )}
              key={index}
              src={author.postAuthor?.image?.mediaItemUrl}
              width={32}
              height={32}
              alt={author.title || author.postAuthor?.image?.altText}
            />
          ))
        )}
        <div className="flex items-center gap-x-1.5">
          <span
            className={clsx(
              'post-author',
              'text-[15px] font-medium leading-dense tracking-extra-tight transition-colors duration-200'
            )}
          >
            {authors.length === 1
              ? authors[0].author.title
              : authors.map(({ author }, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    {author.title}
                  </span>
                ))}
          </span>
          {authors.length === 1 && (
            <>
              <span className="">–</span>
              <span className="mt-1 text-[15px] leading-dense tracking-extra-tight text-gray-new-70">
                {authors[0].author.postAuthor?.role}
              </span>
            </>
          )}
        </div>
      </div>
      {/*
      <div className="flex flex-col gap-y-4">
        {authors.map(({ author }, index) => {
          const Tag = author.postAuthor?.url ? Link : 'div';
          const isExternal =
            author.postAuthor?.url?.startsWith('http') ||
            !author.postAuthor?.url?.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL);

          return (
            <Tag
              className="group flex items-center gap-x-2.5"
              to={author.postAuthor?.url}
              key={author.title}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              <Image
                className="h-8 w-8 shrink-0 rounded-full"
                src={author.postAuthor?.image?.mediaItemUrl}
                width={32}
                height={32}
                alt={author.title || author.postAuthor?.image?.altText}
              />
              <div className="flex items-center gap-x-1.5">
                <span
                  className={clsx(
                    index === 0 && 'post-author',
                    'text-[15px] font-semibold leading-dense tracking-extra-tight transition-colors duration-200',
                    { 'group-hover:text-green-45': author.postAuthor?.url }
                  )}
                >
                  {author.title}
                </span>
                <span className="">–</span>
                <span className="mt-1 text-[15px] leading-dense tracking-extra-tight text-gray-new-70">
                  {author.postAuthor?.role}
                </span>
              </div>
            </Tag>
          );
        })}
      </div>
      */}
      <time
        className="text-sm font-medium uppercase leading-none -tracking-extra-tight text-gray-new-60"
        dateTime={date}
      >
        {date}
      </time>
    </div>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        title: PropTypes.string.isRequired,
        postAuthor: PropTypes.shape({
          url: PropTypes.string,
          role: PropTypes.string,
          image: PropTypes.shape({
            mediaItemUrl: PropTypes.string.isRequired,
            altText: PropTypes.string,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default Hero;
