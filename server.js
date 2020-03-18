var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const players = [null, null];

app.set('port', 5000);

app.use(express.static(path.join( __dirname + 'client/build')));//Routing

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
}); 

io.on('connection', (socket) => {

    let playerIndex = -1;
    for (var i in players) {
        if (players[i] === null) {
            playerIndex = i;
        }
    }
    console.log('a user connected PLAYER', playerIndex);
    
    //Emits clients player number
    socket.emit('player-number', playerIndex);

    if (playerIndex == -1) return;

    players[playerIndex] = socket;

    socket.broadcast.emit('player-connect', playerIndex);

    socket.on('turn', (data) => {
        const {rstate, pstate, sstate, confirm} = data;

        const move = {
            playerIndex,
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

    

    socket.on('disconnect', (reason) => {
        console.log(reason);
    });
    
});

//Starts Server
server.listen(5000, () => {
    console.log('Starting server on port 5000');
});