// Get the scroller and arrow buttons
const scroller = document.querySelector('.scroller');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

// Amount to scroll per button click
const scrollAmount = 300; // Adjust for your layout

// Scroll left
leftArrow.addEventListener('click', () => {
    scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

// Scroll right
rightArrow.addEventListener('click', () => {
    scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

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