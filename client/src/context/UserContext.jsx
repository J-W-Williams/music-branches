import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem('loggedInUser') || null
      );

  const login = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', user);
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');setLoggedInUser(null);
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);