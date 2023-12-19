import clsx from 'clsx';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

import CodeBlock from 'components/shared/code-block';
import Link from 'components/shared/link';
import serializeMdx from 'utils/serialize-mdx';

import ExampleIcon from '../images/example.inline.svg';
import UserIcon from '../images/user.inline.svg';

const components = {
  table: (props) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  // eslint-disable-next-line react/jsx-no-useless-fragment
  undefined: (props) => <Fragment {...props} />,
  code: (props) => {
    if (props?.className?.startsWith('language-') && props?.children) {
      return <CodeBlock as="figure" {...props} />;
    }
    return <code {...props} />;
  },
  pre: (props) => (
    <div>
      <CodeBlock {...props} />
    </div>
  ),
  a: (props) => {
    const { href, children, ...otherProps } = props;
    return (
      <Link to={href} {...otherProps}>
        {children}
      </Link>
    );
  },
  img: (props) => (
    <Image
      {...props}
      loading="lazy"
      width={796}
      height={447}
      style={{ width: '100%', height: '100%' }}
    />
  ),

  CodeBlock,
};

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
            : 'bg-primary-1/10 text-green-45'
        )}
      >
        {role === 'user' ? <UserIcon /> : <ExampleIcon />}
      </span>
      {mdxSource ? (
        <div className="prose-doc prose-chat prose max-w-[656px] grow pt-0.5 dark:prose-invert lg:w-[calc(100%-40px)] xs:prose-code:break-words">
          <MDXRemote {...mdxSource} components={components} />
        </div>
      ) : (
        <div className="flex h-7 grow items-center">
          <span className="h-4 w-1 animate-loading bg-gray-new-50" />
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
