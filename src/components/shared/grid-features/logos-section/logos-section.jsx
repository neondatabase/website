import clsx from 'clsx';
import PropTypes from 'prop-types';

import { LogosWall } from 'components/shared/logos';

const LogosSection = ({ logos, logosTitle = 'Powered by Neon.', containerClassName }) => {
  if (!logos) return null;

  return (
    <div
      className={clsx(
        'mx-auto flex max-w-3xl items-center gap-10 md:flex-col md:gap-6',
        containerClassName
      )}
    >
      <p className="w-[206px] text-lg font-medium leading-none tracking-extra-tight text-gray-new-70 lg:text-base md:max-w-full md:text-center">
        {logosTitle}
      </p>
      <LogosWall logos={logos} size="sm" gap="gap-9" />
    </div>
  );
};

LogosSection.propTypes = {
  logosTitle: PropTypes.string,
  logos: PropTypes.arrayOf(PropTypes.string),
  containerClassName: PropTypes.string,
};

export default LogosSection;
