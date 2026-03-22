/**
 * Networking related helper functions
 */

import os from "os";
/**
 * Returns a list of network interfaces available on the device as object something like:
 * ```javascript
 * {name: "WiFi", address: "192.168.1.193", netmask: "255.255.0.0", "00:00:de:ad:be:ef"}
 * ```
 * **NOTE:** *Mac address is colon separated.*
 * @returns {{name: string, address: string, netmask: string, mac: string}}
 */
function listIPv4Interfaces() {
    const nets = os.networkInterfaces();
    const addrs = [];

    for (const name of Object.keys(nets)) {
        for (const ni of nets[name]) {
            if (ni.family === "IPv4" && !ni.internal) {
                addrs.push({
                    name,
                    address: ni.address,
                    netmask: ni.netmask,
                    mac: ni.mac,
                });
            }
        }
    }

    return addrs;
}

/**
 * Helper function that converts an IP address to an integer.
 * @param {string} ip
 * @returns {number}
 */
function ipToInt(ip) {
    return (
        ip
            .split(".")
            .reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0
    );
}

/**
 * Helper function that converts a valid integer to an IP address.
 * @param {*} i - integer
 * @returns
 */
function intToIp(i) {
    return [
        (i >>> 24) & 0xff,
        (i >>> 16) & 0xff,
        (i >>> 8) & 0xff,
        i & 0xff,
    ].join(".");
}

export default { listIPv4Interfaces, ipToInt, intToIp };
