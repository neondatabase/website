'use client';

import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';

import { cn } from 'utils/cn';

import Item from './item';

const DocsNavigation = forwardRef(
  ({ className = null, navigation, basePath, hiddenIndexes = [], ...props }, ref) => {
    const [activeItems, setActiveItems] = useState([]);

    return (
      <ul className={cn('no-scrollbars flex h-full gap-x-6', className)} ref={ref} {...props}>
        {navigation?.map((item, index) => (
          <Item
            key={index}
            {...item}
            basePath={basePath}
            isHidden={hiddenIndexes.includes(index)}
            activeItems={activeItems}
            setActiveItems={setActiveItems}
          />
        ))}
      </ul>
    );
  }
);

DocsNavigation.displayName = 'DocsNavigation';

DocsNavigation.propTypes = {
  className: PropTypes.string,
  navigation: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
  hiddenIndexes: PropTypes.arrayOf(PropTypes.number),
};

export default DocsNavigation;
