'use client';

import { DocSearch } from '@docsearch/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

const Search = ({ className = null }) => {
  const ref = useRef(null);

  return (
    <div className={clsx('relative', className)} ref={ref}>
      <DocSearch
        appId="RAPNCKAFQF"
        apiKey="a975b8d2e7c08607b212bf690f8eb40a"
        indexName="neon"
        placeholder="Search"
      />
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
