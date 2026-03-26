import { TabController } from "./component/tabs.js";

class CentStoreUIManager {
    constructor() {
        console.log("UI Manager Initializing...");
        this.mainTabs = new TabController("main");
        this.channelTabs = new TabController("channels");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.ui = new CentStoreUIManager();
});
