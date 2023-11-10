import clsx from 'clsx';
import PropTypes from 'prop-types';

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
  info: 'border-gray-new-70',
};

const Admonition = ({ children = null, type = 'note', title = null }) => (
  <div
    className={clsx(
      'admonition not-prose mt-5 flex flex-col rounded-[1px] border-l-4 bg-gray-new-98 px-5 py-4 leading-normal dark:bg-gray-new-10',
      borderClassNames[type]
    )}
  >
    <h4 className={clsx('text-xs font-bold uppercase', titleClassNames[type])}>{title || type}</h4>
    <div className="admonition-text mt-1.5 text-base">{children}</div>
  </div>
);

Admonition.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(titleClassNames)),
  title: PropTypes.string,
};

export default Admonition;
