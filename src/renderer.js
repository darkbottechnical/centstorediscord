const profileHead = document.querySelector(".profile-section-head");
const profileBody = document.querySelector(".profile-section-body");

if (profileHead && profileBody) {
    profileHead.addEventListener("click", () => {
        profileBody.classList.toggle("open");
    });
}

const tabControlContainers = document.querySelectorAll(".tab-controls");

tabControlContainers.forEach((controlContainer) => {
    const tabSetId = controlContainer.getAttribute("data-tabset");
    const contentContainer = document.querySelector(
        `.tab-container[data-tabset="${tabSetId}"]`,
    );

    if (!contentContainer) return;

    const controls = controlContainer.querySelectorAll(".tab-control");

    const contents = contentContainer.querySelectorAll(`:scope > [data-tab]`);

    controls.forEach((control) => {
        control.addEventListener("click", () => {
            const targetId = control.getAttribute("data-tab");

            controls.forEach((c) => c.classList.remove("active"));
            contents.forEach((c) => c.classList.remove("active"));

            control.classList.add("active");

            const targetContent = contentContainer.querySelector(
                `:scope > [data-tab="${targetId}"]`,
            );

            if (targetContent) targetContent.classList.add("active");
        });
    });
});
