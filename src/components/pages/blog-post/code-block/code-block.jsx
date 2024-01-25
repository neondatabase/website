import PropTypes from 'prop-types';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import highlight from 'lib/shiki';

const CodeBlock = async (props) => {
  if (typeof props.children === 'object') {
    props.children = JSON.stringify(props.children);
  }
  const highlightCode = await highlight(props.children, props.language, props.highlight);

  return (
    <CodeBlockWrapper>
      <div className="[&_pre]:my-0" dangerouslySetInnerHTML={{ __html: highlightCode }} />
    </CodeBlockWrapper>
  );
};

CodeBlock.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.string,
};

CodeBlock.defaultProps = {
  language: 'bash',
};

export default CodeBlock;
