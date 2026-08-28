'use client';

import { useCallback, useState } from 'react';

import StartupAnimation from './startup-animation';
import StartupLogos from './startup-logos';

const StartupExperience = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const handleStart = useCallback(() => setHasStarted(true), []);

  return (
    <>
      <StartupLogos isActive={hasStarted} />
      <StartupAnimation onStart={handleStart} />
    </>
  );
};

export default StartupExperience;
