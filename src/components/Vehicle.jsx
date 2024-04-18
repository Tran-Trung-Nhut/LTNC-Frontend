import React from "react";
import axios from "axios"; // uimport axios
import AuthContext from "../Global/AuthContext";
import Login from "./Login";
import { PencilIcon, TrashIcon, TruckIcon } from '@heroicons/react/outline';


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
            <TruckIcon className="h-6 w-10 text-blue-200" />
          </button>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" align="center">
            <thead className="text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">No.</th>
                <th scope="col" className="px-6 py-3 text-center">Registered Number</th>
                <th scope="col" className="px-6 py-3 text-center">Type</th>
                <th scope="col" className="px-6 py-3 text-center">Size</th>
                <th scope="col" className="px-6 py-3 text-center">Load Capacity</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center"></th>
              </tr>
            </thead>
            {this.state.vehicles.map((vehicle, index) => (
              <tr key={vehicle.id} className="bg-white text-black-800 border-b dark:bg-gray-800 dark:border-black-1000">
                <td className="p-3 pr-0 text-center">{index + 1}</td>
                <td className="p-3 pr-0 text-center">{vehicle.registeredNumber}</td>
                <td className="p-3 pr-0 text-center">{vehicle.type}</td>
                <td className="p-3 pr-0 text-center">{vehicle.size.width} x {vehicle.size.height} x {vehicle.size.height}</td>
                <td className="p-3 pr-0 text-center">{vehicle.capacity}</td>
                <td className="p-3 pr-0 text-center">{vehicle.status}</td>
                <td>
                  <button
                    type="button"
                    className="h-5 w-5 mr-2"
                    onClick={() => {
                      this.handleEdit(vehicle);
                    }}
                  >
                    <PencilIcon className="h-5 w-5 text-yellow-400"/>
                  </button>
                  <button
                    type="button"
                    className="h-5 w-5 mr-2"
                    onClick={() => {
                      this.handleDelete(vehicle.id);
                    }}
                  >
                    <TrashIcon className="h-5 w-5 text-red-400"/>
                  </button>
                </td>
              </tr>
            ))}
          </table>
          </div>
        </div>

        {this.state.isOpenVehicleForm && (
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
                                Add new vehicle
                              </h3>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Type"
                                  name="type"
                                  value={this.state.formData.type}
                                  onChange={this.handleChangeInput}
                                />
                                <input
                                  type="number"
                                  id="newVehicleWidth"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Width"
                                  name="width"
                                  value={this.state.formData.size.width}
                                  onChange={this.handleChangeSizeInput}
                                />
                                <input
                                  type="number"
                                  id="newVehicleLength"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Length"
                                  name="length"
                                  value={this.state.formData.size.length}
                                  onChange={this.handleChangeSizeInput}
                                />
                                <input
                                  type="number"
                                  id="newVehicleHeight"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Height"
                                  name="height"
                                  value={this.state.formData.size.height}
                                  onChange={this.handleChangeSizeInput}
                                />
                                <input
                                  type="text"
                                  id="newVehicleRegisteredNumber"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Registered Number"
                                  name="registeredNumber"
                                  value={this.state.formData.registeredNumber}
                                  onChange={this.handleChangeInput}
                                />
                                <input
                                  type="number"
                                  id="newVehicleLoadCapacity"
                                  className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Load Capacity (in tons)"
                                  name="capacity"
                                  value={this.state.formData.capacity}
                                  onChange={this.handleChangeInput}
                                      />
                    {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                    </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { if (this.state.defaultDriver.id) { this.handleSubmitUpdateForm(); } else { this.handleSubmitCreateForm(); } }}>Save</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={this.handleCloseVehicleForm}>Cancel</button>
                        </div>
                      </div>
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