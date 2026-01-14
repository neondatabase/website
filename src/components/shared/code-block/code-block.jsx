import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import highlight from 'lib/shiki';

import CodeBlockWrapper from '../code-block-wrapper';

const getFileNameFromMeta = (meta) => {
  if (!meta) return null;

  // Support only: filename=
  // Examples:
  // ```js filename=src/app.js
  const match = meta.match(/\bfilename=(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  return match ? match[1] || match[2] || match[3] : null;
};

const CodeBlock = async ({
  className = null,
  copyButtonClassName = null,
  children,
  ...otherProps
}) => {
  const language = children?.props?.className?.replace('language-', '') || 'text';
  const meta = children?.props?.meta || '';
  const filename = getFileNameFromMeta(meta);
  const code = children?.props?.children?.trim() || '';
  const html = await highlight(code, language, meta);

  return (
    <CodeBlockWrapper
      className={clsx(
        'rounded-lg border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10',
        className,
        { 'code-wrap': meta?.includes('shouldWrap') }
      )}
      filename={filename}
      data-line-numbers={meta?.includes('showLineNumbers')}
      copyButtonClassName={copyButtonClassName}
      {...otherProps}
    >
      {parse(html)}
    </CodeBlockWrapper>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  copyButtonClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CodeBlock;
