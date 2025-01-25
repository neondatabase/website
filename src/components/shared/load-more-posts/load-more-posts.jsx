'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const ChangelogWrapper = ({ children, countPosts }) => {
  const [allPostsShown, setAllPostsShown] = useState(false);
  useEffect(() => {
    if (countPosts >= children.length) {
      setAllPostsShown(true);
    }
  }, [countPosts, children.length]);

  return (
    <div className={clsx(allPostsShown ? 'mb-0' : '-mb-4')}>{children.slice(0, countPosts)}</div>
  );
};

ChangelogWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  countPosts: PropTypes.number.isRequired,
};

const LoadMorePosts = ({
  className,
  children,
  defaultCountPosts,
  countToAdd,
  isChangelog = false,
}) => {
  const [countPosts, setCountPosts] = useState(defaultCountPosts);

  return (
    <>
      {isChangelog ? (
        <ChangelogWrapper countPosts={countPosts}>{children}</ChangelogWrapper>
      ) : (
        children.slice(0, countPosts)
      )}
      {countPosts < children.length && (
        <div className={clsx('col-span-full text-center', className)}>
          <Button
            className="h-[38px] gap-3 !px-5 text-[15px] font-medium"
            theme="gray-10"
            size="xs"
            onClick={() => setCountPosts((prev) => prev + countToAdd)}
          >
            Show more
            <ChevronIcon className="-mb-px w-2.5 text-white [&_path]:stroke-2" />
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
  isChangelog: PropTypes.bool,
};

export default LoadMorePosts;
