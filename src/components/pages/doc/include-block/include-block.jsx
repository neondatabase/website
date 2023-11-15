import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import { DOCS_DIR_PATH, getPostBySlug } from 'utils/api-docs';

const IncludeBlock = ({ url }) => {
  const post = getPostBySlug(url, DOCS_DIR_PATH);

  return <Content content={post.content} />;
};

IncludeBlock.propTypes = {
  url: PropTypes.string.isRequired,
};

export default IncludeBlock;
