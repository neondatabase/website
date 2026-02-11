'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import InfoIcon from 'components/shared/info-icon';
import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';

export const LAUNCH_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 360, storage: 5 },
  { id: 'large', cu: 720, storage: 10 },
  { id: 'xlarge', cu: 2900, storage: 100 },
];

export const SCALE_RESOURCE_SIZES = [
  { id: 'small', cu: 140, storage: 1 },
  { id: 'medium', cu: 360, storage: 5 },
  { id: 'large', cu: 720, storage: 10 },
  { id: 'xlarge', cu: 2995, storage: 100 },
  { id: '2xlarge', cu: 6000, storage: 1000 },
];

const getLoadType = (cuHours) => {
  if (cuHours < 187.5) return 'Intermittent Load';
  if (cuHours < 375) return 'Low Load';
  if (cuHours <= 750) return 'Medium Load';
  if (cuHours <= 3000) return 'High Load';
  return 'XL Load';
};

const ResourceSizeSelect = ({ value, onChange, sizes = LAUNCH_RESOURCE_SIZES, planId = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = sizes?.find((size) => size.id === value) || sizes?.[1] || sizes?.[0];

  // Generate dynamic tooltip text
  const tooltipText = `Estimated cost of a ${selectedOption.cu} CU-hour, ${selectedOption.storage} GB database workload.`;

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
      <div className="flex flex-nowrap items-center gap-1 text-[15px] leading-snug tracking-extra-tight text-gray-new-60">
        <span className="whitespace-nowrap">Based on:</span>
        <button
          type="button"
          className="group inline-flex flex-shrink-0 items-center gap-1 rounded border border-gray-new-20 px-1.5 py-0.5 transition-colors hover:border-gray-new-30"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="whitespace-nowrap text-gray-new-80">
            {getLoadType(selectedOption.cu)}, {selectedOption.storage} GB
          </span>
          <ChevronIcon
            className={clsx(
              'h-3 w-3 flex-shrink-0 text-gray-new-60 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            aria-hidden
          />
        </button>
        <InfoIcon
          className="relative top-0.5 flex-shrink-0"
          tooltip={tooltipText}
          tooltipId={`resource-size-${planId}`}
          link={{
            text: 'Read more.',
            href: '#workload-cost-estimates',
          }}
          clickable
        />
      </div>

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
  planId: PropTypes.string,
};

export default ResourceSizeSelect;
