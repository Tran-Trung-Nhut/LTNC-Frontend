import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "../components/Home";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "../components/Vehicle";
import Driver from "../components/Driver";
import Trip from "../components/Trip"; // Import Trip component
import "./css/Header.css";
import logo from "../image/logo.png"
import AuthContext from "../Global/AuthContext";
import { UserCircleIcon, XIcon } from '@heroicons/react/outline';



function Header() {
  
  const {isLoggedIn, userName,userRole, driver,admin_password, logout} = useContext(AuthContext)
  const [isShow, setIsShow] = useState(false)

  const showInformation = () => {
    setIsShow(true);
  }

  const handleClose = () =>{
    setIsShow(false);
  }

  const Logout = () =>{
    logout()
    setIsShow(false);
  }

  return (
    <>
    <nav className="NavbarItems">

      <div className="logo">
        <img src={logo}/>
        <Link to="Home"></Link>
      </div>
    

      <ul className="nav-menu">
        <li className="nav-link">
          <Link to="Home">
          Home
          </Link>
        </li>
        <li className="nav-link">
          <Link to="Driver">
          Driver
          </Link>
        </li>
        <li className="nav-link">
          <Link to="Vehicle">
          Vehicle
          </Link>
        </li>
        <li className="nav-link">
          <Link to="Trip">
          Trip
          </Link>
        </li>
        {!isLoggedIn && (<button type="button" >Sign up</button>)}
        {isLoggedIn && (
        <button type="button" className="flex border transform hover:scale-110" onClick={showInformation}>
          <UserCircleIcon className="h-5 w-5 mr-1"/>
          {userName}
        </button>)}
      </ul>
    </nav>
  
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Driver" element={<Driver />} />
        <Route path="/Vehicle" element={<Vehicle />} />
        <Route path="/Trip" element={<Trip />} />
      </Routes>
      {(isLoggedIn && userRole === 'user' && isShow) && (
        <div className="popup">
        <div className="flex flex-col justify-center items-center h-[100vh]">
            <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
                <div className="mt-2 mb-8 w-full ">
                    <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white w-full flex justify-between items-center">
                    General Information <button class="px-1 py-1 transform hover:scale-110 text-red-500" onClick={()=>handleClose()}><XIcon className="h-7 w-7"/></button>
                    </h4>
                    <p className="mt-2 px-2 text-base text-gray-600">
                      There is nothing about this driver
                    </p>
                </div> 
                <div className="grid grid-cols-2 gap-4 px-2 w-full">
                    <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.name}
                    </p>
                    </div>

                    <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">ID number</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.id_number}
                    </p>
                    </div>

                    <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.gender}
                    </p>
                    </div>

                    <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Date of birth</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.dob}
                    </p>
                    </div>

                    <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">Phone number</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.phone_number}
                    </p>
                    </div>

                    <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <p className="text-sm text-gray-600">license</p>
                    <p className="text-base font-medium text-navy-700 dark:text-white">
                        {driver.license.grade} - {driver.license.number}
                    </p>
                    </div>
                </div>
                <div className="flex">
                <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>logout()}>
                  Log out
                </button>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3">
                  Change information
                </button>
                </div>
            </div>  
        </div>
        </div>
      )}

      {(isLoggedIn && userRole === 'admin' && isShow) && (
       <div className="fixed z-10 inset-0 overflow-y-auto">
       <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
           <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
         </div>
         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
             <div className="sm:flex sm:items-start">
               <div className="mt-0 h-full w-full text-center sm:text-left">
                   <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg h-full w-full">
                   <div class="flex justify-end mt-2">
                       <button class="px-1 py-1 transform hover:scale-110 text-red-500" onClick={()=>handleClose()}><XIcon className="h-5 w-5"/></button>
                   </div>
                       <div class="border-t border-gray-200">
                           <dl>
                               <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                   <dt class="text-sm font-medium text-gray-500">
                                       Username
                                   </dt>
                                   <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                       admin
                                   </dd>
                               </div>
                               <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                   <dt class="text-sm font-medium text-gray-500">
                                       Password
                                   </dt>
                                   <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                       {admin_password}
                                   </dd>
                               </div>     
                           </dl>
                       </div>
                   </div>
                    <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>Logout()}>
                      Log out
                    </button>
                   </div>
                   </div>
                   </div>
                   </div>
                   </div>
                   </div>
      )}
    </>
  );
}


export default Header;
