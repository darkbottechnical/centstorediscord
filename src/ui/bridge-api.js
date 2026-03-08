import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("bridge", {});
