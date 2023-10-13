import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef, useState } from 'react';

import Button from 'components/shared/button/button';
import LinesIllustration from 'components/shared/lines-illustration';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import { activities, performance, storage } from 'constants/pricing';
import useClickOutside from 'hooks/use-click-outside';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

import activityIcon from '../images/activity.svg';
import performanceIcon from '../images/performance.svg';
import storageIcon from '../images/storage.svg';
import Select from '../select';

const COMPUTE_TIME_PRICE = 0.102;
const AVERAGE_DAYS_IN_MONTH = 30.416666;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;
const PERCENTAGE_OF_MONTHLY_COST = 0.05;
const calculateStorageCost = (storageValue) =>
  storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateComputeCost = (computeUnits, activeTime) =>
  computeUnits * activeTime * COMPUTE_TIME_PRICE * AVERAGE_DAYS_IN_MONTH;

const icons = {
  activity: activityIcon,
  performance: performanceIcon,
  storage: storageIcon,
};
const Metrics = ({ windowWidth, currentSectionIndex, activeItems, setActiveItems }) => {
  const performanceRef = useRef(null);
  const storageRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState({
    performance: false,
    storage: false,
  });

  const onSelect = useCallback(
    (type, item) => {
      setActiveItems({ ...activeItems, [type]: { ...item } });
      setIsExpanded({ ...isExpanded, [type]: false });
    },
    [activeItems, isExpanded, setActiveItems]
  );

  const onExpand = useCallback(
    (type) => {
      setIsExpanded({ ...isExpanded, [type]: !isExpanded[type] });
    },
    [isExpanded]
  );

  useClickOutside([performanceRef, storageRef], () => {
    setIsExpanded({ performance: false, storage: false });
  });

  const computeTimeCost = useMemo(
    () => calculateComputeCost(activeItems.performance.unit, activeItems.activity.unit),
    [activeItems.performance.unit, activeItems.activity.unit]
  );

  const storageCost = useMemo(
    () => calculateStorageCost(activeItems.storage.unit),
    [activeItems.storage.unit]
  );

  const writtenAndTransferDataCost = useMemo(
    () => (computeTimeCost + storageCost) * PERCENTAGE_OF_MONTHLY_COST,
    [computeTimeCost, storageCost]
  );

  const totalCost = useMemo(
    () => (computeTimeCost + storageCost + writtenAndTransferDataCost).toFixed(2),
    [computeTimeCost, storageCost, writtenAndTransferDataCost]
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="flex h-[50vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-0 md:mt-16"
        initial={{ opacity: windowWidth < 768 ? 1 : 0.3 }}
        animate={{
          opacity: currentSectionIndex === 0 || windowWidth < 768 ? 1 : 0.3,
        }}
      >
        <span className="text-green-45 font-medium leading-none -tracking-extra-tight">
          Activity
        </span>
        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5">
          How active your users?
        </h3>
        <ul className="mt-7 grid gap-y-5 lg:mt-5">
          {activities.map(({ title, description, unit }) => (
            <li key={title}>
              <button
                className={clsx(
                  'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] hover:border-green-45 duration-200 transition-colors text-left',
                  activeItems.activity.title === title ? 'border-green-45' : 'border-gray-new-15'
                )}
                type="button"
                onClick={() =>
                  setActiveItems({ ...activeItems, activity: { title, description, unit } })
                }
              >
                <h4 className="text-xl font-medium leading-tight">{title}</h4>
                <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                  {description}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </m.div>

      <m.div
        className="flex h-[100vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16"
        initial={{ opacity: windowWidth < 768 ? 1 : 0.3 }}
        animate={{
          opacity: currentSectionIndex === 1 || windowWidth < 768 ? 1 : 0.3,
        }}
      >
        <span className="text-yellow-70 leading-none font-medium -tracking-extra-tight">
          Performance
        </span>
        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5">
          What peak performance is needed for your app?
        </h3>
        <Select
          className={clsx(
            'after:bg-[linear-gradient(90deg,rgba(240,240,117,0.2)0%,rgba(12,13,13,0.5)40%,rgba(12,13,13,0.5)100%)]',
            isExpanded.performance &&
              'shadow-[0px_14px_64px_0px_rgba(240,240,117,0.08),0px_6px_10px_0px_rgba(0,0,0,0.25)]'
          )}
          titleClassName={clsx(isExpanded.performance && 'text-yellow-70')}
          containerRef={performanceRef}
          activeItem={activeItems.performance}
          isExpanded={isExpanded.performance}
          items={performance}
          type="performance"
          onSelect={onSelect}
          onExpand={() => onExpand('performance')}
        />
      </m.div>

      <m.div
        className="flex h-[100vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16"
        initial={{ opacity: windowWidth < 768 ? 1 : 0.3 }}
        animate={{
          opacity: currentSectionIndex === 2 || windowWidth < 768 ? 1 : 0.3,
        }}
      >
        <span className="text-blue-80 leading-none font-medium -tracking-extra-tight">Storage</span>
        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5">
          How much storage is required?
        </h3>

        <Select
          className={clsx(
            'after:bg-[linear-gradient(90deg,rgba(110,224,247,0.3)0%,rgba(12,13,13,0.5)40%,rgba(12,13,13,0.5)100%)]',
            isExpanded.storage &&
              'shadow-[0px_14px_64px_0px_rgba(117,219,240,0.10),0px_6px_10px_0px_rgba(0,0,0,0.25)]'
          )}
          titleClassName={clsx(isExpanded.storage && 'text-blue-80')}
          containerRef={storageRef}
          activeItem={activeItems.storage}
          isExpanded={isExpanded.storage}
          items={storage}
          type="storage"
          onSelect={onSelect}
          onExpand={() => onExpand('storage')}
        />
      </m.div>

      <m.div
        className="flex h-[100vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16"
        initial={{ opacity: windowWidth < 768 ? 1 : 0.3 }}
        animate={{
          opacity: currentSectionIndex === 3 || windowWidth < 768 ? 1 : 0.3,
        }}
      >
        <div className="py-7 px-8 border border-green-45 rounded-[10px] overflow-hidden lg:px-6 lg:py-6">
          <p className="font-medium -tracking-extra-tight leading-none">Estimated price</p>
          <p className="mt-6">
            <span className="text-6xl text-green-45 leading-none font-light tracking-[-0.06em]">
              ${totalCost}
            </span>
            <span className="tracking-[-0.06em] text-2xl leading-none inline-block ml-1">/ mo</span>
          </p>
          <p className="mt-2 text-[15px] font-light text-gray-new-70 leading-tight">
            The price calculated for Ohio region
          </p>

          <ul className="mt-6 pt-7 border-t border-gray-new-15 flex flex-col gap-y-[18px]">
            {Object.entries(activeItems).map(([key, value]) => {
              const icon = icons[key];
              return (
                <li className="flex items-center" key={value.title}>
                  <img
                    className="mr-3.5 w-8 h-8"
                    src={icon}
                    alt=""
                    loading="lazy"
                    width={32}
                    height={32}
                  />
                  <span className="text-lg font-medium leading-tight tracking-extra-tight">
                    {value.title}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-8">
            <Button
              className="w-full relative z-20 !font-semibold tracking-extra-tight"
              theme="primary"
              size="new-lg"
              to={LINKS.signup}
            >
              Sign up and start
            </Button>
            <LinesIllustration className="z-10 !w-[125%]" color="#00E599" />
          </div>

          <p className="mt-11 relative z-10 text-base leading-snug font-light text-gray-new-80">
            <strong className="font-medium text-white">Want to learn more?</strong> For advanced
            users we highly recommend exploring our billing documentation.{' '}
            <Link
              className="inline-flex items-baseline font-normal text-[15px] leading-none tracking-extra-tight"
              theme="green"
              to={LINKS.billing}
            >
              Billing docs
              <ArrowIcon className="ml-1" />
            </Link>
          </p>
        </div>
      </m.div>
    </LazyMotion>
  );
};

Metrics.propTypes = {
  windowWidth: PropTypes.number,
  currentSectionIndex: PropTypes.number.isRequired,
  activeItems: PropTypes.shape({
    activity: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      unit: PropTypes.number,
    }),
    performance: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      unit: PropTypes.number,
    }),
    storage: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      unit: PropTypes.number,
    }),
  }).isRequired,
  setActiveItems: PropTypes.func.isRequired,
};

export default Metrics;
