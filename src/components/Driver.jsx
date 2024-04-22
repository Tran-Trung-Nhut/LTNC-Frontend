import React, { useContext } from "react";
import axios from "axios"; 
import "./css/Driver.css"
import Login from "./Login";
import AuthContext from "../Global/AuthContext";
import { PencilIcon,ArrowLeftIcon,ArrowRightIcon, TrashIcon, SearchIcon, UserAddIcon, InformationCircleIcon, XIcon } from '@heroicons/react/outline';
import Background from "../image/B.jpg";
import Footer from "../layout/Footer";

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
            showUserInfor: false,
            driverForHis: "",
            error: "",
            currentPage: 1,
            driversPerPage: 7,
        };
    }


    showError = (message) => {
        this.setState({error: message})
    };

    CloseHistory = () =>{
        this.setState({
            showUserInfor: true,
            isShowingHistory: false
        })
    }

    isExistIDNumber = (driverID) =>{
        const foundID = this.state.drivers.find(driver => driver.id_number === driverID)
        return foundID !== undefined
    }

    static contextType = AuthContext;

    OpenShowUser = (driver) =>{
        this.setState({
        showUserInfor:true,
        defaultDriver: driver
    })
    }

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

    showSumTrip = (driverID)=>{
        const Sum = this.state.trips.filter(trip => trip.driverID === driverID && trip.currentStatus === "Đã hoàn thành");
        return Sum.length;
    }

    showLateTrip = (driverID) => {
        const Sum = this.state.trips.filter(trip => trip.driverID === driverID && trip.currentStatus === "Đã hoàn thành")
        
        const lateTrips = Sum.filter(trip => {
            const estimatedtime = new Date(trip.estimatedArrivalTime);
            const actualtime = new Date(trip.actualArrivalTime);
            return actualtime > estimatedtime
        })

        return lateTrips.length;
    }

    showType = (driverID) =>{
        if(1 - this.showLateTrip(driverID)/this.showSumTrip(driverID) >= 0.8){
            return "Excellent";
        }else if(1 - this.showLateTrip(driverID)/this.showSumTrip(driverID) >= 0.6){
            return "Good";
        }else if(1 - this.showLateTrip(driverID)/this.showSumTrip(driverID) >= 0.5){
            return "Fair";
        }else{
            return "Poor";
        }
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
            isShowingHistory: false,
            showUserInfor: false
        })
        this.handleClearForm()
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
        const id = document.getElementById("id_Number").value;
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
            id_number: id,
            dob: dob,
            gender: gender,
            phone_number: phone_number,
            license: license,
            availability: availability
        };

        this.setState({defaultDriver:newDriver})

        if (!this.checkAllFieldsFilled()) {
            this.showError("You have to fill in all fields");
            return;
        }else {
            if(this.isExistIDNumber(this.state.defaultDriver.id_number)){
                this.showError("ID này đã tồn tại!")
                return;
            }else{
                this.showError("")
            }
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
            showUserInfor: false,
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
        
        const totalPages = Math.ceil(this.state.drivers.length / this.state.driversPerPage);
        const indexOfLastDriver = this.state.currentPage * this.state.driversPerPage;
        const indexOfFirstDriver = indexOfLastDriver - this.state.driversPerPage;
        const currentDrivers = this.state.drivers.slice(indexOfFirstDriver, indexOfLastDriver);
        if (!DataisLoaded)
            return (
                <div>
                    <h1>Wait..</h1>
                </div>
            );
 
        return (
            <div>
            {isLoggedIn && (
            <div className="wrapper" style={{backgroundImage: `url(${Background})`}}>
             <div>
                <div className="container">
                    <div className="flex mt-5 h-12 w-96">
                        {userRole === 'admin' && (
                            <button 
                            type="button" 
                            className="border border-black border-2 flex h-10 mr-2 items-center" 
                            onClick={this.toggleAddDriverForm}>
                                <UserAddIcon className=" h-7 w-8 text-black transform hover:scale-110" />
                            </button>
                        )}
                    
                    <div className="w-full relative flex-grow">
                        <input 
                            type="text" 
                            value={this.state.searchStr} 
                            placeholder="Search by name or ID number..." 
                            onChange={this.handleInput} 
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <button type="button" className="absolute mt-3 inset-y-0 right-0 flex items-center pr-3 pointer-events-none transform hover:scale-110">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                </div>
                    {totalPages >= 1 && (
                    <div className="relative z-2 overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full mx-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-[#030637] text-white">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-center">No.</th>
                            <th scope="col" className="px-6 py-3 text-center">Name</th>
                            <th scope="col" className="px-6 py-3 text-center">ID number</th>
                            <th scope="col" className="px-6 py-3 text-center">Type</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>  
                            <th scope="col" className="px-6 py-3 text-center"></th>
                            </tr>
                        </thead>
                        {currentDrivers.map((driver, index) => (
                            <tr key={driver.id} className="bg-white text-black-800 border-b dark:bg-gray-800 dark:border-black-1000">
                                <td className="p-3 pr-0 text-center">{index + 1}</td>
                                <td className="p-3 pr-0 text-center ">{driver.name}</td>
                                <td className="p-3 pr-0 text-center">{driver.id_number}</td>
                                <td className="p-3 pr-0 text-center">{this.showType(driver.id)}</td>
                                <td className="p-3 pr-0 text-center">{this.checkDriverStatus(driver.id)}</td>
                                <td className="p-3 pr-0">
                                {(userRole === "admin") && (
                                    <>
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
                                </>)}
                                <button
                                    type="button"
                                    className=""
                                    onClick={() => this.OpenShowUser(driver)}
                                    >
                                    <InformationCircleIcon className="h-5 w-5" />
                                </button>
                                </td>
                            </tr>
                            ))}
                    </table>
                    <div className="flex justify-center bg-white">
                        <button 
                        onClick={() => {if(this.state.currentPage !== 1){this.setState({ currentPage: this.state.currentPage - 1 })}}}>
                            <ArrowLeftIcon 
                            className="h-6 w-6"/>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button 
                        className={`border border-2 border-black text-black mx-1 text-sm ${
                            i + 1 === this.state.currentPage && "active-page"
                          } `}
                        key={i} 
                        onClick={() => this.setState({ currentPage: i + 1 })}>
                            {i + 1}
                        </button>
                        ))}
                        <button 
                        onClick={() => {if(this.state.currentPage < totalPages){this.setState({ currentPage: this.state.currentPage + 1 })}}}>
                            <ArrowRightIcon className="h-6 w-6"/>
                        </button>
                        </div>
                    </div>
                    )}
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
                                <input type="text" id="Name" placeholder="Name" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="name" value={this.state.defaultDriver.name} onChange={this.handleChange} />
                                <input type="text" id="id_Number" placeholder="ID Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="id_number" value={this.state.defaultDriver.id_number} onChange={this.handleChange} />
                                <input type="date" id="DateofBirth" placeholder="Date of Birth" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="dob" value={this.state.defaultDriver.dob} onChange={this.handleChange} />
                                <input type="text" id="Gender" placeholder="Gender" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="gender" value={this.state.defaultDriver.gender} onChange={this.handleChange} />
                                <input type="text" id="PhoneNumber" placeholder="Phone Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="phone_number" value={this.state.defaultDriver.phone_number} onChange={this.handleChange} />
                                <input type="text" id="LicenseGrade" placeholder="License Grade" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="grade" value={this.state.defaultDriver.license.grade} onChange={this.handleChangeStruct} />
                                <input type="text" id="LicenseNumber" placeholder="License Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="number" value={this.state.defaultDriver.license.number} onChange={this.handleChangeStruct} />
                                {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                          <button type="button" className="w-full mt-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { if (this.state.defaultDriver.id) { this.handleSubmitUpdateForm(); } else { this.handleSubmitCreateForm(); } }}>Save</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={this.handleClose}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.isShowingHistory && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>
                      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                          <div className="sm:flex sm:items-start">
                            <div className="text-center sm:text-left">
                            <div class="flex justify-between">
                            <button class="px-1 py-1 transform hover:scale-110 text-gray-500" onClick={this.CloseHistory}><ArrowLeftIcon className="h-5 w-5"/></button>
                            <p className="text-lg font-semibold mb-2 border rounded-lg border-gray-500">Total completed trips: {this.showSumTrip(this.state.tripsForHis[0].driverID)}</p>
                            <p className="text-lg font-semibold mb-2 border rounded-lg border-gray-500">Late trips: {this.showLateTrip(this.state.tripsForHis[0].driverID)}</p>
                            <button class="px-1 py-1 transform hover:scale-110 text-red-500" onClick={this.handleClose}><XIcon className="h-5 w-5"/></button>
                            </div>
                            <table className="w-full h-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                 <thead className="text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center">No.</th>
                                        <th scope="col" className="px-6 py-3 text-center">Departure Location</th>
                                        <th scope="col" className="px-6 py-3 text-center">Arrival Location</th>
                                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                                        <th scope="col" className="px-6 py-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tripsForHis.map((trip,index) => (
                                        <tr key={trip.tripID} lassName="bg-white text-black-800 border-b dark:bg-gray-800 dark:border-black-1000">
                                            <td className="p-3 pr-0 text-center">{index + 1}</td>
                                            <td className="p-3 pr-0 text-center">{trip.departureLocation}</td>
                                            <td className="p-3 pr-0 text-center">{trip.arrivalLocation}</td>
                                            <td className="p-3 pr-0 text-center">{trip.currentStatus}</td>
                                            <td className="p-3 pr-0 text-center"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                    </div>
                  </div>
                  </div>
                )}
                {this.state.showUserInfor && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-0 h-full w-full text-center sm:text-left">
                            <div class="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg h-full w-full">
                            <div class="flex justify-end mt-2">
                                <button class="px-1 py-1 transform hover:scale-110 text-red-500" onClick={this.handleClose}><XIcon className="h-5 w-5"/></button>
                            </div>
                                <div class="px-4 py-5 sm:px-6">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                                        Driver database
                                    </h3>
                                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                        Details and informations about driver.
                                    </p>
                                </div>
                                <div class="border-t border-gray-200">
                                    <dl>
                                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                Name
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.name}
                                            </dd>
                                        </div>
                                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                ID number
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.id_number}
                                            </dd>
                                        </div>
                                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                Gender
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.gender}
                                            </dd>
                                        </div>
                                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                Date of birth
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.dob}
                                            </dd>
                                        </div>
                                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                Phone number
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.phone_number}
                                            </dd>
                                        </div>
                                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                License
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {this.state.defaultDriver.license.grade} - {this.state.defaultDriver.license.number}
                                            </dd>
                                        </div>
                                     
                                        <button type="button" class="border border-gray-300 bg-gray-200 transform hover:scale-110 mb-2" onClick={() => this.showDrivingHistory(this.state.defaultDriver.id)}>Driving history</button>
                                        
                                    </dl>
                                </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
            )}
                </div>
                </div>)}
                {!isLoggedIn && (<Login/>)}
                <Footer/>
            </div> 
            
        );
    }
}
 
export default Driver;