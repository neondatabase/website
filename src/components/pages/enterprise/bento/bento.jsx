import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const Bento = ({ cards }) => (
  <section className="bento safe-paddings mt-[199px]">
    <Container className="" size="1152">
      <h2 className="mx-auto text-center font-title text-[48px] font-medium leading-none tracking-extra-tight text-white">
        Add Postgres to your platform or AI Agent
      </h2>
      <ul className="mt-10 grid grid-cols-7 grid-rows-[384px_384px] gap-x-5 gap-y-2.5">
        {/*   grid-cols-[[col1-start]_480px_[col2-start]_316px_[col3-start]_316px_[col3-end]]   */}
        {cards.map(({ title, description, image, className }, index) => (
          <li
            className={clsx(
              className,
              'overflow-hidden rounded-[14px] bg-[rgba(48,50,54,0.31)] p-px'
            )}
            key={index}
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-gray-new-10 p-6">
              <Image
                className={clsx('pointer-events-none absolute inset-0 w-full')} // image.className
                src={image.src}
                width={image.width}
                height={image.height}
                alt={title}
              />
              <p className="relative mt-auto text-lg font-light leading-snug text-gray-new-60">
                <span className="font-medium text-white">{title}</span> {description}
              </p>
            </div>
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
        className: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
};

export default Bento;
