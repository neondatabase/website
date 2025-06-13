'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import quoteIcon from 'icons/quote.svg';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './slider.css';

const Quotes = ({ items }) => (
  <div className="relative">
    <Image
      className="absolute left-1/2 top-0 -z-10 -ml-2.5 -mt-7 -translate-x-1/2 lg:h-20 lg:w-auto md:h-[72px]"
      src={quoteIcon}
      width={104}
      height={89}
      alt=""
      priority
    />
    <Swiper
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      wrapperTag="ul"
      slidesPerView="auto"
      spaceBetween={20}
      speed={700}
      pagination={{ clickable: true }}
      breakpoints={{
        1024: {
          centeredSlides: false,
        },
      }}
      loop
      centeredSlides
    >
      {items.map(({ text, author, post }, index) => (
        <SwiperSlide tag="li" key={index}>
          <div className="group relative w-full py-10 md:h-32 md:p-4">
            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <p className="relative text-xl font-medium leading-snug tracking-tight xl:text-lg">
                {text}
              </p>
              <div className="mt-[18px]">
                <span className="font-light">{author}</span>
                <span className="text-gray-new-60">{post}</span>
              </div>
            </div>
            <div
              className={clsx(
                'pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(67deg,rgba(82,156,160,.14)_16%,rgba(82,156,160,.7))]',
                'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                'before:absolute before:inset-px before:rounded-[inherit] before:bg-[radial-gradient(75%_95%_at_84%_0%,rgba(24,62,65,.8),rgba(10,18,18,.9))]'
              )}
              aria-hidden
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

Quotes.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      post: PropTypes.string,
    })
  ).isRequired,
};

export default Quotes;
