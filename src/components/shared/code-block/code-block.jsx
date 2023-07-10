'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

const DEFAULT_LANGUAGE = 'bash';

function parseHighlightRanges(highlight) {
  const ranges = highlight.split(',');
  let highlightedLines = [];

  ranges.forEach((range) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      const rangeLines = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      highlightedLines = [...highlightedLines, ...rangeLines];
    } else {
      highlightedLines.push(Number(range));
    }
  });

  return highlightedLines;
}

const CodeBlock = ({
  className = null,
  language = null,
  children,
  showLineNumbers = false,
  shouldWrap = false,
  isTrimmed = true,
  highlight = '',
  as: Tag = 'div',
  isBlogPost = false,
  ...otherProps
}) => {
  const { resolvedTheme: theme } = useTheme();

  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const snippetLanguage = (match ? match[1] : language) || DEFAULT_LANGUAGE;

  const code = typeof children === 'string' ? children : children?.props?.children.props.children;

  const content = isTrimmed ? code?.trim() : code;

  const highlightedLines = parseHighlightRanges(highlight);

  return (
    <Tag className={clsx('group relative', { 'code-wrap': shouldWrap }, className)} {...otherProps}>
      <SyntaxHighlighter
        language={snippetLanguage}
        useInlineStyles={false}
        showLineNumbers={showLineNumbers || highlight !== ''}
        className="no-scrollbars"
        lineProps={(lineNumber) => ({
          style: {
            display: 'flex',
            position: 'relative',
            padding: isBlogPost ? '1.5px 24px' : '1.5px 16px',
            marginLeft: isBlogPost ? '-1.5rem' : '-1rem',
            marginRight: isBlogPost ? '-1.5rem' : '-1rem',
            backgroundColor:
              highlightedLines.includes(lineNumber) &&
              (theme === 'dark' || isBlogPost
                ? 'rgba(0, 229, 153, 0.08)'
                : 'rgba(0, 85, 255, 0.08)'),
            boxShadow:
              highlightedLines.includes(lineNumber) &&
              (theme === 'dark' || isBlogPost
                ? 'inset 3px 0px 0px 0px #00E599'
                : 'inset 3px 0px 0px 0px #0055ff'),
          },
        })}
        wrapLines={highlight !== ''}
      >
        {content}
      </SyntaxHighlighter>
      <button
        className="invisible absolute right-2 top-2 rounded border border-gray-6 bg-white p-1.5 text-gray-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100"
        type="button"
        aria-label={isCopied ? 'Copied' : 'Copy'}
        disabled={isCopied}
        onClick={() => handleCopy(content)}
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-current" />
        ) : (
          <CopyIcon className="text-current" />
        )}
      </button>
    </Tag>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
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
