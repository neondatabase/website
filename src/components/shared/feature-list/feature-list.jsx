'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import slugify from 'slugify';

import GlowingIcon from './glowing-icon';
import { FEATURES } from './glowing-icon/data';

const FeatureList = ({ className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const updateTitleById = (title) =>
    slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  return (
    <section className="featured-section">
      <ul className={clsx('!mt-8 flex flex-col gap-10 !p-0 sm:!mt-7 sm:gap-9', className)}>
        {FEATURES.map(({ id, icon, title, description }, index) => (
          <li
            id={updateTitleById(title)}
            key={id}
            className="relative !m-0 flex scroll-mt-[100px] gap-3 before:!content-none"
          >
            <GlowingIcon
              icon={icon}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              isLastItem={index === FEATURES.length - 1}
            />
            <div className="flex max-w-[664px] flex-col gap-3 !tracking-tight md:gap-2">
              <h3 className="m-0 text-[22px] font-semibold leading-snug sm:text-[20px]">{title}</h3>
              <p className="m-0 text-lg !text-gray-new-98 sm:text-[16px]">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

FeatureList.propTypes = {
  className: PropTypes.string,
};

export default FeatureList;
