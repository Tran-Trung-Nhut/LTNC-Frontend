import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "../components/Home";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "../components/Vehicle";
import Driver from "../components/Driver";
import Trip from "../components/Trip"; // Import Trip component
import "./css/Header.css";

function Header() {
  return (
    <>
      <AppBar position="static" className="bar">
        <Toolbar className="tool">        
          <Typography>
            <Link to="/Home">Home</Link>
          </Typography>
          <Typography>
            <Link to="/Driver">Driver List</Link>
          </Typography>
          <Typography>
            <Link to="/Vehicle">Vehicle List</Link>
          </Typography>
          <Typography>
            <Link to="/Trip">Trip</Link> {/* Add Trip link */}
          </Typography>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Driver" element={<Driver />} />
        <Route path="/Vehicle" element={<Vehicle />} />
        <Route path="/Trip" element={<Trip />} /> {/* Add Trip route */}
      </Routes>
    </>
  );
}

export default Header;
