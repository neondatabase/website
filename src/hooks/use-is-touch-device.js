import { useEffect, useState } from 'react';

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export default function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  return isTouch;
}
