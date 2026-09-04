'use client';

import { domAnimation, LazyMotion, useMotionValue } from 'framer-motion';
import { useCallback, useState } from 'react';

import StartupAnimation from './startup-animation';
import StartupLogos from './startup-logos';

const StartupExperience = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const timelineElapsed = useMotionValue(0);
  const handleStart = useCallback(() => setHasStarted(true), []);

  return (
    <LazyMotion features={domAnimation}>
      <StartupLogos isActive={hasStarted} timelineElapsed={timelineElapsed} />
      <StartupAnimation onStart={handleStart} timelineElapsed={timelineElapsed} />
    </LazyMotion>
  );
};

export default StartupExperience;
