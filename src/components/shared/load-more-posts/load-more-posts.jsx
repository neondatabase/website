'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';

const LoadMorePosts = ({ className, children, defaultCountPosts, countToAdd }) => {
  const [countPosts, setCountPosts] = useState(defaultCountPosts);

  return (
    <>
      {children.slice(0, countPosts)}
      {countPosts < children.length && (
        <div className={clsx('col-span-full text-center', className)}>
          <Button
            theme="gray-outline"
            size="xs"
            onClick={() => setCountPosts((prev) => prev + countToAdd)}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

LoadMorePosts.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  defaultCountPosts: PropTypes.number.isRequired,
  countToAdd: PropTypes.number.isRequired,
};

export default LoadMorePosts;
