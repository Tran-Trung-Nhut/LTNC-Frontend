import React from "react";
import axios from "axios"; // uimport axios
import AuthContext from "./Global/AuthContext";
class Vehicle extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            vehicle: [],
            DataisLoaded: false,
            isAddingVehicle: false,
        };
    }
    // execute the code
    componentDidMount() {
        axios.get(
            "http://localhost:8000/Vehicle/list"
            )
            .then((res) => {
                    
                this.setState({ 
                    vehicles: res.data,
                    DataisLoaded: true,
                });
            });
    }
    saveNewVehicle = () => {
        // Lấy thông tin từ các input
        const size = document.getElementById("newVehicleSize").value;
        const loadCapacity = document.getElementById("newVehicleLoadCapacity").value;
        const fuel = document.getElementById("newVehicleFuel").value;
        const situation = document.getElementById("newVehicleSituation").value;
        const type = document.getElementById("newVehicleType").value;
    
        const newVehicle = {
            size: size,
            loadCapacity: loadCapacity,
            fuel: fuel,
            situation: situation,
            type: type,
        };
    
  
        axios.post("http://localhost:8000/Vehicle/add", newVehicle)
            .then((response) => {
                console.log("Vehicle added successfully:", response.data);
                this.fetchVehicle();
                // Đóng bảng nhập liệu
                this.setState({ isAddingVehicle: false });
            })
            .catch((error) => {
                console.error("Error adding vehicle:", error);
                alert("Failed to add vehicle. Please try again later.");
            });
    }
    cancelAddVehicle = () => {
        this.setState({ isAddingVehicle: false });
    }
    fetchVehicle = () => {
        axios.get("http://localhost:8000/Vehicle/list")
            .then((res) => {
                this.setState({ 
                    vehicles: res.data,
                    DataisLoaded: true,
                });
            })
            .catch(error => {
                console.error("Error fetching vehicles:", error);
                alert("Failed to fetch vehicles. Please try again later.");
            });
    }
    editVehicle = (vehicleId) => {
        this.setState({
            editedVehicleId: vehicleId,
            editedVehicle: this.state.vehicles.find(vehicle => vehicle.id === vehicleId)
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            editedVehicle: {
                ...prevState.editVehicle,
                [name]: value
            }
        }));
    }

    saveEditedVehicle = (vehicleId) => {
        const { editedVehicle } = this.state;
        axios.put(`http://localhost:8000/Vehicle/update`, editedVehicle)
            .then(() => {
                this.setState({
                    editedVehicle: null
                });
                this.fetchVehicle(); 
            })
            .catch(error => {
                console.error("Error updating vehicles:", error);
                alert("Failed to update vehicle. Please try again later.");
            });
    }
    deleteVehicle = (id) => {
        const isConfirmed = window.confirm("Are you sure to delete this vehicle?");
        if(isConfirmed){
            axios.delete(`http://localhost:8000/Vehicle/delete/${id}`)
                .then(() => {
                    this.setState(prevState => ({
                        vehicles: prevState.vehicles.filter(vehicle => vehicle.id !== id)
                    }));
                })
                .catch(error => {
                    console.log("Error deleting vehicle:", error);
                });
        }
    }
    
    toggleAddVehicleForm = () => {
        const userRole = localStorage.getItem('userRole');
        if(userRole === 'admin'){
            this.setState(prevState => ({
                isAddingVehicle: !prevState.isAddingVehicle
            }));
        }else{
            alert("You don't have permisson to do that!")
        }
    }

    render() {
        const { DataisLoaded, vehicles, editedVehicleId,editedVehicle } = this.state;
        if (!DataisLoaded)
            return (
                <div>
                    <h1> </h1>
                </div>
            );
 
        return (
            <div className="App">
                <h1 className="Vehicle" >List of Vehicle</h1>
                <div className="container">
                <button type="button" className="btn btn-primary" onClick={this.toggleAddVehicleForm}>Add new vehicle</button>
                {this.state.isAddingVehicle && (
                    <div>
                        <input type="text" id="newVehicleType" className="form-control" placeholder="Type" />
                        <input type="text" id="newVehicleSize" className="form-control" placeholder="Size" />
                        <input type="text" id="newVehicleLoadCapacity" className="form-control" placeholder="Load Capacity" />
                        <input type="text" id="newVehicleFuel" className="form-control" placeholder="Fuel" />
                        <input type="text" id="newVehicleSituation" className="form-control" placeholder="Situation" />
                        <button type="button" className="btn btn-success" onClick={this.saveNewVehicle}>Save</button>
                        <button type="button" className="btn btn-secondary" onClick={this.cancelAddVehicle}>Cancel</button>
                    </div>
                )}
                <table className="table table-hover mt-3" align="center">
                    <thead className="thead-light">
                        <tr>
                        <th scope="col">Ordinal number</th>
                        <th scope="col">Type</th>
                        <th scope="col">Size</th>
                        <th scope="col">Load capacity</th>  
                        <th scope="col">Fuel</th>
                        <th scope="col">Situation</th>
                        <th scope="col">Option</th>
                        </tr>
                    </thead>
                    {vehicles?.map((vehicle,index) => (
                        <tr key={vehicle.id}>
                        <td>
                            {index + 1}
                        </td>
                        <td>
                            {editedVehicleId === vehicle.id ?
                                <input type="text" name="type" value={editedVehicle.type} onChange={this.handleChange} />
                                : vehicle.type}
                        </td>
                        <td>
                            {editedVehicleId === vehicle.id ?
                                <input type="text" name="size" value={editedVehicle.size} onChange={this.handleChange} />
                                : vehicle.size}
                        </td>
                        <td>
                            {editedVehicle === vehicle.loadCapacity ?
                                <input type="text" name="loadCapacity" value={vehicle.loadCapacity} onChange={this.handleChange} />
                                : vehicle.loadCapacity}
                        </td>
                        <td>
                            {editedVehicle === vehicle.fuel ?
                                <input type="text" name="fuel" value={vehicle.fuel} onChange={this.handleChange} />
                                : vehicle.fuel}
                        </td>
                        <td>
                            {editedVehicle === vehicle.situation ?
                                <input type="text" name="situation" value={vehicle.situation} onChange={this.handleChange} />
                                : vehicle.situation}
                        </td>
                        <td>
                            {editedVehicleId === vehicle.id ?
                                <button type="button" className="btn btn-success" onClick={() => this.saveEditedVehicle(vehicle.id)}>Save</button>
                                :
                                <button type="button" className="btn btn-warning" onClick={() => this.editVehicle(vehicle.id)}>Edit</button>
                            }
                            <button type="button" className="btn btn-danger mx-2" onClick={() => this.deleteVehicle(vehicle.id)}>Delete</button>
                        </td>
                    </tr>  
                               
                    ))}
                 </table>
                </div>
            </div>
        );
    }
}
 
export default Vehicle;