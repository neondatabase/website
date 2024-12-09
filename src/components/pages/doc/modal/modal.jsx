'use client';

import clsx from 'clsx';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';

import Link from 'components/shared/link';
import CloseIcon from 'icons/close-small.inline.svg';
import SupportIcon from 'icons/docs/support.inline.svg';

const icons = {
  support: SupportIcon,
};

const Modal = ({ type, title, description, link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalClosedKey = `${type}ModalClosed`;

  useEffect(() => {
    setIsOpen(localStorage.getItem(modalClosedKey) !== 'true');
  }, [modalClosedKey]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(modalClosedKey, 'true');
  };

  const Icon = icons[type];

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 z-[100] flex w-80 flex-col rounded-lg border p-5 pt-[18px] xs:inset-x-3 xs:bottom-3 xs:w-auto',
        'border-gray-new-90 bg-gray-new-98 bg-[radial-gradient(73%_69%_at_100%_100%,rgba(217,238,242,0.5),rgba(217,238,242,0.1))]',
        'shadow-[0px_4px_10px_0px_rgba(0,0,0,.08),0px_4px_30px_0px_rgba(0,0,0,.06)]',
        'dark:border-[#1D1E20] dark:bg-[#101013] dark:bg-[radial-gradient(89%_63%_at_100%_100%,#1D2930,transparent)]',
        'dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]'
      )}
    >
      {Icon && <Icon className="mb-2.5 h-5 w-5 text-secondary-8 dark:text-green-45" />}
      <p className="font-medium leading-snug tracking-extra-tight text-black-new dark:text-white">
        {title}
      </p>
      <p className="mt-1 text-sm tracking-extra-tight text-gray-new-50 dark:text-gray-new-80">
        {description}
      </p>
      <Link className="mt-6 font-medium" to={link.url} theme="blue-green" size="2xs" withArrow>
        {link.title}
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

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Modal;
