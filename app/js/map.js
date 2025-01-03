const map = L.map('map', {
    center: [49.84, 24.03],
    zoom: 14
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);


document.addEventListener("DOMContentLoaded", () => {
    const name = $('#name').get(0).innerText;
    // right now using city centre coords
    console.log(name);
    const marker = L.marker([49.84181862718789, 24.03162551465858]).bindPopup(name).addTo(map);
});


