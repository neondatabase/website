'use client';

import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import Container from 'components/shared/container';
import avoidImage from 'icons/home-new/autoscaling/avoid-illustration.svg';
import autoscalingLegendIcon from 'icons/home-new/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/home-new/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/home-new/autoscaling/legend/resource.svg';
import autoscalingImage from 'icons/home-new/autoscaling/save-costs-illustration.svg';

import Heading from '../heading';

const SaveCostsComponent = () => (
  <div className="pointer-events-none">
    <Image src={autoscalingImage} width={1376} height={451} alt="" />
  </div>
);

const AvoidOutagesComponent = () => (
  <div className="pointer-events-none">
    <Image src={avoidImage} width={1376} height={518} alt="" />
  </div>
);

const data = [
  {
    tab: 'Save Costs',
    renderComponent: () => <SaveCostsComponent />,
  },
  {
    tab: 'Avoid Outages',
    renderComponent: () => <AvoidOutagesComponent />,
  },
];

const Autoscaling = () => {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section
      className="autoscaling safe-paddings relative bg-[#E4F1EB] pb-20 pt-[88px]"
      id="autoscaling"
    >
      <Container
        className="relative grid grid-cols-[224px_1fr] gap-x-32 text-black before:block"
        size="1600"
      >
        <div className="">
          <Heading
            className="max-w-[960px]"
            icon="autoscaling"
            title="<strong>Advanced autoscaling.</strong> Scale further without worrying about the database. Never overpay for resources you don’t use."
          />

          <div className="mt-16">
            {data.map((item, index) => (
              <button
                className={clsx(
                  'relative h-11 min-w-[134px] px-4 py-3.5 transition-colors duration-200',
                  'text-base font-medium leading-none tracking-tight',
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

          <div className="mt-6 w-max">
            <LazyMotion features={domAnimation}>
              <AnimatePresence initial={false} mode="wait">
                {data.map(
                  (item, index) =>
                    index === activeItem && (
                      <m.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.renderComponent()}
                      </m.div>
                    )
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>

          <div className="mt-[22px] grid grid-cols-2 items-start gap-x-8">
            <ul className="flex items-center gap-x-6 text-[15px] leading-snug tracking-tight text-black-pure">
              <li className="flex items-center gap-x-2.5">
                <Image src={autoscalingLegendIcon} width={16} height={16} alt="" />
                <p>Neon autoscaling</p>
              </li>
              <li className="flex items-center gap-x-2.5">
                <Image src={dbLoadLegendIcon} width={16} height={16} alt="" />
                <p>Database load</p>
              </li>
              <li className="flex items-center gap-x-2.5">
                <Image src={resourceLegendIcon} width={16} height={16} alt="" />
                <p>Fixed-resource provisioned</p>
              </li>
            </ul>
            <p className="max-w-[480px] text-[18px] leading-snug tracking-tight">
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
