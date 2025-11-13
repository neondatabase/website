'use client';

import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import Container from 'components/shared/container';
import RiveAnimation from 'components/shared/rive-animation';
import autoscalingLegendIcon from 'icons/home-new/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/home-new/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/home-new/autoscaling/legend/resource.svg';
import avoidImageMd from 'images/pages/home-new/autoscaling/avoid-illustration-md.svg';
import avoidImage from 'images/pages/home-new/autoscaling/avoid-illustration.svg';
import saveCostsImageMd from 'images/pages/home-new/autoscaling/save-costs-md.svg';

import Heading from '../heading';

const SaveCostsComponent = () => (
  <>
    <RiveAnimation
      className="relative -left-[60px] -top-[102px] w-[1680px] max-w-none 2xl:-left-[56px] 2xl:-top-[95px] 2xl:w-[1600px] xl:left-1/2 xl:-ml-[50vw] xl:-translate-x-14 lg:-top-[75px] lg:w-[1248px] lg:-translate-x-11 md:hidden"
      src="/animations/pages/home-new/autoscaling-graph.riv"
      intersectionRootMargin="0px 0px"
      artboard="main"
      stateMachines="SM"
      autoplay={false}
      autoBind
    />
    <Image
      className="mx-auto hidden max-w-none md:block"
      src={saveCostsImageMd}
      width={768}
      height={280}
      alt=""
    />
  </>
);

const AvoidOutagesComponent = () => (
  <>
    <Image
      className="pointer-events-none relative -top-[70px] mx-auto max-w-none 2xl:-top-[62px] 2xl:w-[1216px] xl:w-[1280px] lg:-top-[38px] lg:h-fit lg:w-screen lg:max-w-full md:hidden"
      src={avoidImage}
      width={1376}
      height={518}
      alt=""
    />
    <Image
      className="mx-auto hidden max-w-none md:block"
      src={avoidImageMd}
      width={768}
      height={560}
      alt=""
    />
  </>
);

const tabs = [
  {
    tab: 'Save Costs',
    renderComponent: (props) => <SaveCostsComponent {...props} />,
  },
  {
    tab: 'Avoid Outages',
    renderComponent: () => <AvoidOutagesComponent />,
  },
];

const legend = [
  {
    icon: autoscalingLegendIcon,
    text: 'Neon autoscaling',
  },
  {
    icon: dbLoadLegendIcon,
    text: 'Database load',
  },
  {
    icon: resourceLegendIcon,
    text: 'Fixed-resource provisioned',
  },
];

const Autoscaling = () => {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section
      className="autoscaling safe-paddings relative bg-[#E4F1EB] pb-[105px] pt-[88px] xl:pb-20 xl:pt-16 lg:py-14 md:pt-9"
      id="autoscaling"
    >
      <Container
        className="relative grid h-full grid-cols-[224px_1fr] items-center gap-x-32 pr-0 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-16"
        size="1600"
      >
        <div className="min-w-0">
          <Heading
            className="max-w-[960px] xl:pr-10 lg:pr-0 md:pr-4"
            icon="autoscaling"
            theme="light"
            title="<strong>Advanced autoscaling.</strong> Scale further without worrying about the database. Never overpay for resources you don’t use."
          />

          <div className="relative z-20 mt-16 xl:mt-14 lg:mt-12 md:mt-11">
            {tabs.map((item, index) => (
              <button
                className={clsx(
                  'relative h-11 min-w-[134px] whitespace-nowrap px-4 py-3 transition-colors duration-200',
                  'xl:h-10 xl:min-w-[130px] lg:h-9 lg:min-w-[124px] lg:px-3 lg:py-2.5',
                  'text-[15px] font-medium leading-none tracking-tight',
                  'border border-gray-new-10 even:border-l-0',
                  index === activeItem ? 'bg-white text-gray-new-10' : 'text-gray-new-10/80'
                )}
                key={index}
                type="button"
                onClick={() => setActiveItem(index)}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className="relative z-10 mt-6 w-max max-w-none xl:left-1/2 xl:-ml-[50vw] xl:w-screen lg:mt-5">
            <LazyMotion features={domAnimation}>
              <AnimatePresence initial={false} mode="wait">
                {tabs.map(
                  (item, index) =>
                    index === activeItem && (
                      <m.div
                        className="h-[448px] lg:h-[333px] md:pointer-events-none md:flex md:h-auto md:min-h-[280px] md:justify-center"
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.renderComponent()}
                      </m.div>
                    )
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>

          <div className="relative z-20 mt-[22px] grid grid-cols-2 items-start text-black-pure xl:mt-2 xl:grid-cols-[1fr_352px] lg:mt-5 lg:grid-cols-1">
            <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2.5 lg:gap-x-7 xs:flex-col">
              {legend.map((item, index) => (
                <li
                  className="flex items-center gap-x-2.5 whitespace-nowrap text-[15px] leading-snug tracking-tight xl:gap-x-2 md:text-[14px]"
                  key={index}
                >
                  <Image src={item.icon} width={16} height={16} alt="" />
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="ml-24 max-w-[480px] pr-1 text-[18px] leading-normal tracking-tight xl:-mr-4 xl:ml-8 lg:mx-0 lg:mt-10 md:mt-8 md:text-[15px]">
              Neon monitors your database load ten times a second and autoscales CPU and Memory to
              exactly fit your workload.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Autoscaling;
