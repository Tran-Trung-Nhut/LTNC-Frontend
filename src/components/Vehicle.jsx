import React from "react";
import axios from "axios"; // uimport axios
class Vehicle extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      vehicle: [],
      DataisLoaded: false,
      isOpenCreateForm: false,
    };
  }
  // execute the code
  componentDidMount() {
    axios.get("http://localhost:8000/Vehicle/list").then((res) => {
      this.setState({
        vehicles: res.data,
        DataisLoaded: true,
      });
    });
  }

  saveNewVehicle = () => {
    // Lấy thông tin từ các input
    const type = document.getElementById("newVehicleType").value;
    const registeredNumber = document.getElementById(
      "newVehicleRegisteredNumber"
    ).value;
    const loadCapacity = document.getElementById(
      "newVehicleLoadCapacity"
    ).value;

    const width = document.getElementById("newVehicleWidth").value;
    const length = document.getElementById("newVehicleLength").value;
    const height = document.getElementById("newVehicleHeight").value;
    const status = document.getElementById("newVehicleStatus").value;

    const newVehicle = {
      type: type,
      registeredNumber: registeredNumber,
      capacity: loadCapacity,
      size: {
        width: width,
        length: length,
        height: height,
      },
      status: status,
    };

    console.log("newVehicle: ", newVehicle);

    axios
      .post("http://localhost:8000/Vehicle/add", newVehicle)
      .then((response) => {
        console.log("Vehicle added successfully:", response.data);
        this.fetchVehicle();
        // Đóng bảng nhập liệu
        this.setState({ isOpenCreateForm: false });
      })
      .catch((error) => {
        console.error("Error adding vehicle:", error);
        alert("Failed to add vehicle. Please try again later.");
      });
  };

  cancelAddVehicle = () => {
    this.setState({ isOpenCreateForm: false });
  };

  fetchVehicle = () => {
    axios
      .get("http://localhost:8000/Vehicle/list")
      .then((res) => {
        this.setState({
          vehicles: res.data,
          DataisLoaded: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
        alert("Failed to fetch vehicles. Please try again later.");
      });
  };

  editVehicle = (vehicleId) => {
    this.setState({
      editedVehicleId: vehicleId,
      editedVehicle: this.state.vehicles.find(
        (vehicle) => vehicle.id === vehicleId
      ),
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editedVehicle: {
        ...prevState.editVehicle,
        [name]: value,
      },
    }));
  };

  saveEditedVehicle = (vehicleId) => {
    const { editedVehicle } = this.state;
    axios
      .put(`http://localhost:8000/Vehicle/update`, editedVehicle)
      .then(() => {
        this.setState({
          editedVehicle: null,
        });
        this.fetchVehicle();
      })
      .catch((error) => {
        console.error("Error updating vehicles:", error);
        alert("Failed to update vehicle. Please try again later.");
      });
  };

  deleteVehicle = (id) => {
    const isConfirmed = window.confirm("Are you sure to delete this vehicle?");
    if (isConfirmed) {
      axios
        .delete(`http://localhost:8000/Vehicle/delete/${id}`)
        .then(() => {
          this.setState((prevState) => ({
            vehicles: prevState.vehicles.filter((vehicle) => vehicle.id !== id),
          }));
        })
        .catch((error) => {
          console.log("Error deleting vehicle:", error);
        });
    }
  };

  toggleAddVehicleForm = () => {
    this.setState({ isOpenCreateForm: true });
  };

  render() {
    const { DataisLoaded, vehicles, editedVehicleId, editedVehicle } =
      this.state;

     if (!DataisLoaded)
      return (
        <div>
          <h1> </h1>
        </div>
      );

    return (
      <div className="App">
        <h1 className="Vehicle">List of Vehicle</h1>
        <div className="container">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.toggleAddVehicleForm}
          >
            Add new vehicle
          </button>
          {this.state.isOpenCreateForm && (
            <div className="popup">
              <div className="popup-content">
                <input
                  type="text"
                  id="newVehicleType"
                  className="form-control"
                  placeholder="Type"
                />
                <input
                  type="text"
                  id="newVehicleWidth"
                  className="form-control"
                  placeholder="Width"
                />
                <input
                  type="text"
                  id="newVehicleLength"
                  className="form-control"
                  placeholder="Length"
                />
                <input
                  type="text"
                  id="newVehicleHeight"
                  className="form-control"
                  placeholder="Height"
                />
                <input
                  type="text"
                  id="newVehicleRegisteredNumber"
                  className="form-control"
                  placeholder="Registered Number"
                />
                <input
                  type="text"
                  id="newVehicleLoadCapacity"
                  className="form-control"
                  placeholder="Load Capacity (in tons)"
                />
                <input
                  type="text"
                  id="newVehicleStatus"
                  className="form-control"
                  placeholder="Status"
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={this.saveNewVehicle}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.cancelAddVehicle}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <table className="table table-hover mt-3" align="center">
            <thead className="thead-light">
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Registered Number</th>
                <th scope="col">Type</th>
                <th scope="col">Width</th>
                <th scope="col">Height</th>
                <th scope="col">Length</th>
                <th scope="col">Load Capacity</th>
                <th scope="col">Status</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {vehicles?.map((vehicle, index) => (
              <tr key={vehicle.id}>
                <td>{index + 1}</td>
                <td>{vehicle.registeredNumber}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.width}</td>
                <td>{vehicle.height}</td>
                <td>{vehicle.length}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.status}</td>

                <td>
                  {editedVehicleId === vehicle.id ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => this.saveEditedVehicle(vehicle.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => this.editVehicle(vehicle.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger mx-2"
                    onClick={() => this.deleteVehicle(vehicle.id)}
                  >
                    Delete
                  </button>
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
