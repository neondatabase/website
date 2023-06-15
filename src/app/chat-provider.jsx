/* eslint-disable react/prop-types */

'use client';

import { createContext, useState } from 'react';

export const ChatContext = createContext({});

export default ({ children, initialValue = false }) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  return <ChatContext.Provider value={{ isOpen, setIsOpen }}>{children}</ChatContext.Provider>;
};
