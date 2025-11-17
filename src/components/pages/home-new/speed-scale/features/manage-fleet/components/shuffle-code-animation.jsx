import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const SPEED = 30; // Update characters every 30ms

const customEase = (t) => t * t * (3 - 2 * t);

const DICTIONARY = '0123456789abcdefghijklmnopqrstuvwxyz!?></\\~+*=@#$%'.split('');

const getRandomIndex = () => Math.floor(Math.random() * DICTIONARY.length);

const generateRandomString = (length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += DICTIONARY[getRandomIndex()];
  }
  return result;
};

const ShuffleCodeAnimation = ({ targetText, isActive, duration, className }) => {
  const [textParts, setTextParts] = useState({
    revealed: '',
    random: generateRandomString(targetText.length),
  });
  const frameRef = useRef();
  const startTimeRef = useRef(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setTextParts({ revealed: targetText, random: '' });
      return undefined;
    }

    startTimeRef.current = performance.now();
    lastUpdateRef.current = 0;
    const stringLength = targetText.length;
    const durationMs = duration * 1000;
    const shufflePhase = durationMs * 0.1; // 10% of time for shuffle
    const revealPhase = durationMs * 0.9; // 90% of time for reveal

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;

      if (elapsed < shufflePhase) {
        // Show random characters with throttling
        if (elapsed - lastUpdateRef.current >= SPEED) {
          setTextParts({ revealed: '', random: generateRandomString(stringLength) });
          lastUpdateRef.current = elapsed;
        }
      } else if (elapsed < durationMs) {
        // Gradually reveal target text with throttling
        if (elapsed - lastUpdateRef.current >= SPEED) {
          const linearProgress = (elapsed - shufflePhase) / revealPhase;
          const revealProgress = customEase(linearProgress);
          const revealedLength = Math.floor(stringLength * revealProgress);
          const revealedPart = targetText.slice(0, revealedLength);
          const randomPart = generateRandomString(stringLength - revealedPart.length);
          setTextParts({ revealed: revealedPart, random: randomPart });
          lastUpdateRef.current = elapsed;
        }
      } else {
        // Animation complete
        setTextParts({ revealed: targetText, random: '' });
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetText, isActive, duration]);

  return (
    <span className={className}>
      <span className="text-white">{textParts.revealed}</span>
      <span className="text-[#6b6d73]">{textParts.random}</span>
    </span>
  );
};

ShuffleCodeAnimation.propTypes = {
  targetText: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default ShuffleCodeAnimation;
