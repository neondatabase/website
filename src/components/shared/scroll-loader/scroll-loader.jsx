'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const ScrollLoader = ({ itemsCount, children }) => {
  const [triggerRef, isTriggerInView] = useInView({ rootMargin: '200px' });
  const [isStarted, setIsStarted] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(0);

  useEffect(() => {
    if (isTriggerInView) {
      setItemsVisible((prev) => prev + itemsCount);
      setIsStarted(true);
    }
  }, [itemsCount, isTriggerInView]);

  return (
    <>
      {isStarted && children.slice(0, itemsVisible)}
      <span className="w-full" ref={triggerRef} />
    </>
  );
};

ScrollLoader.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default ScrollLoader;
