// Скрипт для активації активного посилання при прокручуванні
const links = document.querySelectorAll("nav ul li a");
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});
$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        margin: 10,
        navText: [$('.left-arrow'), $('.right-arrow')],
        nav: true,
        dots: true,
        autoplay: false,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            768: { items: 1 },
            1200: { items: 1 }
        }
    });
});
