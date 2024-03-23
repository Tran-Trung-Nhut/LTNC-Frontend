import axios from "axios";

const API_URL = "http://localhost:8000/Driver";

const DriverService = {
    deleteDriver: (driverId) => {
        return axios.delete(`${API_URL}/delete/${driverId}`);
    }
};

export default DriverService;