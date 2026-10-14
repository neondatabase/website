import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

const AuthorCard = ({ slug, name, position, photo, guideCount }) => (
  <Link
    className="flex h-full items-center gap-4 rounded-sm p-6 transition-colors duration-200 hover:bg-gray-new-98 dark:hover:bg-gray-new-8 lg:p-5 md:rounded-none md:px-0 md:py-5 md:hover:bg-transparent dark:md:hover:bg-transparent"
    to={`${LINKS.guides}/authors/${slug}`}
  >
    {photo && (
      <Image className="block shrink-0 rounded-full" src={photo} alt="" width={56} height={56} />
    )}
    <div className="min-w-0">
      <h2 className="text-xl leading-tight font-medium tracking-tighter">{name}</h2>
      {position && (
        <p className="mt-1.5 truncate text-[15px] leading-tight tracking-extra-tight text-gray-new-50 dark:text-gray-new-60 md:text-sm">
          {position}
        </p>
      )}
      <p className="mt-3 text-[15px] leading-none font-light tracking-extra-tight text-gray-new-50 uppercase dark:text-gray-new-70 md:text-sm">
        {guideCount} {guideCount === 1 ? 'guide' : 'guides'}
      </p>
    </div>
  </Link>
);

AuthorCard.propTypes = {
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
  photo: PropTypes.string,
  guideCount: PropTypes.number.isRequired,
};

export default AuthorCard;
