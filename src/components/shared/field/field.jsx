import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const Field = ({ className, name, label, type, tag: Tag }) => (
  <div className={clsx('flex flex-col items-start', className)}>
    <label className="leading-none" htmlFor={name}>
      {label}
    </label>
    <Tag
      className={clsx(
        'remove-autocomplete-styles mt-2.5 w-full rounded border-[3px] border-transparent bg-[#404040] px-4 py-3.5 text-lg leading-none outline-none transition-colors duration-200 focus:border-primary-1 focus:bg-black',
        Tag === 'input' && 'h-14',
        Tag === 'textarea' && 'min-h-[112px]'
      )}
      id={name}
      name={name}
      type={type}
    />
  </div>
);

Field.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  tag: PropTypes.oneOf(['input', 'textarea']),
};

Field.defaultProps = {
  className: null,
  type: 'text',
  tag: 'input',
};

export default Field;
