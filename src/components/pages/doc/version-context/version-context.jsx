'use client';

import PropTypes from 'prop-types';
import { createContext, useContext, useMemo } from 'react';

import {
  DOCS_DEFAULT_VERSION_ID,
  DOCS_VERSION_LOCAL_STORAGE_KEY,
  DOCS_VERSIONS,
} from 'constants/docs-versions';
import useLocalStorage from 'hooks/use-local-storage';

const versionsById = DOCS_VERSIONS.reduce((acc, version) => {
  acc[version.id] = version;
  return acc;
}, {});

const DocsVersionContext = createContext(null);

const getSafeVersionId = (versionId) => {
  if (!versionId || !versionsById[versionId]) return DOCS_DEFAULT_VERSION_ID;
  return versionId;
};

const DocsVersionProvider = ({ children }) => {
  const [storedVersionId, setStoredVersionId] = useLocalStorage(
    DOCS_VERSION_LOCAL_STORAGE_KEY,
    DOCS_DEFAULT_VERSION_ID
  );

  const selectedVersionId = getSafeVersionId(storedVersionId);
  const selectedVersion = versionsById[selectedVersionId];
  const fallbackVersion = versionsById[DOCS_DEFAULT_VERSION_ID];
  const effectiveVersion = selectedVersion.isContentReady ? selectedVersion : fallbackVersion;
  const isFallback = selectedVersion.id !== effectiveVersion.id;

  const value = useMemo(
    () => ({
      versions: DOCS_VERSIONS,
      selectedVersion,
      selectedVersionId,
      effectiveVersion,
      effectiveVersionId: effectiveVersion.id,
      isFallback,
      setSelectedVersionId: setStoredVersionId,
    }),
    [effectiveVersion, isFallback, selectedVersion, selectedVersionId, setStoredVersionId]
  );

  return <DocsVersionContext.Provider value={value}>{children}</DocsVersionContext.Provider>;
};

DocsVersionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useDocsVersionContext = () => {
  const context = useContext(DocsVersionContext);
  if (!context) {
    throw new Error('useDocsVersionContext must be used within DocsVersionProvider');
  }
  return context;
};

export { DocsVersionProvider, useDocsVersionContext };
