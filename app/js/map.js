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
            iconUrl: typeIcons[item.type_id],
            iconSize: 30,
        });

        const marker = L.marker([item.latitude, item.longitude],
            {
                opacity: 0.9,
                title: name,
                icon: icon,
                alt: name,
                shadowPane: item.place_id
            });

        marker.addTo(markers);
        marker.addTo(layers[item.type_id]);
    })

    map.addLayer(markers);

    $(window).on('resize', () => {
        const newWidth = $(document).width();
        dialog.setSize([newWidth * (33 / 100), 150]);
    })

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

    const layerControl = L.control.groupedLayers(null, overlays,
        {
            groupCheckboxes: true,
            position: 'bottomleft'
        })
        .addTo(map);

    const cardWidth = (window.screen.width * (33 / 100)) + 5;

    const dialogOptions = {
        size: [cardWidth, 200],
        minSize: [100, 100],
        maxSize: [10000, 350],
        anchor: [-20, 20],
        position: "topright",
        initOpen: false
    };

    const dialog = L.control.dialog(dialogOptions)
        .addTo(map);

    dialog.lock();
    dialog.showClose();

    markers.eachLayer((layer) => {
        layer.on('click', () => {
            const place_id = layer.options.shadowPane;
            const place = data.find(place => place.place_id === place_id)
            formPlaceContent(place);
            dialog.open();
        })
    })
}

function formPlaceContent(place) {
    const container = document.getElementById("contentNode");
    container.innerHTML = '';
    const column1 = document.createElement("div");
    column1.className = "col-6 ph position-relativer";

    const photo = document.createElement("img");
    photo.src = place.photo_link;
    photo.className = 'photo';
    photo.alt = place.name;
    column1.appendChild(photo);

    const like_icon = document.createElement("div");
    like_icon.className = "like-icon";
    like_icon.innerHTML = '<svg width="33" height="29" viewBox="0 0 33 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                            <path d="M10 0.5H22.0544C27.3011 0.5 31.5544 4.75329 31.5544 10V19C31.5544 24.2467 27.3011 28.5 22.0544 28.5H9.99999C4.75329 28.5 0.5 24.2467 0.5 19V10C0.5 4.7533 4.7533 0.5 10 0.5Z"\n' +
        '                                  fill="#D9D9D9" fill-opacity="0.1" stroke="white"/>\n' +
        '                            <path d="M15.9196 8.66861L16.2721 9.01901L16.6246 8.66861C16.6775 8.61602 16.7314 8.56534 16.7862 8.51656C18.8727 6.65921 22.4103 7.47909 23.623 9.9253C24.2132 11.1156 24.2747 12.751 23.2096 14.7358C22.1622 16.6874 20.0285 18.9633 16.2721 21.4052C12.5158 18.9633 10.382 16.6875 9.33465 14.7358C8.26951 12.751 8.33106 11.1156 8.92118 9.92531C10.134 7.4791 13.6715 6.65921 15.758 8.51655C15.8128 8.56533 15.8667 8.61601 15.9196 8.66861Z"\n' +
        '                                  stroke="white"/>\n' +
        '                        </svg>'
    column1.appendChild(like_icon);

    const column2 = document.createElement("div");
    column2.className = "col-6";

    const card_content = document.createElement("div");
    card_content.className = "card-content";

    const name = document.createElement("h2");
    name.innerText = place.name;
    card_content.appendChild(name);

    const icon = document.createElement("div");
    icon.className = 'icon';

    if (place.cuisine_name === 'null') {
        //icon.innerHTML = '<svg width="39" height="35" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 511.997"><path fill="#fff" fill-rule="nonzero" d="M456.103 372.929c.76 0 1.503.076 2.221.22 18.883-32.877 29.294-67.765 30.989-105.931h-70.387c-1.273 35.725-11.943 70.959-31.822 105.711h68.999zm-12.274 22.439h-70.885c-21.522 31.176-50.508 61.962-86.825 92.362 62.484-7.736 120.355-41.731 157.71-92.362zM225.876 487.73c-36.317-30.401-65.302-61.187-86.824-92.362H68.171c37.351 50.625 95.219 84.622 157.705 92.362zM53.549 372.929h71.343c-19.881-34.752-30.548-69.986-31.822-105.711H22.687c1.692 38.09 12.06 72.896 30.862 105.711zM22.687 244.778h70.82c2.607-35.001 14.22-70.236 35.03-105.71H53.549c-18.805 32.824-29.17 67.626-30.862 105.71zm45.484-128.15h74.743c21.286-30.671 49.426-61.521 84.54-92.551-63.108 7.382-121.587 41.459-159.283 92.551zM284.54 24.077c35.114 31.03 63.256 61.878 84.542 92.551h74.746c-37.692-51.087-96.176-85.172-159.288-92.551zm173.91 114.991h-74.99c20.812 35.473 32.424 70.709 35.03 105.71h70.823c-1.692-38.095-12.061-72.891-30.863-105.71zM256 0c85.059 0 164.712 41.638 212.305 112.556C497.103 155.464 512 203.909 512 256c0 52.06-14.832 100.437-43.695 143.441C420.677 470.412 341.002 511.997 256 511.997c-85.06 0-164.713-41.638-212.306-112.556C14.897 356.535 0 308.089 0 256c0-52.063 14.83-100.439 43.694-143.444C91.322 41.585 170.997 0 256 0zm11.218 38.617v78.011h74.275c-19.514-25.73-44.246-51.733-74.275-78.011zm0 100.451v105.71h128.845c-2.917-34.714-15.788-69.947-38.83-105.71h-90.015zm0 128.15v105.711h93.793c22.204-34.986 34.125-70.221 35.547-105.711h-129.34zm0 128.15v78.971c31.859-26.182 57.931-52.505 78.111-78.971h-78.111zm-22.439 78.976v-78.976h-78.112c20.182 26.467 46.25 52.792 78.112 78.976zm0-101.415V267.218h-129.34c1.421 35.49 13.34 70.725 35.547 105.711h93.793zm0-128.151v-105.71h-90.015c-23.04 35.763-35.913 70.996-38.83 105.71h128.845zm0-128.15V38.609c-30.032 26.281-54.763 52.286-74.275 78.019h74.275z"/></svg>';
        const img = document.createElement("img");
        img.className = 'icons';
        img.src = '../../icons/map/white-globe.svg';
        img.alt = 'Іконка района';
        icon.appendChild(img);
        const span = document.createElement('span');
        span.innerText = place.district;
        icon.appendChild(span);
    } else {
        icon.innerHTML = '<svg width="59" height="70" viewBox="0 0 59 70" fill="none"\n' +
            '                                 xmlns="http://www.w3.org/2000/svg">\n' +
            '                                <path d="M43.416 20.5078H15.584V16.9326C12.9303 15.6708 11.1895 13.113 11.1895 10.2539C11.1895 6.10764 14.8037 2.73438 19.2461 2.73438C20.2561 2.73438 21.2389 2.91129 22.1629 3.25445C23.9481 1.22979 26.6371 0 29.5 0C32.3629 0 35.0519 1.22979 36.8371 3.25445C37.7611 2.91129 38.7439 2.73438 39.7539 2.73438C44.1963 2.73438 47.8105 6.10764 47.8105 10.2539C47.8105 13.1128 46.0697 15.6708 43.416 16.9326V20.5078Z"\n' +
            '                                      fill="white"/>\n' +
            '                                <path d="M22.9082 45.3379V47.1677C22.9082 50.5656 25.8594 53.3201 29.5 53.3201C33.1406 53.3201 36.0918 50.5656 36.0918 47.1677V45.3379C34.0454 46.0774 31.8228 46.4841 29.5 46.4841C27.1772 46.4841 24.9546 46.0774 22.9082 45.3379Z"\n' +
            '                                      fill="white"/>\n' +
            '                                <path d="M15.584 24.6094V29.3945C15.584 36.5563 21.8267 42.3828 29.5 42.3828C37.1733 42.3828 43.416 36.5563 43.416 29.3945V24.6094H15.584Z"\n' +
            '                                      fill="white"/>\n' +
            '                                <path d="M29.5 57.4219C23.4421 57.4219 18.5137 52.822 18.5137 47.168V46.4844H17.7812C8.47759 46.4844 0.935547 53.5236 0.935547 62.207V67.9492C0.935547 69.0818 1.91934 70 3.13281 70H11.1895V64.9414C11.1895 63.8088 12.1732 62.8906 13.3867 62.8906C14.6002 62.8906 15.584 63.8088 15.584 64.9414V70H31.6973V57.2156C30.9871 57.3506 30.2523 57.4219 29.5 57.4219ZM26.5703 65.625C25.3568 65.625 24.373 64.7068 24.373 63.5742C24.373 62.4416 25.3568 61.5234 26.5703 61.5234C27.7838 61.5234 28.7676 62.4416 28.7676 63.5742C28.7676 64.7068 27.7838 65.625 26.5703 65.625Z"\n' +
            '                                      fill="white"/>\n' +
            '                                <path d="M41.2188 46.4844H40.4863V47.168C40.4863 50.5154 38.7584 53.4929 36.0918 55.3655V70H43.416V64.9414C43.416 63.8088 44.3998 62.8906 45.6133 62.8906C46.8268 62.8906 47.8105 63.8088 47.8105 64.9414V70H55.8672C57.0807 70 58.0645 69.0818 58.0645 67.9492V62.207C58.0645 53.5236 50.5224 46.4844 41.2188 46.4844Z"\n' +
            '                                      fill="white"/>\n' +
            '                            </svg>';
        const span = document.createElement('span');
        span.innerText = place.cuisine_name;
        icon.appendChild(span);
    }

    card_content.appendChild(icon);

    const address_icon = document.createElement("div");
    address_icon.className = 'icon';
    address_icon.innerHTML = '<svg width="37" height="33" viewBox="0 0 37 33" fill="none"\n' +
        '                                 xmlns="http://www.w3.org/2000/svg">\n' +
        '                                <path d="M18.5 33C18.5 33 32.375 21.272 32.375 12.375C32.375 5.54048 26.163 0 18.5 0C10.837 0 4.625 5.54048 4.625 12.375C4.625 21.272 18.5 33 18.5 33ZM18.5 18.5625C14.6685 18.5625 11.5625 15.7923 11.5625 12.375C11.5625 8.95774 14.6685 6.1875 18.5 6.1875C22.3315 6.1875 25.4375 8.95774 25.4375 12.375C25.4375 15.7923 22.3315 18.5625 18.5 18.5625Z"\n' +
        '                                      fill="white"/>\n' +
        '                            </svg>';
    const address = document.createElement('span');
    address.innerText = place.address;
    address_icon.appendChild(address);
    card_content.appendChild(address_icon);

    const likes = document.createElement('div');
    likes.className = 'icon';
    likes.innerHTML = '<span>120 вподобань</span>';
    card_content.appendChild(likes);
    column2.appendChild(card_content);

    container.appendChild(column1);
    container.appendChild(column2);
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