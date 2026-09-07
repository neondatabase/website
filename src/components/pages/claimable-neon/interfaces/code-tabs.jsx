'use client';

import PropTypes from 'prop-types';
import { useId, useRef, useState } from 'react';

import { cn } from 'utils/cn';

import { INTERFACES } from './data';

const CodeTabs = ({ children }) => {
  const groupId = useId();
  const tabRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedInterface = INTERFACES[selectedIndex];

  const handleKeyDown = (event, index) => {
    let nextIndex;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (index - 1 + INTERFACES.length) % INTERFACES.length;
        break;
      case 'ArrowRight':
        nextIndex = (index + 1) % INTERFACES.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = INTERFACES.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="dark min-w-0 self-start border border-gray-new-20 bg-black-pure">
      <div
        className="flex h-11 gap-5 border-b border-gray-new-20 bg-gray-new-10 pr-5 pl-5.5"
        role="group"
        aria-label="Claimable Neon code examples"
      >
        {INTERFACES.map(({ id, label }, index) => {
          const selected = index === selectedIndex;

          return (
            <button
              className={cn(
                'relative -mx-0.5 mb-0 cursor-pointer border-b px-0.5 pt-2.5 pb-3.25 text-sm leading-none font-medium tracking-extra-tight whitespace-nowrap transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-green-45 [&:focus:not(:focus-visible)]:outline-none',
                selected ? 'border-white text-white' : 'border-transparent text-gray-new-60'
              )}
              id={`${groupId}-${id}-tab`}
              key={id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              aria-controls={`${groupId}-panel`}
              aria-pressed={selected}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div
        className="min-h-80 md:min-h-72"
        id={`${groupId}-panel`}
        role="region"
        aria-labelledby={`${groupId}-${selectedInterface.id}-tab`}
      >
        {children[selectedIndex]}
        {selectedInterface.id === 'cli' && (
          <p className="px-6 pb-6 text-sm leading-snug tracking-extra-tight text-gray-new-60 md:px-5">
            If <code>neon claim</code> is not a command, use the auth.md example.
          </p>
        )}
      </div>
    </div>
  );
};

CodeTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CodeTabs;
