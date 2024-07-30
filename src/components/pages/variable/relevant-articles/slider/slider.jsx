'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'components/shared/link';
import ChevronRight from 'icons/chevron-right.inline.svg';

const Button = ({ prev = false, disabled, handleClick }) => (
  <button
    className={clsx(
      'group relative flex size-8 items-center justify-center rounded-full bg-gray-new-20 text-gray-new-60 transition-colors duration-200 hover:bg-gray-new-30 md:size-7',
      disabled && 'pointer-events-none opacity-50'
    )}
    type="button"
    disabled={disabled}
    onClick={handleClick}
  >
    <span className="sr-only">{prev ? 'prev slide' : 'next slide'}</span>
    <ChevronRight
      className={clsx('w-2.5 text-inherit md:w-2', prev ? '-ml-0.5 rotate-180' : 'ml-0.5')}
    />
  </button>
);

Button.propTypes = {
  prev: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

const Slider = ({ articles }) => {
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
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-title text-[36px] font-medium leading-none tracking-extra-tight text-white xl:text-[32px] lg:text-[28px] md:text-2xl">
          Keep reading
        </h2>
        <div
          className={clsx(
            articles.length < 2 ? 'hidden' : articles.length < 4 && 'hidden md:block'
          )}
        >
          <div className="flex gap-3">
            <Button handleClick={handlePrevClick} disabled={isBeginning} prev />
            <Button handleClick={handleNextClick} disabled={isEnd} />
          </div>
        </div>
      </div>

      <Swiper
        className="mt-9 xl:mt-8 lg:mt-[30px] md:mt-5"
        wrapperTag="ul"
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        onSwiper={handleSwiper}
        onActiveIndexChange={handleActiveIndexChange}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={() => setIsEnd(true)}
      >
        {articles
          .sort((a, b) => a.order - b.order)
          .map(({ url, slug, title, image, date }, index) => (
            <SwiperSlide tag="li" key={index}>
              <article className="w-full">
                <Link
                  className="group block w-full overflow-hidden rounded-md"
                  to={slug || url}
                  target={url ? '_blank' : undefined}
                  rel={url ? 'noopener noreferrer' : undefined}
                >
                  <Image
                    className="aspect-[1.9] w-[380px] object-cover transition-transform duration-200 group-hover:scale-105 md:w-full"
                    width={380}
                    height={200}
                    src={image}
                    alt={title}
                  />
                </Link>
                <Link
                  className="group mt-4 block max-w-[360px]"
                  to={slug || url}
                  target={url ? '_blank' : undefined}
                  rel={url ? 'noopener noreferrer' : undefined}
                >
                  <h3
                    className={clsx(
                      'text-lg font-medium leading-tight tracking-extra-tight text-white',
                      'transition-colors duration-200 group-hover:text-green-45'
                    )}
                  >
                    {title}
                  </h3>
                </Link>
                {date && (
                  <p className="mt-2.5 text-[15px] font-light tracking-extra-tight text-gray-new-80">
                    {date}
                  </p>
                )}
              </article>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

Slider.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      slug: PropTypes.string,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Slider;
