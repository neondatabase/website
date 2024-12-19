import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const ToggleButton = ({ src, title, isActive }) => (
  <Link
    to={src}
    className={clsx(
      'relative min-w-[100px] rounded-sm border px-[11px] py-[5px] text-center leading-none tracking-tight md:w-1/2',
      'transition-colors duration-200',
      isActive
        ? 'border-gray-new-80 bg-[#F1F2F3] font-medium dark:border-0 dark:bg-gray-new-15 dark:bg-[radial-gradient(54.19%_83.93%_at_50%_3.57%,rgba(255,255,255,0.2),transparent)]'
        : 'border-transparent text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
    )}
  >
    {title}
    {isActive && (
      <GradientBorder className="hidden dark:block dark:border-image-header-docs-button-border" />
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
      'flex gap-x-0.5 rounded border border-gray-new-90 p-[3px] dark:border-gray-new-15 md:w-full',
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
