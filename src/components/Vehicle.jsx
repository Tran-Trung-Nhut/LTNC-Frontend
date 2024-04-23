import React from "react";
import axios from "axios"; // uimport axios
import AuthContext from "../Global/AuthContext";
import Login from "./Login";
import { red } from "@mui/material/colors";

const defaultFormData = {
  id: undefined,
  type: "CONTAINER",
  registeredNumber: "",
  capacity: "",
  size: {
    width: "",
    length: "",
    height: "",
  },
  status: "AVAILABLE",
};

class Vehicle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      trips:[],
      isOpenVehicleForm: false,
      formData: defaultFormData,
      error: ""
    };
  }

  showError = (message) =>{
    this.setState({error:message})
  }

  static contextType = AuthContext;

  componentDidMount = () => {
    this.fetchVehicles();
    this.fetchTrips();
  };

  fetchTrips = () => {
    axios.get("http://localhost:8000/Trip/list").then((response) => {
      this.setState({ trips: response.data });
    });
  };

  fetchVehicles = () => {
    axios.get("http://localhost:8000/Vehicle/list").then((response) => {
      this.setState({ vehicles: response.data });
    });
  };

  handleOpenVehicleForm = () => {
    this.setState({ isOpenVehicleForm: true });
  };

  handleCloseVehicleForm = () => {
    this.setState({ isOpenVehicleForm: false });
    this.handleClearForm();
    this.showError("")
  };

  handleSubmitCreateForm = () => {
    if (!this.checkAllFieldsFilled()) {
      this.showError("You have to fill in all fields");
      return;
    }else {
        this.showError("");
    }
    axios
      .post("http://localhost:8000/Vehicle/add", this.state.formData)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isOpenVehicleForm: false });
          this.fetchVehicles();
          this.handleClearForm();
        }
      });
  };

  handleSubmitUpdateForm = () => {
    if (!this.checkAllFieldsFilled()) {
      this.showError("You have to fill in all fields");
      return;
    }else {
        this.showError("");
    }
    axios
      .put("http://localhost:8000/Vehicle/update", this.state.formData)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ isOpenVehicleForm: false });
          this.fetchVehicles();
          this.handleClearForm();
        }
      });
  };

  handleClearForm = () => {
    this.setState({
      formData: defaultFormData,
    });
  };

  handleChangeInput = (event) => {
    const { name, value } = event.target;

    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  handleChangeSizeInput = (event) => {
    const { name, value } = event.target;

    this.setState({
      formData: {
        ...this.state.formData,
        size: {
          ...this.state.formData.size,
          [name]: value,
        },
      },
    });
  };

  handleDelete = (vehicleId) => {
    const isConfirmed = window.confirm("Are you sure to delete this vehicle?");
    if (isConfirmed) {
      axios
        .delete(`http://localhost:8000/Vehicle/delete/${vehicleId}`)
        .then((response) => {
          if (response.status === 200) this.fetchVehicles();
        });
    }
  };

  handleEdit = (vehicle) => {
    this.handleOpenVehicleForm(true);
    this.setState({ formData: vehicle });
  };

  checkDriverStatus = (vehicleId) => {
    const ongoingTrips = this.state.trips.filter(trip => trip.vehicleID === vehicleId && trip.currentStatus === "Chưa hoàn thành");
    return ongoingTrips.length > 0 ? "ON TRIP" : "AVAILABLE";
  }

  checkAllFieldsFilled = () => {
    const { type, registeredNumber, capacity, size } = this.state.formData;
    return (type !== "" && registeredNumber !== "" && capacity !== "" && size !== "");
  };

  render() {
    const { isLoggedIn, userRole, password } = this.context
    return (
      <>
      {isLoggedIn && (<div className="App">
        <h1 className="Vehicle">List of Vehicle</h1>
        <div className="container">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleOpenVehicleForm}
          >
            Add new vehicle
          </button>
          <table className="table table-hover mt-3" align="center">
            <thead className="thead-light">
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Registered Number</th>
                <th scope="col">Type</th>
                <th scope="col">Size</th>

                <th scope="col">Load Capacity</th>
                <th scope="col">Status</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {this.state.vehicles.map((vehicle, index) => (
              <tr key={vehicle.id}>
                <td>{index + 1}</td>
                <td>{vehicle.registeredNumber}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.size.width} x {vehicle.size.length} x {vehicle.size.height}</td>

                <td>{vehicle.capacity}</td>
                <td>{vehicle.status}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      this.handleEdit(vehicle);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mx-2"
                    onClick={() => {
                      this.handleDelete(vehicle.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>

        {this.state.isOpenVehicleForm && (
          <div className="popup">
            <div className="popup-content">
              <input
                type="text"
                className="form-control"
                placeholder="Type"
                name="type"
                value={this.state.formData.type}
                onChange={this.handleChangeInput}
              />
              <input
                type="number"
                id="newVehicleWidth"
                className="form-control"
                placeholder="Width"
                name="width"
                value={this.state.formData.size.width}
                onChange={this.handleChangeSizeInput}
              />
              <input
                type="number"
                id="newVehicleLength"
                className="form-control"
                placeholder="Length"
                name="length"
                value={this.state.formData.size.length}
                onChange={this.handleChangeSizeInput}
              />
              <input
                type="number"
                id="newVehicleHeight"
                className="form-control"
                placeholder="Height"
                name="height"
                value={this.state.formData.size.height}
                onChange={this.handleChangeSizeInput}
              />
              <input
                type="text"
                id="newVehicleRegisteredNumber"
                className="form-control"
                placeholder="Registered Number"
                name="registeredNumber"
                value={this.state.formData.registeredNumber}
                onChange={this.handleChangeInput}
              />
              <input
                type="number"
                id="newVehicleLoadCapacity"
                className="form-control"
                placeholder="Load Capacity (in tons)"
                name="capacity"
                value={this.state.formData.capacity}
                onChange={this.handleChangeInput}
              />
              {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  if (this.state.formData.id) {
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
                onClick={this.handleCloseVehicleForm}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      )};
      {!isLoggedIn && (<Login></Login>)}
      </>
    );
  }
}

export default Vehicle;