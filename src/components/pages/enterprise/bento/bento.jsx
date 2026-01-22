import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const Bento = ({ cards }) => (
  <section className="bento safe-paddings mt-[202px] xl:mt-[160px] lg:mt-[128px] md:mt-[94px]">
    <Container
      className="xl:max-w-[1024px] xl:px-8 lg:!max-w-[704px] sm:!max-w-[360px]"
      size="1152"
    >
      <h2 className="mx-auto text-center font-title text-[48px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-[36px] md:text-[32px]">
        Add Postgres to your platform or AI Agent
      </h2>
      <ul className="mx-auto mt-10 grid grid-cols-7 grid-rows-[384px_384px] gap-5 xl:mt-11 xl:grid-rows-[318px_318px] lg:mt-9 lg:grid-rows-[318px_318px_318px] sm:grid-cols-1 sm:grid-rows-[repeat(6,minmax(298px,1fr))] sm:gap-y-[18px]">
        {cards.map(({ title, description, image, imageLg, imageMd, className }, index) => (
          <li
            className={clsx(
              className,
              'relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[rgba(48,50,54,0.31)] bg-gray-new-10 p-6 xl:rounded-xl xl:p-5 sm:rounded-[11px] sm:pb-3'
            )}
            key={index}
          >
            <p className="relative z-20 mt-auto text-lg font-light leading-snug tracking-tight text-gray-new-60 lg:text-base">
              <span className="font-medium text-white">{title}</span> {description}
            </p>
            <Image
              className={clsx(
                'absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-auto min-w-full max-w-none',
                {
                  'lg:hidden': imageLg,
                  'sm:hidden': imageMd,
                }
              )}
              src={image}
              width={image.width / 2}
              height={image.height / 2}
              quality={99}
              alt=""
            />
            <Image
              className={clsx('absolute inset-0 z-10 hidden min-h-full min-w-full max-w-none', {
                'lg:block': imageLg,
                'sm:block': imageMd,
              })}
              src={imageLg || imageMd}
              width={imageLg ? imageLg.width / 2 : imageMd.width / 2}
              height={imageLg ? imageLg.height / 2 : imageMd.height / 2}
              quality={99}
              alt=""
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

Bento.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      className: PropTypes.string.isRequired,
      image: PropTypes.object.isRequired,
      imageLg: PropTypes.object,
      imageMd: PropTypes.object.isRequired,
    })
  ).isRequired,
};

export default Bento;
