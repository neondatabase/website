'use client';

import useScrollPosition from '@react-hook/window-scroll';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container/container';
import { activities, performance, storage } from 'constants/pricing';
import useWindowSize from 'hooks/use-window-size';

import Metrics from './metrics';
import { MOBILE_WIDTH } from './select/select';

const SECTION_MIN_HEIGHT = 760;
const PAGE_MIN_HEIGHT = 800;
const OFFSET = 100;

const PAGE_HEIGHT_SETTINGS = [
  [870, 0.8, 0], // min height
  [975, 0.7, 100], // page height, multiplier, offset
  [1200, 0.6, 100],
  [1400, 0.55, 200],
  [1600, 0.5, 300],
  [1900, 0.45, 400],
  [2200, 0.4, 500],
  [Number.MAX_SAFE_INTEGER, 0.35, 600], // max height
];

const getSelectedIndex = (activeTitle, items) => {
  const index = items.findIndex((item) => item.title === activeTitle);
  return index === -1 ? 1 : index + 1;
};

const Estimates = () => {
  const sectionRef = useRef();
  const animationRef = useRef();
  const { width: windowWidth, height: pageHeight } = useWindowSize();
  const scrollY = useScrollPosition();
  const [contentRef, isContentInView] = useInView({ triggerOnce: true });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [activeItems, setActiveItems] = useState({
    activity: null,
    performance: null,
    storage: null,
  });

  const [activeAnimations, setActiveAnimations] = useState({
    activity: null,
    performance: null,
    storage: null,
  });

  const [showSectionTitle, setShowSectionTitle] = useState(true);

  useEffect(() => {
    if (isContentInView) {
      const animationTop = animationRef.current.getBoundingClientRect().top;
      setShowSectionTitle(animationTop !== 0);
    }
  }, [isContentInView, scrollY]);

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/pricing/lights.riv',
    autoplay: false,
    stateMachines: 'SM',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  const defaultInputName = useMemo(
    () => (currentSectionIndex === 3 ? 3 : currentSectionIndex + 1),
    [currentSectionIndex]
  );

  const animationStageInput = useStateMachineInput(rive, 'SM', 'stages', defaultInputName);
  const firstSelectInput = useStateMachineInput(rive, 'SM', '1 select', 1);
  const secondSelectInput = useStateMachineInput(rive, 'SM', '2 select', 1);
  const thirdSelectInput = useStateMachineInput(rive, 'SM', '3 select', 1);

  useEffect(() => {
    if (rive && isContentInView) {
      rive.play();
    }
  }, [rive, isContentInView]);

  useEffect(() => {
    if (!animationStageInput) return;
    const updateAnimationStageInput = () => {
      const { activity, performance, storage } = activeItems;
      if (!performance && !storage) animationStageInput.value = 1;
      if (activity && !performance && !storage) animationStageInput.value = 2;
      if (activity && performance) animationStageInput.value = 3;
      if (activity && performance && storage) {
        animationStageInput.value = currentSectionIndex === 3 ? 3 : currentSectionIndex + 1;
      }
    };

    const updateSelectInputValue = (input, activeItem, activeAnimation, options) => {
      if (!input) return;
      if (activeItem && !activeAnimation?.title) {
        input.value = getSelectedIndex(activeItem?.title, options);
      } else {
        input.value = getSelectedIndex(activeAnimation?.title, options);
      }
    };

    updateAnimationStageInput();
    updateSelectInputValue(
      firstSelectInput,
      activeItems.activity,
      activeAnimations.activity,
      activities
    );
    updateSelectInputValue(
      secondSelectInput,
      activeItems.performance,
      activeAnimations.performance,
      performance
    );
    updateSelectInputValue(
      thirdSelectInput,
      activeItems.storage,
      activeAnimations.storage,
      storage
    );
  }, [
    animationStageInput,
    firstSelectInput,
    secondSelectInput,
    thirdSelectInput,
    activeItems,
    activeAnimations,
    currentSectionIndex,
  ]);

  const pageHeightMultiplier = useMemo(() => {
    const setting = PAGE_HEIGHT_SETTINGS.find(([threshold]) => pageHeight <= threshold);

    return setting ? setting[1] : PAGE_HEIGHT_SETTINGS[PAGE_HEIGHT_SETTINGS.length - 1][1];
  }, [pageHeight]);

  const switchPointsOffset = useMemo(() => {
    const setting = PAGE_HEIGHT_SETTINGS.find(([threshold]) => pageHeight <= threshold);

    return setting ? setting[2] : 0;
  }, [pageHeight]);

  const allItemsSelected = useMemo(
    () => !!(activeItems.activity && activeItems.performance && activeItems.storage),
    [activeItems]
  );

  useEffect(() => {
    const currentScrollTop = scrollY;
    const switchPointMultiplier =
      pageHeight < PAGE_MIN_HEIGHT ? SECTION_MIN_HEIGHT * 1 : pageHeight * pageHeightMultiplier;

    // 5 is number of sections: 4 + 1
    const switchPoints = [...Array(5)].map(
      (_, index) =>
        sectionRef.current.offsetTop + OFFSET + index * switchPointMultiplier - switchPointsOffset
    );

    switchPoints.forEach((_, index) => {
      if (currentScrollTop > switchPoints[index] && currentScrollTop < switchPoints[index + 1]) {
        setCurrentSectionIndex(index);
      }
    });
  }, [switchPointsOffset, pageHeight, pageHeightMultiplier, scrollY]);

  return (
    <section
      className="forecast safe-paddings pt-36 md:pb-20 md:pt-20"
      ref={sectionRef}
      id="estimates"
    >
      <LazyMotion features={domAnimation}>
        <m.div
          className="relative md:opacity-100"
          initial={{ opacity: 1 }}
          animate={{
            opacity: showSectionTitle || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
            zIndex: 10,
          }}
          transition={{ duration: 0.2 }}
        >
          <Container className="relative z-10 text-center" size="medium">
            <h2 className="text-[56px] font-medium leading-none tracking-tighter lg:text-5xl md:text-4xl [&_span]:text-green-45">
              <span>Each user is unique.</span>
              <br /> However, we can give you estimates.
            </h2>
            <p className="mx-auto mt-4 max-w-[656px] text-lg font-light leading-snug md:max-w-none md:text-base">
              Simply answer three questions to get an estimated cost projection, tailored to give
              you a clear understanding of expenses based on usage scenarios.
            </p>
          </Container>
        </m.div>

        <Container
          className="relative grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4 md:grid-cols-1"
          size="medium"
        >
          <div className="relative col-span-5 col-start-2 -mx-[140px] h-full xl:col-span-6 xl:col-start-1 xl:row-start-1 xl:-mx-24 md:col-span-full md:hidden">
            <div
              className="sticky top-0 -mt-[20vh] h-screen min-h-[700px] [@media(max-height:900px)]:-mt-[10vh] [@media(min-height:1800px)]:-mt-[30vh]"
              ref={animationRef}
            >
              <m.div
                className="absolute flex h-full w-full items-center justify-center"
                // fadeIn animation in first 0.5s of render to avoid animation flickering
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <RiveComponent width={870} height={767} aria-hidden />
              </m.div>
            </div>
          </div>
          <div
            className="relative z-10 col-span-4 col-end-12 -ml-10 xl:col-span-5 xl:col-end-13 xl:row-start-1 md:col-span-full md:ml-0"
            ref={contentRef}
          >
            <Metrics
              activeItems={activeItems}
              setActiveItems={setActiveItems}
              activeAnimations={activeAnimations}
              setActiveAnimations={setActiveAnimations}
              allItemsSelected={allItemsSelected}
            />
          </div>
        </Container>
      </LazyMotion>
    </section>
  );
};

export default Estimates;
