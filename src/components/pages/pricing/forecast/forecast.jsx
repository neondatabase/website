'use client';

import useScrollPosition from '@react-hook/window-scroll';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Container from 'components/shared/container/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import { activities, performance, storage } from 'constants/pricing';
import useWindowSize from 'hooks/use-window-size';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

import Metrics from './metrics';

const SECTION_MIN_HEIGHT = 760;

const Forecast = () => {
  const sectionRef = useRef();
  const { width: windowWidth, height: pageHeight } = useWindowSize();
  const scrollY = useScrollPosition();
  const [contentRef, isContentInView] = useInView({ triggerOnce: true });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [activeItems, setActiveItems] = useState({
    activity: activities[0],
    performance: performance[0],
    storage: storage[0],
  });

  const { RiveComponent, rive } = useRive({
    src: '/animations/pages/pricing/lights.riv',
    autoplay: false,
    stateMachines: 'SM',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  });

  const animationStageInput = useStateMachineInput(rive, 'SM', 'stages', 1);
  const firstSelectInput = useStateMachineInput(rive, 'SM', '1 select', 1);
  const secondSelectInput = useStateMachineInput(rive, 'SM', '2 select', 1);
  const thirdSelectInput = useStateMachineInput(rive, 'SM', '3 select', 1);

  useEffect(() => {
    if (rive && isContentInView) {
      rive.play();
    }
  }, [rive, isContentInView, currentSectionIndex]);

  useEffect(() => {
    if (!animationStageInput) return;

    animationStageInput.value = currentSectionIndex + 1;
  }, [currentSectionIndex, animationStageInput]);

  useEffect(() => {
    if (!firstSelectInput) return;

    firstSelectInput.value =
      activities.findIndex(({ title }) => title === activeItems.activity.title) + 1;
  }, [activeItems.activity.title, firstSelectInput]);

  useEffect(() => {
    if (!secondSelectInput) return;

    secondSelectInput.value =
      performance.findIndex(({ title }) => title === activeItems.performance.title) + 1;
  }, [activeItems.performance.title, secondSelectInput]);

  useEffect(() => {
    if (!thirdSelectInput) return;

    thirdSelectInput.value =
      storage.findIndex(({ title }) => title === activeItems.storage.title) + 1;
  }, [activeItems.storage.title, thirdSelectInput]);

  useEffect(() => {
    const currentScrollTop = scrollY;
    const switchPointMultiplier = pageHeight < 975 ? SECTION_MIN_HEIGHT * 1 : pageHeight * 0.9;
    const switchPoints = [...Array(4)].map(
      (_, index) => sectionRef.current.offsetTop + 130 + index * switchPointMultiplier - 200
    );

    switchPoints.forEach((_, index) => {
      if (currentScrollTop > switchPoints[index] && currentScrollTop < switchPoints[index + 1]) {
        setCurrentSectionIndex(index);
      }
    });
  }, [pageHeight, scrollY]);

  return (
    <section className="forecast safe-paddings pt-[200px]" ref={sectionRef}>
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="medium">
        <div className="col-start-2 col-span-5 -mr-10">
          <h2 className="text-6xl leading-none font-medium tracking-tighter">
            Forecasting is easy
          </h2>
          <p className="text-lg leading-snug font-light mt-4 max-w-[464px]">
            Follow a simple survey to quickly estimate potential monthly bill based on your app
            users’ activity.
          </p>
        </div>
        <div className="col-end-12 col-span-4 -ml-10">
          <div>
            <p className="text-lg leading-snug font-light mt-4 max-w-[255px]">
              Need an additional help or custom volume-based plans
            </p>
            <Link
              className="mt-3.5 py-[7px] px-3 text-[15px] border border-green-45 rounded-[50px] inline-flex items-baseline leading-none text-green-45 tracking-extra-tight"
              to={LINKS.contactSales}
            >
              Contact Sales
              <ArrowIcon className="ml-1" />
            </Link>
          </div>
        </div>
      </Container>
      <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="medium">
        <div className="relative col-span-5 -mx-10 col-start-2 h-full xl:col-span-6 lg:-ml-8 md:col-span-full md:hidden">
          <div className="sticky top-0 h-screen min-h-[1020px] -mt-40">
            <div className="absolute flex h-full w-full items-center justify-center">
              <RiveComponent width={870} height={767} aria-hidden />
            </div>
          </div>
        </div>
        <div className="col-end-12 col-span-4 -ml-10" ref={contentRef}>
          <Metrics
            windowWidth={windowWidth}
            currentSectionIndex={currentSectionIndex}
            activeItems={activeItems}
            setActiveItems={setActiveItems}
          />
        </div>
      </Container>
    </section>
  );
};

export default Forecast;
