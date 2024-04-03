import React from "react";
import { useState} from "react";
import axios from "axios";

function Login({handleLogin}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:8000/Driver/login?password=${password}`)
            .then(res => {
                const driver = res.data;
                if(password === 'admin' && username === 'admin'){
                    handleLogin('admin');
                }else{
                    if(!driver){
                        alert('Invalid username or password');
                    }else{
                        if(password === driver.id_number){
                            handleLogin('user');
                        }else{
                            alert('Invalid username or password');  
                        }
                    }
                }
            })
    }

    return (
        <div>Login
            <div>
                <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className="btn btn-success" onClick={handleFormSubmit}>Submit</button>
            </div>
        </div>        
    )
}

export default Login

