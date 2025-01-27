'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { SearchBox } from 'react-instantsearch';

const SearchInput = ({ className, isBlog = false }) => (
  <SearchBox className={clsx(className, isBlog && 'dark')} placeholder="Search" />
);

SearchInput.propTypes = {
  className: PropTypes.string,
  isBlog: PropTypes.bool,
};

export default SearchInput;
