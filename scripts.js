document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("sections-container");
    const scrollLeft = document.getElementById("scroll-left");
    const scrollRight = document.getElementById("scroll-right");

    scrollLeft.addEventListener("click", function () {
        container.scrollBy({ left: -window.innerWidth * 0.75, behavior: "smooth" });
    });

    scrollRight.addEventListener("click", function () {
        container.scrollBy({ left: window.innerWidth * 0.75, behavior: "smooth" });
    });
});
