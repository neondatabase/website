'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';

export const LAUNCH_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 190, storage: 5 },
  { id: 'large', cu: 720, storage: 10 },
  { id: 'xlarge', cu: 3000, storage: 100 },
];

export const SCALE_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 190, storage: 5 },
  { id: 'large', cu: 720, storage: 10 },
  { id: 'xlarge', cu: 3000, storage: 100 },
  { id: '2xlarge', cu: 6000, storage: 1000 },
];

const getLoadType = (cuHours) => {
  if (cuHours < 187.5) return 'Intermittent load';
  if (cuHours < 375) return 'Low load';
  if (cuHours <= 750) return 'Medium load';
  if (cuHours <= 3000) return 'High load';
  return 'XL load';
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
      <div className="flex flex-nowrap items-center gap-1.5 text-[15px] leading-snug text-gray-new-60">
        <span className="flex-shrink-0 whitespace-nowrap tracking-extra-tight">Based on:</span>
        <button
          type="button"
          className="group flex flex-1 items-center justify-between truncate border border-gray-new-30 bg-gray-new-8 py-1 pl-2.5 pr-1 text-left tracking-extra-tight text-gray-new-80 transition-colors hover:bg-gray-new-15 focus-visible:bg-gray-new-15 focus-visible:outline-none"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate whitespace-nowrap text-gray-new-80">
            {getLoadType(selectedOption.cu)}, {selectedOption.storage} GB
          </span>
          <ChevronIcon
            className={clsx(
              'size-[15px] flex-shrink-0 text-white opacity-60 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            aria-hidden
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%-1px)] z-20 w-full border border-gray-new-30 bg-gray-new-8">
          <ul className="flex flex-col" role="listbox">
            {sizes.map((option) => {
              const isSelected = option.id === value;
              const loadType = getLoadType(option.cu);

              return (
                <li
                  className="group border-x-0 border-b border-t-0 border-gray-new-20 bg-gray-new-8 text-gray-new-80 transition-colors last:border-b-0 hover:bg-gray-new-15"
                  key={option.id}
                >
                  <button
                    type="button"
                    className={clsx(
                      'w-full px-2.5 py-2 text-left text-[15px] leading-snug tracking-extra-tight transition-colors'
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.id)}
                  >
                    {loadType} / {option.storage} GB Storage
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
