import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Element, scroller } from 'react-scroll';

import useWindowSize from 'hooks/use-window-size';

export const MOBILE_WIDTH = 768;

const Select = (props) => {
  const {
    className,
    index,
    label,
    title,
    items,
    nextId,
    textColor,
    activeColor,
    defaultColor,
    hexColor,
    activeItems,
    setActiveItems,
    activeAnimations,
    setActiveAnimations,
    allItemsSelected,
    isItemSelected,
  } = props;

  const [isSelected, setIsSelected] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const type = label.toLowerCase();

  const onHover = (type, item) => {
    setActiveAnimations((prevAnimations) => ({
      ...prevAnimations,
      [type]: { ...item },
    }));
  };

  const onUnhover = (type) => {
    setActiveAnimations((prevAnimations) => {
      const newState = {
        ...prevAnimations,
        [type]: null,
      };

      return newState;
    });
  };

  const getScrollOffset = () => {
    if (windowWidth < MOBILE_WIDTH && windowHeight < 975) {
      return 10;
    }

    if (index === items.length - 1) {
      return -0.05 * windowHeight;
    }

    if (windowHeight < 1400) {
      // 1400 is the height of the page screen when section height is 760
      return -(windowHeight - 760) / 2; // 760px - min height of the section
    }

    return -(windowHeight - 975) / 2; // 975px - max height of the section
  };

  return (
    <Element name={type}>
      <m.div
        className={clsx(
          'flex max-h-[975px] min-h-[760px] flex-col justify-center md:h-auto md:min-h-0 md:pt-16 md:opacity-100',
          !isItemSelected(index - 1) && 'pointer-events-none md:pointer-events-auto',
          className
        )}
        initial={{ opacity: windowWidth < MOBILE_WIDTH ? 1 : 0.4 }}
        animate={{
          opacity: index === 0 || isItemSelected(index - 1) || windowWidth < MOBILE_WIDTH ? 1 : 0.4,
        }}
        id={type}
      >
        <span className={clsx('font-medium leading-none -tracking-extra-tight', textColor)}>
          {label}
        </span>

        <h3 className="mt-3.5 text-4xl font-light leading-dense tracking-tighter lg:mt-2.5 lg:text-3xl md:text-2xl">
          {title}
        </h3>
        <ul className="mt-7 grid gap-y-5 lg:mt-5">
          {items.map((item) => {
            const { title, description } = item;
            return (
              <li className="group overflow-hidden rounded-[10px]" key={title}>
                <button
                  className={clsx(
                    'relative flex w-full flex-col rounded-[10px] border text-left transition-colors duration-200 before:absolute before:bottom-full before:left-0 before:h-5 before:w-full group-first:before:hidden',
                    activeItems[type]?.title === title ? activeColor : defaultColor
                  )}
                  type="button"
                  onMouseEnter={() => onHover(type, item)}
                  onMouseLeave={() => onUnhover(type)}
                  onClick={() => {
                    onHover(type, item);
                    setIsSelected(true);
                    setActiveItems({ ...activeItems, [type]: item });
                    if (!allItemsSelected) {
                      scroller.scrollTo(nextId, {
                        duration: 400,
                        delay: 0,
                        smooth: true,
                        isDynamic: true,
                        offset: getScrollOffset(),
                      });
                    }
                    if (isSelected) {
                      setActiveAnimations({ ...activeAnimations, [type]: { ...item } });
                    }
                  }}
                >
                  <span
                    className="absolute -left-[72px] top-1/2 flex h-[180px] w-[180px] -translate-y-1/2 rounded-full opacity-10 blur-[32.5px]"
                    style={{ backgroundColor: hexColor }}
                  />
                  <div className="relative z-10 w-full rounded-[10px] bg-black-new px-6 pb-6 pt-5">
                    <h4 className="text-xl font-medium leading-tight">{title}</h4>
                    <p className="mt-2 text-left text-[15px] font-light leading-tight text-gray-new-70">
                      {description}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </m.div>
    </Element>
  );
};

export const selectPropTypes = {
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
  activeAnimations: PropTypes.shape({
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
  setActiveAnimations: PropTypes.func.isRequired,
};

Select.propTypes = {
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      unit: PropTypes.number,
    })
  ).isRequired,
  nextId: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  activeColor: PropTypes.string.isRequired,
  defaultColor: PropTypes.string.isRequired,
  allItemsSelected: PropTypes.bool.isRequired,
  ...selectPropTypes,
};

export default Select;
