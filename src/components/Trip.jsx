import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./css/Trip.css";
import AuthContext from "../Global/AuthContext";
import Login from "./Login";


const Trip = () => {
  const { isLoggedIn,userRole,password } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    departureTime: "",
    departureLocation: "",
    arrivalLocation: "",
    estimatedArrivalTime: "",
    actualArrivalTime: "",
    currentStatus: "Chưa hoàn thành", // Default value
    driverID: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTrip, setIsAddingTrip] = useState(false);

  useEffect(() => {
    fetchTrips();
    fetchDrivers();
  }, []);

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


  const handleSubmit = () => {
    axios.post("http://localhost:8000/Trip/add", newTrip)
      .then(res => {
        console.log("Trip added successfully:", res.data);
        fetchTrips();
        // Reset form after successful submission
        setNewTrip({
          departureTime: "",
          departureLocation: "",
          arrivalLocation: "",
          estimatedArrivalTime: "",
          actualArrivalTime: "",
          currentStatus: "Chưa hoàn thành", // Reset to default value
          driverID: "",
        });
        setIsAddingTrip(false); // Hide add trip form after submission
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
      // Create a new trip object with the same information as the current trip
      const updatedTrip = { ...tripToMark, currentStatus: "Đã hoàn thành" };
      // Update the current trip status to "Đã hoàn thành"
      axios.put(`http://localhost:8000/Trip/update/${tripID}`, { currentStatus: "Đã hoàn thành" })
        .then(() => {
          console.log("Trip marked as completed successfully");
          // Add the updated trip to the trips state
          setTrips([...trips.filter(trip => trip.tripID !== tripID), updatedTrip]);
          // Delete the old trip from the database
          axios.delete(`http://localhost:8000/Trip/delete/${tripID}`)
            .then(() => {
              console.log("Old trip deleted successfully");
            })
            .catch(error => {
              console.error("Error deleting old trip:", error);
              alert("Failed to delete old trip. Please try again later.");
            });
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
  if (!isLoggedIn) {
    return(
      <Login></Login>
    )
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
                <td>{trip.departureTime}</td>
                <td>{trip.estimatedArrivalTime}</td>
                <td>{trip.actualArrivalTime}</td>
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
              <input type="time" name="departureTime" value={newTrip.departureTime} onChange={handleInputChange} placeholder="Departure Time" />
              <input type="text" name="departureLocation" value={newTrip.departureLocation} onChange={handleInputChange} placeholder="Departure Location" />
              <input type="text" name="arrivalLocation" value={newTrip.arrivalLocation} onChange={handleInputChange} placeholder="Arrival Location" />
              <input type="time" name="estimatedArrivalTime" value={newTrip.estimatedArrivalTime} onChange={handleInputChange} placeholder="Estimated Arrival Time" />
              <input type="time" name="actualArrivalTime" value={newTrip.actualArrivalTime} onChange={handleInputChange} placeholder="Actual Arrival Time" />
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
    );
  }}

export default Trip;
