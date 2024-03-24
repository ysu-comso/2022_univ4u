// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const ServerContext = createContext();

export function ServerProvider({ children }) {
  const [server, setServer] = useState('http://lemontree.cafe24app.com');

  return (
    <ServerContext.Provider value={{ server, setServer }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServer() {
  return useContext(ServerContext);
}