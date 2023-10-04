import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

import ChevronDownIcon from '../images/chevron-down.inline.svg';

const Select = ({ containerRef, activeItem, isExpanded, onSelect, onExpand, items, type }) => (
  <div className="relative" ref={containerRef}>
    <button
      className="mt-7 pt-5 w-full flex items-center px-6 pb-6 border border-gray-new-15 rounded-[10px] hover:border-green-45 duration-200 transition-colors"
      type="button"
      onClick={onExpand}
    >
      <div className="flex flex-col items-start">
        <h4 className="text-xl font-medium leading-tight">{activeItem.title}</h4>
        <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
          {activeItem.description}
        </p>
      </div>
      <ChevronDownIcon className="w-6 h-6 mt-2 ml-auto" />
    </button>
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isExpanded ? (
          <m.ul
            className="absolute top-full left-0 right-0 mt-2.5 z-10 bg-black rounded-[10px] shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {items.map(({ title, description }) => (
              <li key={title}>
                <button
                  className={clsx(
                    'pt-5 w-full flex flex-col px-6 pb-6 border rounded-[10px] hover:border-green-45 duration-200 transition-colors',
                    activeItem.title === title ? 'border-green-45' : 'border-gray-new-15'
                  )}
                  type="button"
                  onClick={() => onSelect(type, title, description)}
                >
                  <h4 className="text-xl font-medium leading-tight">{title}</h4>
                  <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                    {description}
                  </p>
                </button>
              </li>
            ))}
          </m.ul>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  </div>
);

Select.propTypes = {
  containerRef: PropTypes.shape({}).isRequired,
  activeItem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.oneOf(['performance', 'storage']).isRequired,
};

export default Select;
