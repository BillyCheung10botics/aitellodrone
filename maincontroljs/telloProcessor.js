// import dgram from "dgram";
// import commandDelays from "./commandDelays";

const dgram = require("dgram");
const commandDelays = require("./commandDelays");

const CONTROL_IP = '192.168.10.1';
const CONTROL_PORT = 8889;
const STATE_IP = '0.0.0.0';
const STATE_PORT = 8890;
const VS_IP = '0.0.0.0';
const VS_PORT = 11111;
const VS_ADDRESS = `udp://${VS_IP}:${VS_PORT}`;
const RESPONSE_TIMEOUT = 7000;  // in milliseconds
const COMMAND_DELAY = 100; // in milliseconds
const RCCOMMAND_DELAY = 1;  // in milliseconds
const CONNECT_RETRY = 5; // Max. number of trials to connect Tello

function handleError(err) {
    if (err) {
      console.log('ERROR');
      console.log(err);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

class TelloProcessor {
    // constructor () {
    //     this.initialize();
    // }

    // a Tello control class 
    initialize () {
        this.quene = []; // quene to store commands 
        this.executing = false; // whether tello is executing a command?
        this.data_state = {}; // store the state information
        this.data_response = {}; // store the response information

        this.tello_connected = false; // entered SDK mode??
        this.connect_count = 0; // number of trial(s) entering SDK mode
        this.flying = false; // whether tello is flying?
        this.streamoned = false; // whether tello video streaming is turned on?

        this.leftright = 0 // speed % of left/right -100 to 100
        this.forwback = 0 // speed % of forward/backward -100 to 100
        this.updown = 0 // speed % of up/down -100 to 100
        this.yaw = 0 // rotating speed % of spin -100 to 100

        this.udpbuilt = false; // !!A Temporary Variable!! : whether server and client are established 
        
        if (!this.udpbuilt) {
            this.client = dgram.createSocket('udp4'); // client to send command and receiver response
            this.receiver_server = dgram.createSocket('udp4'); // server to receive state information
            

            this.udpbuilt = true;

            // try to connect to tello
            this.telloConnect();

            // constantly sending rc command to tello
            this.sendrcloopID = this.send_rc_control_loop(); // send rc command constantly
        }
        
    }

    telloConnect () {
        this.quene = []; // clear the command queue
        this.setupTelloControlClient();
        this.connectSDK(); // enter SDK mode
        this.setupTelloStateServer();
    }

    setupTelloControlClient(){
        // setup tello client and handle responses
        this.client.bind(CONTROL_PORT);
        this.client.on('message', (message, remote) => {
            const readableMessage = message.toString();
            
            // Previous command executed
            if (readableMessage === 'error' || readableMessage === 'ok' || Number(readableMessage)) {
                console.log(this.quene[0] + " : " + readableMessage);
                this.data_response[this.quene[0]] = readableMessage;
            } 
            else {
                // print error message
                console.log("`🤖 Error: " + readableMessage);
            }
        });
    }

    setupTelloStateServer () {
        // receive state information from tello
        this.receiver_server.bind(STATE_PORT, STATE_IP);
        this.receiver_server.on('message', (message, remote) => {
            const readableMessage = message.toString();
            for (const e of readableMessage.slice(0, -1).split(';')) {
                this.data_state[e.split(':')[0]] = e.split(':')[1];
            }
        });
    }

    connectSDK () {
        // TO DO: this function is problematic !!!
        // Once connected, this.data_response["command"] === "ok" is also true.
        // If one accidentally turns off tello after a connection, 
        // it indicates connection success even the new connection does not.

        this.tello_connected = false;
        // insert "command" to the front of the quene
        if (this.executing) {
            this.quene.splice(1, 0, "command"); // insert it at index 1
        } else {
            this.quene.unshift("command") // insert it at index 0
        };

        // try to enter SDK mode
        this.connect_count += 1;
        if (this.data_response["command"] === "ok"){
            var thisthis = this; 
            setTimeout( function () {
                thisthis.data_response["command"] === null;
            }, commandDelays["command"] * 5);
            console.log(`Tello connected. (Trial ${this.connect_count})`);
            this.connect_count = 0;
            this.tello_connected = true;
            return true
        } else if (this.connect_count <= CONNECT_RETRY) {
            console.log(`Error: Fail to connect Tello. (Trial ${this.connect_count})`);
            var thisthis = this;
            setTimeout( function () {
                thisthis.connectSDK(); // try again
            }, commandDelays["command"]);
        } else {
            // alert("Error: Fail to connect Tello. Please check the Tello wifi connection.");
            console.log("Error: Fail to connect Tello. Please check the Tello wifi connection.");
            this.quene = []; // clear the command queue 
            this.connect_count = 0;
            this.tello_connected = false;
            return false
        }
    }

    emergency () {
        // for emergency only
        // stop motors immediately 
        this._resetVariables;
        this._send("emergency");
        this._send("streamoff");
        this._send("moff");
    }

    takeoff () {
        // let waittime = 0;
        // for (let i=0 ;i < this.quene.length; i++) {
        //     waittime += commandDelays[this.quene[i]];
        // }

        // setTimeout(function(){
        //     console.log(thisthis.data_response);

        //     this.request("takeoff");

        //     if (thisthis.data_response["takeoff"] === "ok") {
        //         thisthis.flying = true
        //     }                
        // }, waittime);

        // if (this.flying) {
        //     console.log("Warning: Tello has already taken off. Please don't send 'takeoff' command again.");
        // } else {
        //     this.request("takeoff");
        // };
        this.request("takeoff");
        this.flying = true;
    }

    land () {

        // if (this.flying) {
        //     this.request("land");

        //     let waittime = 0;
        //     for (let i=0 ;i < this.quene.length; i++) {
        //         waittime += commandDelays[this.quene[i]];
        //     }

        //     var thisthis = this;
        //     setTimeout(function(){
        //         console.log(thisthis.data_response);
        //         if (thisthis.data_response["land"] === "ok") {
        //             thisthis.flying = false
        //         }                
        //     }, waittime);
        // } else {
        //     console.log("Warning: Tello has already landed. Please don't send 'land' command again.");
        // };
        this.request("land");
        this.flying = false;
    }

    streamon () {
        if (this.streamoned) {
            console.log("Warning: Tello has already turned on video streaming. Please don't send 'streamon' command again.");
        } else {
            this.request("streamon");
        };
    }

    setRC (lr, fb, ud, yaw) {
        this.leftright = Math.floor(lr);
        this.forwback = Math.floor(fb);
        this.updown = Math.floor(ud);
        this.yaw = Math.floor(yaw);
    }

    async acrobatics () {
        this.request("rc 0 0 0 0");
        this.request('speed 100');
        let yaw = 50;
        let fb = 0;
        let ud = 0;
        let lr = 0;
        let size = 100;

        for (let j=0; j < 8; j++){
            if (j === 0) {
                lr = -size;
                fb = 0;
                ud = 0;
            } else if (j === 1) {
                lr = 0;
                fb = 0;
                ud = size-20;
            } else if (j === 2) {
                lr = 0;
                fb = -size;
                ud = 0;
            } else if (j === 3) {
                lr = 0;
                fb = 0;
                ud = -size;
            } else if (j === 4) {
                lr = size;
                fb = 0;
                ud = 0;
            } else if (j === 5) {
                lr = 0;
                fb = 0;
                ud = size-20;
            } else if (j === 6) {
                lr = 0;
                fb = size;
                ud = 0;
            } else if (j === 7) {
                lr = 0;
                fb = 0;
                ud = -size;
            }
            this.leftright = lr;
            this.forwback = fb;
            this.updown = ud;
            this.yaw = yaw;
            await sleep(500);
        }
        this.leftright = 0;
        this.forwback = 0;
        this.updown = 0;
        this.yaw = 0;
    }

    squareFlip () {
        this.request("flip l")
        this.request("flip f")
        this.request("flip r")
        this.request("flip b")
    }

    state () {
        if (this.data_state) {
            return this.data_state;
        } else {
            return null;
        }
        
    }

    request (cmd) {
        // Enqueue
        this.quene.push(cmd);
        // try to send command
        this._inquire();
    }

    send_rc_control_loop () {
        const thisthis = this;
        const setintID = setInterval(function () {
            // console.log(`rc ${thisthis.leftright} ${thisthis.forwback} ${thisthis.updown} ${thisthis.yaw}`)
            thisthis.request(`rc ${thisthis.leftright} ${thisthis.forwback} ${thisthis.updown} ${thisthis.yaw}`);
        }, 20);
        // console.log(setintID)
        return setintID;
        
    }

    stop_send_rc_loop () {
        console.log("Stop sending rc command");
        // console.log(this.sendrcloopID);
        clearInterval(this.sendrcloopID);
    }
    // If executing command is nothing and waiting queue has some element, send first command to Tello
    _inquire () {
        if (!this.executing && this.quene.length > 0) {
            this.executing = true;

            // console.log(this.quene)
            let delay = COMMAND_DELAY;
            const command = this.quene[0];
            const cmd_split = command.split(" ", 1)[0];
            if (cmd_split in commandDelays) {
                delay = commandDelays[cmd_split];
            } else {
                delay = COMMAND_DELAY;
            };
            this._sendWaitResponse(command, delay);
        }
    }

    _sendWaitResponse(cmd, delay) {
        // console.log(`sending command: ${cmd} STARTED---------------------` )
        this._send(cmd);
        var thisthis = this;
        setTimeout(function () {
            // Dequeue
            thisthis.quene.shift();
            thisthis.executing = false;
            // Send the next element
            // console.log(`sending command: ${cmd} ENDED---------------------` )
            thisthis._inquire();
        }, delay);
    }

    _send (cmd) {
        const msg = Buffer.from(cmd);
        this.client.send(msg, 0, msg.length, CONTROL_PORT, CONTROL_IP, handleError);
        // this.client.send(cmd, 0, cmd.length, CONTROL_PORT, CONTROL_IP, handleError);
    }

    _resetVariables () {
        this.quene = []; // quene to store commands 
        this.executing = false; // whether tello is executing a command?
        this.data_state = {}; // store the state information
        this.data_response = {}; // store the response information

        this.connect_count = 0; // number of trial(s) entering SDK mode
        this.flying = false; // whether tello is flying?
        this.streamoned = false; // whether tello video streaming is turned on?
    }
}
// export default TelloProcessor;
module.exports = TelloProcessor;