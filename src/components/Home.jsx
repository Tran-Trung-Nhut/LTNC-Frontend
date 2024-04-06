import React, {useContext, useState} from "react";
import "./Home.css";
import Login from "./Login"
import Footer from "./Footer";
import AuthContext from "./Global/AuthContext";

function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    return (
            <div className="Homepage">
            {!isLoggedIn ? (
                <Login/>
            ) : (
                <>
                    <h1>Welcome to Transportation Website</h1>
                </>
            )}
            <Footer className="Footer"/>
            </div>
    );
}

export default Home;
