//global variables

const exchangeAPIkey = "ba1b49989171d9b0410110d6";
const travelForm = document.querySelector("#form-section");
const departureInput = document.querySelector("#departure-input");
const destinationInput = document.querySelector("#destination-input");
const budgetInput = document.querySelector("#budget-input");
const searchHistory = document.querySelector("#search-history-section");
const resultsContainer = document.querySelector("#results");

//Here we take in the user input for their departure, destination, and budget
const chooseYourCountry = function(event){
    event.preventDefault();

    const departure = departureInput.value.trim();
    const destination = destinationInput.value.trim();
    const budget = parseInt(budgetInput.value.trim());

    if (departure && destination){
        countryCode(departure, destination)
    }

    if (budget){
        conversion(budget)
    }

    departureInput.value = "";
    destinationInput.value = "";
    budgetInput.value = "";
}

const countryCode = function(departure, destination){

    const departureUrl = `http://geodb-free-service.wirefreethought.com//v1/geo/countries?limit=5&offsett&namePrefix=${departure}`
    fetch(departureUrl).then(function(response){
        return response.json();

    }).then (function(data){
        console.log(data);
        const departureCurrencyCode = data.list[0].currencyCodes;
        console.log(departureCurrencyCode);
    })

    const destinationUrl = `http://geodb-free-service.wirefreethought.com//v1/geo/countries?limit=5&offsett&namePrefix=${destination}`
    fetch(destinationUrl).then(function(response){
        return response.json();

    }).then (function(data2){
        console.log(data2);
        const destinationCurrencyCode = data2.list[0].currencyCodes;
        console.log(destinationCurrencyCode);
    })
}
    const currencyName = function(){

    const currencyNameUrl = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/codes`
    fetch(currencyNameUrl).then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
    });
}  

const conversion = function (budget){

    const conversionURL = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/pair/${departureCurrencyCode}/${destinationCurrencyCode}/${budget}`
}

travelForm.addEventListener("submit", chooseYourCountry);
