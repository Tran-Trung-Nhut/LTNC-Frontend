import React, {useContext, useState} from "react";
import "./css/Home.css";
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import Footer from "../layout/Footer";

function Home() {
    const { isLoggedIn } = useContext(AuthContext);
    return (
            <div className="Homepage">
                <>
                    <h1>
                        <img src={"https://img.lovepik.com/element/45004/6953.png_860.png"} alt="Logo" style={{ width: "70px", height: "70px" }} />
                        DriveCare
                    </h1>
                    <button type="button" className="manage">Manage</button>
                </>

            <Footer className="Footer"/>
            </div>
    );
}

export default Home;
