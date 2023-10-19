import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import { activities, performance, storage } from 'constants/pricing';
import useWindowSize from 'hooks/use-window-size';

import activityIcon from '../images/activity.svg';
import performanceIcon from '../images/performance.svg';
import storageIcon from '../images/storage.svg';

const COMPUTE_TIME_PRICE = 0.102;
const AVERAGE_DAYS_IN_MONTH = 30.416666;
const PROJECT_STORAGE_PRICE = 0.000164;
const PROJECT_STORAGE_HOURS = 24;

const MOBILE_WIDTH = 768;

const calculateStorageCost = (storageValue) =>
  storageValue * PROJECT_STORAGE_HOURS * PROJECT_STORAGE_PRICE * AVERAGE_DAYS_IN_MONTH;

const calculateComputeCost = (computeUnits, activeTime) =>
  computeUnits * activeTime * COMPUTE_TIME_PRICE * AVERAGE_DAYS_IN_MONTH;

const icons = {
  activity: activityIcon,
  performance: performanceIcon,
  storage: storageIcon,
};

const Metrics = ({ currentSectionIndex, activeItems, setActiveItems }) => {
  const { width: windowWidth } = useWindowSize();

  const computeTimeCost = useMemo(
    () => calculateComputeCost(activeItems.performance.unit, activeItems.activity.unit),
    [activeItems.performance.unit, activeItems.activity.unit]
  );

  const storageCost = useMemo(
    () => calculateStorageCost(activeItems.storage.unit),
    [activeItems.storage.unit]
  );

  const totalCost = useMemo(
    () => (computeTimeCost + storageCost).toFixed(2),
    [computeTimeCost, storageCost]
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="flex h-[50vh] max-h-[975px] min-h-[760px] flex-col justify-center md:h-auto md:min-h-0 md:mt-16 md:opacity-100"
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: currentSectionIndex === 0 || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
      >
        <span className="flex items-center space-x-2.5">
          <span className="text-[15px] leading-none tracking-[-0.02em] font-medium py-1 px-3 text-black bg-green-45 rounded-[50px]">
            1/3
          </span>
          <span className="text-green-45 font-medium leading-none -tracking-extra-tight">
            Activity
          </span>
        </span>

        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5 md:text-2xl">
          How active are your users?
        </h3>
        <ul className="mt-7 grid gap-y-5 lg:mt-5">
          {activities.map(({ title, description, unit }) => (
            <li key={title}>
              <button
                className={clsx(
                  'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] duration-200 transition-colors text-left',
                  activeItems.activity.title === title
                    ? 'border-green-45 hover:border-green-45'
                    : 'border-gray-new-15 hover:border-green-45/30'
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
        className="flex h-[60vh] max-h-[975px] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16 md:opacity-100"
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: currentSectionIndex === 1 || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
      >
        <span className="flex items-center space-x-2.5">
          <span className="text-[15px] leading-none tracking-[-0.02em] font-medium py-1 px-3 text-black bg-yellow-70 rounded-[50px]">
            2/3
          </span>
          <span className="text-yellow-70 leading-none font-medium -tracking-extra-tight">
            Performance
          </span>
        </span>

        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5 md:text-2xl">
          What level of performance does your application require?
        </h3>
        <ul className="mt-7 grid gap-y-5 lg:mt-5">
          {performance.map(({ title, description, unit }) => (
            <li key={title}>
              <button
                className={clsx(
                  'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] duration-200 transition-colors text-left',
                  activeItems.performance.title === title
                    ? 'border-yellow-70 hover:border-yellow-70'
                    : 'border-gray-new-15 hover:border-yellow-70/30'
                )}
                type="button"
                onClick={() =>
                  setActiveItems({ ...activeItems, performance: { title, description, unit } })
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
        className="flex h-[60vh] max-h-[975px] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16 md:opacity-100"
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: currentSectionIndex === 2 || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
      >
        <span className="flex items-center space-x-2.5">
          <span className="text-[15px] leading-none tracking-[-0.02em] font-medium py-1 px-3 text-black bg-blue-80 rounded-[50px]">
            3/3
          </span>
          <span className="text-blue-80 leading-none font-medium -tracking-extra-tight">
            Storage
          </span>
        </span>

        <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5 md:text-2xl">
          How much storage do you require?
        </h3>

        <ul className="mt-7 grid gap-y-5 lg:mt-5">
          {storage.map(({ title, description, unit }) => (
            <li key={title}>
              <button
                className={clsx(
                  'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] duration-200 transition-colors text-left',
                  activeItems.storage.title === title
                    ? 'border-blue-80 hover:border-blue-80'
                    : 'border-gray-new-15 hover:border-blue-80/30'
                )}
                type="button"
                onClick={() =>
                  setActiveItems({ ...activeItems, storage: { title, description, unit } })
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
        className="flex h-[90vh] min-h-[760px] flex-col justify-center md:h-auto md:min-h-fit md:mt-16 md:opacity-100"
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: currentSectionIndex === 3 || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
      >
        <div className="py-7 px-8 border border-green-45 rounded-[10px] overflow-hidden lg:px-6 lg:py-6">
          <p className="font-medium -tracking-extra-tight leading-none">Estimated bill</p>
          <p className="mt-6">
            <span className="text-6xl text-green-45 leading-none font-light tracking-[-0.06em] md:text-5xl">
              ${totalCost}
            </span>
            <span className="tracking-[-0.06em] text-2xl leading-none inline-block ml-1">/ mo</span>
          </p>
          <p className="mt-2 text-[15px] font-light text-gray-new-70 leading-tight">
            The price calculated for the Ohio region
          </p>

          <ul className="mt-6 pt-7 border-t border-gray-new-15 flex flex-col gap-y-[18px] sm:gap-y-4">
            {Object.entries(activeItems).map(([key, value]) => {
              const icon = icons[key];
              return (
                <li className="flex items-center" key={value.title}>
                  <img
                    className="mr-3.5 w-8 h-8 sm:w-7 sm:h-7"
                    src={icon}
                    alt=""
                    loading="lazy"
                    width={32}
                    height={32}
                  />
                  <span className="text-lg font-medium leading-tight tracking-extra-tight sm:text-base">
                    {value.title}
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
