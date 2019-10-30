import React from 'react';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //backend URL
      endpoint: "http://127.0.0.1:5000"
    };
  }

  componentDidMount() {
    const {endpoint} = this.state;
    //Connects to socket on backend
    const socket = socketIOClient(endpoint);


  }

  
  render() {

    return (
      <div className="App">
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
      </div>
    );
  }
}


export default App;
