
'use strict';

var matchFound = false;

//---------------------------
//generate functions
function generateStart() {
    $('#start').append(`
        <h2>Discover</h2>
        <ul>
        <li><h3>The price of your favorite cryptocurrency in the world's eight major currencies.</h3></li>
        <li><h3>Which markets are trading that specified cryptocurrency.</h3></li>
        <li><h3>What currencies are acceptable payment options at each market. (Quote Currencies)</h3></li>
        </ul>
        <h2>Simply search for your favorite cryptocurrency's ticker symbol!</h2>
        `)
}
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
function generateMarketsAndQuotes(responseJson){
    $('#markets-quotes-results').empty();
    $('#markets-quotes-results').append(`
        <section>
            <h2>Markets Selling This Coin and Their Quote Currencies</h2>`);
                for(let i = 0; i < responseJson.length & i < 10; i++){
                    $('#markets-quotes-results').append(
                `<li><h3>${responseJson[i].name}: ${responseJson[i].quote}</h3></li>`);
    }
}
//---------------------------

function getCoin(cryptocurrency){
    const pricesURL =  'https://api.coinlore.net/api/tickers/?'
    //i < 5000
    for (let i = 0; i < 200 & matchFound === false; i += 100){
        
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
        .then(responseJson => findID(responseJson, cryptocurrency))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    }  
}
//takes the responseJson and sends corresponding data to the relevant function
function findID(responseJson, cryptocurrency){
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
        getMarketsAndQuotes(coinID);
    }
}
function getMarketsAndQuotes(coinID){
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
        .then(responseJson => generateMarketsAndQuotes(responseJson))
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
function checkForm(string) {
        var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        var hasNumber = /\d/;

        if( string.match(format) ){
            return true;
        }
        else if(hasNumber.test(string) === true){
          return true;
        }
        else{
          return false;
        }  
}
function handleSearch(){
    $('#search-results').show
    $('form').submit(event => {
        event.preventDefault();
        $('#start').empty();
        $("#js-form-error").empty();
        $("#js-error-message").empty();

        matchFound = false;

        const cryptocurrency = $('#cryptocurrency').val().toUpperCase();
        
        var results = checkForm(cryptocurrency);
        
        if(results === true) {
            $("#js-form-error").text('Invalid Search. Do not enter numbers or special characters');
        } else{
            getCoin(cryptocurrency);
        }
    });
}
function handleApp() {
    handleSearch();
    generateStart();
}

$(handleApp);