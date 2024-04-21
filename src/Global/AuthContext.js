import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [driver, setDriver] = useState('');

  const login = (role, password,username,driver) => {
    // Logic for login
    setUserRole(role);
    setPassword(password);
    setIsLoggedIn(true);
    setUserName(username);
    setDriver(driver);
  };

  const logout = () => {
    // Logic for logout
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,userRole,userName,password,driver, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;