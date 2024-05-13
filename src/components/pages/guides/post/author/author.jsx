import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const Author = ({ data, className = null }) => (
  <div className={clsx(className)}>
    <p className="mb-5 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-blue-80 lg:hidden">
      Author
    </p>
    <div className="flex items-center gap-2.5">
      {data.photo && (
        <Image
          src={data.photo}
          alt={data.name}
          width={40}
          height={40}
          className="block rounded-full md:h-6 md:w-6"
        />
      )}
      <div>
        <span className="block leading-tight">{data.name}</span>
        {data.position && (
          <span className="mt-1 block leading-none text-gray-new-40 dark:text-gray-new-60">
            {data.position}
          </span>
        )}
      </div>
    </div>
    {data.bio && (
      <p className="mt-4 text-[14px] leading-normal text-gray-new-20 dark:text-gray-new-80 lg:text-sm xs:text-[13px]">
        {data.bio}
      </p>
    )}
    {data.link && (
      <Link
        className="mt-2 block w-fit border-b border-secondary-8 leading-tight text-secondary-8 transition-colors duration-200 hover:!border-transparent dark:border-green-45 dark:text-green-45"
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
