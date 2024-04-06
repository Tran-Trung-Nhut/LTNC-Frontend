import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');

  const login = (role, password) => {
    // Logic for login
    setUserRole(role);
    setPassword(password);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Logic for logout
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,userRole,password, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;