import { Component } from "./component.js";

export class ProfileSection extends Component {
    constructor() {
        super(".profile-section-container");
        this.state = {};
    }

    init() {
        this.info(
            `INIT: profile section - ${Object.keys(this.elRefs).join(", ")}`,
        );

        this.elRefs["profile-head"].addEventListener("click", () =>
            this.toggleVisibility(),
        );
        document.body.addEventListener("click", (e) => {
            if (e.target) {
                this.toggleVisibility(false);
            }
        });
    }

    updateUserInfo(newValue) {
        this.send("appdata.update");
    }

    toggleVisibility(bool = null) {
        const body = this.elRefs["profile-body"];
        if (bool == null) {
            body.classList.toggle("open");
        } else {
            if (bool) {
                body.classList.contains("open")
                    ? body.classList.add("open")
                    : null;
            } else {
                body.classList.remove("open");
            }
        }
    }
}
