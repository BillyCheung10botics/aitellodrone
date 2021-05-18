# AI Tello Drone
This project consists of 2 parts, one is a web UI, another part is a scratch desktop. They both can manipulate tello drones and .
## Acknowledgements
This project is inspired by the following developers, 
1. https://github.com/wesbos/javascript-drones
2. https://github.com/kebhr/scratch3-tello
3. https://github.com/dbaldwin/tello-video-nodejs-websockets

## web UI
### How to Run
1. run the backend program which open a server on port 33333
  ```bash
  $ node backend/telloBackend.js
  ```
2. go the localhost http://localhost:3333/index.html

## Scratch Desktop
### How to Build
The building method essentially follows that of https://github.com/kebhr/scratch3-tello and https://github.com/LLK/scratch-desktop .
1. make a new directory that will contains all the required files and go to that directory
  ```bash
  $ mkdir scratch3-tello
  $ cd scratch3-tello
  ```
2. copy the build.sh and relink.sh on scratch_extension folder to the new directory
3. run the build.sh

### How to Run in development mode
  ```bash
  $ cd scratch-desktop
  $ npm run build-gui
  $ npm start
  ```
### How to Make a packaged build
Please follow the steps of https://github.com/LLK/scratch-desktop
