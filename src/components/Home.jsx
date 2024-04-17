import React, {useContext, useState} from "react";
import "./css/Home.css";
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import Footer from "../layout/Footer";

function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    return (
            <div className="Homepage">
                
            {!isLoggedIn ? (
                <Login/>
            ) : (
                <>
                    <h1>
                        <img src={"https://img.lovepik.com/element/45004/6953.png_860.png"} alt="Logo" style={{ width: "70px", height: "70px" }} />
                        DriveCare
                    </h1>
                </>
            )}
            <Footer className="Footer"/>
            </div>
    );
}

export default Home;
