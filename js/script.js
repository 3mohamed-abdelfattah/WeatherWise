// Global variables for API Locations.
let latitude;
let longitude;

// Get Data from API
async function getData() {
    if (latitude === undefined || longitude === undefined) {
        console.error("Latitude or Longitude is not defined.");
        return null;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=eda8d98890214bab926190059241708&q=${latitude},${longitude}&days=3`;
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
    fetchAndUpdateWeather(0); // Load current day weather by default
}

function errorCallback(error) {
    console.error(`Error: ${error.message}`);
}

async function fetchAndUpdateWeather(dayIndex) {
    const data = await getData();
    if (data) {
        // DOM content
        const currentHourElem = document.querySelector('.current-hour');
        const currentDegreeElem = document.querySelector('.current-degree');
        const dateRes = document.querySelector('.date');
        const locationRes = document.querySelector('.location');
        const dayRes = document.querySelector('.day');
        const conditionRes = document.querySelector('.status');
        const temperatureRes = document.querySelector('.temperature');

        // Convert date format and days
        const date = new Date();
        date.setDate(date.getDate() + dayIndex); // Modify date based on dayIndex
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = daysOfWeek[date.getDay()];

        // Extract forecast data based on dayIndex
        const forecastData = data.forecast.forecastday[Math.max(0, Math.min(dayIndex, 2))];

        // Apply New Values
        if (dateRes && locationRes && dayRes && conditionRes && temperatureRes) {
            dateRes.textContent = formattedDate;
            locationRes.textContent = `${data.location.name}, ${data.location.country}`;
            dayRes.textContent = dayName;
            conditionRes.textContent = forecastData.day.condition.text;
            temperatureRes.textContent = `${Math.round(forecastData.day.avgtemp_c)}°C`;
            currentHourElem.textContent = '12:00'; // Default hour, can be modified as needed
            currentDegreeElem.textContent = `${Math.round(forecastData.day.avgtemp_c)}°C`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle Today, Tomorrow, and Yesterday buttons
    const todayBtn = document.querySelector('.todayTxt');
    const tomorrowBtn = document.getElementById('tomorrow');
    const yesterdayBtn = document.getElementById('yesterday');

    const buttons = [todayBtn, tomorrowBtn, yesterdayBtn];

    if (todayBtn && tomorrowBtn && yesterdayBtn) {
        todayBtn.addEventListener('click', () => {
            fetchAndUpdateWeather(0);
            highlightButton(todayBtn);
        });

        tomorrowBtn.addEventListener('click', () => {
            fetchAndUpdateWeather(1);
            highlightButton(tomorrowBtn);
        });

        yesterdayBtn.addEventListener('click', () => {
            fetchAndUpdateWeather(-1);
            highlightButton(yesterdayBtn);
        });
    }

    // Function to highlight the active button
    function highlightButton(activeBtn) {
        buttons.forEach((btn) => {
            if (btn === activeBtn) {
                btn.style.opacity = '1';
            } else {
                btn.style.opacity = '0.5';
            }
        });
    }

    // Get User Location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});
