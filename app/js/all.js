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
const placesSection = document.getElementById("placesSection");
const locationsSection = document.getElementById("locationsSection");
const nextToLocations = document.getElementById("nextToLocations");
const prevToLocations = document.getElementById("prevToLocations");

// Показуємо "Локації"
nextToLocations.addEventListener("click", () => {
    placesSection.classList.remove("active");
    locationsSection.classList.add("active");
});

// Повертаємося до "Закладів"
prevToLocations.addEventListener("click", () => {
    locationsSection.classList.remove("active");
    placesSection.classList.add("active");
});