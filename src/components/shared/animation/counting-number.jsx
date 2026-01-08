import { useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

const CountingNumber = ({
  number,
  fromNumber = 0,
  thousandsSeparator = ',',
  transition = { stiffness: 280, damping: 50 },
  delay = 0,
  started = false,
  ...props
}) => {
  const ref = useRef(null);

  const addThousandsSeparator = (numStr, separator) => {
    if (!separator) return numStr;
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  const motionVal = useMotionValue(fromNumber);
  const springVal = useSpring(motionVal, transition);

  useEffect(() => {
    if (started) {
      // Apply delay only when starting animation (convert seconds to milliseconds)
      const timeoutId = setTimeout(() => {
        motionVal.set(number);
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }
    // Reset instantly without delay when out of view
    springVal.jump(fromNumber);
    motionVal.jump(fromNumber);
  }, [started, number, motionVal, springVal, delay, fromNumber]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest).toString();
        const formatted = addThousandsSeparator(rounded, thousandsSeparator);
        ref.current.textContent = formatted;
      }
    });
    return () => unsubscribe();
  }, [springVal, thousandsSeparator, ref]);

  const finalText = addThousandsSeparator(number.toString(), thousandsSeparator);
  const initialText = addThousandsSeparator(fromNumber.toString(), thousandsSeparator);

  return (
    <span className="relative" data-slot="counting-number" {...props}>
      <span className="invisible opacity-0">{finalText}</span>
      <span className="absolute left-0" ref={ref}>
        {initialText}
      </span>
    </span>
  );
};

CountingNumber.propTypes = {
  number: PropTypes.number.isRequired,
  fromNumber: PropTypes.number,
  thousandsSeparator: PropTypes.string,
  transition: PropTypes.object,
  delay: PropTypes.number,
  started: PropTypes.bool,
};

export default CountingNumber;
