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
    const timeoutId = setTimeout(() => {
      if (inView) motionVal.set(number);
      else motionVal.set(fromNumber);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [inView, number, motionVal, delay, fromNumber]);

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
