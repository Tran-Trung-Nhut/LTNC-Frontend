import React, { Component } from "react";
import "./App.css";
import Header from "./layout/Header";
import { AuthProvider } from "./Global/AuthContext";
import { Footer } from "flowbite-react";

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <div className="App">
          <Header />
          <div>
            <h1 className="Text">Driver Care</h1>
          </div>
          <Footer id="app-footer" container>
            <Footer.Copyright href="#" by="Driver Care" year={2024} />
            <Footer.LinkGroup>
              <Footer.Link href="#">About</Footer.Link>
              <Footer.Link href="#">Privacy Policy</Footer.Link>
              <Footer.Link href="#">Licensing</Footer.Link>
              <Footer.Link href="#">Contact</Footer.Link>
            </Footer.LinkGroup>
          </Footer>
        </div>
      </AuthProvider>
    );
  }
}

export default App;
