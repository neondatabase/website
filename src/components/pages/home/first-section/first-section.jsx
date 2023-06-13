'use client';

import { useInView } from 'react-intersection-observer';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import Hero from 'components/pages/home/hero';
import Lines1 from 'components/pages/home/lines-1';

const FirstSection = () => {
  const [firstSectionWithLinesRef, isFirstSectionWithLinesInView] = useInView({
    rootMargin: '100px 0px',
    triggerOnce: true,
  });
  return (
    <div className="relative overflow-hidden" ref={firstSectionWithLinesRef}>
      {isFirstSectionWithLinesInView && <Lines1 />}
      <Hero />
      <CTA />
      <Advantages />
    </div>
  );
};

export default FirstSection;
