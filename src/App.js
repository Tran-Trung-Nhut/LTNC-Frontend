import React, { Component } from "react";
import "./App.css";
import Header from "./layout/Header";
import { AuthProvider } from "./Global/AuthContext";
import AuthContext from "./Global/AuthContext";
import Background from "./image/B.jpg";
import Footer from "./layout/Footer";
import Login from "./components/Login";
import Home from "./components/Home";

class App extends Component {
  static contextType = AuthContext;
    render() {
        const { isInOtherPage } = this.context || {}
        return (
        <AuthProvider>
            <div className="App">
                <Header/>
                {/* {!isInOtherPage && (
                <div className="wrapper bg-cover bg-repeat-y" style={{backgroundImage: `url(${Background})`}}>
                 <div>   
                    <div>
                        <h1 className="Text">
                            Driver Care
                        </h1>
                    </div>
                </div>
                </div>)} */}
          </div>

        </AuthProvider>
        );
            }
}

export default App;
