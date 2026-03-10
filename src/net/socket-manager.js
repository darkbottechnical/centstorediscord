import dgram from "dgram";
import { PORTS } from "../constants.js";
import netutils from "./ip-utils.js";
import logger from "../util/log.js";

class SocketManager {
    constructor() {
        this.CONTROL_PORT_NO = PORTS.CONTROL;
        this.MESSAGE_PORT_NO = PORTS.MESSAGE;

        this.controlSocket = null;
        this.messageSocket = null;

        this.localIdentity = {
            ipAddress: null,
            subnetMask: null,
            ifaceName: null,
            macAddress: null,
            broadcast: null,
        };
    }

    /**
     * Function to set up sockets for an interface and attach listener callbacks to them.
     * @param {{ipAddress: string, subnetMask: string, ifaceName: string, macAddress: string}} interfaceInfo - Interface info.
     * @param {(buffer) => void} controlCb - The callback to pass control message buffers to.
     * @param {(buffer) => void} messageCb - The callback to pass message buffers to.
     */
    setupSockets({ ipAddress, subnetMask, ifaceName, macAddress }, controlCb, messageCb) {
        if (this.controlSocket) this.controlSocket.close();
        if (this.messageSocket) this.messageSocket.close();

        this.controlSocket = dgram.createSocket("udp4");
        this.messageSocket = dgram.createSocket("udp4");

        this.controlSocket.on("error", (e) => logger.error(`Error in control socket: ${e.message}`));
        this.messageSocket.on("error", (e) => logger.error(`Error in messaging socket: ${e.message}`));

        const ipInt = netutils.ipToInt(ipAddress);
        const maskInt = netutils.ipToInt(subnetMask);

        const broadcastInt = (ipInt & maskInt) | (~maskInt >>> 0);
        const broadcast = netutils.intToIp(broadcastInt);

        this.controlSocket.on("message", (b, r) => controlCb(b));
        this.messageSocket.on("message", (b, r) => messageCb(b));

        this.controlSocket.bind(this.CONTROL_PORT_NO, ipAddress, () => {
            this.controlSocket.setBroadcast(true);
        });
        this.messageSocket.bind(this.MESSAGE_PORT_NO, ipAddress, () => {
            this.messageSocket.setBroadcast(true);
        });

        this.localIdentity = { ipAddress, subnetMask, ifaceName, macAddress, broadcast };
    }
}

export { SocketManager };
