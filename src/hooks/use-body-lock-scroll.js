import { useEffect } from 'react';

const useBodyLockScroll = (isOpen) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);
};

export default useBodyLockScroll;
