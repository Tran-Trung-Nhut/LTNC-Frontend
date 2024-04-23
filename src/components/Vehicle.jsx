import React from "react";
import axios from "axios"; // uimport axios
import AuthContext from "../Global/AuthContext";
import Login from "./Login";
import {
  PencilIcon,
  TrashIcon,
  TruckIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import Background from "../image/logo.jpg";
import "./css/Vehicle.css";
import { Label, Select, TextInput } from "flowbite-react";

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
      trips: [],
      isOpenVehicleForm: false,
      formData: defaultFormData,
      error: "",
      currentPage: 1,
      vehiclesPerPage: 10,
    };
  }

  showError = (message) => {
    this.setState({ error: message });
  };

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
    this.showError("");
  };

  handleSubmitCreateForm = () => {
    if (!this.checkAllFieldsFilled()) {
      this.showError("You have to fill in all fields");
      return;
    } else {
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
    } else {
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
    const ongoingTrips = this.state.trips.filter(
      (trip) =>
        trip.vehicleID === vehicleId && trip.currentStatus === "Chưa hoàn thành"
    );
    return ongoingTrips.length > 0 ? "ON TRIP" : "AVAILABLE";
  };

  checkAllFieldsFilled = () => {
    const { registeredNumber, capacity, size } = this.state.formData;
    return registeredNumber !== "" && capacity !== "" && size !== "";
  };

  handleSearchChange = (e) => {
    const searchValue = e.currentTarget.value;

    axios
      .get(`http://localhost:8000/Vehicle/find`, {
        params: { search: searchValue },
      })
      .then((response) => {
        console.log({ response });
        if (response.status === 200) {
          this.setState({ vehicles: response.data || [] });
        }
      });
  };

  render() {
    const { isLoggedIn, userRole, password } = this.context;

    const totalPages = Math.ceil(
      this.state.vehicles.length / this.state.vehiclesPerPage
    );

    const start = (this.state.currentPage - 1) * this.state.vehiclesPerPage;
    const end = start + this.state.vehiclesPerPage;

    const currentVehicles = this.state.vehicles.slice(start, end);

    return (
      <>
        <div className="App">
          <div
            className="wrapper bg-cover"
            style={{ backgroundImage: `url(${Background})` }}
          >
            <div className="container">
              <div className="flex items-center gap-4 mt-28">
                <div className="w-full relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search by vehicle number, type and status..."
                    onChange={this.handleSearchChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute bottom-[3px] right-0 flex items-center pr-3 pointer-events-none transform hover:scale-110"
                  >
                    <SearchIcon className="h-5 w-5 text-gray-400 mt-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary flex items-center gap-2 py-2 px-3"
                  onClick={this.handleOpenVehicleForm}
                >
                  <p>Add</p>
                  <PlusIcon className="h-4 text-blue-200 mt-0" />
                </button>
              </div>
              <div className="relative z-2 overflow-x-auto shadow-md sm:rounded-lg   mt-3">
                <div className="bg-white">
                  <table
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    align="center"
                  >
                    <thead className="bg-[#030637] text-white">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          No.
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Registered Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Load Capacity
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-center"></th>
                      </tr>
                    </thead>
                    {currentVehicles.map((vehicle, index) => (
                      <tr
                        key={vehicle.id}
                        className="bg-white text-black border-b dark:bg-gray-800 dark:border-black-1000"
                      >
                        <td className="p-3 pr-0 text-center">
                          {index +
                            1 +
                            (this.state.currentPage - 1) *
                              this.state.vehiclesPerPage}
                        </td>
                        <td className="p-3 pr-0 text-center">
                          {vehicle.registeredNumber}
                        </td>
                        <td className="p-3 pr-0 text-center capitalize">
                          {vehicle.type.toLowerCase()}
                        </td>
                        <td className="p-3 pr-0 text-center">
                          {vehicle.size.width} x {vehicle.size.height} x{" "}
                          {vehicle.size.height}
                        </td>
                        <td className="p-3 pr-0 text-center">
                          {vehicle.capacity}
                        </td>
                        <td className="p-3 pr-0 text-center capitalize">
                          {vehicle.status.toLowerCase()}
                        </td>
                        <td>
                          {userRole === "admin" && (
                            <>
                              <button
                                type="button"
                                className="h-5 w-5 mr-2"
                                onClick={() => {
                                  this.handleEdit(vehicle);
                                }}
                              >
                                <PencilIcon className="h-5 w-5 text-yellow-400" />
                              </button>
                              <button
                                type="button"
                                className="h-5 w-5 mr-2"
                                onClick={() => {
                                  this.handleDelete(vehicle.id);
                                }}
                              >
                                <TrashIcon className="h-5 w-5 text-red-400" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </table>
                  <div className="flex justify-center py-3 vehicle-pagination">
                    <button
                      onClick={() => {
                        if (this.state.currentPage !== 1) {
                          this.setState({
                            currentPage: this.state.currentPage - 1,
                          });
                        }
                      }}
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        className={`border border-black-1000 mx-1 text-sm ${
                          i + 1 === this.state.currentPage && "active-page"
                        } `}
                        key={i}
                        onClick={() => this.setState({ currentPage: i + 1 })}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        if (this.state.currentPage < totalPages) {
                          this.setState({
                            currentPage: this.state.currentPage + 1,
                          });
                        }
                      }}
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {this.state.isOpenVehicleForm && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4 tailwind-class-name">
                      <div className="sm:flex sm:items-start">
                        <div className="text-center w-full">
                          <div className="mt-2">
                            <div className="vehicle-form-type mb-3">
                              <Label
                                htmlFor="type"
                                value="Select vehicle type"
                                className="mb-2 text-start block font-semibold"
                              />
                              <Select
                                id="type"
                                required
                                name="type"
                                value={this.state.formData.type}
                                onChange={this.handleChangeInput}
                              >
                                <option value="CONTAINER">Container</option>
                                <option value="BUS">Bus</option>
                                <option value="TRUCK">Truck</option>
                              </Select>
                            </div>
                            <div className="vehicle-form-width mb-3">
                              <Label
                                htmlFor="width"
                                value="Width (meters)"
                                className="mb-2 text-start block font-semibold"
                              />
                              <TextInput
                                type="number"
                                placeholder="Enter vehicle width"
                                value={this.state.formData.size.width}
                                name="width"
                                onChange={this.handleChangeSizeInput}
                              />
                            </div>
                            <div className="vehicle-form-length mb-3">
                              <Label
                                htmlFor="length"
                                value="Length (meters)"
                                className="mb-2 text-start block font-semibold"
                              />
                              <TextInput
                                type="number"
                                placeholder="Enter vehicle length"
                                value={this.state.formData.size.length}
                                name="length"
                                onChange={this.handleChangeSizeInput}
                              />
                            </div>
                            <div className="vehicle-form-height mb-3">
                              <Label
                                htmlFor="height"
                                value="Height (meters)"
                                className="mb-2 text-start block font-semibold"
                              />
                              <TextInput
                                type="number"
                                placeholder="Enter vehicle height"
                                value={this.state.formData.size.height}
                                name="height"
                                onChange={this.handleChangeSizeInput}
                              />
                            </div>
                            <div className="vehicle-form-registered-number mb-3">
                              <Label
                                htmlFor="registeredNumber"
                                value="Registered Number"
                                className="mb-2 text-start block font-semibold"
                              />
                              <TextInput
                                type="string"
                                placeholder="Enter vehicle registered number"
                                value={this.state.formData.registeredNumber}
                                name="registeredNumber"
                                onChange={this.handleChangeInput}
                              />
                            </div>
                            <div className="vehicle-form-load-capacity mb-3">
                              <Label
                                htmlFor="capacity"
                                value="Load Capacity (tons)"
                                className="mb-2 text-start block font-semibold"
                              />
                              <TextInput
                                type="number"
                                placeholder="Enter load capacity"
                                value={this.state.formData.capacity}
                                name="capacity"
                                onChange={this.handleChangeInput}
                              />
                            </div>
                            <div className="w-100">
                              <div className="mb-2 block">
                                <Label
                                  htmlFor="status"
                                  value="Select vehicle status"
                                  className="mb-2 text-start block font-semibold"
                                />
                              </div>
                              <Select
                                id="status"
                                name="status"
                                required
                                value={this.state.formData.status}
                                onChange={this.handleChangeInput}
                              >
                                <option value="AVAILABLE">Available</option>
                                <option value="MAINTENANCE">Maintenance</option>
                              </Select>
                            </div>
                            {this.state.error && (
                              <p style={{ color: "red" }}>{this.state.error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 px-4 pb-4 pt-2 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:text-sm w-24"
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
                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:text-sm w-24"
                        onClick={this.handleCloseVehicleForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Vehicle;
