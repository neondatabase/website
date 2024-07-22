'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import Container from 'components/shared/container';
import useLocalStorage from 'hooks/use-local-storage';
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

const ViewedArticles = () => {
  const [viewedPosts] = useLocalStorage('viewedPosts', []);
  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !viewedPosts.length) return null;

  return (
    <section className="viewed-articles mt-[72px] xl:mt-16 lg:mt-14 md:mt-11">
      <Container size="1220" className="md:px-5">
        <div className="flex items-center justify-between">
          <h2 className="font-title text-[36px] font-medium leading-none tracking-extra-tight text-white xl:text-[32px] lg:text-[28px] md:text-2xl">
            Keep reading
          </h2>
          <div
            className={clsx(
              viewedPosts.length < 2 ? 'hidden' : viewedPosts.length < 4 && 'hidden md:block'
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
          {viewedPosts.map((post, index) => (
            <SwiperSlide className="flex flex-col" tag="li" key={index}>
              <BlogPostCard
                {...post}
                size="md"
                imageWidth={380}
                imageHeight={214}
                withAuthorPhoto
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default ViewedArticles;
