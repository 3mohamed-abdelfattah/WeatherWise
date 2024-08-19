// Global variables for API Locations.
let latitude;
let longitude;

//Get Data form API
async function getData() {
    if (latitude === undefined || longitude === undefined) {
        console.error("Latitude or Longitude is not defined.");
        return null;
    }

    const url = `http://api.weatherapi.com/v1/forecast.json?key=eda8d98890214bab926190059241708&q=${latitude},${longitude}&hour=24&days=3`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(response);
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


function successCallback(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    fetchAndUpdateWeather();
}

function errorCallback(error) {
    console.error(`Error: ${error.message}`);
}

async function fetchAndUpdateWeather() {
    const data = await getData();
    if (data) {
        // DOM content
        const dateRes = document.querySelector('.date');
        const locationRes = document.querySelector('.location');
        const dayRes = document.querySelector('.day');
        const conditionRes = document.querySelector('.status');
        const temperatureRes = document.querySelector('.temperature');

        // Convert date format and days
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        const dayName = daysOfWeek[dayIndex];

        // Apply New Values
        if (dateRes && locationRes && dayRes && conditionRes && temperatureRes) {
            dateRes.textContent = formattedDate;
            locationRes.textContent = `${data.location.name}, ${data.location.country}`;
            dayRes.textContent = dayName;
            conditionRes.textContent = data.current.condition.text;
            temperatureRes.textContent = `${data.current.temp_c}°C`;
        }
    }
}

// Get User Location
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
    console.log("Geolocation is not supported by this browser.");
}

document.addEventListener('DOMContentLoaded', () => {
    if (latitude !== undefined && longitude !== undefined) {
        fetchAndUpdateWeather();
    }
});
