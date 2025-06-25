import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const BranchingDemoContent = ({
  title,
  description,
  button,
  handleNextStep,
  disabled = false,
  isLoading = false,
  step,
}) => (
  <div
    className={clsx(
      'z-20 flex flex-col items-start',
      step === 0 ? 'w-[400px] lg:w-[346px]' : 'w-[312px] lg:w-[270px]'
    )}
  >
    <h3 className="mt-[67px] text-balance text-[28px] font-medium leading-tight tracking-tighter text-white lg:mt-8 lg:text-[24px]">
      {title}
    </h3>
    <p
      className="mt-2.5 text-[15px] leading-snug tracking-extra-tight text-gray-new-70 lg:text-[14px]"
      dangerouslySetInnerHTML={{ __html: description }}
    />
    <div className="mt-[23px] lg:mt-[21px]">
      {step === 5 ? (
        <div className="flex gap-4">
          <Button
            className={clsx('h-8 px-4 text-[13px] font-medium leading-none tracking-extra-tight')}
            to={button.to}
            theme={button.theme}
          >
            {button.text}
          </Button>
          <Button
            className="text-[13px] font-medium"
            theme="white"
            withArrow
            onClick={handleNextStep}
          >
            Restart the demo
          </Button>
        </div>
      ) : (
        <Button
          className={clsx(
            'h-8 px-4 text-[13px] font-medium leading-none tracking-extra-tight',
            disabled && 'cursor-not-allowed',
            isLoading && 'cursor-progress'
          )}
          theme={button.theme}
          disabled={disabled}
          onClick={handleNextStep}
        >
          {button.text}
        </Button>
      )}
    </div>
  </div>
);

BranchingDemoContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  button: PropTypes.shape({
    text: PropTypes.string.isRequired,
    to: PropTypes.string,
    theme: PropTypes.string.isRequired,
  }).isRequired,
  handleNextStep: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  step: PropTypes.number.isRequired,
};

export default BranchingDemoContent;
