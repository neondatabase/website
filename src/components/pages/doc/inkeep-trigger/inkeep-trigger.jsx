'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import ExampleIcon from './images/example.inline.svg';
import SparksIcon from './images/sparks.inline.svg';

const InkeepCustomTrigger = dynamic(
  () => import('@inkeep/widgets').then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

const baseSettings = {
  apiKey: process.env.INKEEP_INTEGRATION_API_KEY,
  integrationId: process.env.INKEEP_INTEGRATION_ID,
  organizationId: process.env.INKEEP_ORGANIZATION_ID,
  primaryBrandColor: '#00E599',
  organizationDisplayName: 'Neon',
};

const InkeepTrigger = ({ className, isSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    stylesheetUrls: ['/css/inkeep-chat.css'],
    baseSettings: {
      ...baseSettings,
      colorMode: {
        forcedColorMode: theme,
      },
    },
    modalSettings: {
      defaultView: 'AI_CHAT',
    },
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={clsx(
          'chat-widget group flex w-full text-sm focus:outline-none',
          isSidebar
            ? 'items-center space-x-3'
            : 'flex-col xl:flex-row xl:items-center xl:space-x-1.5',
          className
        )}
        type="button"
        aria-label="Open Neon AI"
        onClick={handleClick}
      >
        {isSidebar ? (
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[linear-gradient(180deg,#EFEFF0_100%,#E4E5E7_100%)] before:absolute before:inset-px before:rounded-[3px] before:bg-[linear-gradient(180deg,#FFF_100%,#FAFAFA_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_31.25%,rgba(255,255,255,0.05)_100%)] dark:before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
            <SparksIcon className="relative z-10 h-3 w-3 text-gray-new-30 dark:text-gray-new-80" />
          </span>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#00CC88] dark:bg-[rgba(0,229,153,0.1)] xl:h-6 xl:w-6 xl:shrink-0 xl:rounded">
            <ExampleIcon className="h-[26px] w-[26px] text-white dark:text-green-45 xl:h-4 xl:w-4" />
          </span>
        )}
        <div
          className={clsx(
            'flex min-h-[22px] w-full items-center justify-between xl:mt-0 lg:w-auto',
            {
              'mt-2.5': !isSidebar,
            }
          )}
        >
          <h3
            className={clsx(
              'leading-none xl:text-sm',
              isSidebar
                ? 'text-sm font-medium transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45'
                : 'font-semibold'
            )}
          >
            <span
              className={clsx({
                'lg:hidden': !isSidebar,
              })}
            >
              Ask Neon AI
            </span>
            <span
              className={clsx('hidden text-gray-new-20 dark:text-gray-new-90 ', {
                'lg:inline': !isSidebar,
              })}
              aria-hidden
            >
              Ask Neon AI instead
            </span>
          </h3>
        </div>
      </button>
      {isOpen && <InkeepCustomTrigger {...inkeepCustomTriggerProps} />}
    </>
  );
};

InkeepTrigger.propTypes = {
  className: PropTypes.string,
  isSidebar: PropTypes.bool,
};

export default InkeepTrigger;
