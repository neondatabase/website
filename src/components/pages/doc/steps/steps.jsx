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
            'before:flex before:size-7 before:items-center before:justify-center before:border before:border-black-new before:p-1.5 before:text-center before:font-mono before:text-sm before:font-medium before:leading-snug before:tracking-tight before:text-black-new before:content-[counter(section)] before:[counter-increment:section]',
            'after:absolute after:-bottom-[36px] after:left-3.5 after:top-[32px] after:w-px after:bg-gray-new-80',
            'first:!mt-7 last:after:bottom-0',
            'dark:before:border dark:before:border-gray-new-20 dark:before:bg-transparent dark:before:text-gray-new-70 dark:after:bg-gray-new-15',
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
