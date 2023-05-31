'use client';

import { useInView } from 'react-intersection-observer';

import Features from 'components/pages/home/features';
import Lines2 from 'components/pages/home/lines-2';
import SaaS from 'components/pages/home/saas';

const SecondSection = () => {
  const [secondSectionWithLinesRef, isSecondSectionWithLinesInView] = useInView({
    rootMargin: '100px 0px',
    triggerOnce: true,
  });
  return (
    <div className="relative overflow-hidden" ref={secondSectionWithLinesRef}>
      <Features />
      <SaaS />
      {isSecondSectionWithLinesInView && <Lines2 />}
    </div>
  );
};

export default SecondSection;
