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


/*
  2. Create the stream server where the video stream will be sent
*/
const streamServer = http.createServer(function(request, response) {

    // Log that a stream connection has come through
    console.log(
          'Stream Connection on ' + STREAM_PORT + ' from: ' + 
          request.socket.remoteAddress + ':' +
          request.socket.remotePort
      );
  
    // When data comes from the stream (FFmpeg) we'll pass this to the web socket
    request.on('data', function(data) {
      // Now that we have data let's pass it to the web socket server
      webSocketServer.broadcast(data);
    });
  
  }).listen(STREAM_PORT); // Listen for streams on port 3001
  
/*
3. Begin web socket server
*/
// WebSocket for broadcasting stream to connected clients
const WebSocket = require('ws');
// We'll spawn ffmpeg as a separate process
const spawn = require('child_process').spawn;

const webSocketServer = new WebSocket.Server({
server: streamServer
});

// Broadcast the stream via websocket to connected clients
webSocketServer.broadcast = function(data) {
webSocketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
    client.send(data);
    }
});
};
  

// handle io socket send/on
const io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.emit('announcements', { message: 'A new user has joined!' });

    socket.once('tello-initialize', () => {
        tello.initialize();
    });
    
    socket.on('tello-connect', () => {
        // tello.connectSDK();
        tello.telloConnect();
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
    
    socket.on('rclr', (arg) => {
        tello.setRC_lr(arg);
    });

    socket.on('rcfb', (arg) => {
        tello.setRC_fb(arg);
    });

    socket.on('rcud', (arg) => {
        tello.setRC_ud(arg);
    });

    socket.on('rcyaw', (arg) => {
        tello.setRC_yaw(arg);
    });

    socket.on('send', (cmd) => {
        tello.request(cmd);
    });
    
    socket.on('state', function() {
        const state = tello.state();
        socket.emit('state-reply',  JSON.stringify(state));
    });
    
    socket.on("streamvideo", function () {
        tello.request('streamon')
        // Delay for 3 seconds before we start ffmpeg
        setTimeout(function() {
            var args = [
            "-i", "udp://0.0.0.0:11111",
            "-r", "30",
            "-s", "480x360",
            // "-s", "960x720",
            "-codec:v", "mpeg1video",
            "-b", "800k",
            "-f", "mpegts",
            "http://127.0.0.1:3001/stream"
            ];
        
            // Spawn an ffmpeg instance
            var streamer = spawn('ffmpeg', args);
            // Uncomment if you want to see ffmpeg stream info
            //streamer.stderr.pipe(process.stderr);
            streamer.on("exit", function(code){
                console.log("Failure", code);
            });
        }, 3000);
    });
    // socket.on('disconnect', function() {});
});

