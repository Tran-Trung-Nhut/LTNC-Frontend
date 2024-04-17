import React, { useContext } from "react";
import axios from "axios"; 
import "./css/Driver.css"
import Login from "./Login";
import AuthContext from "../Global/AuthContext";

const defaultFormDriver = {
    id: undefined,
    name: "",
    id_number: "",
    gender: "",
    phone_number: "",
    license: {
      grade: "",
      number: "",
    },
    availability: "Free",
  };
class Driver extends React.Component {

    
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            trips: [],
            tripsForHis: [],
            DataisLoaded: false,
            isShowAddingorEdittingTable: false,
            isShowingHistory: false,
            defaultDriver: defaultFormDriver,
            driverForHis: "",
            error: ""
        };
    }


    showError = (message) => {
        this.setState({error: message})
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchDrivers()
        this.fetchTrips();
    }

    fetchTrips = () => {
        axios.get("http://localhost:8000/Trip/list")
        .then((respon) =>{
            this.setState({
                trips: respon.data
            })
        })
    }

    handleInput = (event) =>{
        const searchStr = event.target.value;
        this.setState({searchStr}, () => {
            this.findDriverByNameorID();
        })
    }

    findDriverByNameorID = () =>{
        axios.get(`http://localhost:8000/Driver/find?str=${this.state.searchStr}`)
            .then(res =>{
                this.setState({
                    drivers: res.data
                });
            });
    }

    checkDriverStatus = (driverID) => {
        const ongoingTrips = this.state.trips.filter(trip => trip.driverID === driverID && trip.currentStatus === "Chưa hoàn thành");
        return ongoingTrips.length > 0 ? "ON TRIP" : "AVAILABLE";
    }

    cancelAddDriver = () => {
        this.setState({ isAddingDriver: false });
        this.showError("")
    }
    fetchDrivers = () => {
        axios.get("http://localhost:8000/Driver/list")
            .then((res) => {
                this.setState({ 
                    drivers: res.data,
                    DataisLoaded: true,
                });
            })
    }

    checkAllFieldsFilled = () => {
        const { name, id_number, dob, gender, phone_number, license } = this.state.defaultDriver;
        return (name !== "" && id_number !== "" && dob !== "" && gender !== "" && phone_number !== "" && license.grade !== "" && license.number !== "");
    };

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState(prevState => ({
            defaultDriver: {
                ...prevState.defaultDriver,
                [name]: value,
            },
        }));
    };
    
    handleChangeStruct = (event) => {
        const { name, value } = event.target;
        this.checkAllFieldsFilled();
            this.setState(prevState => ({
            defaultDriver: {
                ...prevState.defaultDriver,
                license: {
                    ...prevState.defaultDriver.license,
                    [name]: value,
                },
            },
        }));
    };

    handleClose = () =>{
        this.setState({
            isShowAddingorEdittingTable: false,
            isShowingHistory: false
        })
        this.fetchTrips()
        this.showError("")
    }

    handleClearForm = () => {
        this.setState({
          defaultDriver: defaultFormDriver,
        });
    };

    handleSubmitCreateForm = () => {
        const name = document.getElementById("Name").value;
        const id_number = document.getElementById("id_Number").value;
        const dob = document.getElementById("DateofBirth").value;
        const gender = document.getElementById("Gender").value;
        const phone_number = document.getElementById("PhoneNumber").value;
        const licenseGrade = document.getElementById("LicenseGrade").value;
        const licenseNumber = document.getElementById("LicenseNumber").value;
        const availability = "Free";

        const license = {
            grade: licenseGrade,
            number: licenseNumber
        } 
    
        const newDriver = {
            name: name,
            id_number: id_number,
            dob: dob,
            gender: gender,
            phone_number: phone_number,
            license: license,
            availability: availability
        };

        this.setState({defaultDriver:newDriver})

        this.checkAllFieldsFilled();

        if (!this.checkAllFieldsFilled()) {
            this.showError("You have to fill in all fields");
            return;
        }else {
            this.showError("");
        }
    
        axios.post("http://localhost:8000/Driver/add", this.state.defaultDriver)
            .then((response) => {
                this.fetchDrivers();
                this.setState({ isShowAddingorEdittingTable: false })
            })
            .catch((error) => {
                console.error("Error adding driver:", error);
                alert("Failed to add driver. Please try again later.");
            });
        this.showError("")
        this.handleClearForm()
    }

    handleSubmitUpdateForm = () => {
        if (!this.checkAllFieldsFilled()) {
            this.showError("You have to fill in all fields");
            return;
        } else {
            this.showError("");
        }
        axios
          .put("http://localhost:8000/Driver/update", this.state.defaultDriver)
          .then((response) => {
            if (response.status === 200) {
              this.setState({ isShowAddingorEdittingTable: false });
              this.fetchDrivers();
              this.handleClearForm();
            }
          });
    };


    handleEdit = (driver) =>{
        this.setState({
            isShowAddingorEdittingTable:true,
            defaultDriver: driver
        })
    }

    showDrivingHistory = (driverID) => {
        const filteredTrips = this.state.trips.filter(trip => trip.driverID === driverID);
        this.setState({ 
            isShowingHistory: true,
            tripsForHis: filteredTrips
        });
    }

    
    handleDelete = (id) => { 
        const isConfirmed = window.confirm("Are you sure to delete this driver?");
        if(isConfirmed){
            axios.delete(`http://localhost:8000/Driver/delete/${id}`)
                .then(() => {
                    this.setState(prevState => ({
                        drivers: prevState.drivers.filter(driver => driver.id !== id)
                    }));
                })
                .catch(error => {
                    console.log("Error deleting driver:", error);
                });
        }
        
    }
    

    toggleAddDriverForm = () => {
        this.setState({
            isShowAddingorEdittingTable:true
        });
    }

    render() {
        const { DataisLoaded } = this.state;
        const { isLoggedIn, userRole, password } = this.context
        
        if (!DataisLoaded)
            return (
                <div>
                    <h1>Wait..</h1>
                </div>
            );
 
        return (
            <div>
            {isLoggedIn && (
             <div>
                <h1 className="Driver" >List of Driver</h1>
                <div className="container">
                {userRole === 'admin' && (
                    <button type="button" className="btn btn-primary" onClick={this.toggleAddDriverForm}>Add new driver</button>
                )}
                <div style={{ position: 'relative' }}>
                    <input type="text" value={this.state.searchStr} placeholder="Name/ID number" onChange={this.handleInput}/>
                </div>
                <table className="table table-hover mt-3" align="center">
                    <thead className="thead-light">
                        <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">ID number</th>
                        <th scope="col">Date of Birth</th>  
                        <th scope="col">Gender</th>  
                        <th scope="col">Phone Number</th>  
                        <th scope="col">License</th>  
                        <th scope="col">Status</th>  
                        <th scope="col">Option</th>
                        </tr>
                    </thead>
                    {this.state.drivers.map((driver, index) => (
                        <tr key={driver.id}>
                            <td>{index + 1}</td>
                            <td>{driver.name}</td>
                            <td>{driver.id_number}</td>
                            <td>{driver.dob}</td>
                            <td>{driver.gender}</td>
                            <td>{driver.phone_number}</td>
                            <td>{driver.license.grade} - {driver.license.number}</td>
                            <td>{this.checkDriverStatus(driver.id)}</td>
                            <td>
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={() => {
                                this.handleEdit(driver);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger mx-2"
                                onClick={() => {
                                this.handleDelete(driver.id);
                                }}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className=""
                                onClick={() => this.showDrivingHistory(driver.id)}
                                >
                                Driving history
                            </button>
                            </td>
                        </tr>
                        ))}
                 </table>
                </div>
                {this.state.isShowAddingorEdittingTable && (
                    <div className="popup">
                        <div className="popup-content">
                            <input type="text"
                            id="Name"
                            className="form-control"
                            placeholder="Name"
                            name="name"
                            value={this.state.defaultDriver.name}
                            onChange={this.handleChange}/>
                            <input type="text"
                            id="id_Number"
                            className="form-control"
                            name="id_number"
                            placeholder="ID number"
                            value={this.state.defaultDriver.id_number}
                            onChange={this.handleChange}/>
                            <input 
                            type="date"
                            id="DateofBirth"
                            className="form-control"
                            placeholder="Date of Birth"
                            name="dob"
                            value={this.state.defaultDriver.dob}
                            onChange={this.handleChange}/>
                            <input 
                            type="text"
                            id="Gender"
                            className="form-control"
                            name="gender"
                            placeholder="Gender"
                            value={this.state.defaultDriver.gender}
                            onChange={this.handleChange}/>
                            <input 
                            type="text"
                            id="PhoneNumber"
                            className="form-control"
                            name="phone_number"
                            placeholder="PhoneNumber"
                            value={this.state.defaultDriver.phone_number}
                            onChange={this.handleChange}/>
                            <input 
                            type="text"
                            id="LicenseGrade"
                            className="form-control"
                            name="grade"
                            placeholder="License grade"
                            value={this.state.defaultDriver.license.grade}
                            onChange={this.handleChangeStruct}/>
                            <input 
                            type="text"
                            id="LicenseNumber"
                            className="form-control"
                            name="number"
                            placeholder="License number"
                            value={this.state.defaultDriver.license.number}
                            onChange={this.handleChangeStruct}/>
                            {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                            <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                if (this.state.defaultDriver.id) {
                                  this.handleSubmitUpdateForm();
                                } else {
                                  this.handleSubmitCreateForm();
                                }
                              }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={this.handleClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {this.state.isShowingHistory && (
                    <div className="popup">
                        <div className="popup-content">
                        <table className="table table-hover">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">No.</th>
                                        <th scope="col">Departure Location</th>
                                        <th scope="col">Arrival Location</th>
                                        <th scope="col">Status</th>
                                        <th scope=""></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tripsForHis.map((trip,index) => (
                                        <tr key={trip.tripID}>
                                            <td>{index + 1}</td>
                                            <td>{trip.departureLocation}</td>
                                            <td>{trip.arrivalLocation}</td>
                                            <td>{trip.currentStatus}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button type="button" className="" onClick={this.handleClose}>Close</button>

                        </div>
                    </div>
                )}
                </div>)}
                {!isLoggedIn && (<div className="login"><Login/></div>)}
            </div>
        );
    }
}
 
export default Driver;