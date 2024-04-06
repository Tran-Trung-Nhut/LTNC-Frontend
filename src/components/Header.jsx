import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "./Home";
import {Routes, Route, Link} from "react-router-dom"
import Vehicle from "./Vehicle";
import Driver from "./Driver";
import "./Driver.css"

function Header() {

  return (
    <>
    <AppBar position="static">
      <Toolbar>
      <img src={"https://img.lovepik.com/element/45004/6953.png_860.png"} alt="Logo" style={{ width: "70px", height: "70px" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>  
          Transportation Management Web Application
        </Typography>

        {/* Nút menu (ví dụ) */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Các nút như Contact, Privacy, About, License */}
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          <Link to="/Home">Home</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            <Link to="/Driver">Driver List</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
         <Link to="/Vehicle">Vehicle List</Link>
        </Typography>
      </Toolbar>
    </AppBar>
    <Routes>
      <Route path="/Home" element={<Home></Home>}/>
      <Route path="/Driver" element={<Driver></Driver>}/>
      <Route path="/Vehicle" element={<Vehicle></Vehicle>}/>
    </Routes>
    </>
  );
}

export default Header;