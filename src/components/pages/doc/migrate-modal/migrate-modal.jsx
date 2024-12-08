'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import CloseIcon from 'icons/close-small.inline.svg';

const MigrateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(localStorage.getItem('migrateModalClosed') !== 'true');
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('migrateModalClosed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 z-[100] w-80 rounded-lg border p-5 xs:inset-x-3 xs:bottom-3 xs:w-auto',
        'border-gray-new-90 bg-gray-new-98 bg-[radial-gradient(73%_69%_at_100%_100%,rgba(217,238,242,0.5),rgba(217,238,242,0.1))]',
        'shadow-[0px_4px_10px_0px_rgba(0,0,0,.08),0px_4px_30px_0px_rgba(0,0,0,.06)]',
        'dark:border-[#1D1E20] dark:bg-[#101013] dark:bg-[radial-gradient(89%_63%_at_100%_100%,#1D2930,transparent)]',
        'dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]'
      )}
    >
      <p className="font-medium leading-snug tracking-extra-tight text-black-new dark:text-white">
        Migrating to Neon?
      </p>
      <p className="mt-1 text-sm text-gray-new-50 dark:text-gray-new-80">
        Our team can help minimize downtime.
      </p>
      <Link
        className="mt-6 font-medium"
        to={LINKS.migrationAssistance}
        theme="blue-green"
        size="2xs"
        withArrow
      >
        Get migration assistance
      </Link>
      <button
        className="absolute right-1 top-1 p-2 text-gray-new-40 transition-colors duration-300 hover:text-black hover:dark:text-white"
        type="button"
        aria-label="Close"
        onClick={handleClose}
      >
        <CloseIcon width={14} height={14} />
      </button>
    </div>
  );
};

export default MigrateModal;
