import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./css/Trip.css";
import AuthContext from "../Global/AuthContext";
import Login from "./Login";
const Trip = () => {
  const {isLoggedIn, password, userRole} = useContext(AuthContext)
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    departureTime: "",
    departureLocation: "",
    arrivalLocation: "",
    estimatedArrivalTime: "",
    currentStatus: "Chưa hoàn thành",
    driverID: "",
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

  useEffect(() => {
    fetchTrips();
    fetchDrivers();
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
    axios.post("http://localhost:8000/Trip/add", newTrip)
      .then(res => {
        console.log("Trip added successfully:", res.data);
        fetchTrips();
        setNewTrip({
          departureTime: "",
          departureLocation: "",
          arrivalLocation: "",
          estimatedArrivalTime: "",
          currentStatus: "Chưa hoàn thành",
          driverID: "",
        });
        setIsAddingTrip(false);
      })
      .catch(error => {
        console.error("Error adding trip:", error);
        alert("Failed to add trip. Please try again later.");
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
      <div className="trip-container">
        <h1 className="trip-heading">List of Trips</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <table className="trip-table">
          <thead>
            <tr>
              <th>Departure Location</th>
              <th>Arrival Location</th>
              <th>Departure Time</th>
              <th>Estimated Arrival Time</th>
              <th>Actual Arrival Time</th>
              <th>Driver Name</th>
              <th>Current Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.filter(trip => {
              if (searchTerm === "") {
                return trip;
              } else if (
                trip.departureTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.departureLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.arrivalLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.estimatedArrivalTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.actualArrivalTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trip.currentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drivers.find(driver => driver.id === trip.driverID)?.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return trip;
              }
              return null;
            }).map(trip => (
              <tr key={trip.tripID}>
                <td>{trip.departureLocation}</td>
                <td>{trip.arrivalLocation}</td>
                <td>{new Date(trip.departureTime).toLocaleString()}</td>
                <td>{new Date(trip.estimatedArrivalTime).toLocaleString()}</td>
                <td>{trip.currentStatus === "Đã hoàn thành" ? new Date(trip.actualArrivalTime).toLocaleString() : "-"}</td>
                <td>{drivers.find(driver => driver.id === trip.driverID)?.name}</td>
                <td>{trip.currentStatus}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(trip)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(trip.tripID)}>Delete</button>
                  {trip.currentStatus !== "Đã hoàn thành" && (
                    <button className="mark-btn" onClick={() => markCompleted(trip.tripID)}>Mark Completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-trip-form">
          {isAddingTrip && (
            <div className="form-group">
              <input type="datetime-local" name="departureTime" value={newTrip.departureTime} onChange={handleInputChange} />
              <select name="departureLocation" value={newTrip.departureLocation} onChange={handleInputChange}>
                <option value="">Select Departure Location</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
              </select>
              <select name="arrivalRegion" value={selectedRegion} onChange={handleRegionChange}>
                <option value="">Select Arrival Region</option>
                {regions.map(region => (
                  <option key={region.name} value={region.name}>{region.name}</option>
                ))}
              </select>
              <select name="arrivalLocation" value={newTrip.arrivalLocation} onChange={handleInputChange}>
                <option value="">Select Arrival Location</option>
                {arrivalLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <input type="datetime-local" name="estimatedArrivalTime" value={newTrip.estimatedArrivalTime} onChange={handleInputChange} />
              {/* Remove Actual Arrival Time field when adding new trip */}
              {/* <input type="datetime-local" name="actualArrivalTime" value={newTrip.actualArrivalTime} onChange={handleInputChange} /> */}
              <select name="driverID" value={newTrip.driverID} onChange={handleInputChange}>
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
              <button className="submit-btn" onClick={handleSubmit}>Save</button>
              <button className="cancel-btn" onClick={() => setIsAddingTrip(false)}>Cancel</button>
            </div>
          )}
          {!isAddingTrip && (
            <button className="add-btn" onClick={() => setIsAddingTrip(true)}>Add Trip</button>
          )}
        </div>
      </div>
    );}
}

export default Trip;
