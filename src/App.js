import React, { Component } from "react";
import "./App.css";
import Header from "./layout/Header";
import { AuthProvider } from "./Global/AuthContext";
import Home from "./components/Home";

class App extends Component {
    render() {
        return (
        <AuthProvider>
            <div className="App">
                <Header/>
            </div>
        </AuthProvider>
        );
            }
}

export default App;