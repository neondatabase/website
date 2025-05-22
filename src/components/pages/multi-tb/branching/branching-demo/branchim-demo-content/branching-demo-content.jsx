import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const BranchingDemoContent = ({
  title,
  description,
  button,
  handleNextStep,
  disabled = false,
  step,
}) => (
  <div className={clsx('z-20 flex flex-col items-start', step === 0 ? 'w-[400px]' : 'w-[312px]')}>
    <h3 className="mt-[45px] text-balance text-[28px] font-medium leading-tight tracking-tighter text-white lg:mt-[25px]">
      {title}
    </h3>
    <p className="mt-2.5 text-[15px] leading-snug tracking-extra-tight text-gray-new-70">
      {description}
    </p>
    <Button
      className="mt-[23px] h-8 px-4 text-[13px] font-medium leading-none tracking-extra-tight"
      theme={button.theme}
      disabled={disabled}
      onClick={handleNextStep}
    >
      {button.text}
    </Button>
  </div>
);

BranchingDemoContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  button: PropTypes.shape({
    text: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
  }).isRequired,
  handleNextStep: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  step: PropTypes.number.isRequired,
};

export default BranchingDemoContent;
