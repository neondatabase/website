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
import PlayIcon from 'icons/play.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const icons = {
  support: SupportIcon,
  // slack: SlackIcon,
};

const Modal = ({ id, title, description, link, embedId }) => {
  const [closedModals, setClosedModals] = useLocalStorage('closedModals', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setClosedModals((prevClosedModals) => [...prevClosedModals, id]);
  };

  const isClosed = closedModals.includes(id);
  const Icon = icons[id];

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isMounted && !isClosed && (
          <m.div
            className={cn(
              'fixed right-4 bottom-4 z-[100] flex w-80 flex-col rounded-lg border p-5 xs:inset-x-3 xs:bottom-3 xs:w-auto',
              embedId ? 'pt-9' : 'pt-[18px]',
              'border-gray-new-90 bg-gray-new-98 bg-[radial-gradient(73%_69%_at_100%_100%,rgba(217,238,242,0.5),rgba(217,238,242,0.1))]',
              'shadow-[0px_4px_10px_0px_rgba(0,0,0,.08),0px_4px_30px_0px_rgba(0,0,0,.06)]',
              'dark:border-[#1D1E20] dark:bg-[#101013] dark:bg-[radial-gradient(89%_63%_at_100%_100%,#1D2930,transparent)]',
              'dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 3 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {embedId ? (
              <a
                className="group relative mb-3 block aspect-video overflow-hidden rounded-md"
                href={link.url}
                aria-label={`Watch: ${title}`}
                onClick={() => {
                  sendGtagEvent('click_docs_modal_link', {
                    modal: id,
                    link: 'thumbnail',
                  });
                }}
              >
                <Image
                  className="h-full w-full object-cover"
                  src={`https://i.ytimg.com/vi/${embedId}/mqdefault.jpg`}
                  alt=""
                  width={320}
                  height={180}
                  unoptimized
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-200 group-hover:bg-black/30">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70">
                    <PlayIcon className="h-5 w-5 pl-0.5 text-white" />
                  </span>
                </span>
              </a>
            ) : (
              Icon && <Icon className="mb-2.5 h-5 w-5 text-secondary-8 dark:text-green-45" />
            )}
            <p className="leading-snug font-medium tracking-extra-tight text-black-new dark:text-white">
              {title}
            </p>
            <p className="mt-1 text-sm tracking-extra-tight text-gray-new-50 dark:text-gray-new-80">
              {description}
            </p>
            <Link
              className="mt-6 font-medium"
              to={link.url}
              theme="blue-green"
              size="2xs"
              withArrow
              onClick={() => {
                sendGtagEvent('click_docs_modal_link', {
                  modal: id,
                  link: link.title,
                });
              }}
            >
              {link.title}
            </Link>
            <button
              className="absolute top-1 right-1 p-2 text-gray-new-40 transition-colors duration-300 hover:text-black hover:dark:text-white"
              type="button"
              aria-label="Close"
              onClick={handleClose}
            >
              <CloseIcon width={14} height={14} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  embedId: PropTypes.string,
};

export default Modal;
