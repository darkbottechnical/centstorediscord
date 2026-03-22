import path from "path";
import { app, BrowserWindow, Notification, ipcMain } from "electron";
import { SocketManager } from "./net/socket-manager.js";
import assetManager from "./ui/asset-manager.js";
import { registerIpc } from "./ipc/if-main.js";
import {
    ChannelManager,
    Channel,
    PublicChannel,
    PrivateChannel,
} from "./net/channel.js";
import logger from "./util/log.js";

export class CentStoreDiscord {
    static appUserModelId = "Cent Store Discord";
    static htmlPath = path.join(import.meta.dirname, "../web/index.html");
    static heartBeatInterval = 8000;
    static browserConfig = {
        width: 1250,
        height: 750,
        webPreferences: {
            preload: path.join(import.meta.dirname, "ipc/if-ui.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: assetManager.getAssetPath("img", "icon.png"),
    };

    /**
     * Main program class to hold everything together.
     * **WARNING: Starts the app when instantiated.**
     */
    constructor() {
        this.window = null;
        this.socketManager = new SocketManager();
        this.channelManager = new ChannelManager();

        this.initApp();
    }

    /**
     * Initialise the desktop app and relevant listeners.
     */
    initApp() {
        logger.info("Initialising desktop app.");
        app.setAppUserModelId(CentStoreDiscord.appUserModelId);
        app.whenReady().then(() => {
            this.launch();
            registerIpc(this);

            app.on("window-all-closed", () => {
                if (process.platform !== "darwin") this.cleanup();
            });

            app.on("activate", () => {
                if (BrowserWindow.getAllWindows().length === 0) this.launch();
            });
        });
    }

    /**
     * Initialise electron BrowserWindow and window. Runs once the app is initialised.
     */
    launch() {
        logger.info("Opening window.");
        this.window = new BrowserWindow(CentStoreDiscord.browserConfig);
        this.window.loadFile(CentStoreDiscord.htmlPath);
        this.window.setMenuBarVisibility(false);
    }

    /**
     * Function that runs when the app is closed.
     */
    cleanup() {
        app.quit();
        logger.shutdown();
    }
}

// Start the app
new CentStoreDiscord();
