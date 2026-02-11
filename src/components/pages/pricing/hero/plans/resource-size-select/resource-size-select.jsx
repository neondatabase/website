'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';

export const LAUNCH_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 360, storage: 5 },
  { id: 'large', cu: 725, storage: 10 },
  { id: 'xlarge', cu: 2970, storage: 100 },
];

export const SCALE_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 360, storage: 5 },
  { id: 'large', cu: 725, storage: 10 },
  { id: 'xlarge', cu: 2970, storage: 100 },
  { id: '2xlarge', cu: 6000, storage: 1000 },
];

const getLoadType = (cuHours) => {
  if (cuHours < 187.5) return 'Intermittent Load';
  if (cuHours < 375) return 'Constant Load';
  if (cuHours <= 750) return 'Heavy Load';
  return 'Scaled Load';
};

const ResourceSizeSelect = ({ value, onChange, sizes = LAUNCH_RESOURCE_SIZES }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = sizes?.find((size) => size.id === value) || sizes?.[1] || sizes?.[0];

  useClickOutside([containerRef], () => setIsOpen(false));

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="group flex w-full items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[15px] leading-snug tracking-extra-tight text-gray-new-60">
          Based on:{' '}
          <span className="text-gray-new-80">
            {getLoadType(selectedOption.cu)}, {selectedOption.storage} GB
          </span>
        </span>
        <ChevronIcon
          className={clsx(
            'ml-1 h-3 w-3 flex-shrink-0 text-gray-new-60 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="absolute left-[-24px] top-full z-20 mt-3 w-[calc(100%+48px)] border border-gray-new-30 bg-black-pure md:left-[-20px] md:w-[calc(100%+40px)]">
          <ul className="flex flex-col" role="listbox">
            {sizes.map((option) => {
              const isSelected = option.id === value;
              const loadType = getLoadType(option.cu);

              return (
                <li
                  className="group border-b border-gray-new-20 transition-colors last:border-b-0 hover:bg-gray-new-8"
                  key={option.id}
                >
                  <button
                    type="button"
                    className={clsx(
                      'w-full px-6 py-4 text-left font-mono text-sm leading-none tracking-extra-tight transition-colors md:px-5',
                      isSelected ? 'text-white' : 'text-gray-new-70 group-hover:text-white'
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.id)}
                  >
                    {loadType} / {option.storage} GB
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

ResourceSizeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  sizes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cu: PropTypes.number.isRequired,
      storage: PropTypes.number.isRequired,
    })
  ),
};

export default ResourceSizeSelect;
