export const addressesService = {
    addPlace,
    getSavedPlaces,
    updatePlaces
};
import { storageServices } from './storage-service.js';

const PLACESKEY = 'saved-places'

var gPlaces;

function addPlace(obj) {
    gPlaces.push(obj);
    storageServices.saveToStorage(PLACESKEY, gPlaces);
}


function getSavedPlaces() {
    gPlaces = storageServices.loadFromStorage(PLACESKEY);
    if (!gPlaces) gPlaces = [];
    return gPlaces;
}

function updatePlaces() {
    storageServices.saveToStorage(PLACESKEY, gPlaces);
    console.log(gPlaces);
}