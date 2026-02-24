const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
    interfaces: {
        // renderer's avialable calls
        select: (interface) => {
            ipcRenderer.send("interfaces.select", { interface });
        },
        // renderer's listeners
        onList: (callback) => {
            ipcRenderer.on("interfaces.list", (event, data) => {
                callback(data);
            });
        },
    },
    notifications: {
        // renderer's available calls
        show: (notification) => {
            ipcRenderer.send("notifications.show", { notification });
        },
    },
    channels: {
        // renderer's available calls
        addPublic: (number, nickname) => {
            ipcRenderer.send("channels.public.add", { number, nickname });
        },
        addPrivate: (rinfo) => {
            ipcRenderer.send("channels.private.add", { rinfo });
        },
        removePublic: (number) => {
            ipcRenderer.send("channels.public.remove", number);
        },
        removePrivate: (mac) => {
            ipcRenderer.send("channels.private.remove", mac);
        },

        // renderer's listeners
        updateChannel: (callback) => {
            ipcRenderer.on(
                "channels.update.one",
                (event, type, identifier, updated) => {
                    callback(type, identifier, updated);
                },
            );
        },
        onList: (callback) => {
            ipcRenderer.on("channels.update.all", (event, channels) => {
                callback(channels);
            });
        },
    },
});
