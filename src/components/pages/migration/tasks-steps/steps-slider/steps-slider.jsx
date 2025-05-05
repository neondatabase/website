'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import { EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './slider.css';

const StepsSlider = ({ items, className }) => {
  const pagination = {
    clickable: true,
    renderBullet(index, className) {
      const item = items[index];
      const bulletContent = (
        <div className={className}>
          <div className="step-number-wrapper">
            <span className="step-number">{index + 1}</span>
          </div>
          <div className="step-content flex flex-col items-start gap-2.5 text-left">
            <h3 className="text-xl font-medium leading-dense tracking-tighter text-white">
              {item.title}
            </h3>
            <p
              className="text-16 font-regular leading-normal tracking-extra-tight text-gray-new-60"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            {item.link && (
              <Link
                className="text-sm leading-none tracking-[-0.03em]"
                to={item.link.url}
                theme="white"
                withArrow
              >
                {item.link.text}
              </Link>
            )}
          </div>
        </div>
      );
      return renderToString(bulletContent);
    },
  };

  return (
    <Swiper
      effect="fade"
      modules={[EffectFade, Pagination]}
      wrapperTag="ul"
      pagination={pagination}
      className={className}
      slidesPerView={1}
      spaceBetween={0}
    >
      {items.map(({ image }, index) => (
        <SwiperSlide tag="li" key={index} className="overflow-hidden rounded-xl">
          <Image
            className="relative"
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
          />
          <GradientBorder withBlend />
        </SwiperSlide>
      ))}
    </Swiper>
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
  className: PropTypes.string,
};

export default StepsSlider;
