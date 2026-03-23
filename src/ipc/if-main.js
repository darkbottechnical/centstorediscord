import { ipcMain } from "electron";
import netutils from "../net/ip-utils.js";
import logger from "../util/log.js";
import { CentStoreDiscord } from "../index.js";

/**
 * Helper to be called in the main class to register ipcMain listeners and stuff.
 * @param {CentStoreDiscord} ctx
 */
export function registerIpc(ctx) {
    const { socketManager } = ctx;

    ipcMain.handle("interfaces.list", async () => {
        logger.info("Retrieving interface list.");
        return netutils.listIPv4Interfaces();
    });

    ipcMain.on("interfaces.select", (event, ifaceInfo) => {
        logger.info(`Binding sockets to interface ${ifaceInfo.ipAddress}`);
        socketManager.setupSockets(
            ifaceInfo,
            (controlBuffer) => {
                ctx.channelManager.handleControl(controlBuffer);
            },
            (messageBuffer) => {
                ctx.channelManager.handleMessage(messageBuffer);
            },
        );
    });
}
