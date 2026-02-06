'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';

export const RESOURCE_SIZES = [
  { id: 'small', label: 'Small project', cu: 50, storage: 15 },
  { id: 'medium', label: 'Medium project', cu: 140, storage: 40 },
  { id: 'large', label: 'Large project', cu: 300, storage: 80 },
];

const ResourceSizeSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = RESOURCE_SIZES.find((size) => size.id === value) || RESOURCE_SIZES[1];

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
        className="flex h-12 w-full items-center justify-between border border-b-0 border-gray-new-30 bg-gray-new-8 px-6 py-4 md:border-b md:px-5"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-sm leading-none tracking-extra-tight text-white">
          {selectedOption.label} ({selectedOption.cu} CU / {selectedOption.storage} GB)
        </span>
        <ChevronIcon
          className={clsx(
            'h-3 w-3 text-white transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 top-full z-20 flex w-full flex-col gap-y-[5px] border border-gray-new-30 bg-gray-new-8 py-2"
          role="listbox"
        >
          {RESOURCE_SIZES.map((option) => {
            const isSelected = option.id === value;

            return (
              <li className="group transition-colors hover:bg-gray-new-15" key={option.id}>
                <button
                  type="button"
                  className={clsx(
                    'h-[34px] w-full px-6 text-left font-mono text-sm leading-none tracking-extra-tight transition-colors',
                    isSelected ? 'text-white' : 'text-gray-new-80 group-hover:text-white'
                  )}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.id)}
                >
                  {option.label} ({option.cu} CU / {option.storage} GB)
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

ResourceSizeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ResourceSizeSelect;
