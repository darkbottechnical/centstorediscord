import { app } from "electron";
import path from "path";

class AssetManager {
    constructor() {
        this.isProdEnv = app.isPackaged;
        this.assetsRoot = this.isProdEnv
            ? path.join(process.resourcesPath, "back")
            : path.join(import.meta.dirname, "..", "..", "assets", "back");
    }

    getAssetPath(type, filename) {
        return path.join(this.assetsRoot, type, filename);
    }
}

const assetManager = new AssetManager();
export default assetManager;
