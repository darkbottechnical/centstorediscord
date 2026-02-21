const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const { Channel, PrivateChannel, PublicChannel } = require("./channel.js");

const path = require("path");
const sound = require("sound-play");

const dgram = require("dgram");
const os = require("os");
const crypto = require("crypto");

const netutils = require("./network.js");

const CONSTANTS = {
    CONTROL_PORT: 4124,
    MESSAGE_PORT: 4123,
};

class CentStoreDiscord {
    constructor() {
        this.registerIpc();
        app.setAppUserModelId("Cent Store Discord");
        app.whenReady().then(() => this.create());
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") app.quit();
        });
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) this.create();
        });
    }

    create() {
        this.htmlPath = path.join(__dirname, "../web", "index.html");
        this.heartbeatInterval = 10000;

        this.sockets = {
            control: null,
            message: null,
        };

        this.channels = {
            public: new Map(),
            private: new Map(),
        };
        this.localIdentity = {};

        this.window = new BrowserWindow({
            width: 1250,
            height: 750,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
            },
            icon: path.join(__dirname, "../assets/icon-rounded.png"),
        });

        this.window.loadFile(this.htmlPath);
        this.window.setMenuBarVisibility(false);

        this.window.webContents.on("did-finish-load", () => {
            this.window.webContents.send(
                "interfaces.list",
                netutils.listIPv4Interfaces(),
            );
        });
    }

    followPublicChannel(number) {
        this.channels.public.set(number, new PublicChannel(number));
    }
    addPrivateChannel(rinfo) {
        this.channels.private.set(rinfo.mac, new PrivateChannel(rinfo));
    }
    tryDecodeMessage(msg) {
        const messageBytes = Buffer.from(msg);
        for (const channel of this.channels.public.keys()) {
            if (
                decryptedBuffer[0] === 123 &&
                decryptedBuffer[decryptedBuffer.length - 1] === 125
            ) {
                const decryptedString = messageBytes
                    .map((byte) => byte - channel)
                    .toString();

                if (decryptedString.includes(`"preamble":`)) {
                    try {
                        return [channel, JSON.parse(decryptedString)];
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
        return [null, null];
    }

    handleMessage(msg, rinfo) {
        const parsed = JSON.parse(msg.toString());
        if (parsed.access && parsed.access == "public") {
            const [channelNo, decoded] = this.tryDecodeMessage(parsed.data);
            if (channelNo == null || decoded == null) return;
        } else if (parsed.access && parsed.access == "private") {
        }
    }
    handleControlMessage(msg, rinfo) {}

    registerIpc() {
        ipcMain.on("notifications.show", (event, data) => {
            new Notification({
                title: data.notification.title || "",
                body: data.notification.body || "",
                icon: path.join(__dirname, "../assets/icon-rounded.png"),
                silent: true,
            }).show();
            sound.play(path.join(__dirname, "../assets/pisscordping.mp3"));
        });
        ipcMain.on("interfaces.select", (event, data) => {
            this.setupSockets(
                data.interface.ip,
                data.interface.netmask,
                data.interface.name,
                data.interface.mac,
            );
        });
    }

    setupSockets(
        ipAddress,
        subnetMask,
        ifaceName = "unknown",
        macAddress = "unknown",
    ) {
        if (this.sockets.control) this.sockets.control.close();
        if (this.sockets.message) this.sockets.message.close();

        this.sockets.control = dgram.createSocket("udp4");
        this.sockets.message = dgram.createSocket("udp4");

        const ipInt = netutils.ipToInt(ipAddress);
        const maskInt = netutils.ipToInt(subnetMask);

        const broadcastInt = (ipInt & maskInt) | (~maskInt >>> 0);
        const broadcastAddr = netutils.intToIp(broadcastInt);

        this.sockets.control.on("message", this.handleControlMessage);
        this.sockets.message.on("message", this.handleMessage);

        this.sockets.control.bind(CONSTANTS.CONTROL_PORT, ipAddress, () => {
            this.sockets.control.setBroadcast(true);
        });
        this.sockets.message.bind(CONSTANTS.MESSAGE_PORT, ipAddress, () => {
            this.sockets.message.setBroadcast(true);
        });

        this.localIdentity = { ipAddress, subnetMask, ifaceName, macAddress };
    }
}
new CentStoreDiscord();
