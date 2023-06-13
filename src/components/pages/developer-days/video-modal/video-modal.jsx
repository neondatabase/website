import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import useClickOutside from 'hooks/use-click-outside';
import CloseIcon from 'icons/close.inline.svg';

import backgroundGradient from './images/bg-gradient-modal.jpg';

const VideoModal = ({ isOpenModal, setIsOpenModal, title, description, videoId }) => {
  const contentRef = useRef();
  const handleClickOutside = () => {
    setIsOpenModal(false);
  };
  useClickOutside([contentRef], handleClickOutside);
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 items-center bg-black px-14 text-white md:px-7 sm:px-4',
        isOpenModal ? 'flex' : 'hidden'
      )}
    >
      <div
        className="relative z-10 mx-auto flex w-full max-w-[1161px] flex-col justify-center"
        ref={contentRef}
      >
        <button
          className="absolute -right-9 top-[84px] md:-top-9 md:right-0"
          type="button"
          onClick={() => setIsOpenModal(false)}
        >
          <CloseIcon className="h-5 w-5 text-white opacity-20" />
        </button>
        <h3 className="text-3xl font-bold leading-tight">{title}</h3>
        <p className="mt-0.5">{description}</p>
        <div className="relative mt-5">
          <div className="absolute -inset-x-16 top-16 h-full sm:top-10">
            <Image
              className="h-full rounded-[200px] opacity-20 blur-[70px]"
              src={backgroundGradient}
              width={1289}
              height={653}
              alt=""
              loading="lazy"
              aria-hidden
            />
          </div>
          <figure className="relative h-0 overflow-hidden pb-[56.25%]">
            <iframe
              className="absolute left-0 top-0 h-full w-full rounded-2xl"
              width="1161"
              height="653"
              src={`https://www.youtube.com/embed/${videoId}${isOpenModal ? '?autoplay=1' : ''}`}
              title="Neon Developer Days"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

VideoModal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
};

export default VideoModal;
