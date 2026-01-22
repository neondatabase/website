'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Autoplay, EffectFade, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './slider.css';

const StepsSlider = ({ items }) => {
  const mainSwiperRef = useRef(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const progressBarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const [swiperContainerRef, isInView] = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isInView && !autoplayEnabled) {
      mainSwiperRef.current?.autoplay?.start();
      setAutoplayEnabled(true);
    }
  }, [isInView, autoplayEnabled]);

  const pagination = {
    clickable: true,
    renderBullet(index, className) {
      return `<div class="${className}">
        <span class="bullet-number">${index + 1}</span>
      </div>`;
    },
  };

  const calculateProgress = (swiper, progress = 0) => {
    const totalSlides = items.length;
    if (isMobile) {
      const start = (swiper.activeIndex / (totalSlides - 1)) * 100;
      const end = ((swiper.activeIndex + 1) / (totalSlides - 1)) * 100;
      return start + (end - start) * (1 - progress);
    }
    const currentSlide = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    const slideProgress = 1 - progress;
    return Math.min(((currentSlide + slideProgress) / totalSlides) * 100, 100);
  };

  const handleAutoplayTimeLeft = (swiper, time, progress) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${calculateProgress(swiper, progress)}%`;
    }
  };

  const handleSlideChange = (swiper) => {
    if (thumbsSwiper && !thumbsSwiper.destroyed) {
      thumbsSwiper.slideTo(swiper.activeIndex);
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${calculateProgress(swiper)}%`;
    }
  };

  return (
    <>
      <div ref={swiperContainerRef} className="relative mt-12 lg:mt-10 md:mt-8">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="steps-swiper"
          effect="fade"
          modules={[Autoplay, EffectFade, Pagination, Thumbs]}
          pagination={pagination}
          slidesPerView={1}
          spaceBetween={0}
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : false}
          wrapperTag="ul"
          loop={!isMobile}
          touchReleaseOnEdges
          onAutoplayTimeLeft={handleAutoplayTimeLeft}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiper.autoplay?.stop();
            mainSwiperRef.current = swiper;
            if (progressBarRef.current) {
              progressBarRef.current.style.width = '0%';
            }
          }}
        >
          {items.map(({ image }, index) => (
            <SwiperSlide tag="li" key={index} className="overflow-hidden rounded-xl bg-black-fog">
              <Image
                className="relative"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                placeholder="blur"
              />
              <GradientBorder withBlend />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-16 h-8 lg:mx-0">
          <div className="absolute inset-x-0 top-1/2 -z-30 h-px w-full bg-migration-steps-slider-progress-bg" />
          <div className="absolute inset-x-0 top-1/2 -z-10 h-px overflow-hidden px-12 [mask-image:linear-gradient(to_right,#494B50_0%,#494B50_72%,transparent_100%)] lg:px-12 md:mx-6 md:px-0 md:[mask-image:none]">
            <div
              ref={progressBarRef}
              className="absolute top-0 h-px w-0 bg-gray-new-30 transition-all duration-300 ease-linear"
            />
          </div>
        </div>
      </div>

      <Swiper
        className="captions-swiper relative mb-12 mt-6 lg:mt-4"
        key={isMobile ? 'mobile' : 'desktop'}
        effect={isMobile ? 'fade' : 'slide'} // effect won't work using breakpoints
        slidesPerView={isMobile ? 1 : 3}
        spaceBetween={0}
        modules={[EffectFade, Thumbs]}
        wrapperTag="ul"
        watchSlidesProgress={false}
        breakpoints={{
          360: {
            spaceBetween: 8,
          },
          768: {
            spaceBetween: 0,
          },
        }}
        watchOverflow
        onSwiper={setThumbsSwiper}
        onSlideChange={(swiper) => {
          if (
            swiper === thumbsSwiper &&
            mainSwiperRef.current &&
            !mainSwiperRef.current.destroyed
          ) {
            mainSwiperRef.current.slideTo(swiper.activeIndex);
          }
        }}
        onBeforeDestroy={(swiper) => {
          if (swiper === thumbsSwiper) {
            setThumbsSwiper(null);
          }
        }}
      >
        {items.map(({ title, description, link }, index) => (
          <SwiperSlide tag="li" key={index} className="bg-black-pure">
            <div className="caption-content mx-8 flex flex-col items-start gap-2.5 text-left lg:mr-0 lg:gap-2 md:mx-auto md:max-w-md md:items-center md:text-center">
              <h3 className="swiper-no-swiping text-xl font-medium leading-dense tracking-tighter text-white lg:text-lg">
                {title}
              </h3>
              <p
                className="text-16 font-regular swiper-no-swiping text-pretty leading-normal tracking-extra-tight text-gray-new-60 md:mx-2.5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {link && (
                <Link
                  className="swiper-no-swiping text-sm leading-none tracking-[-0.03em]"
                  to={link.url}
                  theme="white"
                  withArrow
                >
                  {link.text}
                </Link>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

StepsSlider.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
      link: PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
};

export default StepsSlider;
