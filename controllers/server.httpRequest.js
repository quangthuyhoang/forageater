
request = require('request');
// food, sort, max, offset, apikey

var x = {
    "sort": "n",
    "max" : 12,
    "offset" : 3
}
function ndbOption(key, sort, max, offset) {
    var self = this;
    self.ndbAPIkey = key || 'DEMO_KEY';
    self.sort = sort || 'n';
    self.max = max || 10;
    self.offset = offset || 0;
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

    httpRequest: function(url) {
        return fetch(url)
        .then(function(result) {
            return result.json();
        })
    },
    
}

