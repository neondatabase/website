'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import GradientBorder from 'components/shared/gradient-border';
import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';

import 'swiper/css';

const Button = ({ prev = false, disabled, handleClick }) => (
  <button
    className={clsx(
      'group relative flex size-11 items-center justify-center rounded-full border border-gray-new-15 bg-gray-new-8',
      'transition-colors duration-200 hover:border-gray-new-20 hover:bg-gray-new-10 lg:size-8',
      disabled ? 'pointer-events-none text-gray-new-60 opacity-90' : 'text-gray-new-90'
    )}
    type="button"
    disabled={disabled}
    onClick={handleClick}
  >
    <span className="sr-only">{prev ? 'Previous slide' : 'Next slide'}</span>
    <Chevron className={clsx('w-[11px] text-inherit lg:w-2', prev ? '-ml-1 rotate-180' : 'ml-1')} />
  </button>
);

Button.propTypes = {
  prev: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

const Slider = ({ title, items }) => {
  const [swiper, setSwiper] = useState();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiper = (swiperApi) => {
    setSwiper(swiperApi);
    setIsBeginning(swiperApi.isBeginning);
    setIsEnd(swiperApi.isEnd);
  };

  const handleActiveIndexChange = (swiperApi) => {
    setIsBeginning(swiperApi.isBeginning);
    setIsEnd(swiperApi.isEnd);
  };

  const handlePrevClick = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className="features-slider">
      <div className="relative mb-8 w-full overflow-hidden lg:mb-6 sm:mb-[18px]">
        <h3
          className={clsx(
            'w-fit text-lg uppercase leading-none text-gray-new-50 lg:text-[13px]',
            'after:pointer-events-none after:absolute after:top-1/2 after:ml-5 after:h-px after:w-full after:-translate-y-full after:bg-gray-new-20'
          )}
        >
          {title}
        </h3>
      </div>
      <Swiper
        className="!overflow-visible"
        wrapperTag="ul"
        slidesPerView="auto"
        spaceBetween={12}
        breakpoints={{
          768: {
            spaceBetween: 16,
          },
          1024: {
            spaceBetween: 20,
          },
        }}
        onSwiper={handleSwiper}
        onActiveIndexChange={handleActiveIndexChange}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={() => setIsEnd(true)}
      >
        {items.map(({ title, description, link, icon }) => (
          <SwiperSlide
            tag="li"
            className="!h-[247px] !w-[422px] lg:!h-[229px] lg:!w-80"
            key={title}
          >
            <div
              className={clsx(
                'relative flex size-full flex-col justify-between rounded-lg p-6 lg:p-4',
                link ? 'bg-security-card-link-bg' : 'bg-security-card-bg'
              )}
            >
              <div className="relative flex size-12 items-center justify-center rounded-full bg-security-slide-icon-bg lg:size-10">
                <Image className="lg:size-5" src={icon} alt={title} width={24} height={24} />
                <GradientBorder withBlend />
              </div>
              <div>
                <h4 className="swiper-no-swiping w-fit text-lg font-medium leading-snug tracking-extra-tight lg:pointer-events-none lg:text-[15px]">
                  {title}
                </h4>
                <p className="swiper-no-swiping mt-2.5 text-pretty font-light leading-snug tracking-extra-tight text-gray-new-70 lg:pointer-events-none lg:mt-2 lg:text-sm">
                  {description}
                </p>
                {link && (
                  <Link
                    className="mt-3.5 flex text-[15px] leading-none -tracking-[0.03em] lg:mt-3 lg:text-sm"
                    to={link}
                    theme="green"
                    target="_blank"
                    rel="noopener noreferrer"
                    withArrow
                  >
                    Learn more
                  </Link>
                )}
              </div>
              <GradientBorder className="!rounded-[10px]" withBlend />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={clsx('mt-6 lg:mt-[18px] sm:mt-4', {
          hidden: items.length < 4,
          '2xl:block': items.length === 3,
          'sm:block': items.length === 2,
        })}
      >
        <div className="flex gap-3">
          <Button handleClick={handlePrevClick} disabled={isBeginning} prev />
          <Button handleClick={handleNextClick} disabled={isEnd} />
        </div>
      </div>
    </div>
  );
};

Slider.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      link: PropTypes.string,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Slider;
