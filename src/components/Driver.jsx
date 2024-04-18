import React, { useContext } from "react";
import axios from "axios"; 
import "./css/Driver.css"
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import { PencilIcon, TrashIcon, SearchIcon, UserAddIcon, ClockIcon } from '@heroicons/react/outline';


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
                    <div className="flex items-center mb-4">

                    {userRole === 'admin' && (
                        <button 
                        type="button" 
                        className="btn btn-primary mr-4" 
                        onClick={this.toggleAddDriverForm}>
                            <UserAddIcon className="h-6 w-7 text-blue-200" />
                        </button>
                    )}
                    <div className="w-full relative flex-grow">
                        <input 
                            type="text" 
                            value={this.state.searchStr} 
                            placeholder="Search by name or ID number..." 
                            onChange={this.handleInput} 
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-center">No.</th>
                            <th scope="col" className="px-6 py-3 text-center">Name</th>
                            <th scope="col" className="px-6 py-3 text-center">ID number</th>
                            <th scope="col" className="px-6 py-3 text-center">Date of Birth</th>  
                            <th scope="col" className="px-6 py-3 text-center">Gender</th>  
                            <th scope="col" className="px-6 py-3 text-center">Phone Number</th>  
                            <th scope="col" className="px-6 py-3 text-center">License</th>  
                            <th scope="col" className="px-6 py-3 text-center">Status</th>  
                            <th scope="col" className="px-6 py-3 text-center"></th>
                            </tr>
                        </thead>
                        {this.state.drivers.map((driver, index) => (
                            <tr key={driver.id} className="bg-white text-black-800 border-b dark:bg-gray-800 dark:border-black-1000">
                                <td className="p-3 pr-0 text-center">{index + 1}</td>
                                <td className="p-3 pr-0 text-center ">{driver.name}</td>
                                <td className="p-3 pr-0 text-center">{driver.id_number}</td>
                                <td className="p-3 pr-0 text-center">{driver.dob}</td>
                                <td className="p-3 pr-0 text-center">{driver.gender}</td>
                                <td className="p-3 pr-0 text-center">{driver.phone_number}</td>
                                <td className="p-3 pr-0 text-center" >{driver.license.grade} - {driver.license.number}</td>
                                <td className="p-3 pr-0 text-center">{this.checkDriverStatus(driver.id)}</td>
                                <td className="p-3 pr-0">
                                <button
                                    type="button"
                                    className="h-5 w-5 text-yellow-400 mr-1"
                                    onClick={() => {
                                    this.handleEdit(driver);
                                    }}
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className="h-5 w-5 text-red-400 mr-1"
                                    onClick={() => {
                                    this.handleDelete(driver.id);
                                    }}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className=""
                                    onClick={() => this.showDrivingHistory(driver.id)}
                                    >
                                    <ClockIcon className="h-5 w-5" />
                                </button>
                                </td>
                            </tr>
                            ))}
                    </table>
                    </div>
                </div>
                {this.state.isShowAddingorEdittingTable && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                Add new driver
                              </h3>
                              <div className="mt-2">
                                <input type="text" placeholder="Name" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="name" value={this.state.defaultDriver.name} onChange={this.handleChange} />
                                <input type="text" placeholder="ID Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="id_number" value={this.state.defaultDriver.id_number} onChange={this.handleChange} />
                                <input type="date" placeholder="Date of Birth" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="dob" value={this.state.defaultDriver.dob} onChange={this.handleChange} />
                                <input type="text" placeholder="Gender" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="gender" value={this.state.defaultDriver.gender} onChange={this.handleChange} />
                                <input type="text" placeholder="Phone Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="phone_number" value={this.state.defaultDriver.phone_number} onChange={this.handleChange} />
                                <input type="text" placeholder="License Grade" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="grade" value={this.state.defaultDriver.license.grade} onChange={this.handleChangeStruct} />
                                <input type="text" placeholder="License Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="number" value={this.state.defaultDriver.license.number} onChange={this.handleChangeStruct} />
                                {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { if (this.state.defaultDriver.id) { this.handleSubmitUpdateForm(); } else { this.handleSubmitCreateForm(); } }}>Save</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={this.handleClose}>Cancel</button>
                        </div>
                      </div>
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