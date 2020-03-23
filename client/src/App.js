import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



function findWinner(p1move, p2move, p2confirm) {

    if(p1move.rstate === true) {
      if(p2move.sstate === true) {
        return "Player " + p1move.playerID + " wins, opponent picked Scissors";
      }
      else if(p2move.pstate === true) {
        return "Player " + p2move.playerID + " wins, opponent picked Paper";
      }
      else{
        return "Tie";
      }
    }
    if(p1move.sstate === true) {
      if(p2move.pstate === true) {
        return "Player " + p1move.playerID + " wins, opponent picked Paper";
      }
      else if (p2move.rstate === true) {
        return "Player " + p2move.playerID + " wins, opponent picked Rock";
      }
      else {
        return "Tie";
      }
    }
    if(p1move.pstate === true) {
      if(p2move.rstate === true) {
        return "Player " + p1move.playerID + " wins, opponent picked Rock";
      }
      else if (p2move.sstate === true) {
        return "Player " + p2move.playerID + " wins, opponent picked Scissors";
      }
      else {
        return "Tie";
      }
    }
 

} 

function Rock (props) {
  return (
    <div>
      <button className="btn hvr-float-shadow" onClick={props.onClick}>
        <span className="Emoji" role="img" aria-label="fist">✊</span>
      </button>
    </div>
  );
}
function Paper (props) {
  return (
    <div>
      <button className="btn hvr-float-shadow" onClick={props.onClick}>
        <span className="Emoji" role="img" aria-label="wave">✋</span>
      </button>
    </div>
  );
}
function Scissors (props) {
  return (
    <div>
      <button className="btn hvr-float-shadow" onClick={props.onClick}>
        <span className="Emoji" role="img" aria-label="peace">✌️</span>
      </button>
    </div>
  );
}
var socket;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //backend URL
      endpoint: "/",
      playerID: null,
      rstate: false,
      pstate: false,
      sstate: false,
      p2data: null,
      p2confirm: false,
      p2wait: false,
      p2reset: false,
      confirm: false,
      reset: false
    };
    const {endpoint} = this.state;
    socket = socketIOClient(endpoint);
  }

  //Get opponents move
  getData = (data) => {
    console.log(data)
    this.setState({p2data: data});
  };

  //Get opponents reset value
  getReset = (bool) => {
    this.setState({reset: bool, confirm: false, p2confirm: false, p2wait: false, rstate: false, pstate: false, sstate: false}, () => {
      console.log("Opp reset", this.state);});
  }

  //Get clients Player ID
  getPlayer = (i) => {
    this.setState({playerID : i});
    console.log("Player", this.state.playerID);
  };

  //Get opponents Confirmation
  getConfirm = (x) => {
    this.setState({p2confirm: x, p2wait: true, p2reset: false});
  };

 componentDidMount() {
   //Updates players moves and playerId
    socket.on('move', this.getData);
    socket.on('player-number', this.getPlayer);
    socket.on('listen_confirm', this.getConfirm);
    socket.on('reset_listen', this.getReset);
  }

  componentWillUnmount() {
    socket.off('move');
    socket.off('player-number')
    socket.off('listen_confirm');
    socket.off('reset_listen');
  }

  //When client clicks reset
  handleReset() {
    this.setState({reset: true, p2wait: false, confirm: false, p2confirm: false, p2reset: false, rstate: false, pstate: false, sstate: false}, () => {
      console.log(this.state, " Reset")});
    socket.emit('reset', true);
  }

  //When client clicks confirm
  handleConfirm() {
    this.setState({confirm: true, reset: false}, () => {console.log(this.state.playerID, " Confirmed")});
    socket.emit('confirm', {confirm: true, p2wait: true});
  }

  //Client's options 
  handleRock() {
    this.setState({rstate: true, pstate: false, sstate: false}, () => {
      console.log("Rock set", this.state);
    });
    socket.emit('turn',{rstate: true, pstate: null, sstate: null});
  }
  handlePaper() {
    this.setState({rstate: false, pstate: true, sstate: false}, () => {
      console.log("Paper set", this.state);
    });
    socket.emit('turn',{rstate: null, pstate: true, sstate: null});
  }
  handleScissors() {
    this.setState({rstate: false, pstate: false, sstate: true}, () => {
      console.log("Scissor set", this.state);
    });
    socket.emit('turn',{rstate: null, pstate: null, sstate: true});
  }
  
  render() {
    var result;
    var hasp2confirmed;
    console.log('Player '+ this.state.playerID + 'has confirmed: '+ this.state.confirm);
   if(this.state.playerID === -1){
     result = "You are in a lobby with two people already. Please rejoin until the other user has left. Will add extra lobbies in the future!"
   }
   else {
    if(this.state.p2wait){
      hasp2confirmed = "Opponent has confirmed thier move"
    }
    else{
      hasp2confirmed = "Waiting for opponent";
    }
   
    if(this.state.confirm  && this.state.p2confirm){
      result = findWinner(this.state, this.state.p2data, this.state.p2confirm);
    }
    else if(this.state.p2reset) {
      result = "Other Player has reset!"
    }
    else if(this.state.rstate || this.state.pstate || this.state.sstate) {
      if(this.state.rstate) {
        result = "You picked Rock"
      }
      else if(this.state.pstate) {
        result = "You picked Paper"
      }
      else if (this.state.sstate) {
        result = "You picked Scissors"
      }
    }
    else {
      result = "Pick a move";
    }
  }
  

    return (
      <div className="App">
        <Container fluid="md">
          <Row className="justify-content-md-center">
            <h1>
              Rock, Paper, Scissors
            </h1>
          </Row>
          <Row className="justify-content-md-center">
            <h2>
              You are Player {this.state.playerID}
            </h2>
          </Row>
          <Row className="justify-content-md-center">
            <h3>
            {result}
            </h3>
          </Row>
          <Row className="justify-content-md-center">
            <Col><Rock onClick={() =>this.handleRock()}/></Col>
            <Col><Paper onClick={() =>this.handlePaper()}/></Col>
            <Col><Scissors onClick={() =>this.handleScissors()}/></Col>
          </Row>
          <Row className="justify-content-md-center">
            <h4>
            {hasp2confirmed}
            </h4>
          </Row>
            <div>
              <Button variant='light' size='lg' onClick={()=>this.handleConfirm()}>Confirm</Button>
              <Button variant='dark' size='lg' onClick={()=>this.handleReset()}>Reset</Button>
            </div>
          <Row className="justify-content-md-center"> 
            
          </Row>
        </Container> 
      </div>
    );
  }
}

            
            


export default App;
