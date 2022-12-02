import clsx from 'clsx';
import { StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import CloseIcon from 'icons/close.inline.svg';

const VideoModal = ({ isOpenModal, setIsOpenModal }) => (
  <div
    className={clsx(
      'fixed inset-0 z-50 items-center bg-black px-14 text-white md:px-7 sm:px-4',
      isOpenModal ? 'flex' : 'hidden'
    )}
  >
    <div className="relative mx-auto flex w-full max-w-[1161px] flex-col justify-center">
      <button
        className="absolute top-[84px] -right-9 md:-top-9 md:right-0"
        type="button"
        onClick={() => setIsOpenModal(false)}
      >
        <CloseIcon className="h-5 w-5 text-white opacity-20" />
      </button>
      <h3 className="text-3xl font-bold leading-tight">Neon is Live!</h3>
      <p className="mt-0.5">Welcome to Neon Developer days from 6-8 December, 2022</p>
      <div className="relative">
        <div className="absolute -inset-x-16 top-16">
          <StaticImage
            className="rounded-[200px] opacity-20 blur-[70px]"
            imgClassName="rounded-[200px]"
            src="./images/bg-gradient-modal.jpg"
            width={1289}
            height={653}
            alt=""
            loading="lazy"
            aria-hidden
          />
        </div>
        <figure className="relative mt-5 h-0 overflow-hidden pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 h-full w-full rounded-2xl"
            width="1161"
            height="653"
            src={`https://www.youtube.com/embed/tu-bgIg-Luo${isOpenModal ? '?autoplay=1' : ''}`}
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

VideoModal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
};

export default VideoModal;
