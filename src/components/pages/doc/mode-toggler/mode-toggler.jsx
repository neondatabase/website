import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const ToggleButton = ({ src, title, isActive }) => (
  <Link
    to={src}
    className={clsx(
      'relative min-w-[90px] rounded-sm px-2.5 py-1 md:w-1/2',
      'text-center text-sm leading-none tracking-tight ',
      'transition-colors duration-200',
      isActive
        ? `bg-[#D6D8DB] bg-[radial-gradient(54.19%_83.93%_at_50%_3.57%,#FFF,transparent)]
          font-medium text-gray-new-20 shadow-[0_2px_5px_0px_rgba(15,24,54,0.20)]
          dark:bg-gray-new-15 dark:bg-[radial-gradient(54.19%_83.93%_at_50%_3.57%,rgba(255,255,255,0.2),transparent)]
          dark:text-white dark:shadow-none`
        : `text-gray-new-30 hover:text-gray-new-20
          dark:text-gray-new-80 dark:hover:text-white`
    )}
  >
    {title}
    {isActive && (
      <GradientBorder className="border-image-header-docs-button-border dark:border-image-header-docs-button-border-dark" />
    )}
  </Link>
);

ToggleButton.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  isActive: PropTypes.bool,
};

const ModeToggler = ({ className, isAiChatPage = false }) => (
  <div
    className={clsx(
      'relative z-10 flex gap-x-0.5 overflow-hidden rounded border border-gray-new-90 p-[3px] dark:border-gray-new-15 md:w-full',
      className
    )}
  >
    <ToggleButton src={LINKS.docsHome} title="Neon Docs" isActive={!isAiChatPage} />
    <ToggleButton src={LINKS.aiChat} title="Neon AI" isActive={isAiChatPage} />
  </div>
);

ModeToggler.propTypes = {
  className: PropTypes.string,
  isAiChatPage: PropTypes.bool,
};

export default ModeToggler;
