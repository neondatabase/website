import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import highlight from 'lib/shiki';
import { cn } from 'utils/cn';

import CodeBlockWrapper from '../code-block-wrapper';

const getFileNameFromMeta = (meta) => {
  if (!meta) return null;

  // Support only: filename=
  // Examples:
  // ```js filename=src/app.js
  const match = meta.match(/\bfilename=(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  return match ? match[1] || match[2] || match[3] : null;
};

const getTrackingLabelFromMeta = (meta) => {
  if (!meta) return null;

  // Support: trackingLabel="Copy neonctl init - docs intro"
  // Examples:
  // ```bash trackingLabel="Copy neonctl init - docs intro"
  const match = meta.match(/\btrackingLabel=(?:"([^"]+)"|'([^']+)'|(\S+))/i);
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
  const trackingLabel = getTrackingLabelFromMeta(meta);
  const code = (
    typeof children?.props?.children === 'string' ? children.props.children : ''
  ).trim();
  const html = await highlight(code, language, meta);

  return (
    <CodeBlockWrapper
      className={cn(
        'rounded-none border border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8 [&>pre]:my-0 [&>pre]:rounded-none [&>pre]:bg-transparent! [&>pre]:py-4 [&>pre]:pr-11',
        className,
        {
          'code-wrap': meta?.includes('shouldWrap'),
          // Line numbers and diff markers already draw in front of each line.
          'code-block-prompt': !meta?.includes('showLineNumbers'),
        }
      )}
      filename={filename}
      language={language}
      trackingLabel={trackingLabel}
      copyCode={code}
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
