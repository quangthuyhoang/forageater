
request = require('request');
// food, sort, max, offset, apikey

var x = {
    "sort": "n",
    "max" : 12,
    "offset" : 3
}
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

    var opt = new ndbOption();
    if(option) {
        opt = new ndbOption(option.ndbAPIkey, option.sort, option.max, option.offset)
    }

    return 'https://api.nal.usda.gov/ndb/search/?format=json&q=' + food;
}

function getNutrientURL(ndbno) {
    var opt = new ndbOption();
    return 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbno + '&type=f&format=json&api_key=' + opt.ndbAPIkey;
}

var option = {
    type: 'query'  //'query' || 'ndb'
}

function getAPIrequest(url, option = {type: ''}) {
    var opt = new ndbOption()
    if(option.type = 'query') {
        opt = new ndbOption(option.ndbAPIkey, option.sort, option.max, option.offset)
        return url + '&sort=' + opt.sort + '&max=' + opt.max + '&offset=' + opt.offset +'&api_key=' + opt.ndbAPIkey;
    }
    op
    return 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbno + '&type=f&format=json&api_key=' + opt.ndbAPIkey;
}

function apiParser(error, response, body) {
    if(error) {
        throw Error('apiParser: response Error')
    }
    if(response.statusCode === 200 && body) {
        var result = JSON.parse(response.body);
    }
}

module.exports = {
    requestNDB: function(query, option) {
        // check if string or convert to string
        console.log("query", query, "option", option)
        if(!query) {
            throw Error('Search term was false: server.httpRequest.js')
        }
        var food = query.split(' ').join('%20').toLowerCase();
        if(typeof food !== 'string') {
            food.tostring();
        }
    
        var opt = new ndbOption();
        if(option) {
            opt = new ndbOption(option.ndbAPIkey, option.sort, option.max, option.offset)
        }
    
        return 'https://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=' + opt.sort + '&max=' + opt.max + '&offset=' + opt.offset +'&api_key=' + opt.ndbAPIkey;
    },

    // var nutrientURL = 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbList[0].ndbno + '&type=f&format=json&api_key=' + process.env.ndbAPIkey
 
    getNutrientURL: function(ndbno) {
        var opt = new ndbOption();
        return 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbno + '&type=f&format=json&api_key=' + opt.ndbAPIkey;
    },

    getAPIrequest: getAPIrequest,

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
    }
    
}

