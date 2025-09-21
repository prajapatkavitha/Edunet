const myAPIKey = '33fee7f303c4da4d8cfd3c3ebaae6ec8'; 

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherLocationInfo = document.getElementById('weather-location-info');
const weatherReportCard = document.getElementById('weather-report-card');
const errorMsg = document.getElementById('error-message');
const weatherIcon = document.getElementById('weather-icon');
const appBackground = document.getElementById('app-background');
const topHumorReport = document.getElementById('top-humor-report'); 
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const dayNightStatusElement = document.getElementById('day-night-status');
const descriptionElement = document.getElementById('description'); 
const temperatureElement = document.getElementById('temperature');

// New and updated elements
const hourlyForecastContainer = document.getElementById('hourly-cards-container');
const weeklyForecastContainer = document.getElementById('weekly-cards-container');
const hourlySection = document.getElementById('hourly-forecast-container');
const weeklySection = document.getElementById('weekly-forecast-container');

const currentDayNameElement = document.getElementById('current-day-name');

let tempAnimationInterval;

const weatherMoods = {
    'clear': {
        description: "The sun's out! Time to shine (or hide from the brightness). ✨",
        background: 'sf.jpg'
    },
    'clouds': {
        description: "It's cloudy. Perfect weather for deep thoughts and pondering life. ☁️",
        background: 'cs.jpg'
    },
    'rain': {
        description: "It's raining cats and dogs! Grab a blanket and some hot cocoa. 🌧️",
        background: 'rw.jpg'
    },
    'drizzle': {
        description: "Just a sprinkle, nothing a good hair day can't handle. 💧",
        background: 'wt.jpg'
    },
    'snow': {
        description: "Snow day! Time to build a snowman or just hibernate. ☃️",
        background: 'SF.jpg'
    },
    'thunderstorm': {
        description: "Thunderbolts and lightning! Very, very frightening. ⚡",
        background: 'LS.jpg'
    },
    'mist': {
        description: "It's a bit hazy out. Like the morning after a long night... 🌫️",
        background: 'misty_forest.jpg'
    },
    'haze': {
        description: "Haze for days. Are we in a dream? 😵‍💫",
        background: 'misty_fog.jpg'
    },
    'fog': {
        description: "Can't see a thing! Just follow the sound of my voice. ☁️",
        background: 'misty_forest.jpg'
    },
    'default': {
        description: "The weather is... doing its thing. Whatever that is! 🤷",
        background: 'bi2.jpg'
    }
};

async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Data not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Whoops, an error occurred:', error);
        return null;
    }
}

async function getWeatherInfo(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myAPIKey}&units=metric`;

    const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(weatherUrl),
        fetchWeatherData(forecastUrl)
    ]);

    if (weatherData && forecastData) {
        showTheWeather({ weatherData, forecastData });
    } else {
        showErrorMessage();
    }
}

async function getWeatherByCoords(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myAPIKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myAPIKey}&units=metric`;

    const [weatherData, forecastData] = await Promise.all([
        fetchWeatherData(weatherUrl),
        fetchWeatherData(forecastUrl)
    ]);

    if (weatherData && forecastData) {
        showTheWeather({ weatherData, forecastData });
    } else {
        showErrorMessage();
    }
}

function getInitialWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            () => {
                getWeatherInfo('Hyderabad'); 
            }
        );
    } else {
        getWeatherInfo('Hyderabad');
    }
}

function showTheWeather({ weatherData, forecastData }) {
    weatherLocationInfo.classList.remove('hidden');
    weatherReportCard.classList.remove('hidden');
    descriptionElement.classList.remove('hidden'); 
    hourlySection.classList.remove('hidden');
    weeklySection.classList.remove('hidden');
    errorMsg.classList.add('hidden');

    document.getElementById('city-name').textContent = weatherData.name;
    
    const targetTemp = Math.round(weatherData.main.temp);
    animateNumber(temperatureElement, targetTemp);

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    currentDayNameElement.textContent = currentDay;

    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const mood = weatherMoods[weatherMain] || weatherMoods['default']; 
    
    descriptionElement.textContent = mood.description;

    topHumorReport.textContent = getTopHumorReport(weatherMain, weatherData.main.temp); 
    
    document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${weatherData.wind.speed} m/s`;
    
    const iconCode = weatherData.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    updateBackground(weatherMain); 
    updateTimeAndDayStatus(weatherData.timezone, iconCode);
    
    displayHourlyForecast(forecastData);
    displayWeeklyForecast(forecastData);
}

function animateNumber(element, targetNumber) {
    clearInterval(tempAnimationInterval); 
    let currentNumber = 0;
    const increment = targetNumber > 0 ? 1 : -1;
    const duration = 800; 
    const stepTime = duration / Math.abs(targetNumber);

    tempAnimationInterval = setInterval(() => {
        if ((increment > 0 && currentNumber >= targetNumber) || (increment < 0 && currentNumber <= targetNumber)) {
            clearInterval(tempAnimationInterval);
            element.textContent = targetNumber; 
            return;
        }
        currentNumber += increment;
        element.textContent = currentNumber;
    }, stepTime);
}

// Function to display hourly forecast (next 24 hours)
function displayHourlyForecast(forecastData) {
    hourlyForecastContainer.innerHTML = '';
    // The API provides data every 3 hours, so 8 entries cover 24 hours.
    const hourlyData = forecastData.list.slice(0, 8);
    let delay = 0;

    hourlyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const description = item.weather[0].description;
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.style.animationDelay = `${delay}s`;
        delay += 0.1;
        
        card.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="${description} icon">
            <p class="day-name">${time}</p>
            <p class="temp-high-low">${temp}°C</p>
        `;
        hourlyForecastContainer.appendChild(card);
    });
}

// Function to display weekly forecast
function displayWeeklyForecast(forecastData) {
    weeklyForecastContainer.innerHTML = ''; 
    const dailyForecast = {};
    
    for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const fullDate = date.toLocaleDateString();
        
        if (!dailyForecast[fullDate]) {
             dailyForecast[fullDate] = {
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp_min: item.main.temp,
                temp_max: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
            };
        } else {
            dailyForecast[fullDate].temp_min = Math.min(dailyForecast[fullDate].temp_min, item.main.temp);
            dailyForecast[fullDate].temp_max = Math.max(dailyForecast[fullDate].temp_max, item.main.temp);
        }
    }
    
    const forecastDays = Object.keys(dailyForecast);
    let delay = 0;
    
    for (let i = 0; i < Math.min(forecastDays.length, 7); i++) {
        const fullDate = forecastDays[i];
        const dayData = dailyForecast[fullDate];

        const card = document.createElement('div');
        card.classList.add('forecast-card');
        
        card.style.animationDelay = `${delay}s`;
        delay += 0.1;
        
        card.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${dayData.icon}@2x.png" alt="${dayData.description} icon">
            <p class="day-name">${dayData.dayName}</p>
            <p class="temp-high-low">${Math.round(dayData.temp_max)}° / ${Math.round(dayData.temp_min)}°</p>
        `;
        weeklyForecastContainer.appendChild(card);
    }
}

function updateTimeAndDayStatus(timezone, iconCode) {
    const date = new Date();
    const localTime = new Date(date.getTime() + (timezone * 1000) + (date.getTimezoneOffset() * 60000));

    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };

    const formattedTime = localTime.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = localTime.toLocaleDateString('en-US', dateOptions);

    currentDateElement.textContent = formattedDate;
    currentTimeElement.textContent = formattedTime;

    const isDay = iconCode.slice(-1) === 'd';
    dayNightStatusElement.textContent = isDay ? 'Day' : 'Night';
}

function getTopHumorReport(weatherCondition, temp) {
    if (temp < 0) {
        return "It's so cold, I saw a politician with his hands in his own pockets. 🥶";
    } else if (temp > 30) {
        return "Warning: Your phone's battery is hotter than this asphalt. Stay hydrated! 🔥";
    } else if (weatherCondition.includes('rain')) {
        return "Looks like the sky is taking a shower... a really long one. 🌧️";
    } else if (weatherCondition.includes('clear')) {
        return "The sun is out! It's aggressively clear. Protect your eyeballs. 😎";
    } else if (weatherCondition.includes('cloud')) {
        return "Cloudy with a high chance of me judging your outfit from my window. 😉";
    } else if (weatherCondition.includes('snow')) {
        return "It's snowing. My inner child is screaming, but my car is crying. ❄️";
    } else if (weatherCondition.includes('thunderstorm')) {
        return "The gods are angry again. Maybe check your search history? ⚡";
    } else {
        return "I have no witty remarks for this weather. It's just... a day. 🤷";
    }
}


function showErrorMessage() {
    clearInterval(tempAnimationInterval);
    descriptionElement.textContent = ''; 

    weatherLocationInfo.classList.add('hidden');
    weatherReportCard.classList.add('hidden');
    descriptionElement.classList.add('hidden'); 
    hourlySection.classList.add('hidden');
    weeklySection.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = "Are you sure that's a real place? 🤔 I've never heard of it! My server hamsters are confused.";
    topHumorReport.textContent = "Oops! My crystal ball is broken. Try again! 🔮";
    updateBackground('default'); 
}

function updateBackground(weatherCondition) {
    const mood = weatherMoods[weatherCondition] || weatherMoods['default'];
    appBackground.style.backgroundImage = `url('${mood.background}')`;
}


searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherInfo(cityName);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateBackground('default'); 
    topHumorReport.textContent = "Welcome! Let's check the vibes. ✨";
    getInitialWeather();
});