/* eslint-disable react/prop-types */
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import Button from 'components/shared/button';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

const DEFAULT_LANGUAGE = 'bash';

const CodeBlock = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;
  const code = children.trim();

  const { isCopied, handleCopy } = useCopyToClipboard(3000);
  return (
    <div className="group code-block relative" {...props}>
      <SyntaxHighlighter language={language} style={prism}>
        {code}
      </SyntaxHighlighter>
      <Button
        className="invisible absolute top-4 right-6 rounded font-semibold uppercase opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100"
        type="button"
        size="xxs"
        theme="gray-2"
        disabled={isCopied}
        onClick={() => handleCopy(code)}
      >
        {isCopied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
};
export default CodeBlock;
