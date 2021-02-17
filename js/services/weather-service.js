export const weatherService = {
    getLocWeatherData
}

function getLocWeatherData(lat, lan, key) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${key}&units=metric`)
}