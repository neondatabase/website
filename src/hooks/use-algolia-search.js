import algoliasearch from 'algoliasearch/lite';
import { useState, useMemo } from 'react';

const useAlgoliaSearch = () => {
  const [query, setQuery] = useState();
  const [hasFocus, setFocus] = useState(false);
  const searchClient = useMemo(
    () => algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY),
    []
  );

  return {
    searchClient,
    query,
    setQuery,
    hasFocus,
    setFocus,
  };
};

export default useAlgoliaSearch;
