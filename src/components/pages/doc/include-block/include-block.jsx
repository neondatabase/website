import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
import Content from 'components/shared/content';
import { DOCS_DIR_PATH } from 'constants/docs';
import { getPostBySlug } from 'utils/api-docs';

const IncludeBlock = ({ url }) => {
  const post = getPostBySlug(url, DOCS_DIR_PATH);

  return <Content content={post.content} />;
};

IncludeBlock.propTypes = {
  url: PropTypes.string.isRequired,
};

export default IncludeBlock;
