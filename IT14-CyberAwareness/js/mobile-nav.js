const mobileNavQuery = window.matchMedia("(max-width: 768px)");

function setExpanded(item, expanded) {
    item.classList.toggle("is-expanded", expanded);
    const link = item.querySelector(":scope > a");
    if (link) {
        link.setAttribute("aria-expanded", String(expanded));
    }

    if (!expanded) {
        item.querySelectorAll(".is-expanded").forEach((child) => {
            child.classList.remove("is-expanded");
            const childLink = child.querySelector(":scope > a");
            if (childLink) {
                childLink.setAttribute("aria-expanded", "false");
            }
        });
    }
}

document.querySelectorAll(".sidebar .nav-menu .dropdown > a, .sidebar .nav-menu .dropdown-l2 > a")
    .forEach((link) => link.setAttribute("aria-expanded", "false"));

document.addEventListener("click", (event) => {
    const link = event.target.closest(
        ".sidebar .nav-menu .dropdown > a, .sidebar .nav-menu .dropdown-l2 > a"
    );
    if (!mobileNavQuery.matches || !link) {
        return;
    }

    const item = link.parentElement;
    const hasSubmenu = Array.from(item.children).some((child) =>
        child.matches(".submenu-l2, .submenu-l3")
    );
    if (!hasSubmenu || item.classList.contains("is-expanded")) {
        return;
    }

    event.preventDefault();
    Array.from(item.parentElement.children).forEach((sibling) => {
        if (sibling !== item && sibling.classList.contains("is-expanded")) {
            setExpanded(sibling, false);
        }
    });
    setExpanded(item, true);
});

document.querySelectorAll(".mobile-nav-checkbox").forEach((toggle) => {
    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            return;
        }

        document.querySelectorAll(".sidebar .nav-menu .is-expanded").forEach((item) => {
            setExpanded(item, false);
        });
    });
});
