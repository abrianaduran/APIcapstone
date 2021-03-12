
'use strict';

const key = "1fe0530e72fd42ee9441e316ed247ec2";
var matchFound = false;

/*var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

const todaysDate = yyyy + '-' + mm + "-" + dd;*/

//---------------------------
//Generate functions
function generateNewsResults(responseJson, maxResults){
    console.log('generateNewsResults');
    //show articles pertaining to searched coin
    console.log(responseJson);
    $('#news-results').empty();
    for (let i = 0; i < responseJson.articles.length & i < maxResults; i++){
        $('#news-results').append(
            `<li><h3><a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a></h3>
            <p>${responseJson.articles[i].description}</p>
            <p>By ${responseJson.articles[i].author}</p>
            </li>`
        )};
    //(add to bottom of results or reload?)
}
function generatePriceResults(price){
    //finished
    console.log('generatePriceResults');
    //current price in USDT
    $('.price-results').empty();

    $('.price-results').append(`<p>The current price is: ${price} USD</p>`)
}
function generateExchangesResults(responseJson){
    //finished
    console.log('generateExchangesResults');
    //applicable exchanges
    $('#exchanges-results').empty();
    $('#exchanges-results').append('Exchanges Trading This Coin');
    //set default is 10
    for(let i = 0; i < responseJson.length & i < 10; i++){
        $('#exchanges-results').append(
        `<li><h3>${responseJson[i].name}</h3></li>`
        );
    }
}
//-------------------
function generateQuoteCurrencies(responseJson){
    //finished
    console.log('generateQuoteResults');
    //Quote Currencies
    $('#quote-currency-results').empty();
    for(let i = 0; i < responseJson.length & i < 10; i++){
        $('#quote-currency-results').append(
            `<li><h3>${responseJson[i].name}: ${responseJson[i].quote}</h3></li>`);
    }
}

//---------------------------
//GET FUNCTIONS   
function getNews(searchTerm, maxResults){
    //finished, but API doesn't like this IP
    console.log('getNews');
    const newsURL = 'https://newsapi.org/v2/everything?'
    
    const params = {
        q: searchTerm,
        apiKey: key
    };
    const queryString = formatQueryParams(params);
    const url = newsURL + queryString;
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => generateNewsResults(responseJson, maxResults))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function getCurrentPrice(cryptocurrency){
    //finished
    console.log('getCurrentPrice');
    //Tickers(all coins) endpoint
    //https://api.coinlore.net/api/tickers/?start=0&limit=100
    
    const pricesURL =  'https://api.coinlore.net/api/tickers/?'
    //i < 5000
    for (let i = 0; i < 200 & matchFound === false; i += 100){
        console.log(matchFound);
        
    const params = {
        start: i,
        limit: 100
    };
    const queryString = formatQueryParams(params);
    const url = pricesURL + queryString;
    console.log(url);

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
        //you can uncomment this? findID(responseJson)
    }

    
}

function findID(responseJson, cryptocurrency){
    //finished, just uncomment function calls
    console.log('findID');
    for (let i = 0; i < responseJson.data.length; i++){
        if(responseJson.data[i].symbol === cryptocurrency){
            
            var cryptoName = responseJson.data[i].name;
            console.log(`'cryptoname is:${cryptoName}`);
            var coinID = responseJson.data[i].id;
            console.log(`coinID is:${coinID}`);
            var price = responseJson.data[i].price_usd;
            console.log(`price is: ${price}`);  
        }
    }
    matchFound = true;
    generatePriceResults(price);
    getNews(cryptoName);
    //getExchanges(coinID);
    if (coinID !== undefined){
        getQuoteCurrencies(coinID);
    }
}
/*function getExchanges(coinID){
    //finished
    console.log('getExchanges');
//Get Markets for Coin (Base) endpoint
//https://api.coinlore.net/api/coin/markets/?id=90
    const marketsURL =  'https://api.coinlore.net/api/coin/markets/?'
    
    const params = {
        id: coinID
    };
    const queryString = formatQueryParams(params);
    const url = marketsURL + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => generateExchangesResults(responseJson) 
        //right now this json contains objects representing each market that trades
        //this coin, but not all the available payment options
            //, marketsArray(responseJson)
            )
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    
    //get exchange id for quote currencies
}*/
function formatQueryParams(params){
    //finished
    console.log('formatQueryParams');
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}
//---------------------------
function getQuoteCurrencies(coinID){
    //https://api.coinlore.net/api/coin/markets/?id=90 

    const marketsForCoinURL = 'https://api.coinlore.net/api/coin/markets/?';

    const params = {
        id: coinID
    };
    const queryString = formatQueryParams(params);
    const url = marketsForCoinURL + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => generateQuoteCurrencies(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//---------------------------
function handleSearch(){
    console.log('handleSearch');
    $('form').submit(event => {
        event.preventDefault();
        const cryptocurrency = $('#js-symbol').val();
        const maxResults = $('#js-max-results').val();
        matchFound = false;
        getCurrentPrice(cryptocurrency);
        
    });
    

}
function handleApp() {
    console.log('handleApp');
    handleSearch();
}

$(handleApp);