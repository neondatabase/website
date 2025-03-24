import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
import Content from 'components/shared/content';
import ExternalCodeSnippet from 'components/shared/external-code-snippet';
import { DOCS_DIR_PATH } from 'constants/content';
import { getPostBySlug } from 'utils/api-docs';

const IncludeBlock = ({ url, ...props }) => {
  // Check if URL is external (starts with http or https)
  const isExternal = url?.startsWith('http');

  // For external URLs, render the ExternalCodeSnippet component directly
  if (isExternal) {
    return <ExternalCodeSnippet url={url} {...props} />;
  }

  // For local files, continue with existing logic
  const post = getPostBySlug(url, DOCS_DIR_PATH);

  // Safety check to avoid null reference errors
  if (!post) {
    return <div>Failed to load content: {url}</div>;
  }

  // Replace placeholders with actual prop values
  let contentWithProps = post.content;
  Object.entries(props).forEach(([key, value]) => {
    contentWithProps = contentWithProps.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  return <Content content={contentWithProps} />;
};

IncludeBlock.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
  param1: PropTypes.string,
  param2: PropTypes.string,
};

export default IncludeBlock;
