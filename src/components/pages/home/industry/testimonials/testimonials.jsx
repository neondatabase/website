'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useMemo } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';

import alexKlarfeldImage from 'images/pages/home/industry/alex-klarfeld.jpg';
import edouardBonlieuImage from 'images/pages/home/industry/edouard-bonlieu.jpg';
import himanshuBhandohImage from 'images/pages/home/industry/himanshu-bhandoh.jpg';
import koyebLogo from 'images/pages/home/industry/koyeb.svg';
import leonardHenriquezImage from 'images/pages/home/industry/leonard-henriquez.jpg';
import retoolLogo from 'images/pages/home/industry/retool.svg';
import supergoodLogo from 'images/pages/home/industry/supergood.svg';
import topoLogo from 'images/pages/home/industry/topo.svg';

import Testimonial from './testimonial';

const TESTIMONIALS = [
  {
    quote: `Neon allows us to develop much faster than we’ve even been used to`,
    avatar: alexKlarfeldImage,
    name: 'Alex Klarfeld',
    position: 'CEO and co-founder of Supergood.ai',
    logo: { src: supergoodLogo, width: 124, height: 32, alt: 'Supergood.ai' },
  },
  {
    quote: `Neon's serverless philosophy is aligned with our vision: no infrastructure to manage, no servers to provision, no database cluster to maintain`,
    avatar: edouardBonlieuImage,
    name: 'Edouard Bonlieu',
    position: 'co-founder at Koyeb',
    logo: { src: koyebLogo, width: 123, height: 32, alt: 'Koyeb' },
  },
  {
    quote: `The killer feature that convinced us to use Neon was branching: it keeps our engineering velocity high`,
    avatar: leonardHenriquezImage,
    name: 'Léonard Henriquez',
    position: 'co-founder and CTO, Topo.io',
    logo: { src: topoLogo, width: 109, height: 32, alt: 'Topo.io' },
  },
  {
    quote: `We've been able to automate virtually all database tasks via the Neon API, saving us a tremendous amount of time and engineering effort`,
    avatar: himanshuBhandohImage,
    name: 'Himanshu Bhandoh',
    position: 'Software Engineer at Retool',
    logo: { src: retoolLogo, width: 112, height: 32, alt: 'Retool' },
  },
];

const clamp = (min, value, max) => Math.min(Math.max(min, value), max);

const IS_MOBILE_SCREEN_WIDTH = 639;

const Testimonials = ({ activeIndex, setActiveIndex, testimonialsRef }) => {
  const containerRef = useRef(null);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= IS_MOBILE_SCREEN_WIDTH;

  useEffect(() => {
    if (isMobile) {
      const container = containerRef.current;
      if (!container) return;

      setScrollLeft(container.scrollLeft);
      setScrollWidth(container.scrollWidth);

      const onScroll = () => {
        setScrollLeft(container.scrollLeft);
        setScrollWidth(container.scrollWidth);
      };

      container.addEventListener('scroll', onScroll);
      // eslint-disable-next-line consistent-return
      return () => container.removeEventListener('scroll', onScroll);
    }
  }, [isMobile, setActiveIndex]);

  const thumbStyle = useMemo(() => {
    const width = 1 / TESTIMONIALS.length;
    const left = (scrollLeft / (scrollWidth - windowWidth)) * (1 - width);
    return {
      width: `${width * 100}%`,
      left: `${clamp(0, left, 1 - width) * 100}%`,
    };
  }, [scrollLeft, scrollWidth, windowWidth]);

  return (
    <div className="mt-[157px] xl:mt-[88px] lg:mt-[63px] sm:mt-[38px] sm:w-full">
      <div
        className={clsx(
          'flex flex-col gap-[184px] xl:gap-[142px] lg:gap-[78px]',
          'sm:no-scrollbars sm:snap-x sm:snap-mandatory sm:flex-row sm:gap-3 sm:overflow-x-auto'
        )}
        ref={containerRef}
      >
        <div className="hidden shrink-0 sm:block sm:w-[calc((100%-min(100%-32px,448px)-24px)/2)] sm:snap-center" />
        {TESTIMONIALS.map((testimonial, index) => (
          <Testimonial
            className="testimonial"
            {...testimonial}
            isActive={activeIndex === index || isMobile}
            key={index}
            ref={(el) => (testimonialsRef.current[index] = el)}
          />
        ))}
        <div className="hidden shrink-0 sm:block sm:w-[calc((100%-min(100%-32px,448px)-24px)/2)] sm:snap-center" />
      </div>
      {isMobile && (
        <div className="relative mx-auto mt-8 h-px w-[192px] bg-[#343538]">
          <div className="absolute top-0 h-px bg-green-45" style={thumbStyle} />
        </div>
      )}
    </div>
  );
};

Testimonials.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  testimonialsRef: PropTypes.shape({ current: PropTypes.arrayOf(PropTypes.object) }).isRequired,
};

export default Testimonials;
