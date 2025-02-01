import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import { DOCS_DIR_PATH, getPostBySlug } from 'utils/api-docs';

const IncludeBlock = ({ url, ...props }) => {
  const post = getPostBySlug(url, DOCS_DIR_PATH);

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
