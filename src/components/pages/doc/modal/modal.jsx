'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';

import Link from 'components/shared/link';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import useLocalStorage from 'hooks/use-local-storage';
import CloseIcon from 'icons/close-small.inline.svg';
import SupportIcon from 'icons/docs/modal/support.inline.svg';
import RobotIcon from 'icons/docs/sidebar/ai-agent.inline.svg';
// import SlackIcon from 'icons/docs/modal/slack.inline.svg';
import ExpandIcon from 'icons/expand-icon.inline.svg';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import PlayIcon from 'icons/play.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const icons = {
  support: SupportIcon,
  'docs-agent-setup': RobotIcon,
  // slack: SlackIcon,
};

const MOBILE_MEDIA_QUERY = '(max-width: 47.9375rem)';

// "Prompt copied" confirmation shows for 1.4s, then the button reverts.
const COPIED_RESET_MS = 1400;

const Modal = ({ id, title, description, destination, embedId, copyPrompt }) => {
  const [closedModals, setClosedModals] = useLocalStorage('closedModals', []);
  const [isMounted, setIsMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { isCopied, handleCopy } = useCopyToClipboard(COPIED_RESET_MS);

  useEffect(() => {
    // The copyPrompt card is dismiss-only (no minimize), so it never collapses to the
    // minimized toast, even on mobile.
    setIsMinimized(!copyPrompt && window.matchMedia(MOBILE_MEDIA_QUERY).matches);
    setIsMounted(true);
  }, [copyPrompt]);

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

  const handleCopyPrompt = () => {
    if (isCopied) return;
    handleCopy(copyPrompt);
    sendGtagEvent('Action Clicked', { text: 'Agent setup', tag_name: 'DocsAgentSetupPopup' });
  };

  // The whole terminal block is the copy target; mirror native button key handling.
  const handleTerminalKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCopyPrompt();
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isMounted && !isClosed && (
          <m.div
            className={cn(
              'fixed right-4 bottom-4 z-100 flex border border-gray-new-80 bg-[#F4F9F7] xs:inset-x-3 xs:bottom-3 xs:w-auto',
              copyPrompt ? 'w-[380px]' : 'w-80',
              isMinimized
                ? 'h-[58px] flex-row items-center px-[18px]'
                : cn('flex-col', copyPrompt ? 'p-5' : 'p-[18px]', !copyPrompt && 'min-h-[314px]'),
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
                    <Icon
                      className={cn(
                        'mr-2.5 size-[18px] shrink-0',
                        copyPrompt
                          ? 'text-green-44 dark:text-green-45'
                          : 'text-secondary-8 dark:text-green-45'
                      )}
                    />
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
                  {copyPrompt ? (
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <Icon className="size-5 shrink-0 text-green-44 dark:text-green-45" />
                      )}
                      <p className="text-base leading-snug font-medium tracking-extra-tight text-black-new dark:text-white">
                        {title}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-base leading-snug font-medium tracking-extra-tight text-black-new dark:text-white">
                        {title}
                      </p>
                      {description && (
                        <p className="mt-1 text-sm leading-normal tracking-extra-tight text-gray-new-50 dark:text-gray-new-80">
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {!copyPrompt && (
                  <button
                    className="absolute top-[15px] right-[43px] flex size-7 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                    type="button"
                    aria-label="Minimize"
                    onClick={() => setIsMinimized(true)}
                  >
                    <span className="h-px w-3.5 bg-current" />
                  </button>
                )}
                <button
                  className="absolute top-[15px] right-[15px] flex size-7 items-center justify-center text-gray-new-40 transition-colors duration-200 hover:text-black-new dark:hover:text-white"
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <CloseIcon width={14} height={14} />
                </button>
                {copyPrompt ? (
                  <>
                    {/* The whole code field is the copy affordance. It reuses the site's light
                        docs code-block tokens (bg-gray-new-98 fill, gray-new-80 border) so it
                        matches the other code blocks on the page and stays theme-aware.
                        role="button" (not a real <button>) keeps the block-level content valid. */}
                    <div
                      className={cn(
                        'group relative mt-[14px] overflow-hidden border bg-gray-new-98 transition-colors duration-200 dark:bg-gray-new-8',
                        isCopied
                          ? 'cursor-default border-green-44 dark:border-green-45'
                          : 'cursor-pointer border-gray-new-80 hover:border-gray-new-70 dark:border-gray-new-20 dark:hover:border-gray-new-30'
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label="Copy agent setup prompt"
                      onClick={handleCopyPrompt}
                      onKeyDown={handleTerminalKeyDown}
                    >
                      {/* Icon-only copy control, pinned to the top-right corner like a docs
                          code-block copy button. The field content reserves right padding so the
                          prompt's first line never runs under the icon. */}
                      <span
                        className={cn(
                          'absolute top-2 right-2 flex transition-colors duration-200',
                          isCopied
                            ? 'text-green-44 dark:text-green-52'
                            : 'text-gray-new-40 group-hover:text-gray-new-20 dark:text-gray-new-70 dark:group-hover:text-white'
                        )}
                        aria-hidden="true"
                      >
                        {isCopied ? (
                          <CopiedIcon className="size-3.5" />
                        ) : (
                          <CopyIcon className="size-3.5" />
                        )}
                      </span>
                      <div className="py-2.5 pr-9 pl-3">
                        <code className="block font-mono text-xs leading-relaxed tracking-extra-tight [overflow-wrap:anywhere] text-gray-new-30 dark:text-gray-new-90">
                          {copyPrompt}
                        </code>
                      </div>
                    </div>
                    <p className="mt-[14px] text-xs leading-relaxed tracking-extra-tight">
                      <Link
                        className="text-gray-new-50! underline decoration-gray-new-50/40 underline-offset-2 transition-colors hover:text-black-new! hover:decoration-current dark:text-gray-new-70! dark:hover:text-white!"
                        to={destination.url}
                        isExternal={isExternalDestination}
                        onClick={() => handleLinkClick(destination.label)}
                      >
                        {destination.label}
                        &nbsp;→
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
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
                      Icon && (
                        <Icon className="mt-[15px] h-5 w-5 text-secondary-8 dark:text-green-45" />
                      )
                    )}
                    <Link
                      className={cn(
                        'mt-4 flex w-fit items-center gap-2 text-base! leading-none font-medium tracking-extra-tight',
                        '[&>svg]:text-black-new! [&>svg]:transition-all! dark:[&>svg]:text-white!',
                        'hover:text-black-new! dark:hover:text-white! [&:hover>svg]:text-black-new! dark:[&:hover>svg]:text-white!'
                      )}
                      theme="black"
                      size="sm"
                      to={destination.url}
                      isExternal={isExternalDestination}
                      withArrow
                      onClick={() => handleLinkClick(destination.label)}
                    >
                      {destination.label}
                    </Link>
                  </>
                )}
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
  copyPrompt: PropTypes.string,
};

export default Modal;
