import { useRef } from 'react';

const useAbortController = () => {
  const abortControllerRef = useRef(new AbortController());

  const getSignal = () => abortControllerRef.current.signal;

  const resetAbortController = () => {
    console.log('resetting');
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  return { getSignal, resetAbortController };
};

export default useAbortController;
