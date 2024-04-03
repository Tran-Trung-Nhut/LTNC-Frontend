import React, {useState} from "react";
import "./Home.css";
import DriverList from "./DriverList";
import VehicleList from "./Vehicle";
import FooterPage from "./FooterPage"

function Home() {

    const [showDriverList, setShowDriverList] = useState(false);
    const [showVehicleList, setShowVehicleList] = useState(false);

    const CancelClick = () =>{
        setShowDriverList(false);
        setShowVehicleList(false);
    }

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
            <h1>Welcome to Transportation Website</h1>
            <button type="button" onClick={CancelClick}>X</button>

            <div>
                <button
                    type="button"
                    id="watchDriver"
                    className="btn btn-success"
                    onClick={DriverClick}
                >
                    <strong>Driver</strong>
                </button>

                <button
                    type="button"
                    id="watchVehicle"
                    className="btn btn-success"
                    onClick={VehicleClick}
                >
                    <strong>Vehicle</strong>
                </button>
            </div>
            {showDriverList && <DriverList/>}
            {showVehicleList && <VehicleList/>}
        </div>
    );
}

export default Home;
