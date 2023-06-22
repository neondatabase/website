import PropTypes from 'prop-types';

import useLottie from 'hooks/use-lottie';

const Icon = ({ animationData, isInView }) => {
  const { animationRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { threshold: 0.5 },
    isInView,
  });

  return <div ref={animationRef} />;
};

Icon.propTypes = {
  animationData: PropTypes.shape({}).isRequired,
  isInView: PropTypes.bool.isRequired,
};

export default Icon;
