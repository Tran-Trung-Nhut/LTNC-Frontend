import React from "react";
import { Typography } from "@mui/material";
import logo from "../image/fixlogo.png"
import "./css/Footer.css";
import Home from "../components/Home";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "../components/Vehicle";
import Driver from "../components/Driver";
import Trip from "../components/Trip"; // Import Trip component

function Footer() {
  return (
    <footer className="bg-gray-900 rounded-none shadow dark:bg-gray-900 mx-auto p-4 md:py-8">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-8" style={{ width: '80px', height: 'auto' }} alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-gray-300">Driver Care</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li className="mr-20 md:mr-24">
              <a className="hover:underline text-gray-300">About</a>
              {/* Thêm nội dung phía dưới mục About */}
              <div className="text-sm text-gray-500 mt-1">Group...</div>
              <div className="text-sm text-gray-500">HCMUT</div>
            </li>
            <li className="mr-20 md:mr-24">
              <a href="#" className="hover:underline text-gray-300">Privacy Policy</a>
              <div className="text-sm text-gray-500 mt-1">Group...</div>
            </li>
           
            <li>
              <a className="hover:underline text-gray-300">Contact</a>
              {/* Thêm nội dung phía dưới mục Contact */}
              <div className="text-sm text-gray-500 mt-1">Gmail</div>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400 text-gray-300"><Typography className="Footer" variant="body2" color="#6b7280" align="center">
          © {new Date().getFullYear()} Transportation Management Web Application. All rights reserved.
        </Typography>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
