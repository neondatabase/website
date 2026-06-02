'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CloseIcon from 'icons/close-small.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

const TABS = [
  { id: 'npm', label: 'npm', command: 'npx neonctl@latest init' },
  { id: 'brew', label: 'brew', command: 'neonctl init' },
];

const NeonInitModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('npm');
  const { isCopied, handleCopy } = useCopyToClipboard(2000);

  const activeCommand = TABS.find((tab) => tab.id === activeTab)?.command;

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const handleCopyClick = () => {
    handleCopy(activeCommand);
    sendGtagEvent('Action Clicked', {
      text: `Copy neon init command (${activeTab})`,
      tag_name: 'NeonInitModal',
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black-new/30 p-4 dark:bg-black-new/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <m.div
              className="relative w-full max-w-[704px] border border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-new"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="neon-init-modal-title"
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 p-2 text-black-pure hover:text-gray-new-50 dark:text-white dark:hover:text-white/80"
                type="button"
                aria-label="Close"
                onClick={onClose}
              >
                <CloseIcon className="size-3.5" />
              </button>

              {/* Content */}
              <div className="p-6">
                <h2
                  className="text-lg leading-tight font-medium tracking-extra-tight text-black-pure dark:text-white"
                  id="neon-init-modal-title"
                >
                  Get started with Neon + AI
                </h2>
                <p className="mt-2 text-sm leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-70">
                  Connect your app to Neon with a single command
                </p>

                {/* Tabs and code block */}
                <div className="mt-6 overflow-hidden border border-gray-new-80 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-new-80 dark:border-gray-new-20">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        className={cn(
                          'mx-4 border-b-2 border-transparent py-2.5 text-sm leading-none font-medium tracking-extra-tight',
                          activeTab === tab.id
                            ? 'border-black-pure text-black-pure dark:border-white dark:text-white'
                            : 'text-gray-new-40 hover:text-gray-new-70 dark:text-gray-new-60 dark:hover:text-gray-new-50'
                        )}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Code block */}
                  <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 dark:bg-black-new">
                    <code className="text-sm leading-none tracking-extra-tight text-[#2D8665] dark:text-[#34D59A]">
                      {activeCommand}
                    </code>
                    <button
                      className="shrink-0 border border-gray-new-80 bg-white p-1.5 text-gray-new-40 hover:bg-gray-new-98 dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-60 dark:hover:bg-gray-new-8"
                      type="button"
                      aria-label={isCopied ? 'Copied' : 'Copy command'}
                      onClick={handleCopyClick}
                    >
                      {isCopied ? (
                        <CheckIcon className="size-3.5" />
                      ) : (
                        <CopyIcon className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body
  );
};

NeonInitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NeonInitModal;
