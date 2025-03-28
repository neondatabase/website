import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
import Content from 'components/shared/content';
import { DOCS_DIR_PATH } from 'constants/content';
import { getPostBySlug } from 'utils/api-docs';

const IncludeBlock = ({ url, ...props }) => {
  // For local files, continue with existing logic
  try {
    const post = getPostBySlug(url, DOCS_DIR_PATH);

    // Safety check to avoid null reference errors
    if (!post) {
      return <div className="text-red-500 p-4">Failed to load content: {url}</div>;
    }

    // Replace placeholders with actual prop values
    let contentWithProps = post.content;
    Object.entries(props).forEach(([key, value]) => {
      contentWithProps = contentWithProps.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return <Content content={contentWithProps} />;
  } catch (error) {
    console.error(`Error loading content for ${url}:`, error);
    return <div className="text-red-500 p-4">Error loading content: {url}</div>;
  }
};

IncludeBlock.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
  param1: PropTypes.string,
  param2: PropTypes.string,
};

export default IncludeBlock;
