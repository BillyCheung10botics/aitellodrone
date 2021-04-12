// get the directory name
const path = require("path")
const pathpath = __dirname.split(path.sep);
pathpath.pop();
const topdir = path.join(...pathpath);

// tello control 
const TelloProcessor = require("../maincontroljs/telloProcessor.js");
const tello = new TelloProcessor();
tello.initialize();

// HTTP and streaming ports
const HTTP_PORT = 33333;
const STREAM_PORT = 3001

//set up server
const http = require('http')
const fs = require('fs');
const server = http.createServer(function(request, response) {
    // Log that an http connection has come through
    console.log(
          'HTTP Connection on ' + HTTP_PORT + ' from: ' + 
          request.socket.remoteAddress + ':' +
          request.socket.remotePort
      );
    // console.log(__dirname + request.url);
    fs.readFile(topdir + '/frontend/' + request.url, function (err,data) {
      if (err) {
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200);
      response.end(data);
    });
  
  }).listen(HTTP_PORT); // Listen on port HTTP_PORT

// handle io socket send/on
const io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.emit('announcements', { message: 'A new user has joined!' });

    socket.once('tello-initialize', () => {
        tello.initialize();
    });
    
    socket.on('tello-connect', () => {
        tello.connectSDK();
    });
    
    socket.on('emergency', () => {
        tello.emergency();
    });
    
    socket.on("takeoff", function() {
        tello.takeoff();
    });
    socket.on("land", function() {
        tello.land();
    });

    socket.on('rc', (arg) => {
        tello.setRC(arg.arglr, arg.argfb, arg.argud, arg.argyaw);
    });
    
    socket.on('send', (cmd) => {
        tello.request(cmd);
    });
    
    socket.on('state', function() {
        const state = tello.state();
        socket.emit('state-reply',  JSON.stringify(state));
    });
    
    
    // socket.on('disconnect', function() {});
});
