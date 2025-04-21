'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import slugify from 'slugify';

import useLocalStorage from 'hooks/use-local-storage';

const CheckList = ({ title, children }) => {
  const id =
    title &&
    slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }).replace(/_/g, '');

  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const checkListId = id || slug;
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checklist, setChecklist] = useLocalStorage(`checklist-${checkListId}`, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setProgress(Math.round((checklist.length / children.length) * 100));
  }, [checklist, children]);

  const handleToggle = useCallback(
    (id) => {
      setChecklist((prev = []) => {
        if (prev.includes(id)) {
          return prev.filter((itemId) => itemId !== id);
        }
        return [...prev, id];
      });
    },
    [setChecklist]
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && typeof child.type === 'object') {
      return React.cloneElement(child, {
        checklist: mounted ? checklist : [],
        onToggle: handleToggle,
      });
    }
    return child;
  });

  return (
    <div className="checklist doc-cta prose-doc my-5 flex flex-col rounded-[10px] border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA,transparent)] px-7 py-6 dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_30%,#131415_75%)] md:p-5 md:px-4 md:py-5">
      <div className="mb-2 flex items-center gap-3">
        {title && <h2 className="!m-0">{title}</h2>}
        <span
          className={clsx(
            'rounded-full border px-2 py-1.5 text-[15px] font-medium leading-none tracking-extra-tight',
            progress === 100
              ? 'border-secondary-8/20 bg-secondary-8/10 text-secondary-8 dark:border-green-45/20 dark:bg-green-45/10 dark:text-green-45'
              : 'border-gray-new-80 bg-gray-new-94 text-gray-new-20 dark:border-white/20 dark:bg-white/10 dark:text-gray-new-90'
          )}
        >
          {progress === 100 ? 'Completed' : `${progress} %`}
        </span>
      </div>
      {childrenWithProps}
    </div>
  );
};

CheckList.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CheckList;
