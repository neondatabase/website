'use client';

import clsx from 'clsx';
import { useRef, useState, useEffect, useMemo } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';

import avatar1 from 'images/pages/home/industry/avatar-1.png';
import avatar2 from 'images/pages/home/industry/avatar-2.png';
import avatar3 from 'images/pages/home/industry/avatar-3.png';
import vercelLogo from 'images/pages/home/industry/vercel.svg';

import Testimonial from './testimonial';

// TODO: update logos and avatars
const TESTIMONIALS = [
  {
    quote: `Neon is very easy to use. You create an account and a project, you get a database string, and that’s that. It’s still the Postgres that you’re used to.`,
    avatar: avatar1,
    name: 'Joey Teunissen',
    position: 'CTO at Opusflow',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
  {
    quote: `By partnering with Neon, Vercel’s frontend platform is now the end-to-end serverless solution for building on the Web, from Next.js all the way to SQL.`,
    avatar: avatar2,
    name: 'Guillermo Rauch',
    position: 'CEO at Vercel',
    logo: { src: vercelLogo, width: 111, height: 36, alt: 'Vercel' },
  },
  {
    quote: `The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.`,
    avatar: avatar3,
    name: 'Lincoln Bergeson',
    position: 'Infrastructure Engineer at Replit',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
  {
    quote: `Using Neon has meant our developers can continue to spend their time on things that meaningfully drive the business forward, instead of babysitting infrastructure.`,
    avatar: avatar3,
    name: 'Adithya Reddy',
    position: 'Developer at Branch',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
];

const clamp = (min, value, max) => Math.min(Math.max(min, value), max);

const Testimonials = () => {
  const containerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
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
  }, [windowWidth]);

  const thumbStyle = useMemo(() => {
    const width = 1 / TESTIMONIALS.length;
    const left = (scrollLeft / (scrollWidth - windowWidth)) * (1 - width);
    return {
      width: `${width * 100}%`,
      left: `${clamp(0, left, 1 - width) * 100}%`,
    };
  }, [scrollLeft, scrollWidth, windowWidth]);

  return (
    <div className="mt-48 xl:mt-[123px] lg:mt-[98px] sm:mt-6 sm:w-full">
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
            className={clsx(index !== 1 && 'opacity-40 blur-[2px] sm:opacity-100 sm:blur-none')}
            {...testimonial}
            key={index}
          />
        ))}
        <div className="hidden shrink-0 sm:block sm:w-[calc((100%-min(100%-32px,448px)-24px)/2)] sm:snap-center" />
      </div>
      <div className="relative mx-auto mt-8 hidden h-px w-[192px] bg-[#343538] sm:block">
        <div className="absolute top-0 h-px bg-green-45" style={thumbStyle} />
      </div>
    </div>
  );
};

export default Testimonials;
