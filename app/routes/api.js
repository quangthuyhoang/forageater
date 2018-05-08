request = require('request'),
dbFoodHandler = require("../../controllers/db.foodHandlers"),
http = require('../../controllers/server.httpRequest'),
MongoClient = require('mongodb').MongoClient,
mongoUtil = require('../utilities/mongoUtil')
db = mongoUtil.getDB();

async function logDataSearch(db, arr) {
    let promises = [];
    for (let i = 0; i < arr.length; i++) {
        promises[i] = dbFoodHandler.findFoodPromise(db, arr[i])
    }

    Promise.all(promises)
    .then(function(values) {
        console.log("promise values", values)
    })
    .cathc(function(err) {
        console.log(err)
    })
}
module.exports = function(app, db) {
    app.post('/main/isedible/nutrition', (req, res) => {
        if(!req.body['item-1']) {
            res.redirect('/main/isedible')
        }
        var foodGroup = req.body;
        // lookup NDB number
        const option = {
            ndbAPIkey: process.env.ndbAPIkey,
            type: 'query'
        }
        
        const url = http.getAPIrequest(foodGroup['item-1'], option);
        console.log("url post", url)
        var results = [];
        
       
            request.get({url: url}, function(err, response, body) {
                if(err) {
                    console.log(err)
                }
                if(response.statusCode !== 200) {
                    // console.log(body, response)
                    console.log("Response Error:", res.statusCode)
                }
                if(response.statusCode === 200 && response.body) {
                    console.log("status code 200", response.body)
                    var data = JSON.parse(response.body)
                    var responseList = data.list.item, ndbList = [];
                    var fd = responseList[0]

                
                    for(let j = 0; j < responseList.length; j++) {
                        // console.log("responseList", responseList[j])
                        var name = responseList[j].name.split(", UPC:")[0]
                        var upc = responseList[j].name.split(", UPC:")[1]
                        var fd = new dbFoodHandler.foodClass(name, responseList[j].ndbno, upc)
                        // find and add to DB if does not exist
                        // MongoClient.connect(dbURL, function(err, client){
                            console.log("Connected correctly with server.", j)
                            // const db = client.db(dbName)
                            dbFoodHandler.findFood(db, fd, function(result) {
                                console.log("result:", result)
                                if(result.length < 1) {
                                    dbFoodHandler.addOneFood(db, fd, function() {
                                        console.log("Success")
                                        client.close()
                                    })
                                }
                                // client.close()
                            })
                        // })
                        console.log("after mongoclient")
                        ndbList.push(fd);
                    }
                    // var ndbList = data.list.item.map((brand) => {
                    //     // separate name from UPC code
                    //     var name = brand.name.split(", UPC:")[0]
                    //     var upc = brand.name.split(", UPC:")[1]
                    //     return { name: name, ndbno: brand.ndbno, upc: upc }
                    // })
                    
    
                    // if not in system add to system
    
                    
                    // console.log("redirect...now", ndbList)
                    // var urls = [];
                    // option.type = "";
                  
                    // fetchAll(urls, se)
                    // console.log("food array", foodArr)
                    // seed(MongoClient, dbURL, ndbList)
                    res.redirect('/main/isedible/' + ndbList[0].ndbno+ '/nutrition')
    
                }
            })
    
    })
}