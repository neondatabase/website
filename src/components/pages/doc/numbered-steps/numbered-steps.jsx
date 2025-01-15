import clsx from 'clsx';
import PropTypes from 'prop-types';

const NumberedSteps = ({ children }) => {
  const steps = [];
  let step = null;

  // Split the children into steps
  children.forEach((child) => {
    if (
      step === null ||
      (typeof child.props.children === 'string' && child.props.children.startsWith('Step'))
    ) {
      if (step) {
        steps.push(step);
      }
      step = [];
    }
    step.push(child);
  });
  if (step) {
    steps.push(step);
  }

  return (
    <ol
      className="!mt-0 inline-flex w-full flex-col !pl-0"
      style={{
        counterReset: 'section',
      }}
    >
      {steps.map((step, index) => (
        <li
          className={clsx(
            'relative !mb-0 !mt-10 flex w-full items-start gap-3 !pl-0',
            'before:mt-1 before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-gray-new-15 before:text-sm before:leading-snug before:tracking-extra-tight before:text-white before:content-[counter(section)] before:[counter-increment:section]',
            'after:absolute after:left-3 after:top-[34px] after:h-[calc(100%+4px)] after:w-px after:bg-gray-new-80',
            'first:!mt-7 last:overflow-hidden',
            'dark:before:bg-gray-new-94 dark:before:text-black-new dark:after:bg-gray-new-15'
          )}
          key={index}
        >
          <div className="w-[calc(100%-100px)] flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {step}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default NumberedSteps;

NumberedSteps.propTypes = {
  children: PropTypes.node.isRequired,
};
