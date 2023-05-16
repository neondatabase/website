import { useEffect, useState } from 'react';

const COMMAND = '⌘';
const CTRL = 'Ctrl';

const useControlKey = () => {
  const [commandKey, setCommandKey] = useState(COMMAND);
  useEffect(() => {
    const { userAgent } = window.navigator;
    setCommandKey(userAgent.indexOf('Mac') !== -1 ? COMMAND : CTRL);
  }, []);
  return [commandKey];
};

export default useControlKey;
