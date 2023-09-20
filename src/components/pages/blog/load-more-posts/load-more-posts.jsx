'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';

const LoadMorePosts = ({ children, defaultCountPosts = -1, countToAdd = 12 }) => {
  const [countPosts, setCountPosts] = useState(defaultCountPosts);

  return (
    <>
      {children.slice(0, countPosts)}
      {countPosts < children.length && (
        <div className="col-span-full text-center">
          <Button
            theme="white-outline"
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
  children: PropTypes.node.isRequired,
  defaultCountPosts: PropTypes.number,
  countToAdd: PropTypes.number,
};

export default LoadMorePosts;
