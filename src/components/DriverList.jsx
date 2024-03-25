import React from "react";
import axios from "axios"; // uimport axios
import "./DriverList.css"
class DriverList extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            DataisLoaded: false,
            isAddingDriver: false,
        };
    }

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
    saveNewDriver = () => {
        // Lấy thông tin từ các input
        const name = document.getElementById("newDriverName").value;
        const personal_ID = document.getElementById("newDriverPersonalID").value;
        const sex = document.getElementById("newDriverSex").value;
    
        // Tạo object chứa thông tin của driver mới
        const newDriver = {
            name: name,
            personal_ID: personal_ID,
            sex: sex
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
        this.setState(prevState => ({
            editedDriver: {
                ...prevState.editedDriver,
                [name]: value
            }
        }));
    }

    saveEditedDriver = (driverId) => {
        const { editedDriver } = this.state;
        axios.put(`http://localhost:8000/Driver/update`, editedDriver)
            .then(() => {
                this.setState({
                    editedDriverId: null
                });
                this.fetchDrivers(); // Fetch drivers again to get updated data
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
    
    toggleAddDriverForm = () => {
        this.setState(prevState => ({
            isAddingDriver: !prevState.isAddingDriver
        }));
    }

    render() {
        const { DataisLoaded, drivers, editedDriverId,editedDriver } = this.state;
        if (!DataisLoaded)
            return (
                <div>
                    <h1></h1>
                </div>
            );
 
        return (
            <div className="App">
                <h1 className="Driver" >List of Driver</h1>
                <div className="container">
                <button type="button" className="btn btn-primary" onClick={this.toggleAddDriverForm}>Add new driver</button>
                {this.state.isAddingDriver && (
                    <div>
                        <input type="text" id="newDriverName" className="form-control" placeholder="Name" />
                        <input type="text" id="newDriverPersonalID" className="form-control" placeholder="Personal ID" />
                        <input type="text" id="newDriverSex" className="form-control" placeholder="Gender" />
                        <button type="button" className="btn btn-success" onClick={this.saveNewDriver}>Save</button>
                        <button type="button" className="btn btn-secondary" onClick={this.cancelAddDriver}>Cancel</button>
                    </div>
                )}
                <table className="table table-hover mt-3" align="center">
                    <thead className="thead-light">
                        <tr>
                        <th scope="col">Ordinal number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Personal ID</th>
                        <th scope="col">Gender</th>  
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
                                <input type="text" name="personal_ID" value={editedDriver.personal_ID} onChange={this.handleChange} />
                                : driver.personal_ID}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <input type="text" name="sex" value={editedDriver.sex} onChange={this.handleChange} />
                                : driver.sex}
                        </td>
                        <td>
                            {editedDriverId === driver.id ?
                                <button type="button" className="btn btn-success" onClick={() => this.saveEditedDriver(driver.id)}>Save</button>
                                :
                                <button type="button" className="btn btn-warning" onClick={() => this.editDriver(driver.id)}>Edit</button>
                            }
                            <button type="button" className="btn btn-danger mx-2" onClick={() => this.deleteDriver(driver.id)}>Delete</button>
                        </td>
                    </tr>  
                               
                    ))}
                 </table>
                </div>
            </div>
        );
    }
}
 
export default DriverList;