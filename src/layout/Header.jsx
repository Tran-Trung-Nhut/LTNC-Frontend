import React, { useContext, useState } from "react";
import axios from "axios";
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
  
  const {isLoggedIn, userName,userRole, driver,admin_password, logout, updateDriver,setAdminPassword} = useContext(AuthContext)
  const [isShow, setIsShow] = useState(false)
  const [isChangeInfo, setChangeInfo] = useState(false);
  const [error, setError] = useState("")

  const showInformation = () => {
    setIsShow(true);
  }

  const handleClose = () =>{
    setIsShow(false);
    setError("");
  }

  const handleCloseChange = ()=>{
    setIsShow(true)
    setChangeInfo(false)
    setError("")
  }

  const Logout = () =>{
    logout()
    setIsShow(false);
  }

  const showChange = () => {
    setChangeInfo(true);
    setIsShow(false);
  }

  const setAdminpassword = (password) =>{
    setIsShow(true);
    setChangeInfo(false);
    setAdminPassword(password);
    setError(false);
  } 

  const checkAllFilled = (driver) => {
    return (driver.name !== "" && driver.id_number !== "" && driver.dob !== "" && driver.gender !== "" && driver.phone_number !== "" && driver.license.grade !== "" && driver.license.number !== "");
  };

  const handleUpdateForm = (driver) =>{
    if (!checkAllFilled(driver)) {
      setError("You have to fill in all fields");
      return;
    } else {
        setError("");
    }
    axios.put("http://localhost:8000/Driver/update", driver)
    .then((response) => {
      if (response.status === 200) {
        setIsShow(true)
        setChangeInfo(false)
        setError("")
      }
    });
  }

  const handleChange = (event) =>{
    const { name, value } = event.target;
    updateDriver((prevDriver => ({
      ...prevDriver,
      [name]: value
    })));
  }

  const handleChangeStruct = (event) =>{
    const { name, value } = event.target;
    const license = { ...driver.license, [name]: value };
    updateDriver((prevDriver => ({
      ...prevDriver,
      license: license
    })));
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
                <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>Logout()}>
                  Log out
                </button>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3" onClick={()=>showChange()}>
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
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3" onClick={()=>showChange()}>
                      Change password
                    </button>
                   </div>
                   </div>
                   </div>
                   </div>
                   </div>
                   </div>
      )}
      {isChangeInfo && userRole === 'user' && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                Change {driver.name}'s information
                              </h3>
                              <div className="mt-2">
                                <input type="text" placeholder="Name" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="name" value={driver.name} onChange={handleChange} />
                                <input type="text" placeholder="ID Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="id_number" value={driver.id_number} onChange={handleChange} />
                                <input type="date" placeholder="Date of Birth" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="dob" value={driver.dob} onChange={handleChange} />
                                <input type="text" placeholder="Gender" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="gender" value={driver.gender} onChange={handleChange} />
                                <input type="text" placeholder="Phone Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="phone_number" value={driver.phone_number} onChange={handleChange} />
                                <input type="text" placeholder="License Grade" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="grade" value={driver.license.grade} onChange={handleChangeStruct} />
                                <input type="text" placeholder="License Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="number" value={driver.license.number} onChange={handleChangeStruct} />
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() =>  handleUpdateForm(driver) }>Save</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => handleCloseChange()}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
        {isChangeInfo && userRole === 'admin' && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4">
                              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                Change Admin's password
                              </h3>
                              <div className="mt-2 flex">
                                <div
                                  className="text-gray-600 ml-5">
                                  Type new password</div>
                                <input type="text" id="newPassword" placeholder="New password" className="form-input w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" 
                          onClick={() =>{
                            if(document.getElementById("newPassword").value){setAdminpassword(document.getElementById("newPassword").value)}else
                        {setError("Password can not be null")}}}>Save</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => handleCloseChange()}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    </>
  );
}


export default Header;
