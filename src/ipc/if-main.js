import { ipcMain } from "electron";
import netutils from "../net/ip-utils.js";
import logger from "../util/log.js";

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
                ctx.window.handleControl(controlBuffer);
            },
            (messageBuffer) => {
                ctx.window.handleMessage(messageBuffer);
            },
        );
    });
}
