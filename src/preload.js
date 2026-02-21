const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
    interfaces: {
        onList: (callback) => {
            ipcRenderer.on("interfaces.list", (event, data) => {
                callback(data);
            });
        },
        select: (interface) => {
            ipcRenderer.send("interfaces.select", { interface: interface });
        },
    },
    notifications: {
        show: (notification) => {
            ipcRenderer.send("notifications.show", {
                notification: notification,
            });
        },
    },
});
