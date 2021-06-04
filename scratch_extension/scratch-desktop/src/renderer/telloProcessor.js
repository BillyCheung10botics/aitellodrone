import {ipcRenderer} from 'electron';


export class TelloProcessor {
    constructor () {
        ipcRenderer.send('tello-initialize');
    }

    connect () {
        ipcRenderer.send('connect');
    }

    emergency () {
        ipcRenderer.send("emergency");
    }

    send (cmd) {
        ipcRenderer.send('send', cmd);
    }

    rc (lr, fb, ud, yaw) {
        ipcRenderer.send("rc", lr, fb, ud, yaw);
    }

    rc_lr (value) {
        ipcRenderer.send("rclr", value);
    }

    rc_fb (value) {
        ipcRenderer.send("rcfb", value);
    }

    rc_ud (value) {
        ipcRenderer.send("rcud", value);
    }

    rc_yaw (value) {
        ipcRenderer.send("rcyaw", value);
    }

    async state () {
        ipcRenderer.send('state');

        const response = await this.statePromise();
        return response;
    }

    statePromise () {
        return new Promise(resolve => {
            ipcRenderer.once('state-reply', (ev, arg) => {
                resolve(arg);
            });
        });
    }

// communication channels for advanced setting-------------------------
    async response () {
        ipcRenderer.send('response');

        const response = await this.responsePromise();
        return response;
    }

    responsePromise () {
        return new Promise(resolve => {
            ipcRenderer.once('response-reply', (ev, arg) => {
                resolve(arg);
            });
        });
    }

    set_ap (ssid, pass) {
        ipcRenderer.send("setap", ssid, pass);
    }

    set_ip (address) {
        ipcRenderer.send("setip", address);
    }
}
