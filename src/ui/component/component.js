export class Component {
    constructor(selector) {
        this.root = document.querySelector(selector);
        if (!this.root) throw new Error(`Selector ${selector} has no matches.`);

        this.elRefs = {};
        this._cacheElRefs();
        this.init();
    }

    /**
     * Hook for when the component is initialised.
     */
    init() {}

    /**
     * Internal helper function to cache marked elements inside the root container.
     * @returns {void}
     */
    _cacheElRefs() {
        document.querySelectorAll("[data-elref]").forEach((el) => {
            this.elRefs[el.getAttribute("data-elref")] = el;
        });
    }

    _log(level, message) {
        console.log(`[${new Date()}] [${level}] ${message}`);
    }

    info(message) {
        this._log("INFO", message);
    }

    warn(message) {
        this._log("WARN", message);
    }

    error(message) {
        this._log("ERROR", message);
    }

    send(channel, data) {
        if (window.bridge) {
            window.bridge.send(channel, data);
        } else {
            this.warn("Electron bridge API not found.");
        }
    }

    async invoke(channel) {
        if (window.bridge) {
            return await window.bridge.invoke(channel);
        } else {
            this.warn("Electron bridge API not found.");
        }
    }

    on(channel, callback) {
        if (window.bridge) {
            window.bridge.on(channel, callback);
        } else {
            this.warn("Electron bridge API not found.");
        }
    }
}
