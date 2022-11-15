import { useEffect } from 'react';

const useBodyLockScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
};

export default useBodyLockScroll;
