import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

const Select = ({
  className = null,
  containerRef,
  activeItem,
  isExpanded,
  onSelect,
  onExpand,
  items,
  type,
}) => (
  <LazyMotion features={domAnimation}>
    <div className="mt-7 relative">
      <div
        className={clsx(
          'border rounded-[10px] border-gray-new-15 absolute inset-x-0 top-0 after:absolute after:-inset-px after:rounded-[10px] after:p-px',
          className
        )}
        ref={containerRef}
      >
        <div className="relative z-10 bg-black-new rounded-[10px]">
          <button
            className={clsx(
              'bg-black-new rounded-[10px] w-full flex items-center pt-5 px-6 pb-6',
              isExpanded && 'rounded-b-none'
            )}
            type="button"
            onClick={onExpand}
          >
            <div className="flex flex-col items-start">
              <h4 className="text-xl font-medium leading-tight">{activeItem.title}</h4>
              <p className="text-left mt-2 text-gray-new-70 font-light leading-tight text-[15px]">
                {activeItem.description}
              </p>
            </div>
            <span className="relative flex ml-auto h-6 w-6 items-center justify-center rounded before:absolute before:inset-px before:rounded bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_31.25%,rgba(255,255,255,0.05)_100%)] before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
              <span className="relative w-1.5">
                <span
                  className={clsx(
                    'absolute -left-[0.5px] top-1/2 h-[9px] w-[1.5px] -translate-y-1/2 rounded-b-sm bg-gray-new-80 transition-transform duration-200 group-hover:bg-gray-40',
                    isExpanded ? 'rotate-45' : 'rotate-[135deg]'
                  )}
                />
                <span
                  className={clsx(
                    'absolute left-[5px] top-1/2 h-[9px] w-[1.5px] -translate-y-1/2 rounded-b-sm bg-gray-new-80 transition-transform duration-200 group-hover:bg-gray-40',
                    isExpanded ? '-rotate-45' : '-rotate-[135deg]'
                  )}
                />
              </span>
            </span>
          </button>

          <AnimatePresence mode="wait">
            {isExpanded ? (
              <m.ul
                className="relative z-10 max-h-[232px] overflow-y-auto"
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  transition: {
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                      delay: 0.15,
                    },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                    },
                  },
                }}
              >
                {items.map(({ title, description }) => {
                  const value = description
                    .replace(/\/ GiB-hour/g, '/h')
                    .replace('Starts from', '≥');
                  return (
                    <li className="group" key={title}>
                      <button
                        className={clsx(
                          'relative z-10 py-[15px] w-full border-t border-gray-new-15 flex items-center justify-between px-6 text-[15px] duration-200 transition-colors group-last:rounded-b-[10px] group-last:border-t-gray-new-15/60 hover:bg-white hover:bg-opacity-[3%]',
                          activeItem.title === title && 'bg-white bg-opacity-[3%]'
                        )}
                        type="button"
                        onClick={() => onSelect(type, title, description)}
                      >
                        <h4 className="leading-tight">{title}</h4>
                        <p className="text-gray-new-70 font-light leading-tight">{value}</p>
                      </button>
                    </li>
                  );
                })}
              </m.ul>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </LazyMotion>
);

Select.propTypes = {
  className: PropTypes.string,
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
