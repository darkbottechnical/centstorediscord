import { TabController } from "./component/tabs.js";
import { ProfileSection } from "./component/profile.js";

class CentStoreUIManager {
    constructor() {
        console.log("UI Manager Initializing...");
        this.mainTabs = new TabController("main");
        this.channelTabs = new TabController("channels");

        this.profileSection = new ProfileSection();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.ui = new CentStoreUIManager();
});
