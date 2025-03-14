import { useState, useEffect } from 'react';

export default function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

    return () => {
      setIsSafari(false);
    };
  }, []);

  return isSafari;
}
