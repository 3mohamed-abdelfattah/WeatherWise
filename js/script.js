// Global for API Locations.
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
        const dateRes = document.querySelector('.date');
        const locationRes = document.querySelector('.location');
        const dayRes = document.querySelector('.day');
        const conditionRes = document.querySelector('.status');
        const temperatureRes = document.querySelector('.temperature');
        const forecastHoursElem = document.querySelector('.forecast-hours');

        // Convert date format and days
        const date = new Date();
        date.setDate(date.getDate() + dayIndex);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = daysOfWeek[date.getDay()];

        // Extract forecast data based on dayIndex
        const forecastData = data.forecast.forecastday[Math.max(0, Math.min(dayIndex, 2))];
        const currentHour = new Date().getHours(); // Get the current hour

        // Update main info
        if (dateRes && locationRes && dayRes && conditionRes && temperatureRes) {
            dateRes.textContent = formattedDate;
            locationRes.textContent = `${data.location.name}, ${data.location.country}`;
            dayRes.textContent = dayName;
            conditionRes.textContent = forecastData.day.condition.text;
            temperatureRes.textContent = `${Math.round(forecastData.day.avgtemp_c)}°C`;
        }

        // Clear the previous hours
        forecastHoursElem.innerHTML = '';

        let hourIndex = 0;
        for (let i = 0; i < 10; i++) {
            if (hourIndex >= forecastData.hour.length) break;

            const hourData = forecastData.hour[hourIndex];
            const hourElem = document.createElement('div');
            hourElem.classList.add('hour');

            const hourTime = new Date(hourData.time).getHours();
            if (hourTime === currentHour) {
                hourElem.classList.add('active');
            }

            const hourText = document.createElement('p');
            hourText.textContent = `${hourTime % 12 || 12} ${hourTime < 12 ? 'AM' : 'PM'}`;

            const hourImgSrc = hourData.condition.text.toLowerCase().includes('sunny')
                ? 'img/partly-sunny.png'
                : 'img/partly-sunny.png'; //Change if Icons Available

            const hourImg = document.createElement('img');
            hourImg.src = hourImgSrc;
            const hourDegree = document.createElement('p');
            hourDegree.textContent = `${Math.round(hourData.temp_c)}°C`;

            hourElem.appendChild(hourText);
            hourElem.appendChild(hourImg);
            hourElem.appendChild(hourDegree);

            forecastHoursElem.appendChild(hourElem);

            hourIndex += 2; // Control How Hour Shown  ->( 12 , 3 , 6 ,9 )
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
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

    function highlightButton(activeBtn) {
        buttons.forEach((btn) => {
            if (btn === activeBtn) {
                btn.style.opacity = '1';
            } else {
                btn.style.opacity = '0.5';
            }
        });
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});
