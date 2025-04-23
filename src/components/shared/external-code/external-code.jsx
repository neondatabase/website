import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import Admonition from 'components/shared/admonition';
import highlight from 'lib/shiki';

import CodeBlockWrapper from '../code-block-wrapper';

const getLanguageFromUrl = (url) => url.split('.').pop();

const FallbackMessage = ({ url }) => (
  <Admonition type="warning">
    Failed to fetch external code from
    <br />
    <a href={url} target="_blank" rel="noreferrer noopener">
      {url}
    </a>
  </Admonition>
);

FallbackMessage.propTypes = {
  url: PropTypes.string.isRequired,
};

const ExternalCode = async ({
  url,
  language = null,
  shouldWrap = false,
  showLineNumbers = false,
  className = null,
  copyButtonClassName = null,
  ...otherProps
}) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return <FallbackMessage url={url} />;

    const text = await response.text();
    const detectedLanguage = language || getLanguageFromUrl(url);
    const html = await highlight(text, detectedLanguage);

    return (
      <CodeBlockWrapper
        className={clsx(
          '[&>pre]:my-0 [&>pre]:!bg-gray-new-98 [&>pre]:dark:!bg-gray-new-10',
          shouldWrap && 'code-wrap',
          className
        )}
        data-line-numbers={showLineNumbers}
        copyButtonClassName={copyButtonClassName}
        {...otherProps}
      >
        {parse(html)}
      </CodeBlockWrapper>
    );
  } catch (error) {
    return <FallbackMessage url={url} />;
  }
};

ExternalCode.propTypes = {
  url: PropTypes.string.isRequired,
  language: PropTypes.string,
  shouldWrap: PropTypes.bool,
  showLineNumbers: PropTypes.bool,
  className: PropTypes.string,
  copyButtonClassName: PropTypes.string,
};

export default ExternalCode;
