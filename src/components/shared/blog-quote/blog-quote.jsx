import Image from 'next/image';
import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const BlogQuote = ({ quote, author, role, photo, className = '' }) => (
  <section className={cn('quote my-8 border-l-2 border-green-44 pl-6', className)}>
    <figure className="my-10 lg:my-8 md:my-6">
      <blockquote className="max-w-[710px] border-none p-0 font-mono text-xl leading-snug font-normal! tracking-tighter text-black-new dark:text-gray-9 sm:text-[18px] sm:leading-snug">
        &quot;{quote}&quot;
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-2.5 md:mt-4">
        {photo && (
          <div className="relative overflow-hidden rounded-full">
            <Image
              className="pointer-events-none m-0 size-8 rounded-full object-cover sm:h-7 sm:w-7"
              src={photo}
              alt={author}
              width={32}
              height={32}
            />
          </div>
        )}
        <div className="text-base leading-snug font-medium tracking-tighter text-black-new dark:text-gray-9 sm:text-[13px]">
          {author}
          {role && (
            <span className="font-normal text-gray-new-70 dark:text-[#A1A1AA]">
              <span className="mx-1.5">—</span>
              <cite className="not-italic">{role}</cite>
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  </section>
);

BlogQuote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string,
  photo: PropTypes.string,
  className: PropTypes.string,
};

export default BlogQuote;
