import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const Author = ({ data, className = null }) => (
  <div className={clsx(className, 'lg:rounded-lg lg:bg-gray-new-95 lg:p-5 dark:lg:bg-gray-new-10')}>
    <p className="mb-5 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-gray-new-60 dark:text-gray-new-50 lg:hidden">
      Author
    </p>
    <div className="flex items-start gap-2.5">
      {data.photo && (
        <Image
          className="block rounded-full"
          src={data.photo}
          alt={data.name}
          width={40}
          height={40}
        />
      )}
      <div>
        <span className="post-author block leading-tight">{data.name}</span>
        {data.position && (
          <span className="mt-1 block text-[14px] leading-none text-gray-new-50 dark:text-gray-new-60">
            {data.position}
          </span>
        )}
      </div>
    </div>
    {data.bio && (
      <p className="mt-4 text-[14px] leading-normal text-gray-new-40 dark:text-gray-new-80 lg:text-sm md:mt-3">
        {data.bio}
      </p>
    )}
    {data.link && (
      <Link
        className="mt-2 block w-fit border-b border-secondary-8 text-[14px] leading-tight text-secondary-8 transition-colors duration-200 hover:!border-transparent dark:border-green-45 dark:text-green-45 md:mt-1.5"
        to={data.link.url}
        target="_blank"
      >
        {data.link.title}
      </Link>
    )}
  </div>
);

export default Author;

Author.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};
