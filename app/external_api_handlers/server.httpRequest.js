
request = require('request');
var searchOption = require('./options/option');
const debug = require('debug')('server.httpRequest');
// food, sort, max, offset, apikey

// *** API  ***

// Request handler
function ndbOption(key, sort, max, offset, format) {
    var self = this;
    self.ndbAPIkey = key || 'DEMO_KEY';
    self.sort = sort || 'n';
    self.max = max || 10;
    self.offset = offset || 0;
    self.f = format || 'f';
}

function getNDBUrl(query) {
    // check if string or convert to string
    if(!query) {
        throw Error('Search term was false: server.httpRequest.js')
    }
    var food = query.split(' ').join('%20').toLowerCase();
    if(typeof food !== 'string') {
        food.tostring();
    }
    
    return 'https://api.nal.usda.gov/ndb/search/?format=json&q=' + food;
}

function getNutrientURL(ndbno) {
    return 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbno;
}

function getManyNutrientURL(arr, option) {
    var urls = [];
    
    for(let i = 0; i < arr.length; i++) {
        if(!arr[i]._id) {
            urls.push(getAPIrequest(arr[i].data.ndbno, option))
        }
    }
    return urls;
}

var option = {
    type: 'query'  //'query' || 'ndb'
}
// https://api.nal.usda.gov/ndb/search/?format=json&q=chicken raw&sort=n&max=100&ds=Standard Reference&offset=0&api_key=amDzDlse9UvPbte7K2uMdlALSD0JKXByOPuhp5eO

function searchAPIrequest(query, option) {
    var opt = new searchOption(option)
    return getNDBUrl(query) + opt.getParameters() //returns API request URL
}

function getAPIrequest(query, option = {type: ''}) {

    var opt = new ndbOption(option.ndbAPIkey, option.sort, option.max, option.offset)

    if(option.type === 'query') {
        var base = getNDBUrl(query)
      
        return base + '&sort=' + opt.sort + '&max=' + opt.max + '&offset=' + opt.offset +'&api_key=' + opt.ndbAPIkey;
    }

    var url = getNutrientURL(query)
   
    return  url + '&type=f&format=json&api_key=' + opt.ndbAPIkey;
}

// RESPONSE HANDLER

function checkAPILimit(response) {
    const remain = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    return {count: remain, limit: limit}
}

function apiParser(error, response, body) {
    if(error) {
        throw Error('apiParser: response Error')
    }
    if(reponse.statusCode === 429) {
        var rate = checkAPILimit(response)
        return {error: response.statusCode, errorMessage: rate.remain + ' remaining out of ' + rate.limit}
    }
    if(response.statusCode !== 200) {
        return {error: response.statusCode, errorMessage: response.errorMessage}
    }

    if(response.statusCode === 200 && body.errors) {
        return {error: body.errors, errorMessage: 'There has been one or more returned API errors'}
    }
    if(response.statusCode === 200 && body) {
        var result = JSON.parse(response.body);
    }
}


// ERROR HANDLER
// need to add
// function errorHandler(response) {
//     if(response.error)
// }

module.exports = {
    requestNDB: getNDBUrl,
 
    getNutrientURL: getNutrientURL,

    getManyNutrientURL: getManyNutrientURL,

    getAPIrequest: getAPIrequest,

    searchAPIrequest: searchAPIrequest,

    requestNutr: function(url, request) {
        return request.get({url: url}, (err, response, body) => {
            if(err) {
                console.log(err)
            }
            if(response.statusCode === 200 && body) {
                console.log("Nutrient Report API has responded:", response.statusCode);
                // organize nutrient
                var result = JSON.parse(response.body)
                var product = result.foods[0].food
                var food = {label : product.desc, ing: product.ing, nutrients: product.nutrients};
                res.render('show', {product: food})
            }
        })
    },
    // rate limit check
    checkAPILimit: checkAPILimit,

    // newOption: newOption,
}

