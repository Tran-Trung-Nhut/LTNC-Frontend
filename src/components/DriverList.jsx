import React from "react";
import axios from "axios"; // uimport axios
class DriverList extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            DataisLoaded: false,
        };
    }
 
    // ComponentDidMount is used to
    // execute the code
    componentDidMount() {
        axios.get(
            "http://localhost:8000/Driver/list"
            )
            .then((res) => {
                    
                this.setState({ 
                    drivers: res.data,
                    DataisLoaded: true,
                });
            });
    }
    deleteDriver = (id) => {
        axios.delete(`http://localhost:8000/Driver/delete/${id}`)
            .then(() => {
                this.setState(prevState => ({
                    drivers: prevState.drivers.filter(driver => driver.id !== id)
                }));
                alert("Delete Sucessfully");
            })
            .catch(error => {
                console.log("Error deleting driver:", error);
            });
    }
    render() {
        const { DataisLoaded, drivers } = this.state;
        if (!DataisLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>
                </div>
            );
 
        return (
            <div className="App">
                <h1 className="Driver" >List of Driver</h1>
                <div className="container">
                <table className="table table-hover mt-3" align="center">
                    <thead className="thead-light">
                        <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Personal ID</th>
                        <th scope="col">Gender</th>  
                        <th scope="col">Option</th>
                        </tr>
                    </thead>
                    {drivers?.map((driver) => (
                            <tbody key={drivers.id}>
                                <tr>
                                <td>{driver.name}</td>
                                <td>{driver.personal_ID}</td>
                                <td>{driver.sex}</td>
                                <td>
                                    <button type="button" className="btn btn-warning" >
                                        Edit
                                    </button>
                                    <button type="button" className="btn btn-danger mx-2" onClick={() => this.deleteDriver(driver.id)}>
                                        Delete
                                    </button>
                                </td>
                                </tr>
                            </tbody>    
                    ))}
                 </table>
                </div>
            </div>
        );
    }
}
 
export default DriverList;