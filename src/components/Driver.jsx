import React, { useContext } from "react";
import axios from "axios"; 
import "./Driver.css"
import Login from "./Login";
import AuthContext from "./Global/AuthContext";
class Driver extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            DataisLoaded: false,
            isAddingDriver: false,
            searchResults: [],
        };
    }

    static contextType = AuthContext;

    // execute the code
    componentDidMount() {
        axios.get(
            "http://localhost:8000/Driver/list"
            )
            .then((res) => {
                    
                this.setState({ 
                    drivers: res.data,
                    DataisLoaded: true,
                });
            });
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
    saveNewDriver = () => {
        // Lấy thông tin từ các input
        const name = document.getElementById("Name").value;
        const id_number = document.getElementById("id_Number").value;
        const dob = document.getElementById("DateofBirth").value;
        const gender = document.getElementById("Gender").value;
        const phone_number = document.getElementById("PhoneNumber").value;
        const licenseGrade = document.getElementById("LicenseGrade").value;
        const licenseNumber = document.getElementById("LicenseNumber").value;
        const availability = document.getElementById("Availability").value;

        const license = {
            grade: licenseGrade,
            number: licenseNumber
        } 
    
        // Tạo object chứa thông tin của driver mới
        const newDriver = {
            name: name,
            id_number: id_number,
            dob: dob,
            gender: gender,
            phone_number: phone_number,
            license: license,
            availability: availability
        };
    
        // Gửi object chứa thông tin của driver mới lên server để lưu
        axios.post("http://localhost:8000/Driver/add", newDriver)
            .then((response) => {
                console.log("Driver added successfully:", response.data);
                // Sau khi lưu thành công, cập nhật lại danh sách drivers
                this.fetchDrivers();
                // Đóng bảng nhập liệu
                this.setState({ isAddingDriver: false });
            })
            .catch((error) => {
                console.error("Error adding driver:", error);
                alert("Failed to add driver. Please try again later.");
            });
    }
    cancelAddDriver = () => {
        this.setState({ isAddingDriver: false });
    }
    fetchDrivers = () => {
        axios.get("http://localhost:8000/Driver/list")
            .then((res) => {
                this.setState({ 
                    drivers: res.data,
                    DataisLoaded: true,
                });
            })
            .catch(error => {
                console.error("Error fetching drivers:", error);
                alert("Failed to fetch drivers. Please try again later.");
            });
    }
    editDriver = (driverId) => {
        this.setState({
            editedDriverId: driverId,
            editedDriver: this.state.drivers.find(driver => driver.id === driverId)
        });
        
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        const [fieldName, subFieldName] = name.split('.');
    
        if (fieldName === 'license') {
            this.setState(prevState => ({
                editedDriver: {
                    ...prevState.editedDriver,
                    license: {
                        ...prevState.editedDriver.license,
                        [subFieldName]: value
                    }
                }
            }));
        } else {
            this.setState(prevState => ({
                editedDriver: {
                    ...prevState.editedDriver,
                    [name]: value
                }
            }));
        }
    }

    showDrivingHistory = () => {
        
    }

    

    saveEditedDriver = (driverId) => {
        const { editedDriver } = this.state;
        axios.put(`http://localhost:8000/Driver/update`, editedDriver)
            .then(() => {
                this.setState({
                    editedDriverId: null,
                 });
                this.fetchDrivers(); 
            })
            .catch(error => {
                console.error("Error updating driver:", error);
                alert("Failed to update driver. Please try again later.");
            });
    }
    deleteDriver = (id) => { 
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
    
    handleLogin = () =>{
        this.setState({isLoggedIn : true})
    }

    toggleAddDriverForm = () => {
        this.setState(prevState => ({
            isAddingDriver: !prevState.isAddingDriver
        }));
    }

    render() {
        const { DataisLoaded, drivers, editedDriverId,editedDriver    } = this.state;
        const { isLoggedIn, userRole, password } = this.context
        
        if (!DataisLoaded)
            return (
                <div>
                    <h1>Wait..</h1>
                </div>
            );
 
        return (
            <div className="App">
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
                {this.state.isAddingDriver && (
                    <div className="popup">
                        <div className="popup-content">
                            <input type="text" id="Name" className="form-control" placeholder="Name" />
                            <input type="text" id="id_Number" className="form-control" placeholder="ID number" />
                            <input type="text" id="DateofBirth" className="form-control" placeholder="Date of Birth" />
                            <input type="text" id="Gender" className="form-control" placeholder="Gender" />
                            <input type="text" id="PhoneNumber" className="form-control" placeholder="Phone number" />
                            <input type="text" id="LicenseGrade" className="form-control" placeholder="License grade" />
                            <input type="text" id="LicenseNumber" className="form-control" placeholder="License number" />
                            <input type="text" id="Availability" className="form-control" placeholder="Status" />
                            <button type="button" className="btn btn-success" onClick={this.saveNewDriver}>Save</button>
                            <button type="button" className="btn btn-secondary" onClick={this.cancelAddDriver}>Cancel</button>
                        </div>
                    </div>
                )}
                <table className="table table-hover mt-3" align="center">
                    <thead className="thead-light">
                        <tr>
                        <th scope="col">Ordinal number</th>
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
                    {drivers?.map((driver,index) => (
                        <tr key={driver.id}>
                        <td>
                            {index + 1}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="name" value={editedDriver.name} onChange={this.handleChange} />
                                : driver.name}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="id_number" value={editedDriver.id_number} onChange={this.handleChange} />
                                : driver.id_number}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="dob" value={editedDriver.dob} onChange={this.handleChange} />
                                : driver.dob}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="gender" value={editedDriver.gender} onChange={this.handleChange} />
                                : driver.gender}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="phone_number" value={editedDriver.phone_number} onChange={this.handleChange} />
                                : driver.phone_number}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?(
                            <div>
                                <input type="text" name="license.grade" value={editedDriver.license.grade} onChange={this.handleChange} />
                                <input type="text" name="license.number" value={editedDriver.license.number} onChange={this.handleChange} />
                            </div>
                            ):(
                                `${driver.license.grade} - ${driver.license.number}`
                            )}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="availability" value={editedDriver.availability} onChange={this.handleChange} />
                                : driver.availability}
                        </td>
                        <td>
                            {editedDriverId === driver.id ? (
                                    <button type="button" className="btn btn-success" onClick={() => this.saveEditedDriver(driver.id)}>Save</button>
                                ) : (
                                    userRole === 'admin' && (
                                        <button type="button" className="btn btn-warning" onClick={() => this.editDriver(driver.id)}>Edit</button>
                                    )
                                )}
                                {userRole === 'admin' && (<button type="button" className="btn btn-danger mx-2" onClick={() => this.deleteDriver(driver.id)}>Delete</button>)}
                                <button type="button" className="" onClick={() => this.showDrivingHistory}>Driving history</button>
                        </td>
                    </tr>  
                               
                    ))}
                 </table>
                </div>
                </div>)}
                {!isLoggedIn && (<Login></Login>)}
            </div>
        );
    }
}
 
export default Driver;