const map = L.map('map', {
    center: [49.84, 24.03],
    zoom: 14
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

document.addEventListener("DOMContentLoaded", () => {
    // check if we on map page
    if (document.URL.includes('map')) {
        map.setZoom(12.4, {animate: false});
        renderMapData();
    } else {
        $(document).ready(function () {
            const name = $('#name').get(0).innerText;
            let place;

            if (document.URL.includes('place')) {
                place = sessionStorage.getItem('placePage');
            } else {
                place = sessionStorage.getItem('locationPage');
            }

            place = JSON.parse(place)[0];
            map.setView([place.latitude, place.longitude]);
            const icon = L.icon({
                iconUrl: typeIcons[place.type_id],
                iconSize: 30,
            });
            const marker = L.marker([place.latitude, place.longitude],
                {
                    opacity: 0.9,
                    icon: icon
                })
                .bindPopup(name)
                .addTo(map);
        })
    }
});

async function getMapData() {

    const cachedData = sessionStorage.getItem('mapData');
    const cacheTime = sessionStorage.getItem('mapDataTimestamp');
    const expirationTime = 30 * 60 * 1000;
    if (cachedData && cacheTime && Date.now() - cacheTime < expirationTime) {
        console.log('Using cached map data');
        return JSON.parse(cachedData);
    }

    const URL = 'http://localhost:8080/api/getMapData'

    try {
        const res = await fetch(URL);

        if (!res.ok) {
            throw new Error('Error while fetching map data');
        }

        const data = await res.json();
        sessionStorage.setItem('mapData', JSON.stringify(data));
        sessionStorage.setItem('mapDataTimestamp', Date.now().toString());
        return data;
    } catch (error) {
        console.error('Error while fetching map data:', error);
    }
}

async function renderMapData() {
    const data = await getMapData();

    const markers = L.featureGroup();

    const restaurant = L.featureGroup();
    const coffee = L.featureGroup();
    const steak_house = L.featureGroup();
    const fast_food = L.featureGroup();
    const bar = L.featureGroup();
    const pizza = L.featureGroup();
    const park = L.featureGroup();
    const theater = L.featureGroup();
    const gallery = L.featureGroup();
    const architectural = L.featureGroup();
    const cinema = L.featureGroup();
    const church = L.featureGroup();
    const museum = L.featureGroup();
    const other = L.featureGroup();

    const layers = {
        1: restaurant,
        2: coffee,
        3: steak_house,
        4: fast_food,
        5: bar,
        6: pizza,
        7: park,
        8: theater,
        9: gallery,
        10: architectural,
        11: cinema,
        12: church,
        13: museum,
        14: other
    };

    data.forEach((item) => {
        const name = item.name;

        const icon = L.icon({
            iconUrl: typeIcons[item.type],
            iconSize: 30,
        });

        const marker = L.marker([item.latitude, item.longitude],
            {
                opacity: 0.9,
                title: name,
                icon: icon
            });

        marker.on('click', () => {
            map.openPopup(`${name}`,
                [item.latitude, item.longitude])
        })

        marker.addTo(markers);
        marker.addTo(layers[item.type]);
    })

    map.addLayer(markers);

    $(document).ready(function () {
        $('.leaflet-control-layers-group-label').click();
    })

    const overlays = {
        "Всі маркери": {
            "Ресторан": restaurant,
            "Кав’ярня": coffee,
            "Стейк-хаус": steak_house,
            "Фаст-фуд": fast_food,
            "Бар": bar,
            "Піцерія": pizza,
            "Парк": park,
            "Театр": theater,
            "Галерея": gallery,
            "Пам’ятка архітектури": architectural,
            "Кінотеатр": cinema,
            "Церква/собор": church,
            "Музей": museum,
            "Інше": other
        }
    };

    const layerControl = L.control.groupedLayers(null, overlays, {collapsed: true, groupCheckboxes: true}).addTo(map);
}

const typeIcons = {
    1: "../../icons/map/restaurant.svg",
    2: "../../icons/map/coffee.svg",
    3: "../../icons/map/steak-house.svg",
    4: "../../icons/map/fast-food.svg",
    5: "../../icons/map/bar.svg",
    6: "../../icons/map/pizza.svg",
    7: "../../icons/map/park.svg",
    8: "../../icons/map/theater.svg",
    9: "../../icons/map/gallery.svg",
    10: "../../icons/map/architectural.svg",
    11: "../../icons/map/cinema.svg",
    12: "../../icons/map/church.svg",
    13: "../../icons/map/museum.svg",
    14: "Інше"
};
