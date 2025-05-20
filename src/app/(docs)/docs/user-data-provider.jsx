'use client';

import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const UserDataContext = createContext({
  loggedIn: false,
});

export const UserDataProvider = ({ children }) => {
  const iframeRef = useRef(null);
  const [userData, setUserData] = useState({
    loggedIn: false,
  });

  useEffect(() => {
    const handleEvent = (event) => {
      const { data, origin } = event;
      if (origin === 'https://console.neon.tech' || origin === 'http://localhost:30000') {
        setUserData({ loggedIn: true, ...data });
      } else {
        console.log('ignoring message from untrusted origin', origin);
      }
    };

    window.addEventListener('message', handleEvent, false);
    return () => window.removeEventListener('message', handleEvent);
  }, []);

  return (
    <UserDataContext.Provider value={userData}>
      <iframe
        ref={iframeRef}
        src="http://localhost:30000/docs_data"
        style={{ display: 'none' }}
        hidden
        onLoad={() => {
          console.log('sending message!');
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
