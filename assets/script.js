//global variables

let searchHistoryArray = [];
let departureCurrencyValue =  "";
let destinationCurrencyValue = "";
let conversionRateValue = "";
let conversionResultValue = "";
let budgetValue = "";
let departureCodeValue = "";
let destinationCodeValue = "";

const exchangeAPIkey = "ba1b49989171d9b0410110d6";
const travelForm = document.querySelector("#form-section");
const departureInput = document.querySelector("#departure-input");
const destinationInput = document.querySelector("#destination-input");
const budgetInput = document.querySelector("#budget-input");
const searchHistory = document.querySelector("#search-history-list");
const resultsContainer = document.querySelector("#results-section");
const apiKey = "gmOSLi0sE4brs48eLQFJxPwT0WY7uqOLMbpkbmKC";

bootSearchHistory();
travelForm.addEventListener("submit", submitSearch);

function submitSearch(event) {
    event.preventDefault();

    const departure = departureInput.value.trim();
    const destination = destinationInput.value.trim();
    const budget = parseInt(budgetInput.value.trim());
    budgetValue = budget;
    

    if (departure && destination && budget){
        getCountryCodes(departure, destination, budget);
    }
    
}

function getCountryCodes (departure, destination, budget) {
    const departureUrl = `http://geodb-free-service.wirefreethought.com/v1/geo/countries?limit=5&offsett&namePrefix=${departure}`
    fetch(departureUrl)
        .then(function(response) {
            return response.json();  
        })
        .then(function(departureData) {
            if (departureData) {
                departureCode = departureData.data[0].currencyCodes[0];
                console.log(departureCode);
                departureCodeValue = departureCode;

            const destinationUrl = `http://geodb-free-service.wirefreethought.com/v1/geo/countries?limit=5&offsett&namePrefix=${destination}`
            fetch(destinationUrl)
            .then(function(response) {
                return response.json();  
            })
            .then(function(destinationData) {
                if (destinationData) {
                    destinationCode = destinationData.data[0].currencyCodes[0];
                    
                    destinationCodeValue = destinationCode;

                    appendSearchHistory(departure, destination);
                    getCurrency(departureCode, destinationCode)
                    conversion(departureCode, destinationCode, budget)
                } else {
                    console.log("No country data found");
                }
        })
            } else {
                console.log("No country data found");
            }
        })
    }

function getCurrency(departureCode, destinationCode) {

    const currencyNameUrl = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/codes`;

    fetch(currencyNameUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const supportedCodes = data.supported_codes;

            for (let i = 0; i < supportedCodes.length; i++) {
                if (supportedCodes[i][0] === departureCode) {
                    console.log(supportedCodes[i][1]);
                    const departureCurrencyName = supportedCodes[i][1];
                    console.log(departureCurrencyName);
                    departureCurrencyValue = departureCurrencyName;

                }
                if (supportedCodes[i][0] === destinationCode) {
                    console.log(supportedCodes[i][1]);
                    const destinationCurrencyName = supportedCodes[i][1];
                    console.log(destinationCurrencyName);
                    destinationCurrencyValue = destinationCurrencyName;
                }
                displayResults()
              }
            
            })
            
       
}  


function appendSearchHistory (departure, destination) {
        if (searchHistoryArray === null) {
            return;
        } else {
            searchHistoryArray.push(`From ${departure} to ${destination}`);
            localStorage.setItem("Search History", JSON.stringify(searchHistoryArray));
            renderSearchHistory();
        }
    }

function renderSearchHistory () {
    searchHistory.innerHTML = "";
    for (let index = 0; index < searchHistoryArray.length; index++) {
        const newButton = document.createElement("button");
        newButton.setAttribute("type", "button");
        newButton.setAttribute("class", "btn past-search-button");
        newButton.setAttribute("data-search", searchHistoryArray[index]);
        newButton.textContent = searchHistoryArray[index];
        searchHistory.appendChild(newButton);
    }
}

function bootSearchHistory () {
    const storedHistory = JSON.parse(localStorage.getItem("Search History"));
    if (storedHistory === null) {
        return;
    } else if (storedHistory) {
        searchHistoryArray = storedHistory;
    }
    renderSearchHistory();
}

function searchHistoryClick(event) {
    if (!event.target.matches('.past-search-button')) {
        return;
    }
    const historyButton = event.target;
    const search = historyButton.getAttribute('data-search');
    
}

const conversion = function (departureCode, destinationCode, budget){

    const conversionURL = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/pair/${departureCode}/${destinationCode}/${budget}`
    
    fetch(conversionURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const conversionRate = data.conversion_rate;
        const conversionResult = data.conversion_result;
        console.log(conversionRate);
        console.log(conversionResult);
        conversionRateValue = conversionRate;
        conversionResultValue = conversionResult;
        
    });
}

const displayResults = function(){

    const resultsCard = document.createElement("div");
    const title = document.createElement("h3");
    const currencyNameEl = document.createElement("p");
    const conversionRateEl = document.createElement("p");
    const currentConversionEl = document.createElement("p");

    resultsCard.setAttribute("class", "card-body");
    title.setAttribute("id", "title",);
    title.setAttribute("class", "p-2 text-2xl");
    currencyNameEl.setAttribute("class", "ml-4 p-2");
    conversionRateEl.setAttribute("class", "ml-4 p-2");
    currentConversionEl.setAttribute("class", "ml-4 p-2");

    title.textContent = "Results:";
    currencyNameEl.textContent = `Your destination uses the ${destinationCurrencyValue}.`;
    conversionRateEl.textContent = `The conversion rate is ${conversionRateValue}.`;
    currentConversionEl.textContent = `Your budget of $${budgetValue} ${departureCodeValue} converts into $${conversionResultValue} ${destinationCodeValue}.`;

    resultsCard.append(title, currencyNameEl, conversionRateEl, currentConversionEl);
    
    resultsContainer.innerHTML = "";
    resultsContainer.append(resultsCard);

}
