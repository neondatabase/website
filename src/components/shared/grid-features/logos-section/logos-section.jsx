import clsx from 'clsx';
import PropTypes from 'prop-types';

import { LogosWall } from 'components/shared/logos';

const LogosSection = ({ logos, logosTitle = 'Powered by Neon.', containerClassName }) => {
  if (!logos) return null;

  return (
    <div
      className={clsx(
        'mx-auto flex max-w-3xl items-center gap-4 md:flex-col md:gap-6',
        containerClassName
      )}
    >
      <div className="min-w-[144px] text-base font-normal leading-snug tracking-tight text-black-new dark:text-[#C9CBCF] md:max-w-full md:text-center">
        {logosTitle}
      </div>
      <LogosWall logos={logos} size="sm" />
    </div>
  );
};

LogosSection.propTypes = {
  logosTitle: PropTypes.string,
  logos: PropTypes.arrayOf(PropTypes.string),
  containerClassName: PropTypes.string,
};

export default LogosSection;
