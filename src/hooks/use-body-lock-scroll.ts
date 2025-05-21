import { useEffect } from 'react';

const useBodyLockScroll = (isOpen: boolean): void => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);
};

export default useBodyLockScroll;
