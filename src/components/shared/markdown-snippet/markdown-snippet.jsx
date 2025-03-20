'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import Content from 'components/shared/content';
import serializeMdx from 'utils/serialize-mdx';

/**
 * MarkdownSnippet component that fetches and renders Markdown content from a URL
 *
 * @param {Object} props Component props
 * @param {string} props.url URL of the raw Markdown file to fetch
 * @param {string} props.className Optional CSS class to apply to the component
 * @param {string} props.fallback Optional fallback content to display if fetch fails
 * @param {boolean} props.showSource Optional flag to show a link to the source
 * @param {string} props.title Optional title for the snippet
 */
const MarkdownSnippet = ({
  url,
  className = '',
  fallback = 'Failed to load Markdown content',
  showSource = true,
  title = '',
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const mdxSource = await serializeMdx(text);
        setContent(mdxSource);
        setError(null);
      } catch (err) {
        // Error is handled by setting the error state
        setError(err);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchMarkdown();
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded bg-gray-new-98 p-4 dark:bg-gray-new-10">
        Loading snippet...
      </div>
    );
  }

  if (error || !content) {
    return (
      <CodeBlockWrapper className={clsx('bg-gray-new-98 dark:bg-gray-new-10', className)}>
        <div className="p-4 text-gray-new-50">{fallback}</div>
      </CodeBlockWrapper>
    );
  }

  return (
    <div className={clsx('markdown-snippet', className)}>
      {title && <h4 className="text-md mb-2 font-medium">{title}</h4>}
      <CodeBlockWrapper className="bg-gray-new-98 dark:bg-gray-new-10">
        <Content content={content} />
        {showSource && (
          <div className="mt-2 text-right text-xs text-gray-new-50">
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              View source
            </a>
          </div>
        )}
      </CodeBlockWrapper>
    </div>
  );
};

MarkdownSnippet.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.string,
  showSource: PropTypes.bool,
  title: PropTypes.string,
};

export default MarkdownSnippet;
