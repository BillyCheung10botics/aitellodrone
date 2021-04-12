// import TelloProcessor from "../maincontroljs/telloProcessor";
const TelloProcessor = require("../maincontroljs/telloProcessor.js");
var tc = new TelloProcessor();
tc.initialize();


// if (tc.connect()) {
//     console.log("connected")
//     tc.takeoff();

//     tc.land();
//     tc.request("speed?");
//     tc.request("speed?");
//     tc.request("rc 0 0 0 0");
//     tc.request("rc 1 0 0 0");
//     tc.request("rc 0 0 0 1");
//     tc.request("rc 0 0 1 0");
//     tc.request("rc 1 1 1 1");
//     tc.request("rc 0 0 1 0");
//     tc.request("rc 1 1 1 1");
//     tc.request("rc 0 0 1 0");
//     tc.request("rc 1 1 1 1");
//     tc.request("rc 0 0 1 0");
//     tc.request("rc 1 1 1 1"); 
// } else {
//     console.log("connection fail")
    
// }
// tc.connect()
tc.takeoff();
tc.streamon();
tc.request("rc 0 0 0 0")
tc.request("rc 0 1 0 0")
tc.request("rc 0 -100 0 0")
tc.request("go 0 0 0 100")
tc.request("flip r")
tc.request("up 100")
tc.request("backward 50")
// tc.land();
// setTimeout(function(){tc.stop_send_rc_loop();}, 1000);

// // tc.land();
// // tc.request("speed?");
// // tc.request("speed?");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 1 0 0 0");
// // tc.request("rc 0 0 0 1");
// // tc.request("rc 0 0 1 0");
// // tc.request("rc 1 1 1 1");
// // tc.request("rc 0 0 1 0");
// // tc.request("rc 1 1 1 1");
// // tc.request("rc 0 0 1 0");
// // tc.request("rc 1 1 1 1");
// // tc.request("rc 0 0 1 0");
// // tc.request("rc 1 1 1 1"); 
// tc.request("command")
// // console.log(tc.flying)
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// tc.takeoff();
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("flip l");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("flip b");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("flip r");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("rc 0 0 0 0");
// // tc.request("flip f");
// tc.acrobatics();
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// // tc.land();
// tc.land();
// tc.request("rc 0 0 0 0");
// tc.request("rc 0 0 0 0");
// // tc.acrobatics();