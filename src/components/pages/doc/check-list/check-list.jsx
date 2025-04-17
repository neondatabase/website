'use client';

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

const CheckList = ({ id, children }) => {
  const [mounted, setMounted] = useState(false);
  const [checklist, setChecklist] = useLocalStorage(`checklist-${id}`, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {childrenWithProps}
    </div>
  );
};

CheckList.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CheckList;
