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
  const code = children?.props?.children?.trim() || '';
  const html = await highlight(code, language, meta);

  return (
    <CodeBlockWrapper
      className={clsx(
        'rounded-none border border-gray-new-90 dark:border-gray-new-20 [&>pre]:my-0 [&>pre]:rounded-none [&>pre]:!bg-gray-new-98 [&>pre]:py-4 [&>pre]:dark:!bg-transparent',
        className,
        { 'code-wrap': meta?.includes('shouldWrap') }
      )}
      filename={filename}
      trackingLabel={trackingLabel}
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
