// imported io from  ''<script src="/socket.io/socket.io.js"></script>''  in html

var socket = io.connect('/');
socket.on('announcements', function(data) {
    console.log('Got announcement:', data.message);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function telloInitialize() {
    socket.emit("tello-initialize");
}

function telloconnect() {
    socket.emit("tello-connect");
}

function emergency() {
    socket.emit("emergency");
}

function takeoff() {
    socket.emit("takeoff");
};

function land() {
    socket.emit("land");
};

function rc(lr, fb, ud, yaw) {
    socket.emit("rc", {arglr:lr, argfb:fb, argud:ud, argyaw:yaw});
}

function rc_lr(value) {
    socket.emit("rclr",value);
}

function rc_fb(value) {
    socket.emit("rcfb",value);
}

function rc_ud(value) {
    socket.emit("rcud",value);
}

function rc_yaw(value) {
    socket.emit("rcyaw",value);
}

function send(cmd) {
    socket.emit("send", cmd);
}

function streamVideo () {
    socket.emit("streamvideo");
}

async function telloState() {
    socket.emit('state');
    const response = await this.statePromise();
    // console.log(response);
    // console.log(`test temp: ${response["templ"]}`);
    return response;
};

function statePromise () {
    return new Promise(resolve => {
        socket.on('state-reply', arg => {
            resolve(JSON.parse(arg));
        });
    });
};