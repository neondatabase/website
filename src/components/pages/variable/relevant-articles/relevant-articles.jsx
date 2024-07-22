'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronRight from 'icons/chevron-right.inline.svg';

import architecturalChoices from './images/architectural-choices.jpg';
import autoscalingInAction from './images/autoscaling-in-action.jpg';
import autoscaling from './images/autoscaling.jpg';
import databaseEconomics from './images/database-economics.jpg';
import evolutionOfServerlessPostgres from './images/evolution-of-postgres.jpg';
import neonUtils from './images/neon-utils.jpg';
import oneYearOfAutoscaling from './images/one-year-of-autoscaling.jpg';
import readReplicasDemo from './images/read-replicas-demo.jpg';
import recrowd from './images/recrowd.jpg';
import scaleToZero from './images/scale-to-zero.jpg';
import whiteWidgetsSecret from './images/white-widgets-secret.jpg';

const articles = [
  {
    url: 'https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/',
    title: 'The Evolution of Serverless Postgres',
    image: evolutionOfServerlessPostgres,
    date: 'May 29, 2024',
  },
  {
    slug: '/blog/autoscaling-in-action-postgres-load-testing-with-pgbench',
    title: 'Autoscaling in Action: Postgres Load Testing with pgbench',
    image: autoscalingInAction,
    date: 'February 23, 2024',
  },
  {
    slug: '/blog/1-year-of-autoscaling-postgres-at-neon',
    title: '1 Year of Autoscaling Postgres: How it’s going, and what’s next',
    image: oneYearOfAutoscaling,
    date: 'April 15, 2024',
  },
  {
    url: 'https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20',
    title: 'Database economics: an Amazon RDS reflection',
    image: databaseEconomics,
    date: 'May 31, 2024',
  },
  {
    url: 'https://dev.to/rsiv/auto-scaling-apps-by-default-neon-api-gateway-nitric-34id',
    title: 'Architectural choices that scale',
    image: architecturalChoices,
    date: 'June 6, 2023',
  },
  {
    slug: '/docs/introduction/autoscaling',
    title: 'Autoscaling',
    image: autoscaling,
  },
  {
    slug: '/docs/introduction/neon-utils',
    title: 'The neon_utils extension',
    image: neonUtils,
  },
  {
    url: 'https://github.com/prisma/read-replicas-demo',
    title: 'Read Replicas Demo',
    image: readReplicasDemo,
  },
  {
    slug: '/blog/white-widgets-secret-to-scalable-postgres-neon',
    title: 'White Widget’s secret to scalable Postgres: Neon',
    image: whiteWidgetsSecret,
    date: 'March 21, 2024',
  },
  {
    slug: '/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand',
    title: 'How Recrowd uses Neon autoscaling to meet fluctuating demand',
    image: recrowd,
    date: 'March 01, 2024',
  },
  {
    slug: '/blog/why-you-want-a-database-that-scales-to-zero',
    title: 'Why You Want a Database That Scales to Zero',
    image: scaleToZero,
    date: 'April 05, 2024',
  },
];

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

const RelevantArticles = () => {
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
    <section className="viewed-articles mt-[72px] xl:mt-16 lg:mt-14 md:mt-11">
      <Container size="1220" className="md:px-5">
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
          {articles.map(({ url, slug, title, image, date }, index) => (
            <SwiperSlide tag="li" key={index}>
              <article className="w-full">
                <Link
                  className="group block w-full overflow-hidden rounded-md"
                  to={slug || url}
                  target={url ? '_blank' : undefined}
                  rel={url ? 'noopener noreferrer' : undefined}
                >
                  <Image
                    className="aspect-[1.784] w-[380px] object-cover transition-transform duration-200 group-hover:scale-110 md:w-full"
                    width={380}
                    height={213}
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
      </Container>
    </section>
  );
};

export default RelevantArticles;
