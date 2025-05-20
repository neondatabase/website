'use client';

import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const UserDataContext = createContext({
  loggedIn: false,
  selection: null,
  setSelection: () => {},
  data: {},
});

export const UserDataProvider = ({ children }) => {
  const iframeRef = useRef(null);

  const [userData, setUserData] = useState({});
  const [selection, setSelection] = useState({
    org_id: null,
    project_id: null,
  });

  useEffect(() => {
    const handleEvent = (event) => {
      const { data, origin } = event;
      if (origin === 'https://console.neon.tech' || origin === 'http://localhost:30000') {
        setUserData(data);
      } else {
        console.log('ignoring message from untrusted origin', origin);
      }
    };

    window.addEventListener('message', handleEvent, false);
    return () => window.removeEventListener('message', handleEvent);
  }, []);

  const getDataUrl = () => {
    const params = new URLSearchParams();
    if (selection.org_id) {
      params.append('org_id', selection.org_id);
    }
    if (selection.project_id) {
      params.append('project_id', selection.project_id);
    }
    return `http://localhost:30000/docs_data?${params.toString()}`;
  };

  return (
    <UserDataContext.Provider
      value={{
        loggedIn: !!userData.id,
        selection,
        setSelection,
        data: userData,
      }}
    >
      <iframe
        ref={iframeRef}
        src={getDataUrl()}
        style={{ display: 'none' }}
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

export const useUserData = () => useContext(UserDataContext);
