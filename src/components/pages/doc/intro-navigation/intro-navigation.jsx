import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const IntroNavigation = ({ children = null }) => (
  <ul className="not-prose !my-10 flex flex-col gap-5 !p-0">
    {React.Children.map(children, (child, index) => {
      const { children, href, title } = child.props?.children.props ?? {};

      return (
        <li className="!m-0 before:hidden">
          <NextLink
            key={index}
            href={href}
            className="block rounded-[10px] !border-none bg-gray-9 p-6 pb-2 !transition-colors !duration-200 hover:bg-gray-8 dark:bg-gray-1 dark:hover:bg-gray-2"
          >
            <h4 className="text-xl font-semibold text-black dark:text-white">{children}</h4>
            <p className="mt-2 text-sm text-gray-4 dark:text-gray-7">{title}</p>
          </NextLink>
        </li>
      );
    })}
  </ul>
);

IntroNavigation.propTypes = {
  children: PropTypes.node,
};

export default IntroNavigation;
