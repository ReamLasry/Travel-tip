import { mapService } from './services/map-service.js';
import { weatherService } from './services/weather-service.js';
import { addressesService } from './services/addresses-service.js';

var gMap;
var gMarker;

const API_KEY = 'AIzaSyD5VvfHfVlus-ey6NWZRyOgsmMCSJG2Xuw'
const API_KEY_2 = '4b5737ce0e7b5f0d875e11f36d6c4f5f'



console.log('Main!');

mapService.getLocs()
    // .then(locs => console.log('locs', locs))

window.onload = () => {

    // document.querySelector('.curr-loc-btn').addEventListener('click', (ev) => {
    //     console.log('Aha!', ev.target);
    //     panTo(35.6895, 139.6917);
    // })

    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch((error) => console.log('INIT MAP ERROR:', error));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.curr-loc-btn').addEventListener('click', () => {
                panTo(pos.coords.latitude, pos.coords.longitude);
                addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    renderSavedLocations();

}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', gMap);
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                let locObj;

                weatherService.getLocWeatherData(mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng, API_KEY_2)
                    .then((res) => { return res.json() })
                    .then((res) => { showWeater(res.main) })

                mapService.getLocAddress(mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng, API_KEY)
                    .then((res) => (res.json()))
                    .then((res) => {
                        (document.querySelector('.loc-name').innerHTML = '&nbsp;' + (res["results"][0]["formatted_address"]));
                        locObj = {
                            id: makeId(),
                            addressName: res["results"][0]["formatted_address"],
                            coords: mapsMouseEvent.latLng.toJSON()
                        };
                        showSaveOption(locObj);
                    })
                addMarker(mapsMouseEvent.latLng.toJSON());




            });
            document.querySelector('.search-loc').addEventListener('click', onSearch)
        })
}


function addMarker(loc) {
    if (gMarker) gMarker.setMap(null)
    console.log(loc);
    mapService.getLocAddress(loc.lat, loc.lng, API_KEY)
        .then((res) => (res.json()))
        .then((res) => (document.querySelector('.loc-name').innerHTML = '&nbsp;' + (res["results"][0]["formatted_address"])))

    gMarker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: `LAT: ${loc.lat}, LAN: ${loc.lng}`
    });

    const elCopyBtn = document.querySelector('.copy-loc');
    elCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(`https://reamlasry.github.io/Travel-tip/index.html?lat=${loc.lat}&lng=${loc.lng}`);
    })
    return gMarker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onSearch() {
    let searchParam = document.getElementById('enter-loc').value;
    let searchParamCoords;
    mapService.getLocParams(searchParam, API_KEY)
        .then(res => res.json())
        .then((res) => {
            searchParamCoords = res
            console.log(searchParamCoords.results[0].geometry.location)
            panTo(searchParamCoords.results[0].geometry.location.lat, searchParamCoords.results[0].geometry.location.lng);
            addMarker({ lat: searchParamCoords.results[0].geometry.location.lat, lng: searchParamCoords.results[0].geometry.location.lng });
        })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
        // const API_KEY = 'AIzaSyD5VvfHfVlus-ey6NWZRyOgsmMCSJG2Xuw';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function showSaveOption(locObj) {
    const saveBTN = document.querySelector('.save-location');
    saveBTN.style.visibility = 'unset';

    saveBTN.onclick = () => {
        saveLocation(locObj);
    }
}

function saveLocation(locObj) {
    addressesService.addPlace(locObj);
    renderSavedLocations();
}

function renderSavedLocations() {
    const places = addressesService.getSavedPlaces();
    const locsList = document.querySelector('.locations-list');

    locsList.innerText = '';

    places.forEach(location => {
        locsList.innerHTML += `<li class="saved-loc saved-loc-${location.id}">${location.addressName}<button class="btn-${location.id}">🎯</button><button class="delete-btn-${location.id}">X</button></li>`
    });

    places.forEach(location => {
        document.querySelector(`.btn-${location.id}`).addEventListener('click', () => {
            panTo(location.coords.lat, location.coords.lng);
            addMarker({ lat: location.coords.lat, lng: location.coords.lng });
        });

        document.querySelector(`.delete-btn-${location.id}`).addEventListener('click', () => {
            console.log('i am delete');
            let places = addressesService.getSavedPlaces();
            console.log('places are: ', places);
            const idx = places.findIndex(place => place.id === location.id);
            console.log(idx);
            places.splice(idx, 1);
            addressesService.updatePlaces();
            renderSavedLocations();
        });
    });
}

function showWeater(weather) {
    document.getElementById('temp').innerHTML = `Temp:&nbsp${weather.temp}`;
    document.getElementById('feels-like').innerHTML = `Feels like:&nbsp${weather.feels_like}`;
    document.getElementById('temp-max').innerHTML = `Max temp:&nbsp${weather.temp_max}`;
    document.getElementById('temp-min').innerHTML = `Min temp:&nbsp${weather.temp_min}`;
    document.getElementById('pressure').innerHTML = `Pressure:&nbsp${weather.pressure}`;
    document.getElementById('humidity').innerHTML = `Humidity:&nbsp${weather.humidity}`;
}

// const myLatlng = { lat: -25.363, lng: 131.044 };
// const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: myLatlng,
// });
// Create the initial InfoWindow.

function makeId(length = 12) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}