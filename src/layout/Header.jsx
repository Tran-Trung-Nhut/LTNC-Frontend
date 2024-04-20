import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "../components/Home";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "../components/Vehicle";
import Driver from "../components/Driver";
import Trip from "../components/Trip"; // Import Trip component
import "./css/Header.css";
import logo from "../image/fixlogo.png"


function Header() {
  
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);

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
        <button>Sign up</button>
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
