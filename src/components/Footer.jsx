import React from "react";
import { Typography } from "@mui/material";

function Footer() {
  return (
    <Typography className="Footer" variant="body2" color="text.secondary" align="center">
      © {new Date().getFullYear()} Transportation Management Web Application. All rights reserved.
    </Typography>
  );
}

export default Footer;