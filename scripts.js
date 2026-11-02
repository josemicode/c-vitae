document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("sections-container");
    const sections = Array.from(container.querySelectorAll("section"));
    const navLinks = Array.from(document.querySelectorAll(".section-nav a"));
    const scrollLeft = document.getElementById("scroll-left");
    const scrollRight = document.getElementById("scroll-right");
    const printButton = document.getElementById("print-cv");
    const header = document.querySelector("header");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stackedLayout = window.matchMedia("(max-width: 768px)");

    const scrollBehavior = () => (reducedMotion.matches ? "auto" : "smooth");

    const cardStep = () => {
        const styles = window.getComputedStyle(container);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return sections[0].getBoundingClientRect().width + gap;
    };

    const scrollByCard = (direction) => {
        if (stackedLayout.matches) return;

        container.scrollBy({ left: direction * cardStep(), behavior: scrollBehavior() });
    };

    const updateActiveLink = () => {
        const stacked = stackedLayout.matches;
        const reference = stacked
            ? 120
            : container.getBoundingClientRect().left + container.clientWidth / 2;

        let active = sections[0];
        let best = Infinity;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const point = stacked ? rect.top : rect.left + rect.width / 2;
            const distance = Math.abs(point - reference);

            if (distance < best) {
                best = distance;
                active = section;
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${active.id}`;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const updateArrows = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        scrollLeft.disabled = container.scrollLeft <= 2;
        scrollRight.disabled = container.scrollLeft >= maxScroll - 2;
    };

    let ticking = false;

    const onScroll = () => {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveLink();
            updateArrows();
            ticking = false;
        });
    };

    scrollLeft.addEventListener("click", () => scrollByCard(-1));
    scrollRight.addEventListener("click", () => scrollByCard(1));

    container.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByCard(-1);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByCard(1);
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;

            event.preventDefault();

            if (stackedLayout.matches) {
                target.scrollIntoView({
                    behavior: scrollBehavior(),
                    block: "start",
                });
            } else {
                const containerRect = container.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                const left = container.scrollLeft
                    + targetRect.left
                    - containerRect.left
                    - (container.clientWidth - targetRect.width) / 2;
                const headerOffset = window.getComputedStyle(header).position === "sticky"
                    ? header.offsetHeight + 16
                    : 16;
                const containerTop = containerRect.top + window.scrollY;

                container.scrollTo({ left, behavior: scrollBehavior() });
                window.scrollTo({
                    top: Math.max(0, containerTop - headerOffset),
                    behavior: scrollBehavior(),
                });
            }

            history.replaceState(null, "", link.getAttribute("href"));
        });
    });

    printButton.addEventListener("click", () => window.print());

    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    updateActiveLink();
    updateArrows();
});
