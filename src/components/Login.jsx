import React, { useContext } from "react";
import { useState} from "react";
import axios from "axios";
import AuthContext from "../Global/AuthContext";
import Background from "../image/logo.jpg";
import "./css/Login.css"

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    
    const handleLogin = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:8000/Driver/login?password=${password}`)
            .then(res => {
                const driver = res.data;
                if(password === 'admin' && username === 'admin'){
                    login('admin','admin','admin');
                }else{
                    if(!driver){
                        alert('Invalid username or password');
                    }else{
                        if(username === driver.name){
                            login('user', password, username, driver);
                        }else{
                            alert('Invalid username or password');  
                        }
                    }
                }
            })
    }

    return (
    <div className="wrapper bg-cover bg-repeat-y z-2" style={{backgroundImage: `url(${Background})`}}>
        <div className="login">Login
            <div>
                <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div>
                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
                <button type="submit" className="btn btn-success" onClick={handleLogin}>Submit</button>
            </div>
        </div>   
    </div>     
    )
}

export default Login

