import { mapService } from './services/map-service.js'

var gMap;
var gMarker;
const API_KEY = 'AIzaSyD5VvfHfVlus-ey6NWZRyOgsmMCSJG2Xuw'
const API_KEY_2 = '4b5737ce0e7b5f0d875e11f36d6c4f5f'
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))

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
            // 
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                mapService.getLocWeatherData(mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng, API_KEY_2)
                    .then((res) => { return res.json() })
                    .then((res) => { console.log(res.main) })

                mapService.getLocAddress(mapsMouseEvent.latLng.toJSON().lat, mapsMouseEvent.latLng.toJSON().lng, API_KEY)
                    .then((res) => (res.json()))
                    .then((res) => (document.querySelector('.loc-name').innerHTML = '&nbsp;' + (res["results"][0]["formatted_address"])))
                addMarker(mapsMouseEvent.latLng.toJSON());
                showSaveOption();
            });
            // 
            document.querySelector('.search-loc').addEventListener('click', onSearch)
        })
}




function addMarker(loc) {
    if (gMarker) gMarker.setMap(null)
    console.log(loc);

    gMarker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: `LAT: ${loc.lat}, Lan: ${loc.lng}`
    });
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
    let searchParam = document.getElementById('enter-loc').value
    let searchParamCoords
    mapService.getLocParams(searchParam, API_KEY)
        .then(res => res.json())
        .then((res) => {
            searchParamCoords = res
            console.log(searchParamCoords.results[0].geometry.location)
            panTo(searchParamCoords.results[0].geometry.location.lat, searchParamCoords.results[0].geometry.location.lng)
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

function showSaveOption() {

}


// const myLatlng = { lat: -25.363, lng: 131.044 };
// const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: myLatlng,
// });
// Create the initial InfoWindow.