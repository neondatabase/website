import algoliasearch from 'algoliasearch/lite';
import { useState, useMemo } from 'react';

const useAlgoliaSearch = () => {
  const [query, setQuery] = useState();
  const [hasFocus, setFocus] = useState(false);
  const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  );
  const searchClient = useMemo(
    () => ({
      ...algoliaClient,
      search(requests) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: false,
              query: '',
              params: '',
            })),
          });
        }

        return algoliaClient.search(requests);
      },
    }),
    [algoliaClient]
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
