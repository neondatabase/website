'use client';

import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';
import { cn } from 'utils/cn';

const LANGUAGE_BY_LABEL = {
  'REST API': 'bash',
  CLI: 'bash',
  curl: 'bash',
  SDK: 'typescript',
  MCP: 'json',
  JSON: 'json',
};

const ApiCodeBlock = ({
  label,
  descriptor = null,
  code = null,
  children = null,
  className = '',
  language: languageProp = null,
  preClassName = '',
  copyCode = null,
  wrap = true,
  showFilename = true,
}) => {
  const filename = descriptor ? `${label} - ${descriptor}` : label;
  const language =
    languageProp ?? LANGUAGE_BY_LABEL[descriptor] ?? LANGUAGE_BY_LABEL[label] ?? 'text';
  const [highlightedHtml, setHighlightedHtml] = useState('');

  useEffect(() => {
    let cancelled = false;

    if (!code || children) {
      setHighlightedHtml('');
      return () => {
        cancelled = true;
      };
    }

    highlight(code, language).then((result) => {
      if (!cancelled) setHighlightedHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [children, code, language]);

  return (
    <CodeBlockWrapper
      className={cn(
        'max-w-full min-w-0 overflow-hidden rounded-none border border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-pure [&_.line]:text-sm [&_code]:text-sm [&_pre]:text-sm [&_pre]:leading-relaxed [&>pre]:my-0 [&>pre]:max-w-full [&>pre]:overflow-x-auto [&>pre]:rounded-none [&>pre]:bg-white! [&>pre]:py-4 [&>pre]:dark:bg-black-pure!',
        className
      )}
      filename={showFilename ? filename : null}
      language={language}
      copyCode={copyCode ?? code}
    >
      {highlightedHtml ? (
        parse(highlightedHtml)
      ) : (
        <pre
          className={cn(
            'overflow-x-auto bg-white p-4 font-mono text-sm leading-relaxed text-gray-new-20 dark:bg-black-pure dark:text-gray-new-80',
            wrap ? 'whitespace-pre-wrap' : 'whitespace-pre',
            preClassName
          )}
          data-language={language}
        >
          <code>{children ?? code}</code>
        </pre>
      )}
    </CodeBlockWrapper>
  );
};

ApiCodeBlock.propTypes = {
  label: PropTypes.string.isRequired,
  descriptor: PropTypes.string,
  code: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  language: PropTypes.string,
  preClassName: PropTypes.string,
  copyCode: PropTypes.string,
  wrap: PropTypes.bool,
  showFilename: PropTypes.bool,
};

export default ApiCodeBlock;
