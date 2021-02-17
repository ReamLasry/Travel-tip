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
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.replaceAll(' ', '+')}&key=${key}`)
    // .then(res => res.json())
    // .then(ans => {
    //     console.log('Service Got Ans:', ans);
    //     // resolve(ans)
    // })
}

function getLocAddress(lat, lng, key) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
}