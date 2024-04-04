import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  return (
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
          <a href="#">Contact</a>
        </Typography>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          <a href="#">Privacy</a>
        </Typography>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          <a href="#">About</a>
        </Typography>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          <a href="#">License</a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;