'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'components/shared/link/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './style.css';

const CaseStudies = ({ items }) => (
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
    {items.map(({ title, description, logo, link }, index) => (
      <SwiperSlide className="!flex !w-[278px] sm:!w-[calc(100vw-40px)]" tag="li" key={index}>
        <Link
          className="group relative h-44 w-full rounded-xl border border-gray-new-10 bg-[#0A0A0C] p-5 text-left shadow-contact xl:h-[134px] xl:p-[18px] md:h-32 md:p-4"
          to={link}
        >
          <div className="relative z-10 flex h-full flex-col justify-between">
            <p className="relative text-xl font-medium leading-snug tracking-tight text-white xl:text-lg">
              {title}{' '}
              <span
                className="font-light text-gray-new-60 lg:block"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </p>
            <Image
              className="relative h-6 w-fit xl:h-5 sm:h-[18px]"
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
            />
          </div>
          <div
            className={clsx(
              'pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(67deg,rgba(82,156,160,.14)_16%,rgba(82,156,160,.7))]',
              'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              'before:absolute before:inset-px before:rounded-[inherit] before:bg-[radial-gradient(75%_95%_at_84%_0%,rgba(24,62,65,.8),rgba(10,18,18,.9))]'
            )}
            aria-hidden
          />
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
);

CaseStudies.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CaseStudies;
