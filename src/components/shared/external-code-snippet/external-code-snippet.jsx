import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

/**
 * ExternalCodeSnippet component that fetches and displays raw code from external files at build time
 */
const ExternalCodeSnippet = async ({
  url,
  language = '',
  className = '',
  fallback = 'Failed to load code snippet',
  showSource = true,
  title = '',
}) => {
  if (!url) {
    return (
      <CodeBlockWrapper className={clsx('bg-gray-new-98 dark:bg-gray-new-10', className)}>
        <div className="p-4 text-gray-new-50">URL is required for ExternalCodeSnippet</div>
      </CodeBlockWrapper>
    );
  }

  try {
    const response = await fetch(url, { cache: 'force-cache' }); // Fetch once at build time with caching

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const code = await response.text();

    // Determine language from file extension if not provided
    const fileExtension = url.split('.').pop();
    const detectedLanguage = language || fileExtension;

    // Highlight the code using shiki
    const html = await highlight(code, detectedLanguage);

    return (
      <div className={clsx('code-snippet', className)}>
        {title && <h4 className="text-md mb-2 font-medium">{title}</h4>}
        <CodeBlockWrapper className="[&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10">
          {parse(html)}
          {showSource && (
            <div className="mt-2 text-right text-xs text-gray-new-50">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                View source
              </a>
            </div>
          )}
        </CodeBlockWrapper>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching external code snippet from ${url}:`, error);
    // Return fallback content if fetch fails
    return (
      <CodeBlockWrapper className={clsx('bg-gray-new-98 dark:bg-gray-new-10', className)}>
        <div className="p-4 text-gray-new-50">{fallback}</div>
      </CodeBlockWrapper>
    );
  }
};

ExternalCodeSnippet.propTypes = {
  url: PropTypes.string.isRequired,
  language: PropTypes.string,
  className: PropTypes.string,
  fallback: PropTypes.string,
  showSource: PropTypes.bool,
  title: PropTypes.string,
};

export default ExternalCodeSnippet;
