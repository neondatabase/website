import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

const CodeBlock = async (props) => {
  let codeContent = props.children;

  if (typeof codeContent === 'object') {
    // Stringify the object with indentation and preserving new lines
    codeContent = JSON.stringify(codeContent, null, 2);
  }

  const highlightCode = await highlight(codeContent, props.language);

  return <CodeBlockWrapper>{parse(highlightCode)}</CodeBlockWrapper>;
};

CodeBlock.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  language: PropTypes.string,
};

CodeBlock.defaultProps = {
  language: 'bash',
};

export default CodeBlock;
