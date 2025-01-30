import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const Steps = ({ children }) => {
  // Split content into steps by h2 headings
  const steps = [];
  let currentStep = [];

  React.Children.toArray(children).forEach((child) => {
    // Determine if the child is a h2 heading
    const isHeading =
      (typeof child.type === 'string' && child.type === 'h2') ||
      (typeof child.type === 'function' && child.type.displayName === 'h2');

    // Start a new step if the current child is a h2 heading
    if (isHeading) {
      if (currentStep.length > 0) {
        steps.push(currentStep);
      }
      currentStep = [];
    }

    currentStep.push(child);
  });

  if (currentStep.length > 0) {
    steps.push(currentStep);
  }

  return (
    <ol
      className="numbered-steps !mt-0 inline-flex w-full flex-col !pl-0"
      style={{
        counterReset: 'section',
      }}
    >
      {steps.map((step, index) => (
        <li
          className={clsx(
            'numbered-step relative !mb-0 !mt-10 flex w-full items-start gap-3 !pl-0',
            'before:mt-1 before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-gray-new-15 before:text-sm before:leading-snug before:tracking-extra-tight before:text-white before:content-[counter(section)] before:[counter-increment:section]',
            'after:absolute after:left-3 after:top-[34px] after:h-[calc(100%+4px)] after:w-px after:bg-gray-new-80',
            'first:!mt-7 last:overflow-hidden',
            'dark:before:bg-gray-new-94 dark:before:text-black-new dark:after:bg-gray-new-15',
            '[&_ol]:!list-decimal'
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

export default Steps;

Steps.propTypes = {
  children: PropTypes.node.isRequired,
};
