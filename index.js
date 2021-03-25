
'use strict';

var matchFound = false;

//---------------------------
//generate functions
function generateCoinResults(price, cryptoName){
    $('.price-results').empty();
    $('.price-results').append(`<h2 class="indent" >The current price of ${cryptoName} is: ${price} USD</h2>`);
}
function generateConversionResults(responseJson, price){
    $('#conversion-results').empty();
    $('#conversion-results').append(`<h2>Price in Other Currencies</h2>`)

    const rates = responseJson.conversion_rates

    for (const [key, value] of Object.entries(rates)) {
        //8 major currencies
        //CAD EUR GBP CHF NZD AUD JPY
        if (key === 'CAD' || key === 'EUR' || key === 'GBP' || key === 'CHF' || key === 'NZD' || key === 'AUD' || key === 'JPY'){
        $('#conversion-results').append(
            `<li><h3>${value * price} ${key}</h3><li>`
        )};
    };
   
}
function generateMarketsAndQuotes(responseJson, maxResults){
    $('#markets-quotes-results').empty();
    $('#markets-quotes-results').append(`<h2>Markets Selling This Coin and Their Quote Currencies</h2>`);
    for(let i = 0; i < responseJson.length & i < maxResults; i++){
        $('#markets-quotes-results').append(
            `<li><h3>${responseJson[i].name}: ${responseJson[i].quote}</h3></li>`);
    }
}
//---------------------------

function getCoin(cryptocurrency, maxResults){
    const pricesURL =  'https://api.coinlore.net/api/tickers/?'

    for (let i = 0; i < 5000 & matchFound === false; i += 100){
        
    const params = {
        start: i,
        limit: 100
    };

    const queryString = formatQueryParams(params);
    const url = pricesURL + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => findID(responseJson, cryptocurrency, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    }  
}

function findID(responseJson, cryptocurrency, maxResults){
    for (let i = 0; i < responseJson.data.length; i++){
        if(responseJson.data[i].symbol === cryptocurrency){
            
            var cryptoName = responseJson.data[i].name;
            var coinID = responseJson.data[i].id;
            var price = responseJson.data[i].price_usd; 
        }
    }
    matchFound = true;
    if(price !== undefined & coinID !== undefined){
        generateCoinResults(price, cryptoName);
        getConversion(price);
        getMarketsAndQuotes(coinID, maxResults);
    }
}
function getMarketsAndQuotes(coinID, maxResults){
    const marketsForCoinURL = 'https://api.coinlore.net/api/coin/markets/?';

    const params = {
        id: coinID
    };
    const queryString = formatQueryParams(params);
    const url = marketsForCoinURL + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => generateMarketsAndQuotes(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}
function getConversion(price){
    const conversionURL = 'https://v6.exchangerate-api.com/v6/2f9264dd65a33847aae15e7d/latest/USD';

    fetch(conversionURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => generateConversionResults(responseJson, price))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}
function formatQueryParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}
//---------------------------
function handleSearch(){
    $('#search-results').show
    $('form').submit(event => {
        event.preventDefault();

        matchFound = false;

        const cryptocurrency = $('#js-symbol').val().toUpperCase();
        const maxResults = $('#js-max-results').val();

        getCoin(cryptocurrency, maxResults);
    });
}
function handleApp() {
    handleSearch();
}

$(handleApp);