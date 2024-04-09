let weatherSearchHistory = [];
const weatherApiKey = "f7c0786b20b622650cb560d6e04129e2";

const searchInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const todaySection = document.querySelector("#selected-city-today");
const forecastSection = document.querySelector("#five-day-box");
const pastSearches = document.querySelector("#past-searches");

bootSearchHistory();
searchButton.addEventListener('click', submitSearch);
pastSearches.addEventListener('click', searchHistoryClick);

function submitSearch (event) {
    event.preventDefault();
    
    const search = searchInput.value.trim();
    
    if (search) {
        getCoordinates(search)
    }

    console.log(search)
}

function getCoordinates (search) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${weatherApiKey}`;
    fetch(url).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        
        if (!data[0]) {
        alert("Please enter a valid city");
        }  else {
            appendWeather(search);
            getWeather (data[0])
        }
    })
    }

function appendWeather (search) {
    if (weatherSearchHistory.indexOf(search) !== -1) {
        return;
    } else {
        weatherSearchHistory.push(search);
        localStorage.setItem("Weather History", JSON.stringify(weatherSearchHistory));
        console.log('added to storage')
        renderSearchHistory();



    }
}

function renderSearchHistory () {
    pastSearches.innerHTML = "";
    for (let index = 0; index < weatherSearchHistory.length; index++) {
        const newButton = document.createElement("button");
        newButton.setAttribute("type", "button");
        newButton.setAttribute("class", "past-search-button");
        newButton.setAttribute("data-search", weatherSearchHistory[index]);
        newButton.textContent = weatherSearchHistory[index];
        pastSearches.appendChild(newButton);
    }
}

function bootSearchHistory () {
    const storedHistory = JSON.parse(localStorage.getItem("Weather History"))

    if (storedHistory === null) {
        return;
    } else if (storedHistory) {
        weatherSearchHistory = storedHistory;
    }

    renderSearchHistory();

}

function searchHistoryClick (event) {
    
    if (!event.target.matches('.past-search-button')) {
        return;
    }
    
    const historyButton = event.target;
    const search = historyButton.getAttribute('data-search');
    getCoordinates(search);
}

function getWeather (location) {
    const latitude = location.lat;
    const longitude = location.lon;
    const city = location.name;
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;
    fetch(apiURL).then(function(response) {
        return response.json();
    }).then(function(data){
        console.log(data);
        displayTodaysWeather(city, data.list[0]);
        displayForecast(data.list)
    });

}

function displayTodaysWeather (city, weatherData) {
    const date = dayjs().format('M/D/YYYY');
    const tempFull = (weatherData.main.temp - 273.15) * 1.8 + 32;
    const temp = tempFull.toFixed(1);
    const windSpeed = weatherData.wind.speed;
    const humid = weatherData.main.humidity;
    const icon = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    console.log(weatherData);

    const block = document.createElement('div');
    const title = document.createElement('h2');
    const emoji = document.createElement('img');
    const temperature = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');
    
    title.setAttribute('id', 'today-header');
    emoji.setAttribute('id', 'header-emoji')
    temperature.setAttribute('class', 'today-text');
    wind.setAttribute('class', 'today-text');
    humidity.setAttribute('class', 'today-text');

    title.textContent = `${city} (${date})`;
    emoji.setAttribute('src', icon);
    title.append(emoji);

    temperature.textContent = `Temperature: ${temp} °F`;
    wind.textContent = `Wind: ${windSpeed} m/h`;
    humidity.textContent = `Humidity: ${humid}%`;

    block.append(title, temperature, wind, humidity)

    todaySection.innerHTML = "";
    todaySection.append(block);

}

function displayForecast (weatherData) {
    const start = dayjs().add(1, 'day').startOf('day').unix();
    const end = dayjs().add(6, 'day').startOf('day').unix();
    const headerBox = document.createElement('div');
    const title = document.createElement('h2');
    headerBox.setAttribute('id', 'header-box');
    title.setAttribute('id', 'forecast-title');
    title.textContent = '5 Day Forecast';
    headerBox.append(title);

    forecastSection.innerHTML = "";
    forecastSection.append(headerBox);

    for (let index = 0; index < weatherData.length; index++) {
        console.log(weatherData[index].dt);
        if (weatherData[index].dt >= start && weatherData[index].dt <= end){
            console.log(weatherData[index].dt_txt.slice(11, 13));
            if (weatherData[index].dt_txt.slice(11,13) === '12') {
                console.log(weatherData[index]);
                
                createForecastBlock(weatherData[index]);
            }
    }
    }
}

function createForecastBlock(forecast) {
    console.log(forecast);
    const icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const tempFull = (forecast.main.temp - 273.15) * 1.8 + 32;
    const temp = tempFull.toFixed(1);
    const wind = forecast.wind.speed;
    const humidity = forecast.main.humidity;

    const newBlock = document.createElement('div');
    const newBlock2 = document.createElement('div');
    const newBlock3 = document.createElement('div');
    const date = document.createElement('h3');
    const emoji = document.createElement('img');
    const tempP = document.createElement('p');
    const windP = document.createElement('p');
    const humidityP = document.createElement('p');

    newBlock.append(newBlock2);
    newBlock2.append(newBlock3);
    newBlock3.append(date, emoji, tempP, windP, humidityP);

    newBlock.setAttribute('class', 'new-block');
    newBlock2.setAttribute('class', 'new-block-two');
    newBlock3.setAttribute('class', 'new-block-three');
    emoji.setAttribute('id', 'forecast-emoji');
    date.setAttribute('id', 'forecast-date');
    tempP.setAttribute('class', 'forecast-text');
    windP.setAttribute('class', 'forecast-text');
    humidityP.setAttribute('class', 'forecast-text');

    date.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    emoji.setAttribute('src', icon);
    tempP.textContent = `Temperature: ${temp} °F`;
    windP.textContent = `Wind: ${wind} m/h`;
    humidityP.textContent = `Humidity: ${humidity}%`;

    forecastSection.append(newBlock);

}
