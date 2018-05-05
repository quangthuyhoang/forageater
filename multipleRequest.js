var http = require('https');

module.exports = function(urls, callback) {
    var responses = [], result = [];
    var done = 0;

    for(i in urls) {
        (function(i) {http.get(urls[i], (res) => {
            var buf = [];
            res.setEncoding('utf8');
            res.on('error', (error) => { console.log(error)})
            res.on('data', (data) => {
 
                buf.push(data.toString())
            })
            res.on("end", ()=> {
                if(buf.join("")) {
        
                    result[i] = buf.join("");
                    
                }
                if(result.length === urls.length) {

                    for(i in result) {
                        var obj = JSON.parse(result[i])
                        responses.push(obj.foods[0].food)
                    }
                    console.log("responses",responses)
                    
                }
            })
        })})(i)
    }
}