import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [driver, setDriver] = useState();
  const [admin_password,setAdminPassword] = useState('admin')

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

  const ChangeAdminPass = (string) =>{
    setAdminPassword(string)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn,userRole,userName,password,driver,admin_password, login, logout, setAdminPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;