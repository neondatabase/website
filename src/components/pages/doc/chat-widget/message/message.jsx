import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Content from 'components/shared/content/content';
import serializeMdx from 'utils/serialize-mdx';

import ExampleIcon from '../images/example.inline.svg';
import UserIcon from '../images/user.inline.svg';

const Message = ({ role, content }) => {
  const [mdxSource, setMdxSource] = useState(null);
  const fetchMdx = async (currentContent) => {
    const serializedContent = await serializeMdx(currentContent);
    setMdxSource(serializedContent);
  };
  useEffect(() => {
    if (content) {
      fetchMdx(content);
    }
  }, [content]);
  if (role === 'assistant') {
    // @TODO: remove this, debug only
    // eslint-disable-next-line no-console
    console.log({ mdxSource, content });
  }
  return (
    <div
      className={clsx(
        'flex items-start px-5 py-2.5',
        role === 'user'
          ? ' bg-[rgba(36,38,40,0.04)] text-gray-new-50 dark:bg-gray-new-15/40 dark:text-gray-new-60'
          : 'text-black dark:text-white'
      )}
    >
      <span
        className={clsx(
          'mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          role === 'user'
            ? 'bg-gray-new-90 text-gray-new-50 dark:bg-gray-new-15 dark:text-gray-new-60'
            : 'bg-secondary-8/10 text-secondary-8 dark:bg-primary-1/10 dark:text-primary-1'
        )}
      >
        {role === 'user' ? <UserIcon /> : <ExampleIcon />}
      </span>
      {mdxSource ? (
        <Content
          className="prose-chat prose pt-0.5 dark:prose-invert xs:prose-code:break-words"
          content={mdxSource}
        />
      ) : (
        <div className="flex h-7 items-center">
          <span className="h-4 w-1 animate-pulse bg-gray-new-50" />
        </div>
      )}
    </div>
  );
};

Message.propTypes = {
  role: PropTypes.string,
  content: PropTypes.string,
};

export default Message;
