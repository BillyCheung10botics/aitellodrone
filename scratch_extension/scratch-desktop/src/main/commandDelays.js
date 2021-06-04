/*
Table of command delay taken from
https://github.com/wesbos/javascript-drones
with unit of millisecond
*/

const commandDelays = {
  command: 500,
  takeoff: 5000,
  land: 5000,
  go: 7000,
  up: 7000,
  down: 7000,
  left: 5000,
  right: 5000,
  forward: 5000,
  back: 5000,
  cw: 5000,
  ccw: 5000,
  flip: 3000,
  speed: 3000,
  rc:1,
  ap:3000,
  'battery?': 500,
  'speed?': 500,
  'time?': 500,
};
// export default commandDelays;
module.exports = commandDelays;
