import clsx from 'clsx';
import parse from 'html-react-parser';

import highlight from 'lib/shiki';

import CodeBlockWrapper from '../code-block-wrapper';

const CodeBlock = async (props) => {
  const { className = null, copyButtonClassName = null, children, ...otherProps } = props;

  const language = children?.props?.className?.replace('language-', '');
  const meta = children?.props?.meta;
  const code = children?.props?.children?.trim();
  const html = await highlight(code, language);

  return (
    <CodeBlockWrapper
      className={clsx(
        '[&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10',
        className,
        { 'code-wrap': meta?.includes('shouldWrap') }
      )}
      data-line-numbers={meta?.includes('showLineNumbers')}
      copyButtonClassName={copyButtonClassName}
      {...otherProps}
    >
      {parse(html)}
    </CodeBlockWrapper>
  );
};

export default CodeBlock;
