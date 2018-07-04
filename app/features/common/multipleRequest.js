'use strict';
var http = require('https');
const debug = require('debug')('multipleRequest');

// Fetch an array of api url request and returns an array of responses
module.exports = function multipleRequests(urls, callback) {
    var responses = [], result = [];
    var done = 0;
        for(let i in urls) {
            (function loop(i) {http.get(urls[i], (res) => {
                var buf = [];
                res.setEncoding('utf8');
                res.on('error', (error) => { console.log("was there an error?"); console.log(error)})
                res.on('data', (data) => {
                    buf.push(data.toString())
                })
                res.on("end", ()=> {
                    // after each stream is complete add entire string into array by order of request
                    if(buf.join("") && typeof buf.join("") === 'string' ) {
           
                        result[i] = buf.join("");
                        done++
                    }
                    // check if each request has been completed
                    if(result.length === urls.length && done === urls.length) {
                      
                        for(i in result) {
          
                            var obj = JSON.parse(result[i])

                            if(obj.error) {
                                debug("Error", obj.error)
                                // reject(new Error(obj.error.message))
                                // return obj.error;
                            } 
                            responses.push(obj.foods[0].food)  
                        }
                        callback(responses)

                    }
        
                })
            }
        )})(i)
            
        }
}