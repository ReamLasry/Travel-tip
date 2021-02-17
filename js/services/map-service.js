export const mapService = {
    getLocs,
    getLocParams,
    getLocAddress
};
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function getLocParams(location, key) {
<<<<<<< HEAD
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.replaceAll(' ','+')}&key=${key}`)
        // .then(res => res.json())
        // .then(ans => {
        //     console.log('Service Got Ans:', ans);
        //     // resolve(ans)
        // })
}

=======
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.replaceAll(' ', '+')}&key=${key}`)
    // .then(res => res.json())
    // .then(ans => {
    //     console.log('Service Got Ans:', ans);
    //     // resolve(ans)
    // })
}

function getLocWeatherData(lat, lan, key) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${key}&units=metric`)
}

>>>>>>> 997f7daba8513e3f2934f469e01a8298867082d1
function getLocAddress(lat, lng, key) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
}