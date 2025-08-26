'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Item from './item';

const DocsNavigation = ({ navigation, basePath }) => {
  const [activeItems, setActiveItems] = useState([]);

  return (
    <ul className="no-scrollbars flex size-full gap-x-6 2xl:-mx-8 2xl:w-[calc(100%+32px)] 2xl:px-8">
      {navigation?.map((item, index) => (
        <Item
          key={index}
          {...item}
          basePath={basePath}
          activeItems={activeItems}
          setActiveItems={setActiveItems}
        />
      ))}
    </ul>
  );
};

DocsNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
};

export default DocsNavigation;
