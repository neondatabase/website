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
    <div
      className={clsx(
        'checklist doc-cta !mt-10 flex flex-col rounded-lg px-8 py-6',
        'border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA,transparent)] ',
        'dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_30%,#131415_75%)]',
        'xl:!mt-8 lg:px-6 lg:py-5 md:p-5 md:px-5 md:py-[18px]'
      )}
    >
      <div className="flex items-start gap-3.5">
        {title && (
          <h2 className="!m-0 font-medium leading-snug tracking-tighter lg:text-xl">{title}</h2>
        )}
        <span
          className={clsx(
            'mt-[3px] rounded-full border px-2 py-[5px] text-[15px] font-medium leading-none tracking-extra-tight lg:mt-0',
            progress === 100
              ? 'border-secondary-8/20 bg-secondary-8/10 text-secondary-8 dark:border-green-45/20 dark:bg-green-45/10 dark:text-green-45'
              : 'border-gray-new-80 bg-gray-new-94 text-gray-new-20 dark:border-white/20 dark:bg-white/10 dark:text-gray-new-90'
          )}
        >
          {progress === 100 ? 'Complete' : `${progress}%`}
        </span>
      </div>
      <ul className="!mb-0 !mt-5 flex flex-col gap-[18px] !p-0 lg:!mt-[18px] lg:gap-4 md:!mt-4">
        {childrenWithProps}
      </ul>
    </div>
  );
};

CheckList.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CheckList;
