'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import Container from 'components/shared/container';
import autoscalingLegendIcon from 'icons/home-new/autoscaling/legend/autoscaling.svg';
import dbLoadLegendIcon from 'icons/home-new/autoscaling/legend/db-load.svg';
import resourceLegendIcon from 'icons/home-new/autoscaling/legend/resource.svg';

import Heading from '../heading';

import Animation from './animation';

const SaveCostsComponent = () => (
  <Animation
    className="relative w-[1378px] max-w-none xl:left-1/2 xl:-ml-[50vw] xl:w-[1300px] lg:w-[1023px] md:left-0 md:ml-0 md:aspect-[767/599] md:w-screen"
    src="/animations/pages/home-new/autoscaling-save-costs.riv"
    autoBind
  />
);

const AvoidOutagesComponent = () => (
  <Animation
    className="relative w-[1378px] max-w-none xl:left-1/2 xl:-ml-[50vw] xl:w-[1300px] lg:w-[1023px] md:left-0 md:ml-0 md:aspect-[767/1193] md:w-screen"
    src="/animations/pages/home-new/autoscaling-avoid-outages.riv"
  />
);

const tabs = [
  {
    tab: 'Save Costs',
    renderComponent: () => <SaveCostsComponent />,
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
      className="autoscaling safe-paddings relative overflow-hidden bg-[#E4F1EB] pb-[105px] pt-[88px] xl:pb-20 xl:pt-16 lg:py-14 md:pt-9"
      id="autoscaling"
    >
      <Container
        className="relative grid h-full grid-cols-[224px_1fr] items-center gap-x-32 pr-0 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-16"
        size="1600"
      >
        <div className="min-w-0">
          <Heading
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
                  index === activeItem
                    ? 'bg-white text-gray-new-10'
                    : 'bg-[#E4F1EB] text-gray-new-10/80'
                )}
                key={index}
                type="button"
                onClick={() => setActiveItem(index)}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className="no-scrollbars relative z-10 mt-6 w-max max-w-none overflow-hidden overflow-x-auto 2xl:w-auto xl:left-1/2 xl:-ml-[50vw] xl:w-screen lg:mt-5">
            <div className="h-[448px] xl:h-[408px] lg:h-[338px] md:h-auto">
              {tabs.map(
                (item, index) =>
                  index === activeItem && <div key={index}>{item.renderComponent()}</div>
              )}
            </div>
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
