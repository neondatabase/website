import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import dhruvAminAvatar from 'images/authors/dhruv-amin2.jpg';
import lincolnBergesonAvatar from 'images/authors/lincoln-bergeson.jpg';
import martinSkowAvatar from 'images/authors/martin-skow.jpg';

const quotes = {
  'dhruv-amin': {
    name: 'Dhruv Amin',
    avatar: dhruvAminAvatar,
  },
  'lincoln-bergeson': {
    name: 'Lincoln Bergeson',
    avatar: lincolnBergesonAvatar,
  },
  'martin-skow-røed': {
    name: 'Martin Skow Røed',
    avatar: martinSkowAvatar,
  },
};

const QuoteBlock = ({ author, className = '', quote, role }) => {
  const authorData = quotes[author];
  if (!authorData) {
    return null;
  }
  const { avatar, name } = authorData;

  return (
    <section className={clsx('quote border-l-2 border-green-44 pl-6', className)}>
      <figure className="my-10 lg:my-8 md:my-6">
        <blockquote className="max-w-[710px] border-none p-0 font-mono text-xl !font-normal leading-snug tracking-tighter text-black-new dark:text-gray-9 sm:text-[18px] sm:leading-snug">
          &quot;{quote}&quot;
        </blockquote>

        <figcaption className="mt-5 flex items-center gap-3 md:mt-4">
          <div className="relative size-9 overflow-hidden rounded-full sm:size-7">
            <Image
              src={avatar}
              alt={name}
              width={32}
              height={32}
              className="m-0 rounded-full object-cover sm:h-7 sm:w-7"
            />
          </div>
          <div className="flex gap-1.5">
            <div className="text-base font-medium leading-snug tracking-tighter text-black-new dark:text-gray-9 sm:text-[13px]">
              {name}{' '}
              <span className="font-normal text-gray-new-30 dark:text-[#A1A1AA]">— {role}</span>
            </div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
};

QuoteBlock.propTypes = {
  author: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default QuoteBlock;
