import React, {useState} from "react";
import "./Home.css";
import DriverList from "./DriverList";
import VehicleList from "./Vehicle";
import FooterPage from "./FooterPage"
import Login from "./Login"

function Home() {
    const [isLoginnedIn, setIsLoginnedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    const handleLogin = (role) => {
        setIsLoginnedIn(true);
        setUserRole(role);
    }
    
    const [showDriverList, setShowDriverList] = useState(false);
    const [showVehicleList, setShowVehicleList] = useState(false);

    const VehicleClick = () =>{
        if(!showVehicleList) setShowVehicleList(true);
        else setShowVehicleList(false);
        setShowDriverList(false);
    }

    const DriverClick = () =>{
        setShowVehicleList(false);
        if(!showDriverList) setShowDriverList(true);
        else setShowDriverList(false);
    }
    return (
        <div className="Homepage">
        <FooterPage/>
        {!isLoginnedIn ? (
            <Login handleLogin={handleLogin} />
        ) : (
            <>
            <h1>Welcome to Transportation Website</h1>

            <div>
                <button
                    type="button"
                    id="watchDriver"
                    className={`btn btn-success ${showDriverList ? 'active' : ''}`}
                    onClick={DriverClick}
                >
                    <strong>Driver</strong>
                </button>

                <button
                    type="button"
                    id="watchVehicle"
                    className={`btn btn-success ${showVehicleList ? 'active' : ''}`}
                    onClick={VehicleClick}
                >
                    <strong>Vehicle</strong>
                </button>
            </div>
            {showDriverList && <DriverList/>}
            {showVehicleList && <VehicleList/>}
            </>
        )}
        </div>
    );
}

export default Home;
