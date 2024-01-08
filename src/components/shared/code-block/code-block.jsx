import clsx from 'clsx';
import PropTypes from 'prop-types';

import CodeBlockWrapper from '../code-block-wrapper';

const CodeBlock = async ({
  className = null,
  copyButtonClassName = null,
  children,
  shouldWrap = false,
  ...otherProps
}) => (
  <CodeBlockWrapper copyButtonClassName={copyButtonClassName}>
    <pre
      className={clsx(
        '!my-0 !bg-gray-new-98 dark:!bg-gray-new-10',
        { 'code-wrap': shouldWrap },
        className
      )}
      {...otherProps}
    >
      {children}
    </pre>
  </CodeBlockWrapper>
);

CodeBlock.propTypes = {
  className: PropTypes.string,
  copyButtonClassName: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  language: PropTypes.string,
  children: PropTypes.node,
  showLineNumbers: PropTypes.bool,
  shouldWrap: PropTypes.bool,
  isTrimmed: PropTypes.bool,
  highlight: PropTypes.string,
  as: PropTypes.oneOf(['figure', 'pre']),
  isBlogPost: PropTypes.bool,
};

export default CodeBlock;
