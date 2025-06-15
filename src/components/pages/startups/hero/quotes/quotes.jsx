'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import quoteIcon from 'icons/startups/quote.svg';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './slider.css';

const Quotes = ({ items }) => (
  <div className="relative pt-9 lg:pt-6">
    <Image
      className="absolute -left-2.5 top-0 lg:-left-1.5 lg:w-[51px]"
      src={quoteIcon}
      width={69}
      height={52}
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
      loop
    >
      {items.map(({ text, author, post }, index) => (
        <SwiperSlide tag="li" key={index}>
          <p className="swiper-no-swiping relative text-xl leading-snug tracking-tighter lg:text-lg md:text-base">
            {text}
          </p>
          <div className="swiper-no-swiping mt-[18px] font-light leading-tight tracking-extra-tight lg:mt-3.5 md:mt-3 md:text-sm">
            {author}
            {post && <span className="text-gray-new-50"> — {post}</span>}
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
