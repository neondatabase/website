import Image from 'next/image';
import { PropTypes } from 'prop-types';

import { cn } from 'utils/cn';

const Authors = ({ authors, isPriority = false, className }) => {
  const isMultipleAuthors = authors.length > 1;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {authors.map(
        ({ name, photo }, index) =>
          photo && (
            <Image
              className={cn(
                'shrink-0 rounded-full',
                index > 0 && '-ml-4',
                isMultipleAuthors && 'outline outline-1 outline-black-pure'
              )}
              src={photo}
              alt={name}
              width={30}
              height={30}
              priority={isPriority}
              key={index}
              style={{ zIndex: index }}
            />
          )
      )}
      <div className="line-clamp-2 space-x-0.5 leading-none">
        {authors.map(({ name }, index) => (
          <span
            className="text-sm leading-tight font-medium tracking-extra-tight text-gray-new-94"
            key={index}
          >
            {name}
            {index !== authors.length - 1 && ','}
          </span>
        ))}
      </div>
    </div>
  );
};

Authors.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      photo: PropTypes.string,
    })
  ).isRequired,
  isPriority: PropTypes.bool,
  className: PropTypes.string,
};

export default Authors;
