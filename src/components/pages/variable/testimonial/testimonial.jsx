import clsx from 'clsx';
import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Link from 'components/shared/link';

import BgDecor from '../bg-decor';

const Testimonial = ({ text, author, url }) => (
  <figure
    className={clsx(
      'relative mt-7 w-full rounded-lg bg-[#0D0E10] p-14 pb-8 pr-11',
      'before:absolute before:left-6 before:top-6 before:size-16 before:bg-[url("/images/pages/variable-load/blockquote.svg")] before:bg-contain before:bg-no-repeat',
      'xl:mt-6 lg:mt-5 lg:p-12 lg:pb-7 lg:pr-10 sm:mt-4 sm:p-6 sm:pb-7',
      'lg:before:left-[22px] lg:before:top-[22px] lg:before:size-14 sm:before:hidden'
    )}
  >
    <div className="relative z-10">
      <blockquote className="text-xl leading-snug tracking-tighter lg:text-lg">{text}</blockquote>
      <div className="mt-5 flex items-center justify-between sm:mt-2.5 sm:flex-col sm:items-start sm:gap-4">
        {author && (
          <div className="flex items-center gap-3 sm:gap-2">
            {author.avatar && (
              <Image
                className="size-8 rounded-full grayscale lg:size-7 sm:size-5"
                src={author.avatar}
                width={author.avatar.width / 2}
                height={author.avatar.height / 2}
                alt={author.name}
              />
            )}
            {author.name && (
              <figcaption className="text-lg text-gray-new-60 lg:text-base sm:text-sm">
                {author.name}
                {author.company && (
                  <cite className="font-light not-italic text-gray-new-40">
                    {' '}
                    - {author.company}
                  </cite>
                )}
              </figcaption>
            )}
          </div>
        )}
        {url && (
          <Link
            className="flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em]"
            to={url}
            theme="white"
            withArrow
          >
            Case study
          </Link>
        )}
      </div>
    </div>
    <BgDecor hasBorder />
  </figure>
);

Testimonial.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.shape({
    avatar: PropTypes.object,
    name: PropTypes.string,
    company: PropTypes.string,
  }),
  url: PropTypes.string.isRequired,
};

export default Testimonial;
