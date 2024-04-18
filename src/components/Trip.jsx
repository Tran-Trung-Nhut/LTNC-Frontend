import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./css/Trip.css";
import AuthContext from "../Global/AuthContext";
import Login from "./Login";
import { PencilIcon, TrashIcon, CheckCircleIcon, UserAddIcon, SearchIcon } from '@heroicons/react/outline';
import Background from "../image/logo.jpg";


const Trip = () => {
  const {isLoggedIn, password, userRole} = useContext(AuthContext)
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    departureTime: "",
    departureLocation: "",
    arrivalLocation: "",
    currentStatus: "Chưa hoàn thành",
    driverID: "",
    vehicle: "" // Thêm trường vehicle cho loại xe
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [arrivalLocations, setArrivalLocations] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [regions] = useState([
    { name: "Bắc", provinces: [
      "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Cao Bằng", "Điện Biên",
      "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hải Dương",
      "Hải Phòng", "Hòa Bình", "Hưng Yên", "Lai Châu", "Lạng Sơn",
      "Lào Cai", "Nam Định", "Phú Thọ", "Sơn La", "Tây Ninh",
      "Thái Bình", "Thái Nguyên", "Tuyên Quang", "Vĩnh Phúc", "Yên Bái"
    ] },
    { name: "Trung", provinces: [
      "Bình Định", "Bình Thuận", "Đà Nẵng", "Đắk Lắk", "Đắk Nông",
      "Khánh Hòa", "Kon Tum", "Lâm Đồng", "Nghệ An", "Ninh Thuận",
      "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Thanh Hóa",
      "Thừa Thiên Huế"
    ] },
    { name: "Nam", provinces: [
      "An Giang", "Bà Rịa Vũng Tàu", "Bạc Liêu", "Bến Tre", "Bình Dương",
      "Bình Phước", "Cà Mau", "Cần Thơ", "Đồng Nai", "Đồng Tháp",
      "Hậu Giang", "Kiên Giang", "Long An", "Phú Yên", "Sóc Trăng",
      "TP Hồ Chí Minh", "Trà Vinh", "Vĩnh Long", "Tiền Giang"
    ] }
  ]);
  const [vehicles, setVehicles] = useState([]); // Danh sách các loại xe

  useEffect(() => {
    fetchTrips();
    fetchDrivers();
    fetchVehicles(); // Gọi hàm fetch danh sách các loại xe
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const region = regions.find(region => region.name === selectedRegion);
      if (region) {
        setArrivalLocations(region.provinces);
      }
    }
  }, [selectedRegion, regions]);

  const fetchTrips = () => {
    axios.get("http://localhost:8000/Trip/list")
      .then(res => {
        setTrips(res.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching trips:", error);
        alert("Failed to fetch trips. Please try again later.");
      });
  }

  const fetchDrivers = () => {
    axios.get("http://localhost:8000/Driver/list")
      .then(res => {
        setDrivers(res.data);
      })
      .catch(error => {
        console.error("Error fetching drivers:", error);
        alert("Failed to fetch drivers. Please try again later.");
      });
  }

  const fetchVehicles = () => {
    axios.get("http://localhost:8000/Vehicle/list")
      .then(res => {
        setVehicles(res.data);
      })
      .catch(error => {
        console.error("Error fetching vehicles:", error);
        alert("Failed to fetch vehicles. Please try again later.");
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setNewTrip(prevState => ({
      ...prevState,
      arrivalLocation: ""
    }));
  }

  const handleSubmit = () => {
    // Kiểm tra xem có phải đang chỉnh sửa chuyến đi hay không
    const isEditing = !!newTrip.tripID;

    // Nếu không phải đang chỉnh sửa và tài xế đã tồn tại chuyến đi chưa hoàn thành
    if (!isEditing && trips.some(trip => trip.driverID === newTrip.driverID && trip.currentStatus === "Chưa hoàn thành")) {
      alert("Tài xế đang bận, hãy chọn tài xế khác!");
      return;
    }

    // Tiếp tục thêm chuyến đi mới hoặc cập nhật chuyến đi đã lưu
    const estimatedArrivalTime = new Date(newTrip.departureTime);
    estimatedArrivalTime.setDate(estimatedArrivalTime.getDate() + 1.5);
    estimatedArrivalTime.setHours(Math.round(estimatedArrivalTime.getHours()));

    const newTripData = {
      ...newTrip,
      estimatedArrivalTime: estimatedArrivalTime.toISOString(),
    };

    const saveAction = isEditing ? axios.put(`http://localhost:8000/Trip/update/${newTrip.tripID}`, newTripData) : axios.post("http://localhost:8000/Trip/add", newTripData);

    saveAction
      .then(res => {
        console.log(isEditing ? "Trip updated successfully:" : "Trip added successfully:", res.data);
        fetchTrips();
        setNewTrip({
          departureTime: "",
          departureLocation: "",
          arrivalLocation: "",
          currentStatus: "Chưa hoàn thành",
          driverID: "",
          vehicle: "" // Reset trường vehicle sau khi thêm chuyến đi thành công
        });
        setIsAddingTrip(false);
      })
      .catch(error => {
        console.error("Error saving trip:", error);
        alert(`Failed to ${isEditing ? "update" : "add"} trip. Please try again later.`);
      });
  }

  const handleEdit = (trip) => {
    setNewTrip(trip);
    setIsAddingTrip(true);
  }

  const handleDelete = (tripID) => {
    const isConfirmed = window.confirm("Are you sure to delete this trip?");
    if (isConfirmed) {
      axios.delete(`http://localhost:8000/Trip/delete/${tripID}`)
        .then(() => {
          setTrips(trips.filter(trip => trip.tripID !== tripID));
        })
        .catch(error => {
          console.error("Error deleting trip:", error);
          alert("Failed to delete trip. Please try again later.");
        });
    }
  }

  const markCompleted = (tripID) => {
    const tripToMark = trips.find(trip => trip.tripID === tripID);
    if (tripToMark) {
      const updatedTrip = {
        ...tripToMark,
        currentStatus: "Đã hoàn thành",
        actualArrivalTime: new Date().toISOString()
      };
      axios.put(`http://localhost:8000/Trip/update/${tripID}`, updatedTrip)
        .then(() => {
          console.log("Trip marked as completed successfully");
          fetchTrips();
        })
        .catch(error => {
          console.error("Error marking trip as completed:", error);
          alert("Failed to mark trip as completed. Please try again later.");
        });
    } else {
      console.error("Error marking trip as completed: Trip not found");
      alert("Trip not found. Please try again later.");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if(!isLoggedIn){
    return(<Login></Login>)
  }else{

  return (
    <div>
        <div className="wrapper bg-cover bg-repeat-y" style={{backgroundImage: `url(${Background})`}}>
        <div className="container">
            <div className="flex items-center mb-4">
            {userRole === 'admin' &&(
              
               <button 
                type="button" 
                className="btn btn-primary mr-4 mt-24" 
                onClick={() => setIsAddingTrip(true)}>
                    <UserAddIcon className="h-6 w-7 text-blue-200" />
                </button>
            )}
            <div className="w-full relative flex-grow mt-20">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-5 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" >
                    <SearchIcon className="h-5 w-5 text-gray-400 mt-5" />
                </div>
            </div>
            </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">No.</th>
              <th scope="col" className="px-6 py-3 text-center">Departure Location</th>
              <th scope="col" className="px-6 py-3 text-center">Arrival Location</th>
              <th scope="col" className="px-6 py-3 text-center">Departure Time</th>
              <th scope="col" className="px-6 py-3 text-center">Estimated Arrival Time</th>
              <th scope="col" className="px-6 py-3 text-center">Actual Arrival Time</th>
              <th scope="col" className="px-6 py-3 text-center">Driver Name</th>
              <th scope="col" className="px-6 py-3 text-center">Vehicle</th>
              <th scope="col" className="px-6 py-3 text-center">Current Status</th>
              <th scope="col" className="px-6 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {trips.filter(trip => {
              const searchTermLower = searchTerm.toLowerCase();
              const departureTimeLower = new Date(trip.departureTime).toLocaleString().toLowerCase();
              const departureLocationLower = trip.departureLocation.toLowerCase();
              const arrivalLocationLower = trip.arrivalLocation.toLowerCase();
              const estimatedArrivalTimeLower = new Date(trip.estimatedArrivalTime).toLocaleString().toLowerCase();
              const actualArrivalTimeLower = trip.actualArrivalTime ? new Date(trip.actualArrivalTime).toLocaleString().toLowerCase() : "-";
              const driverNameLower = drivers.find(driver => driver.id === trip.driverID)?.name.toLowerCase();
              const currentStatusLower = trip.currentStatus.toLowerCase();
              
              return (
                searchTermLower === "" ||
                departureTimeLower.includes(searchTermLower) ||
                departureLocationLower.includes(searchTermLower) ||
                arrivalLocationLower.includes(searchTermLower) ||
                estimatedArrivalTimeLower.includes(searchTermLower) ||
                actualArrivalTimeLower.includes(searchTermLower) ||
                driverNameLower?.includes(searchTermLower) ||
                currentStatusLower.includes(searchTermLower)
              );
            }).map((trip, index) => (
              <tr key={trip.tripID} className="bg-white text-black-800 border-b dark:bg-gray-800 dark:border-black-1000">
                <td className="p-3 pr-0 text-center">{index + 1}</td>
                <td className="p-3 pr-0 text-center">{trip.departureLocation}</td>
                <td className="p-3 pr-0 text-center">{trip.arrivalLocation}</td>
                <td className="p-3 pr-0 text-center">{new Date(trip.departureTime).toLocaleString()}</td>
                <td className="p-3 pr-0 text-center">{new Date(trip.estimatedArrivalTime).toLocaleString()}</td>
                <td className="p-3 pr-0 text-center">{trip.currentStatus === "Đã hoàn thành" ? new Date(trip.actualArrivalTime).toLocaleString() : "-"}</td>
                <td className="p-3 pr-0 text-center">{drivers.find(driver => driver.id === trip.driverID)?.name}</td>
                <td className="p-3 pr-0 text-center">{trip.vehicle}</td>
                <td className="p-3 pr-0 text-center">{trip.currentStatus}</td>
                <td>
                  <button className="h-5 w-5 text-yellow-400 mr-1" onClick={() => handleEdit(trip)}><PencilIcon className="h-5 w-5"/></button>
                {userRole === "admin" && (  
                  <button className="h-5 w-5 text-red-400 mr-1" onClick={() => handleDelete(trip.tripID)}><TrashIcon className="h-5 w-5"/></button>
                )} 
                  {trip.currentStatus !== "Đã hoàn thành" && (
                    <button className="h-5 w-5 text-grey-400 mr-1" onClick={() => markCompleted(trip.tripID)}><CheckCircleIcon className="h-5 w-5"/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div className="add-trip-form">
        {isAddingTrip && (
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
              <input type="datetime-local" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="departureTime" value={newTrip.departureTime} onChange={handleInputChange} />
              <select name="departureLocation" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={newTrip.departureLocation} onChange={handleInputChange}>
                <option value="">Select Departure Location</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
              </select>
              <select name="arrivalRegion" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={selectedRegion} onChange={handleRegionChange}>
                <option value="">Select Arrival Region</option>
                {regions.map(region => (
                  <option key={region.name} value={region.name}>{region.name}</option>
                ))}
              </select>
              <select name="arrivalLocation" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={newTrip.arrivalLocation} onChange={handleInputChange}>
                <option value="">Select Arrival Location</option>
                {arrivalLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {/* Thêm phần chọn loại xe */}
              <select name="vehicle" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={newTrip.vehicle} onChange={handleInputChange}>
                <option value="">Select Vehicle Type</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.type} value={vehicle.type}>{vehicle.type}</option>
                ))}
              </select>
              {/* Removed the Estimated Arrival Time input field */}
              <input type="hidden" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="estimatedArrivalTime" value={newTrip.estimatedArrivalTime} />
              <select name="driverID" className="form-input mb-4 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={newTrip.driverID} onChange={handleInputChange}>
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
              </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSubmit}>Save</button>
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={()=>setIsAddingTrip(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      </div>
    </div>
  );
}
}
export default Trip;
