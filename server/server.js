var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const players = [null, null];

app.use(express.static(path.join(__dirname ,'/../client/build')));//Routing

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname +'/../client/build/index.html'));
}); 

io.on('connection', (socket) => {

    let playerID = -1;
    for (var i in players) {
        if (players[i] === null) {
            playerID = i;
        }
    }
    console.log('a user connected PLAYER', playerID);
    
    //Emits clients player number
    socket.emit('player-number', playerID);

    if (playerID == -1) return;

    players[playerID] = socket;

    socket.broadcast.emit('player-connect', playerID);

    socket.on('turn', (data) => {
        const {rstate, pstate, sstate, confirm} = data;

        const move = {
            playerID,
            rstate,
            pstate,
            sstate
        };
        console.log(move);
        
        //Only emits to other clients 
        socket.broadcast.emit('move', move);
    });

    socket.on('confirm', (data) => {
        const {confirm} = data;
        const confirmation = {confirm};
        socket.broadcast.emit('listen_confirm', confirmation);
    });

    socket.on('reset', (data) => {
        socket.broadcast.emit('reset_listen', data);

    });
    

    socket.on('disconnect', (reason) => {
        players[playerID] = null;
        console.log(reason);
    });
    
});

const port = process.env.PORT || 5000;
//Starts Server
server.listen(port);

console.log('Server running on' , port)