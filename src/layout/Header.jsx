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
import { UserCircleIcon } from '@heroicons/react/outline';



function Header() {
  
  const {isLoggedIn, userName, driver} = useContext(AuthContext)
  const [isShow, setIsShow] = useState(false)

  const showInformation = () => {
    setIsShow(true);
  }

  return (
    <>
    <nav className="NavbarItems">

      <div className="logo">
        <img src={logo}/>
        <Link to="Home"></Link>
      </div>
     

      {/* <div className="menu-icons" onClick={handleClick}>
          {clicked ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </div> */}

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
        {!isLoggedIn && (<button>Sign up</button>)}
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
    </>
  );
}


export default Header;
