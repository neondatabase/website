'use client';

import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import { useLocation } from 'react-use';

const ALLOWED_ORIGINS = [
  'https://console.neon.tech',
  'http://localhost:30000',
  'https://console.hydrogen.aws.neon.build', // TODO temporary for testing, delete later
];

const UserDataContext = createContext({
  loggedIn: false,
  selection: {},
  setSelection: () => {},
  data: {},
});

const UserDataProvider = ({ children }) => {
  const iframeRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [selection, setSelection] = useState({
    org_id: null,
    project_id: null,
  });

  useEffect(() => {
    const handleEvent = (event) => {
      const { data, origin } = event;
      if (ALLOWED_ORIGINS.includes(origin)) {
        setUserData(data);
      }
    };

    window.addEventListener('message', handleEvent, false);
    return () => window.removeEventListener('message', handleEvent);
  }, []);

  const consoleUrl = useConsoleUrl();

  const dataUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selection.org_id) {
      params.append('org_id', selection.org_id);
    }
    if (selection.project_id) {
      params.append('project_id', selection.project_id);
    }
    return `${consoleUrl}/docs_data?${params.toString()}`;
  }, [selection.org_id, selection.project_id, consoleUrl]);

  const contextValue = useMemo(
    () => ({
      loggedIn: !!userData.id,
      selection: {
        org_id: userData.selected_org_id,
        project_id: userData.selected_project_id,
      },
      setSelection,
      data: userData,
    }),
    [userData]
  );

  return (
    <UserDataContext.Provider value={contextValue}>
      <iframe
        ref={iframeRef}
        src={dataUrl}
        style={{ display: 'none' }}
        title="user-data-iframe"
        hidden
        onLoad={() => {
          iframeRef.current.contentWindow.postMessage('user-data-request', '*');
        }}
      />
      {children}
    </UserDataContext.Provider>
  );
};

UserDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserDataProvider };

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const useConsoleUrl = () => {
  const { origin } = useLocation();

  // TODO temporary for testing, delete later
  if (1 === 1) {
    return 'https://console.hydrogen.aws.neon.build';
  }

  return origin === 'http://localhost:3000'
    ? 'http://localhost:30000'
    : 'https://console.neon.tech';
};
