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

    // console.log("inside fetchall", urls)
        for(i in urls) {
            (function(i) {http.get(urls[i], (res) => {
                var buf = [];
                res.setEncoding('utf8');
                res.on('error', (error) => { console.log("was there an error?"); console.log(error)})
                res.on('data', (data) => {
                    buf.push(data.toString())
                })
                res.on("end", ()=> {
                    if(buf.join("") && typeof buf.join("") === 'string' ) {
           
                        result[i] = buf.join("");
                        done++
                        console.log(done, "result")
                    }
                    
                    
                    
                    if(result.length === urls.length && done === urls.length) {
                        console.log("trigger added should be only once")
                        for(i in result) {
                            // console.log("result", result)
                            // if(result[i] === 'string') {

                                var obj = JSON.parse(result[i])

                                if(obj.error) {
                                   console.log("Error", obj.error)
                                    // reject(new Error(obj.error.message))
                                    // return obj.error;
                                } 

                                responses.push(obj.foods[0].food)  
                        
                        }

                        console.log("length", responses)

                    }
        
                })
            }
        )})(i)
            
        }
    // })
        
}