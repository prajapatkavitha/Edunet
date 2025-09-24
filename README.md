# My Super Fun Weather App ✨

A dynamic and interactive web application that provides a real-time weather report, complete with a unique "vibe check," and detailed hourly and weekly forecasts. It's designed to be both informative and entertaining.

---

## Live Demo

You can view the live project here: [https://prajapatkavitha.github.io/My-Super-Fun-Weather-App/](https://prajapatkavitha.github.io/My-Super-Fun-Weather-App/)

---

## Features

  * **Real-time Weather:** Get the current temperature, humidity, and wind speed for any city in the world.
  * **Dynamic Background:** The background image automatically updates to match the current weather (e.g., cloudy, rainy, or clear).
  * **Location-Based Data:** The app uses geolocation to automatically display the weather for your current location upon first load.
  * **24-Hour Forecast:** View a detailed report of the next 24 hours in 3-hour intervals.
  * **7-Day Forecast:** Plan your week with a glance at the upcoming daily weather trends.
-----

## Technologies Used

  * **HTML5:** For the app's core structure.
  * **CSS3:** For styling, animations, and responsive design.
  * **JavaScript (ES6+):** For all the app's functionality, including API calls, data manipulation, and DOM interactions.
  * **[OpenWeatherMap API](https://openweathermap.org/api):** Provides the weather and forecast data.

-----

## Setup and Installation

Follow these simple steps to get the app running on your local machine:

1.  **Clone the repository** (or download the project files).
2.  **Get an OpenWeatherMap API Key:**
      * Go to the [OpenWeatherMap website](https://openweathermap.org/api).
      * Sign up for a free account.
      * Generate a new API key from your account dashboard.
3.  **Update the API Key:** Open `script.js` and replace the placeholder API key with your new key:
    ```javascript
    const myAPIKey = 'YOUR_API_KEY_HERE';
    ```
4.  **Open the App:** Simply open the `index.html` file in your preferred web browser.

-----

## Code Structure

  * `index.html`: The main HTML file containing the app's layout and content.
  * `style.css`: The stylesheet that handles the app's visual design, including the dynamic background and animations.
  * `script.js`: The JavaScript file that fetches weather data, updates the page content, and manages all user interactions.
