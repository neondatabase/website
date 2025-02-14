import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const Bento = ({ cards }) => (
  <section className="bento safe-paddings mt-[202px]">
    <Container className="" size="1152">
      <h2 className="mx-auto text-center font-title text-[48px] font-medium leading-none tracking-extra-tight text-white">
        Add Postgres to your platform or AI Agent
      </h2>
      <ul className="mt-10 grid grid-cols-7 grid-rows-[384px_384px] gap-x-5 gap-y-5">
        {cards.map(({ title, description, image, className }, index) => (
          <li
            className={clsx(
              className,
              'relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[rgba(48,50,54,0.31)] bg-gray-new-10 p-6'
            )}
            key={index}
          >
            <p className="relative z-20 mt-auto text-lg font-light leading-snug tracking-tight text-gray-new-60">
              <span className="font-medium text-white">{title}</span> {description}
            </p>
            <Image
              className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-auto min-w-full"
              src={image.src}
              width={image.width}
              height={image.height}
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
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Bento;
