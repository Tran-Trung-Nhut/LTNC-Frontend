import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Trip.css";

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTrip, setNewTrip] = useState({
    departureTime: "",
    departureLocation: "",
    arrivalLocation: "",
    estimatedArrivalTime: "",
    actualArrivalTime: "",
    currentStatus: "",
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
          currentStatus: "",
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <div className="add-trip-form">
        {isAddingTrip && (
          <div className="form-group">
            <input type="text" name="departureTime" value={newTrip.departureTime} onChange={handleInputChange} placeholder="Departure Time" />
            <input type="text" name="departureLocation" value={newTrip.departureLocation} onChange={handleInputChange} placeholder="Departure Location" />
            <input type="text" name="arrivalLocation" value={newTrip.arrivalLocation} onChange={handleInputChange} placeholder="Arrival Location" />
            <input type="text" name="estimatedArrivalTime" value={newTrip.estimatedArrivalTime} onChange={handleInputChange} placeholder="Estimated Arrival Time" />
            <input type="text" name="actualArrivalTime" value={newTrip.actualArrivalTime} onChange={handleInputChange} placeholder="Actual Arrival Time" />
            <input type="text" name="currentStatus" value={newTrip.currentStatus} onChange={handleInputChange} placeholder="Current Status" />
            <select className="form-select" name="driverID" value={newTrip.driverID} onChange={handleInputChange}>
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
      <table className="trip-table">
        <thead>
          <tr>
            <th>Departure Time</th>
            <th>Departure Location</th>
            <th>Arrival Location</th>
            <th>Estimated Arrival Time</th>
            <th>Actual Arrival Time</th>
            <th>Current Status</th>
            <th>Driver Name</th>
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
              <td>{trip.departureTime}</td>
              <td>{trip.departureLocation}</td>
              <td>{trip.arrivalLocation}</td>
              <td>{trip.estimatedArrivalTime}</td>
              <td>{trip.actualArrivalTime}</td>
              <td>{trip.currentStatus}</td>
              <td>{drivers.find(driver => driver.id === trip.driverID)?.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(trip)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(trip.tripID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Trip;
