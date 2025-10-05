import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    id: null,
  });

  const login = (username, password) => {
    if (username === "admin@gmail.com" && password === "admin") {
      setUser({ isLoggedIn: true, id: 1 });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser({ isLoggedIn: false, id: null });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
