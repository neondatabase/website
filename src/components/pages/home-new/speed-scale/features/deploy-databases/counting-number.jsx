import { useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

const CountingNumber = ({
  number,
  fromNumber = 0,
  inView = false,
  thousandsSeparator = ',',
  transition = { stiffness: 280, damping: 50 },
  delay = 0,
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
    if (inView) {
      // Apply delay only when starting animation (convert seconds to milliseconds)
      const timeoutId = setTimeout(() => {
        motionVal.set(number);
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }
    // Reset instantly without delay when out of view
    springVal.jump(fromNumber);
    motionVal.jump(fromNumber);
  }, [inView, number, motionVal, springVal, delay, fromNumber]);

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

  const initialText = addThousandsSeparator(fromNumber.toString(), thousandsSeparator);

  return (
    <span ref={ref} data-slot="counting-number" {...props}>
      {initialText}
    </span>
  );
};

CountingNumber.propTypes = {
  number: PropTypes.number.isRequired,
  fromNumber: PropTypes.number,
  inView: PropTypes.bool,
  thousandsSeparator: PropTypes.string,
  transition: PropTypes.object,
  delay: PropTypes.number,
};

export default CountingNumber;
