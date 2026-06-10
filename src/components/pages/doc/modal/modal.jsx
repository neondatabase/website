'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';

import Link from 'components/shared/link';
import useLocalStorage from 'hooks/use-local-storage';
import CloseIcon from 'icons/close-small.inline.svg';
// import SlackIcon from 'icons/docs/modal/slack.inline.svg';
import SupportIcon from 'icons/docs/modal/support.inline.svg';
import ExpandIcon from 'icons/expand-icon.inline.svg';
import PlayIcon from 'icons/play.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const icons = {
  support: SupportIcon,
  // slack: SlackIcon,
};

const MOBILE_MEDIA_QUERY = '(max-width: 47.9375rem)';

const Modal = ({ id, title, description, destination, embedId }) => {
  const [closedModals, setClosedModals] = useLocalStorage('closedModals', []);
  const [isMounted, setIsMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsMinimized(window.matchMedia(MOBILE_MEDIA_QUERY).matches);
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setClosedModals((prevClosedModals) => [...prevClosedModals, id]);
  };

  const isClosed = closedModals.includes(id);
  const Icon = icons[id];
  const isExternalDestination = /^https?:\/\//.test(destination.url);

  const handleLinkClick = (linkTitle) => {
    sendGtagEvent('click_docs_modal_link', {
      modal: id,
      link: linkTitle,
      destination: destination.url,
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isMounted && !isClosed && (
          <m.div
            className={cn(
              'fixed right-4 bottom-4 z-100 flex w-80 border border-gray-new-80 bg-[#F4F9F7] xs:inset-x-3 xs:bottom-3 xs:w-auto',
              isMinimized
                ? 'h-[58px] flex-row items-center px-[18px]'
                : 'min-h-[314px] flex-col p-[18px]',
              'shadow-[0px_4px_10px_0px_rgba(0,0,0,.08),0px_4px_30px_0px_rgba(0,0,0,.06)]',
              'dark:border-[#2B2D30] dark:bg-[#101013]',
              'dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 3 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {isMinimized ? (
              <>
                {embedId ? (
                  <button
                    className="mr-2.5 flex size-[18px] shrink-0 items-center justify-center border border-gray-new-50 text-black-new transition-colors duration-200 hover:border-black-new dark:border-gray-new-70 dark:text-white dark:hover:border-white"
                    type="button"
                    aria-label="Expand"
                    onClick={() => setIsMinimized(false)}
                  >
                    <PlayIcon className="size-2.5 translate-x-px text-current [&_path]:fill-current" />
                  </button>
                ) : (
                  Icon && (
                    <Icon className="mr-2.5 size-[18px] shrink-0 text-secondary-8 dark:text-green-45" />
                  )
                )}
                <button
                  className="min-w-0 grow truncate text-left text-base leading-snug font-medium tracking-extra-tight text-black-new dark:text-white"
                  type="button"
                  onClick={() => setIsMinimized(false)}
                >
                  {title}
                </button>
                <button
                  className="flex size-7 shrink-0 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                  type="button"
                  aria-label="Expand"
                  onClick={() => setIsMinimized(false)}
                >
                  <ExpandIcon width={14} height={14} />
                </button>
                <button
                  className="flex size-7 shrink-0 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <CloseIcon width={14} height={14} />
                </button>
              </>
            ) : (
              <>
                <div className="pr-[70px]">
                  <p className="text-base leading-snug font-medium tracking-extra-tight text-black-new dark:text-white">
                    {title}
                  </p>
                  {description && (
                    <p className="mt-1 text-sm leading-normal tracking-extra-tight text-gray-new-50 dark:text-gray-new-80">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  className="absolute top-[15px] right-[43px] flex size-7 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                  type="button"
                  aria-label="Minimize"
                  onClick={() => setIsMinimized(true)}
                >
                  <span className="h-px w-3.5 bg-current" />
                </button>
                <button
                  className="absolute top-[15px] right-[15px] flex size-7 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <CloseIcon width={14} height={14} />
                </button>
                {embedId ? (
                  <a
                    className="group relative mt-4 block aspect-video overflow-hidden"
                    href={destination.url}
                    aria-label={title}
                    target={isExternalDestination ? '_blank' : undefined}
                    rel={isExternalDestination ? 'noopener noreferrer' : undefined}
                    onClick={() => handleLinkClick('thumbnail')}
                  >
                    <Image
                      className="h-full w-full object-cover"
                      src={`https://i.ytimg.com/vi/${embedId}/mqdefault.jpg`}
                      alt=""
                      width={284}
                      height={160}
                      unoptimized
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-200 group-hover:bg-black/20">
                      <span className="flex size-9 items-center justify-center rounded-full bg-black/60 transition-colors duration-200 group-hover:bg-black/70">
                        <PlayIcon className="h-3.5 w-3.5 translate-x-px text-white" />
                      </span>
                    </span>
                  </a>
                ) : (
                  Icon && <Icon className="mt-[15px] h-5 w-5 text-secondary-8 dark:text-green-45" />
                )}
                <Link
                  className={cn(
                    'mt-4 flex w-fit items-center gap-2 leading-none font-medium tracking-extra-tight',
                    '[&>svg]:text-black-new! [&>svg]:transition-all! dark:[&>svg]:text-white!',
                    'hover:text-black-new! dark:hover:text-white! [&:hover>svg]:text-black-new! dark:[&:hover>svg]:text-white!'
                  )}
                  theme="black"
                  size="sm"
                  to={destination.url}
                  isExternal={isExternalDestination}
                  withArrow
                >
                  {destination.label}
                </Link>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  destination: PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  embedId: PropTypes.string,
};

export default Modal;
