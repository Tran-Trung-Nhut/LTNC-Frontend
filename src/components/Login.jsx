import React, { useContext } from "react";
import { useState} from "react";
import axios from "axios";
import AuthContext from "../Global/AuthContext";
import logo from "../image/fixlogo.png";
import oldlogo from "../image/logo.png";
import Background from "../image/B.jpg";
import { Label } from "flowbite-react";

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [drivers, setDrivers] = useState([])
    const [error, setError] = useState("")
    const { login, admin_password } = useContext(AuthContext);
    
     
    const handleLogin = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:8000/Driver/login?password=${password}`)
            .then(res => {
                const driver = res.data;
                if(password === admin_password && username === 'admin'){
                    login('admin',admin_password,'admin');
                }else{
                    if(!driver){
                        alert('Invalid username or password');
                    }else{
                        if(username === driver.name){
                            login('user', password,driver.name,driver);
                        }else{
                            alert('Invalid username or password');  
                        }
                    }
                }
            })
    }

    
    const isExistIDNumber = (driverID) =>{
        axios.get("http://localhost:8000/Driver/list")
        .then((respon) =>{
            setDrivers(
                respon.data
            )
        })
        const foundID = drivers.find(driver => driver.id_number === driverID)
        return foundID !== undefined
    }

    const handleSubmitCreateForm = () => {
        const name = document.getElementById("Name").value;
        const id = document.getElementById("id_Number").value;
        const dob = document.getElementById("DateofBirth").value;
        const gender = document.getElementById("Gender").value;
        const phone_number = document.getElementById("PhoneNumber").value;
        const licenseGrade = document.getElementById("LicenseGrade").value;
        const licenseNumber = document.getElementById("LicenseNumber").value;

        const license = {
            grade: licenseGrade,
            number: licenseNumber
        } 
    
        const newDriver = {
            name: name,
            id_number: id,
            dob: dob,
            gender: gender,
            phone_number: phone_number,
            license: license,
        };


        if (!(name !== "" &&
         id !== "" && 
         dob !== "" && 
         gender !== "" && 
         phone_number !== "" && 
         licenseGrade !== "" && 
         licenseNumber !== "")) {
            setError("You have to fill in all fields");
            if(isExistIDNumber(id)){
                setError("ID này đã tồn tại!")
                return;
            }
            return;
        }else {
            if(isExistIDNumber(id)){
                setError("ID này đã tồn tại!")
                return;
            }else{
                setError("")
            }
        }

        axios.post("http://localhost:8000/Driver/add", newDriver)
            .then((response) => {
                setIsSignUp(false)
                login('user', id,name,newDriver)
            })
        setError("")
    }
    return (
        <div className="wrapper bg-cover w-full" style={{backgroundImage: `url(${Background})`}}>
        <div className="login">
        <section className="z-5">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="bg-white w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <a href="#" className="flex justify-center items-center mb-6 text-4xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-14 h-14 mr-2" src= {oldlogo} alt="logo"/>
                    Driver Care  
                </a>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input 
                            type="text" 
                            id="username" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Username" 
                            onChange={(e) => setUsername(e.target.value)}
                            required=""/>
                        </div>
                        <div>
                            <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={(e) => setPassword(e.target.value)}
                            required=""/>
                        </div>
                        <div className="flex items-center justify-between">
                        </div>
                        <button 
                        type="submit" 
                        className="w-full text-white bg-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" 
                        onClick={handleLogin}>
                            Sign in
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            You want to be our driver? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500 " onClick={()=>setIsSignUp(true)}>Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </section>
      </div>
      {isSignUp && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-1 pb-0 sm:p-6 sm:pb-4 tailwind-class-name">
              <div className="sm:flex sm:items-start">
              <div className="mt-1 w-full text-center sm:mt-0 sm:text-left">
                  <a href="#" className="flex justify-center items-center mb-4 text-4xl font-semibold text-gray-900 dark:text-white">
                      <img className="w-14 h-14 mr-2" src= {oldlogo} alt="logo"/>
                      Driver Care  
                  </a>
                  <h3 className="text-5xl font-medium leading-6 text-gray-900 mb-5" id="modal-title">
                     Sign up
                  </h3>
                  <div className=""/>
                    <Label value="Driver's name" className="mb-2 text-start block font-semibold"/>
                      <input type="text" id="Name" placeholder="Name" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                    <Label value="Driver's ID number" className="mb-2 text-start block font-semibold"/>
                      <input type="text" id="id_Number" placeholder="ID Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                    <Label value="Driver's birthday" className="mb-2 text-start block font-semibold"/>  
                      <input type="date" id="DateofBirth" placeholder="Date of Birth" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                    <Label value="Driver's gender" className="mb-2 text-start block font-semibold"/>  
                      <input type="text" id="Gender" placeholder="Gender" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black" />
                    <Label value="Driver's phone number" className="mb-2 text-start block font-semibold"/>  
                      <input type="text" id="PhoneNumber" placeholder="Phone Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                    <Label value="Driver's license grade" className="mb-2 text-start block font-semibold"/>
                      <input type="text" id="LicenseGrade" placeholder="License Grade" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                    <Label value="Driver's license number" className="mb-2 text-start block font-semibold "/>  
                      <input type="text" id="LicenseNumber" placeholder="License Number" className="form-input mb-4 w-full px-4 py-2 border rounded-md border-black"/>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                <button type="button" className="border border-2 border-black transform hover:scale-110 ml-1" onClick={() => {handleSubmitCreateForm()} }>Submit</button>
                <button type="button" className="border border-2 border-black transform hover:scale-110 ml-1" onClick={()=>setIsSignUp(false)}>Cancel</button>
            </div>
            </div>
          </div>
        </div>
      )}
      </div>
    )
}

export default Login
