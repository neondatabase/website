import clsx from 'clsx';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

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
    activeItems,
    setActiveItems,
    activeAnimations,
    setActiveAnimations,
    allItemsSelected,
    isItemSelected,
  } = props;
  // once the user selects an item, the animation on hover should be disabled
  const [isSelected, setIsSelected] = useState(false);
  const { width: windowWidth } = useWindowSize();

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

  return (
    <m.div
      className={clsx(
        'flex max-h-[975px] min-h-[760px] flex-col justify-center md:h-auto md:min-h-0 md:mt-16 md:opacity-100',
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

      <h3 className="text-4xl tracking-tighter leading-dense font-light mt-3.5 lg:text-3xl lg:mt-2.5 md:text-2xl">
        {title}
      </h3>
      <ul className="mt-7 grid gap-y-5 lg:mt-5">
        {items.map((item) => {
          const { title, description } = item;
          return (
            <li key={title}>
              <button
                className={clsx(
                  'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] duration-200 transition-colors text-left',
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
                    document.getElementById(nextId).scrollIntoView({ behavior: 'smooth' });
                  }
                  if (isSelected) {
                    setActiveAnimations({ ...activeAnimations, [type]: { ...item } });
                  }
                }}
              >
                <h4 className="text-xl font-medium leading-tight">{title}</h4>
                <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                  {description}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </m.div>
  );
};

export const selectPropTypes = {
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
