import PropTypes from 'prop-types';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import Button from 'components/shared/button';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

const DEFAULT_LANGUAGE = 'bash';

const CodeBlock = ({ className, children, ...otherProps }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;
  const code = children.trim();

  return (
    <div className="group relative" {...otherProps}>
      <SyntaxHighlighter language={language} useInlineStyles={false}>
        {code}
      </SyntaxHighlighter>
      <Button
        className="invisible absolute top-2 right-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100"
        type="button"
        size="xxs"
        theme="secondary"
        disabled={isCopied}
        onClick={() => handleCopy(code)}
      >
        {isCopied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CodeBlock.defaultProps = {
  className: null,
};

export default CodeBlock;
