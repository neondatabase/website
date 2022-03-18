/* eslint-disable react/prop-types */
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import dockerfile from 'react-syntax-highlighter/dist/esm/languages/hljs/dockerfile';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';

import Button from 'components/shared/button';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

/* TODO: figure out why importing styles from react-syntax-highlighter doesn't work
and remove hightlight.js from project deps */
import 'highlight.js/styles/ir-black.css';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('dockerfile', dockerfile);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('typescript', typescript);

const DEFAULT_LANGUAGE = 'bash';

const CodeBlock = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;
  const code = children.trim();

  const { isCopied, handleCopy } = useCopyToClipboard(3000);
  return (
    <div className="group code-block relative" {...props}>
      <SyntaxHighlighter language={language} style={monokai} useInlineStyles={false}>
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
