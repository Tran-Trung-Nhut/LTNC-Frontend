import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import { AuthProvider } from "./components/Global/AuthContext";

class App extends Component {
    render() {
        return (
        <AuthProvider>
            <div className="App">
                <Header></Header>
            </div>
        </AuthProvider>
        );
            }
}

export default App;