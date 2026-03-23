class Component {
    constructor(rootSel) {
        this.root = document.querySelector(rootSel);
        if (!this.root) throw new Error(`Failed to initialise UI component: Selector "${rootSel}" not found.`);
        this.elementReferences = {};
        this._cacheElementReferences();

        this.init();
    }

    _cacheElementReferences() {
        this.root.querySelectorAll("[data-elref]").forEach((el) => {
            this.elementReferences[el.getAttribute("data-elref")] = el;
        });
    }
}
