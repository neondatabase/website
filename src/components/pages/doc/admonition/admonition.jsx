import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const titleClassNames = {
  note: 'text-[#4C97FF]',
  important: 'text-[#FFBB33]',
  tip: 'text-primary-2',
  warning: 'text-secondary-1',
  info: 'text-gray-5',
};

const borderClassNames = {
  note: 'border-[#4C97FF]',
  important: 'border-[#FFBB33]',
  tip: 'border-primary-2',
  warning: 'border-secondary-1',
  info: 'border-gray-5',
};

const Admonition = ({ children, type, title }) => (
  <div
    className={clsx(
      'not-prose mt-8 flex flex-col rounded-[1px] border-l-4 bg-gray-9 px-5 py-4',
      borderClassNames[type]
    )}
  >
    <span className={clsx('text-xs font-bold uppercase', titleClassNames[type])}>
      {title || type}
    </span>
    <div className="mt-1.5 text-base leading-normal">{children}</div>
  </div>
);

Admonition.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(titleClassNames)),
  title: PropTypes.string,
};

Admonition.defaultProps = {
  children: null,
  type: 'note',
  title: null,
};

export default Admonition;
