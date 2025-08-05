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
    <section className={clsx('quote', className)}>
      <figure className="my-10 lg:my-8 md:my-6">
        <blockquote className="max-w-[710px] border-none p-0 text-2xl !font-medium leading-normal tracking-tight text-gray-9 sm:text-[18px] sm:leading-snug">
          &quot;{quote}&quot;
        </blockquote>

        <figcaption className="mt-4 flex items-center gap-3 md:mt-4">
          <div className="relative size-9 overflow-hidden rounded-full sm:size-7">
            <Image
              src={avatar}
              alt={name}
              width={36}
              height={36}
              className="m-0 rounded-full object-cover sm:h-7 sm:w-7"
            />
          </div>
          <div className="flex gap-1.5">
            <p className="text-sm font-medium leading-tight tracking-tight !text-gray-9 sm:text-[13px]">
              {name} <span className="text-[#A1A1AA]">— {role}</span>
            </p>
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
