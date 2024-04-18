import React, { Component } from "react";
import "./App.css";
import Header from "./layout/Header";
import { AuthProvider } from "./Global/AuthContext";
import Background from "./image/logo.jpg";
import Footer from "./layout/Footer";


class App extends Component {
    render() {
        return (
        <AuthProvider>
            <div className="App">
                <Header/>
                <div className="wrapper bg-cover bg-repeat-y" style={{backgroundImage: `url(${Background})`}}>
                    <div>
                        <h1 className="Text">
                            Driver Care
                        </h1>
                    </div>
                </div>
                <Footer/>
            </div>
        </AuthProvider>
        );
            }
}

export default App;