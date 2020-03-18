import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from "socket.io-client";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

//You need to store opponent data as state....

function findWinner(p1move, p2move, p2confirm) {
  //while(p1move.confirm === true && p2confirm === true){
   // console.log(p1move.rstate, p2move.sstate);
   console.log(p2confirm);
   
    
    if(p1move.rstate === true) {
      if(p2move.sstate === true) {
        console.log("Player" + p1move.playerID + "wins");
        return "Player" + p1move.playerID + "wins";
      }
      else if(p2move.pstate === true) {
        return "Player" + p2move.playerID + "wins";
      }
      else{
        return "Tie";
      }
    }
    if(p1move.sstate === true) {
      if(p2move.pstate === true) {
        return "Player" + p1move.playerID + "wins";
      }
      else if (p2move.rstate === true) {
        return "Player" + p2move.playerID + "wins";
      }
      else {
        return "Tie";
      }
    }
    if(p1move.pstate === true) {
      if(p2move.rstate === true) {
        return "Player" + p1move.playerID + "wins";
      }
      else if (p2move.sstate === true) {
        return "Player" + p2move.playerID + "wins";
      }
      else {
        return "Tie";
      }
    }
  //}

} 

function Rock (props) {
  return (
    <div>
      <Button variant="secondary" onClick={props.onClick}>
        Rock
      </Button>
    </div>
  );
}
function Paper (props) {
  return (
    <div>
      <Button onClick={props.onClick} variant="secondary">
        Paper
      </Button>
    </div>
  );
}
function Scissors (props) {
  return (
    <div>
      <Button onClick={props.onClick} variant="secondary">
        Scissors
      </Button>
    </div>
  );
}
var socket;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //backend URL
      endpoint: "http://127.0.0.1:5000",
      playerID: null,
      rstate: false,
      pstate: false,
      sstate: false,
      p2data: null,
      p2confirm: false,
      confirm: false
    };
    const {endpoint} = this.state;
    socket = socketIOClient(endpoint);
  }

  //Get opponents move
  getData = (data) => {
    console.log(data)
    this.setState({p2data: data});
  };

  //Your Player Number
  getPlayer = (i) => {
    this.setState({playerID : i});
    console.log("Player", this.state.playerID);
  };

  //Opponents Confirmation
  getConfirm = (x) => {
    this.setState({p2confirm: x});
  };

 componentDidMount() {
   //Updates players moves and playerId
    socket.on('move', this.getData);
    socket.on('player-number', this.getPlayer);
    socket.on('listen_confirm', this.getConfirm);
  }

  componentWillUnmount() {
    socket.off('move');
    socket.off('player-number')
  }

 

  handleConfirm() {
    this.setState({confirm: true}, () => {console.log(this.state.playerID, "Confirmed")});
    socket.emit('confirm', {confirm: true});
  }

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
    console.log('u',this.state.confirm);
    console.log('o', this.state.p2confirm);
    if(this.state.confirm  && this.state.p2confirm){
      console.log('fuck u');
      result = findWinner(this.state, this.state.p2data, this.state.p2confirm);
      let status = result;
    }

    return (
      <div className="App">
        <div className="status">{result}</div>
        <div className="player">Player: {this.state.playerID}</div>
          <ButtonGroup aria-label="Basic example">
            <Rock onClick={() =>this.handleRock()}/>
            <Paper onClick={() =>this.handlePaper()}/>
            <Scissors onClick={() =>this.handleScissors()}/>
          </ButtonGroup>
          <Button onClick={()=>this.handleConfirm()}>Confirm</Button>
      </div>
    );
  }
}


export default App;
