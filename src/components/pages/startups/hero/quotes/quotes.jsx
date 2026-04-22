'use client';

import PropTypes from 'prop-types';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './slider.css';

const Quotes = ({ items }) => (
  <div className="startups-quotes relative pt-8 lg:pt-6">
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
          <p
            className="swiper-no-swiping relative font-mono text-lg leading-snug tracking-tighter text-gray-new-94 md:text-base [&_mark]:bg-[rgba(40,116,88,1)] [&_mark]:p-px [&_mark]:text-white"
            dangerouslySetInnerHTML={{ __html: `“${text}”` }}
          />
          <div className="swiper-no-swiping mt-5 font-mono text-base leading-snug font-light tracking-extra-tight text-gray-new-90 lg:mt-3.5 md:mt-3 md:text-sm">
            {author}
            {post && <span className="text-gray-new-70"> — {post}</span>}
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
