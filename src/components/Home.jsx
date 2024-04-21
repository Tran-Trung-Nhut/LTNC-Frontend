import React, { useContext } from "react";
import "./css/Home.css";
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import Footer from "../layout/Footer";
import Background from "../image/B.jpg";
import logo from "../image/fixlogo.png"
import { FaClock, FaMap, FaCoins } from 'react-icons/fa';
import clockIcon from "../image/clock.png";
import mapIcon from "../image/map.png";
import coinsIcon from "../image/coins.png";

function Home() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <>
            <div className="background">
               
                <div className="content"> 
                
                    <div className="text-box">
                        <div className="text" style={{ color: "white", fontWeight: 800 }}>
                            <h2>Driver Care</h2>
                            <h4 className="description">Driver Care is a platform designed to manage driver information and travel history with the goal of optimizing operational efficiency. With Driver Care, you can easily track driver movements, manage driver and vehicle information, and receive optimized route suggestions to save costs</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="background-image">
                <img src={Background} alt="background"/>
        <div class="container">
            <div className="text2">  
                What we can do?
            </div>
            <div class="box">
            <div className="icon">
                            <img src={clockIcon} alt="Clock" />
                        </div>
                        <h1>Moving history</h1>
                        <p className="description">Store information about the driver's travel schedule</p>
                    </div>
                    <div className="box">
                        <div className="icon">
                            <img src={mapIcon} alt="Map" />
                        </div>
                        <h1>Optimal route</h1>
                        <p className="description">Suggest suitable, optimal routes for the itinerary</p>
                    </div>
                    <div className="box">
                        <div className="icon">
                            <img src={coinsIcon} alt="Coins" style={{ width: "700px", height: "auto" }} />
                        </div>
                        <h1>Cost savings</h1>
                        <p className="description">Optimize fuel and toll costs</p>
            </div>
        </div>
    </div>
            
            <Footer />
        </>
    );
}

export default Home;