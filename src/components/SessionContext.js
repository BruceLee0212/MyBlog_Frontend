// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState();
  // const userData = { user: "bli725@uwo.ca" };
  // sessionStorage.setItem("user", JSON.stringify(userData));
  useEffect(() => {
    const sessionDataFromSession = JSON.parse(sessionStorage.getItem('user'));
    setSessionData(sessionDataFromSession);
  }, []);

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};
