'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { PropTypes } from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useLocalStorage from 'hooks/use-local-storage';

const ToggleButton = ({ src, title, isActive, onClick }) => (
  <Link
    className={clsx(
      'relative flex h-7 min-w-[104px] items-center justify-center rounded-sm px-2 md:w-1/2',
      'text-center text-sm font-medium leading-none tracking-tight transition-colors duration-200',
      isActive
        ? 'bg-gray-new-90 font-medium text-black-new dark:bg-gray-new-20 dark:text-white'
        : 'text-gray-new-50 hover:text-gray-new-20 dark:hover:text-white'
    )}
    to={src}
    onClick={onClick}
  >
    {title}
  </Link>
);

ToggleButton.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

const ModeToggler = ({ className, isAiChatPage }) => {
  const [previousPage, setPreviousPage] = useLocalStorage('previousDocPage', LINKS.docsHome);
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        'relative z-10 flex h-9 items-center gap-1 overflow-hidden rounded border border-gray-new-90 p-[3px] dark:border-gray-new-20 md:w-full',
        className
      )}
    >
      {/* Checks if previous page is Docs page and leads user back to it */}
      <ToggleButton
        src={isAiChatPage ? previousPage : LINKS.docsHome}
        title={isAiChatPage ? 'Back to Docs' : 'Neon Docs'}
        isActive={!isAiChatPage}
      />
      <ToggleButton
        src={LINKS.aiChat}
        title="Ask Neon AI"
        isActive={isAiChatPage}
        onClick={() => setPreviousPage(pathname)}
      />
    </div>
  );
};

ModeToggler.propTypes = {
  className: PropTypes.string,
  isAiChatPage: PropTypes.bool,
};

export default ModeToggler;
