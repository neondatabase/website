import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const UPDATE_INTERVAL = 30;
const SCRAMBLE_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyz!?></\\~+*=@#$%';
const STATIC_CHARACTER_PATTERN = /[\s.,:/_-]/u;

const easeInOut = (progress) => progress * progress * (3 - 2 * progress);

const getScrambledText = (text, revealLength) =>
  Array.from(text, (character, index) => {
    if (index < revealLength || STATIC_CHARACTER_PATTERN.test(character)) {
      return character;
    }

    return SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)];
  }).join('');

const ScrambleText = ({ text, isActive, delay, duration, shouldReduceMotion }) => {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef();

  useEffect(() => {
    if (!isActive || shouldReduceMotion) {
      setDisplayText(text);
      return undefined;
    }

    setDisplayText(getScrambledText(text, 0));

    const delayMs = delay * 1000;
    const durationMs = duration * 1000;
    let startTime;
    let lastUpdate = 0;

    const animate = (currentTime) => {
      if (startTime === undefined) {
        startTime = currentTime;
      }
      const elapsed = currentTime - startTime;

      if (elapsed < delayMs) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const animationElapsed = elapsed - delayMs;
      const progress = Math.min(animationElapsed / durationMs, 1);

      if (animationElapsed - lastUpdate >= UPDATE_INTERVAL || progress === 1) {
        const revealLength = Math.floor(text.length * easeInOut(progress));
        setDisplayText(progress === 1 ? text : getScrambledText(text, revealLength));
        lastUpdate = animationElapsed;
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [delay, duration, isActive, shouldReduceMotion, text]);

  return (
    <m.span
      className="relative inline-block overflow-hidden align-bottom"
      aria-label={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0 : 0.08,
      }}
      data-scramble-text=""
    >
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden="true">
        {displayText}
      </span>
    </m.span>
  );
};

ScrambleText.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  shouldReduceMotion: PropTypes.bool,
};

export default ScrambleText;
