import axios from 'axios';
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [driver, setDriver] = useState();
  const [admin_password,setAdminPassword] = useState('admin')
  const [isInOtherPage,setOtherPage] = useState(false)

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

  const updateDriver = (driver) =>{
    setDriver(driver);
  }
  return (
    <AuthContext.Provider value={{ isInOtherPage, setOtherPage,isLoggedIn,userRole,userName,updateDriver,password,driver,admin_password, login, logout, setAdminPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;