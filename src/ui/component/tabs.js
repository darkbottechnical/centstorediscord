export class TabController {
    constructor(tabsetName) {
        this.tabsetName = tabsetName;

        const buttonContainer = document.querySelector(`.tab-controls[data-tabset="${tabsetName}"]`);
        this.buttons = buttonContainer ? buttonContainer.querySelectorAll(".tab-control") : [];

        this.panes = document.querySelectorAll(`.tab-container[data-tabset="${tabsetName}"] [data-tab]`);

        console.log(`[Tabset: ${tabsetName}] Buttons: ${this.buttons.length}, Panes: ${this.panes.length}`);

        this.init();
    }

    init() {
        this.buttons.forEach((btn) => {
            btn.onclick = () => this.switch(btn.dataset.tab);
        });
    }

    switch(tabId) {
        this.buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
        this.panes.forEach((p) => p.classList.toggle("active", p.dataset.tab === tabId));
    }
}
