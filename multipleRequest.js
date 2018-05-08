var http = require('https');

// function fetchAllPromise (method, urls) {
//     var responses = [], result = [];
//     var done = 0;

//     return new Promise(function(resolve, reject) {

//     })
// }

module.exports = function(urls, callback) {
    var responses = [], result = [];
    var done = 0;

    // return new Promise(function(resolve, reject) {

    
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
                        console.log("result", result)
                        for(i in result) {
                            var obj = JSON.parse(result[i])
                            if(obj.error) {
                               
                                // reject(new Error(obj.error.message))
                                // return obj.error;
                            }

                            responses.push(obj.foods[0].food)                            
                        }
                        console.log(responses)
                        // resolve(responses)
                    }
                })
            })})(i)
        }
    // })

}