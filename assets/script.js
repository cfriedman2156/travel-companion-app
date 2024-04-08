//global variables

const exchangeAPIkey = "ba1b49989171d9b0410110d6";
const travelForm = document.querySelector("#form-section");
const departureInput = document.querySelector("#departure-input");
const destinationInput = document.querySelector("#destination-input");
const budgetInput = document.querySelector("#budget-input");
const resultsContainer = document.querySelector("#results")

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

    const departureUrl = `https://ip-geo-location.p.rapidapi.com/ip/check?format=json&filter=${departure}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '65d425a615msh8b10438e995f535p1d297ajsn78f72a232e93',
            'X-RapidAPI-Host': 'ip-geo-location.p.rapidapi.com'
        }
    };
    
    try {
        const response = fetch(url, options);
        const result = response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

//     const countryURL = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/codes`
//     fetch(countryURL).then(function(response){
//         return response.json();
//     }).then(function(data){
//         console.log(data)
//     });
// }  

// const conversion = function (departure, destination, budget){

//     const conversionURL = `https://v6.exchangerate-api.com/v6/${exchangeAPIkey}/pair/${}/${}/${budget}`
// }

// travelForm.addEventListener("submit", chooseYourCountry);
