class Component {
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

    send(channel, data) {
        if (window.bridge) {
            window.bridge.send(channel, data);
        } else {
            console.warn("Electron bridge API not found.");
        }
    }

    on(channel, callback) {
        if (window.bridge) {
            window.bridge.on(channel, callback);
        } else {
            console.warn("Electron bridge API not found.");
        }
    }
}
