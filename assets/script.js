//global variables

let searchHistoryArray = [];

const exchangeAPIkey = "ba1b49989171d9b0410110d6";
const travelForm = document.querySelector("#form-section");
const departureInput = document.querySelector("#departure-input");
const destinationInput = document.querySelector("#destination-input");
const budgetInput = document.querySelector("#budget-input");
const searchHistory = document.querySelector("#search-history-list");
const resultsContainer = document.querySelector("#results");
const apiKey = "gmOSLi0sE4brs48eLQFJxPwT0WY7uqOLMbpkbmKC";

bootSearchHistory();
travelForm.addEventListener("submit", submitSearch);

function submitSearch(event) {
    event.preventDefault();

    const departure = departureInput.value.trim();
    const destination = destinationInput.value.trim();
    const budget = parseInt(budgetInput.value.trim());
    

    if (departure && destination && budget){
        getCountryCodes(departure, destination);
    }
    
}

function getCountryCodes (departure, destination) {
    const departureUrl = `http://geodb-free-service.wirefreethought.com/v1/geo/countries?limit=5&offsett&namePrefix=${departure}`
    fetch(departureUrl)
        .then(function(response) {
            return response.json();  
        })
        .then(function(departureData) {
            if (departureData) {
                departureCode = departureData.data[0].currencyCodes[0];
                console.log(departureCode);

            const destinationUrl = `http://geodb-free-service.wirefreethought.com/v1/geo/countries?limit=5&offsett&namePrefix=${destination}`
            fetch(destinationUrl)
            .then(function(response) {
                return response.json();  
            })
            .then(function(destinationData) {
                if (destinationData) {
                    destinationCode = destinationData.data[0].currencyCodes[0];
                    appendSearchHistory(departure, destination);
                    getCurrency(departureCode, destinationCode)
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

                }
                if (supportedCodes[i][0] === destinationCode) {
                    console.log(supportedCodes[i][1]);
                    const destinationCurrencyName = supportedCodes[i][1];
                    console.log(destinationCurrencyName);
                }
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






// const conversion = function (budget){

//     const conversionURL = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/pair/${departureCurrencyCode}/${destinationCurrencyCode}/${budget}`
// }
