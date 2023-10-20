import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import { activities, performance, storage } from 'constants/pricing';
import useWindowSize from 'hooks/use-window-size';

import activityIcon from '../images/activity.svg';
import performanceIcon from '../images/performance.svg';
import storageIcon from '../images/storage.svg';
import Select from '../select';
import { selectPropTypes, MOBILE_WIDTH } from '../select/select';

const COMPUTE_TIME_PRICE = 0.102;
const AVERAGE_DAYS_IN_MONTH = 30.416666;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;

const calculateStorageCost = (storageValue) =>
  storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateComputeCost = (computeUnits, activeTime) =>
  computeUnits * activeTime * COMPUTE_TIME_PRICE * AVERAGE_DAYS_IN_MONTH;

const icons = {
  activity: activityIcon,
  performance: performanceIcon,
  storage: storageIcon,
};

const items = [
  {
    label: 'Activity',
    title: 'How active are your users?',
    items: activities,
    nextId: 'performance',
    textColor: 'text-green-45',
    activeColor: 'border-green-45 hover:border-green-45',
    defaultColor: 'border-gray-new-15 hover:border-green-45/30',
  },
  {
    label: 'Performance',
    title: 'What level of performance does your application require?',
    items: performance,
    nextId: 'storage',
    textColor: 'text-yellow-70',
    activeColor: 'border-yellow-70 hover:border-yellow-70',
    defaultColor: 'border-gray-new-15 hover:border-yellow-70/30',
  },
  {
    label: 'Storage',
    title: 'How much storage do you require?',
    items: storage,
    nextId: 'pricing',
    textColor: 'text-blue-80',
    activeColor: 'border-blue-80 hover:border-blue-80',
    defaultColor: 'border-gray-new-15 hover:border-blue-80/30',
  },
];

const Metrics = ({
  currentSectionIndex,
  activeItems,
  setActiveItems,
  activeAnimations,
  setActiveAnimations,
}) => {
  const { width: windowWidth } = useWindowSize();
  const [finalEstimatePrice, setFinalEstimatePrice] = useState({
    price: 0,
    activeItems: {
      activity: {
        title: 'Activity',
      },
      performance: {
        title: 'Performance',
      },
      storage: {
        title: 'Storage',
      },
    },
  });
  const [allItemsSelected, setAllItemsSelected] = useState(false);
  const computeTimeCost = useMemo(
    () => calculateComputeCost(activeItems.performance?.unit, activeItems.activity?.unit),
    [activeItems.performance?.unit, activeItems.activity?.unit]
  );

  const storageCost = useMemo(
    () => calculateStorageCost(activeItems.storage?.unit),
    [activeItems.storage?.unit]
  );

  const totalCost = useMemo(
    () => (computeTimeCost + storageCost).toFixed(2),
    [computeTimeCost, storageCost]
  );

  useEffect(() => {
    if (activeItems.activity && activeItems.performance && activeItems.storage) {
      setFinalEstimatePrice({
        price: totalCost,
        activeItems: { ...activeItems },
      });
      setAllItemsSelected(true);
    }
  }, [activeItems, totalCost]);

  return (
    <LazyMotion features={domAnimation}>
      {items.map((item, index) => (
        <Select
          className={clsx(
            index === 0
              ? 'h-[50vh]'
              : 'h-[60vh] scroll-mt-[calc((100vh-975px)/2)] [@media(max-height:1400px)]:scroll-mt-[calc((100vh-760px)/2)]'
          )}
          key={item.label}
          {...item}
          index={index}
          activeItems={activeItems}
          setActiveItems={setActiveItems}
          activeAnimations={activeAnimations}
          setActiveAnimations={setActiveAnimations}
          currentSectionIndex={currentSectionIndex}
          allItemsSelected={allItemsSelected}
        />
      ))}

      <m.div
        className="flex h-[90vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16 md:opacity-100"
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: currentSectionIndex === 3 || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
        id="pricing"
      >
        <div className="py-7 px-8 border border-green-45 rounded-[10px] overflow-hidden lg:px-6 lg:py-6">
          <p className="font-medium -tracking-extra-tight leading-none">Estimated bill</p>
          <p className="mt-6">
            <span className="text-6xl text-green-45 leading-none font-light tracking-[-0.06em] md:text-5xl">
              ${finalEstimatePrice.price}
            </span>
            <span className="tracking-[-0.06em] text-2xl leading-none inline-block ml-1">/ mo</span>
          </p>
          <p className="mt-2 text-[15px] font-light text-gray-new-70 leading-tight">
            The price calculated for the Ohio region
          </p>

          <ul className="mt-6 pt-7 border-t border-gray-new-15 flex flex-col gap-y-[18px] sm:gap-y-4">
            {Object.entries(finalEstimatePrice.activeItems).map(([key, value]) => {
              const icon = icons[key];
              return (
                <li className="flex items-center" key={value?.title}>
                  <img
                    className="mr-3.5 w-8 h-8 sm:w-7 sm:h-7"
                    src={icon}
                    alt=""
                    loading="lazy"
                    width={32}
                    height={32}
                  />
                  <span className="text-lg font-medium leading-tight tracking-extra-tight sm:text-base">
                    {value?.title}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-8">
            <AnimatedButton
              className="w-full relative z-20 !font-semibold tracking-extra-tight"
              theme="primary"
              size="lg"
              to={LINKS.signup}
              isAnimated
            >
              Sign up and start
            </AnimatedButton>
          </div>

          <p className="mt-11 relative z-10 text-base leading-snug font-light text-gray-new-80">
            <strong className="font-medium text-white">Want to learn more?</strong> For advanced
            users we highly recommend exploring our{' '}
            <Link
              className="inline-block leading-tight decoration-1 underline-offset-[6px]"
              theme="green-underlined"
              to={LINKS.billing}
            >
              billing documentation
            </Link>
            .
          </p>
        </div>
      </m.div>
    </LazyMotion>
  );
};

Metrics.propTypes = {
  ...selectPropTypes,
};

export default Metrics;
