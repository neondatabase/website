'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import slugify from 'slugify';

import useLocalStorage from 'hooks/use-local-storage';
import { cn } from 'utils/cn';

const slugifyOptions = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
};

const getChecklistItemId = (title) => slugify(title, slugifyOptions).replace(/_/g, '');

const getCurrentChecklist = (items, validItemIds) => {
  if (!Array.isArray(items)) {
    return [];
  }

  const validItemIdSet = new Set(validItemIds);
  const seenItemIds = new Set();

  return items.filter((itemId) => {
    if (!validItemIdSet.has(itemId) || seenItemIds.has(itemId)) {
      return false;
    }

    seenItemIds.add(itemId);
    return true;
  });
};

const CheckList = ({ title, children }) => {
  const id = title && getChecklistItemId(title);

  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const checkListId = id || slug;
  const [mounted, setMounted] = useState(false);
  const [checklist, setChecklist] = useLocalStorage(`checklist-${checkListId}`, []);
  const checklistItemIds = useMemo(
    () =>
      React.Children.toArray(children).reduce((itemIds, child) => {
        if (React.isValidElement(child) && typeof child.props?.title === 'string') {
          itemIds.push(getChecklistItemId(child.props.title));
        }

        return itemIds;
      }, []),
    [children]
  );
  const currentChecklist = useMemo(
    () => getCurrentChecklist(checklist, checklistItemIds),
    [checklist, checklistItemIds]
  );
  const visibleChecklist = mounted ? currentChecklist : [];
  const progress =
    checklistItemIds.length > 0
      ? Math.round((visibleChecklist.length / checklistItemIds.length) * 100)
      : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(
    (id) => {
      if (!checklistItemIds.includes(id)) {
        return;
      }

      setChecklist((prev = []) => {
        const currentPrev = getCurrentChecklist(prev, checklistItemIds);

        if (currentPrev.includes(id)) {
          return currentPrev.filter((itemId) => itemId !== id);
        }

        return [...currentPrev, id];
      });
    },
    [checklistItemIds, setChecklist]
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && typeof child.type === 'object') {
      return React.cloneElement(child, {
        checklist: visibleChecklist,
        onToggle: handleToggle,
      });
    }
    return child;
  });

  return (
    <div
      className={cn(
        'checklist doc-cta my-9! flex flex-col bg-white px-8 pt-6 pb-8',
        'border border-gray-new-80',
        'dark:border-gray-new-20 dark:bg-black-pure',
        'xl:my-8! lg:px-6 lg:py-5 md:p-5 md:px-5 md:py-[18px]'
      )}
    >
      <div className="flex items-start gap-4">
        {title && (
          <h2 className="m-0! pt-0! text-2xl leading-tight font-medium tracking-tighter text-black-pure dark:text-white lg:text-xl">
            {title}
          </h2>
        )}
        <span
          className={cn(
            'border px-2.5 py-1.5 font-mono text-sm leading-none font-medium lg:mt-0',
            progress === 100
              ? 'border-secondary-8/20 bg-secondary-8/10 text-secondary-8 dark:border-green-45/20 dark:bg-green-45/10 dark:text-green-45'
              : 'border-gray-new-70 bg-gray-new-94 text-black-pure dark:border-gray-new-20 dark:bg-gray-new-15/60 dark:text-gray-new-90'
          )}
        >
          {progress === 100 ? 'Complete' : `${progress}%`}
        </span>
      </div>
      <ul className="mt-6! mb-0! flex flex-col gap-5 p-0! lg:mt-[18px]! lg:gap-4 md:mt-4!">
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
