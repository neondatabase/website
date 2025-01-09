'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useLocalStorage from 'hooks/use-local-storage';

const ToggleButton = ({ src, title, isActive, onClick }) => (
  <Link
    className={clsx(
      'relative min-w-[104px] rounded-sm px-2.5 py-1 md:w-1/2',
      'text-center text-sm leading-none tracking-tight ',
      'transition-colors duration-200',
      isActive
        ? clsx(
            'bg-[#D6D8DB] bg-[radial-gradient(54.19%_83.93%_at_50%_3.57%,#FFF,transparent)] font-medium text-gray-new-20 shadow-[0_2px_5px_0px_rgba(15,24,54,0.20)]',
            'dark:bg-gray-new-15 dark:bg-[radial-gradient(54.19%_83.93%_at_50%_3.57%,rgba(255,255,255,0.2),transparent)] dark:text-white dark:shadow-none'
          )
        : clsx(
            'text-gray-new-30 hover:text-gray-new-20',
            'dark:text-gray-new-80 dark:hover:text-white'
          )
    )}
    to={src}
    onClick={onClick}
  >
    {title}
    {isActive && (
      <GradientBorder className="border-image-header-docs-button-border dark:border-image-header-docs-button-border-dark" />
    )}
  </Link>
);

ToggleButton.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

const ModeToggler = ({ className }) => {
  const [isAiChatPage, setIsAiChatPage] = useState(false);
  const [previousPage, setPreviousPage] = useLocalStorage('previousDocPage', null);

  const pathname = usePathname();

  useEffect(() => {
    setIsAiChatPage(pathname.includes(LINKS.aiChat));
  }, [pathname]);

  return (
    <div
      className={clsx(
        'relative z-10 flex gap-x-0.5 overflow-hidden rounded border border-gray-new-90 p-[3px] dark:border-gray-new-15 md:w-full',
        className
      )}
    >
      {/* Checks if previous page is Docs page and leads user back to it */}
      <ToggleButton
        src={isAiChatPage && previousPage ? previousPage : LINKS.docsHome}
        title={isAiChatPage && previousPage ? 'Back to Docs' : 'Neon Docs'}
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
};

export default ModeToggler;
