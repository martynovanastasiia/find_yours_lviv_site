(() => {
    const scroller = document.querySelector('.scroller');
    const images = scroller.querySelectorAll('img');
    const arrows = document.querySelector('.arrows');

    if (images.length <= 3) {
        arrows.classList.add('hidden');
    }
})();