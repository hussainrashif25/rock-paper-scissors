var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('port', 5000);

app.use(express.static(path.join( __dirname + 'client/build')));//Routing

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
}); 

io.on('connection', (socket) => {
    console.log('a user connected');
});

//Starts Server
server.listen(5000, () => {
    console.log('Starting server on port 5000');
});