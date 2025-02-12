'use client';

import { useThrottleCallback } from '@react-hook/throttle';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';

const ScrollLoader = ({ className, itemsCount, children }) => {
  const [itemsVisible, setItemsVisible] = useState(itemsCount);
  const ref = useRef(null);

  const updateItemsVisible = useCallback(() => {
    const { clientHeight } = document.documentElement;
    const elBottom = ref.current?.getBoundingClientRect().bottom || 0;
    if (clientHeight >= elBottom - 200) {
      setItemsVisible((prev) => prev + itemsCount);
    }
  }, [itemsCount]);

  const onScroll = useThrottleCallback(updateItemsVisible, 100);

  useEffect(() => {
    updateItemsVisible();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll, updateItemsVisible]);

  return (
    <div className={className} ref={ref}>
      {children.slice(0, itemsVisible)}
    </div>
  );
};

ScrollLoader.propTypes = {
  className: PropTypes.string,
  itemsCount: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default ScrollLoader;
