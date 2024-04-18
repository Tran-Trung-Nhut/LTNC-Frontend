import React, {useContext, useState} from "react";
import "./css/Home.css";
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import Footer from "../layout/Footer";
import Background from "../image/logo.jpg";

function Home() {
    return (
        <>
       <div className = "background">
       <img src={Background} />

       <div>
        <h1 className="Text">
            Driver Care
        </h1>
       </div>
       
       </div>
       
       
        
        </>
    );
}

export default Home; 