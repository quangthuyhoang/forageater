'use strict';
var express     = require('express'),
    bodyparser  = require('body-parser'),
    http = require('./controllers/server.httpRequest'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    mongoUtil = require('./app/utilities/mongoUtil'),
    fetchAll = require('./multipleRequest'),
    seed2 = require('./seed2'),
    dbNutrientMethods = require('./controllers/db.crud.nutrientHandlers'),
    dbFoodHandler = require('./controllers/db.foodHandlers'),
    request = require('request'),
    apiRoutes = require('./app/routes/api');

var app = express();

require('dotenv').load();

app.set("view engine", 'ejs');
app.use('/views', express.static(process.cwd() + '/views'));
// app.use('/public', express.static(__dirname + '/public'));
// app.use
app.use(bodyparser.urlencoded({extended:true}));

const option = {
    ndbAPIkey: process.env.ndbAPIkey
}

// const dbURL = 'mongodb://localhost:27017/mongo_prac';//process.env.localDB;
var dbURL = 'mongodb://localhost:27017';
const dbName = 'forageat';

// Connect to DB
mongoUtil.connectToServer(dbURL,dbName, function(err) {
    var client = mongoUtil.getDB();
    // apiRoutes(app, db);
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
                const db = client.db(dbName);
                logDataSearch(db, responseList)

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
                res.redirect('/main/isedible/' + responseList[0].ndbno+ '/nutrition')

            }
        })

})
})

// ROUTING
app.get('/', (req, res)=> {
    res.send('landing page')
});

app.get('/main', (req, res)=> {
    res.send("Main Page")
});

app.get('/main/isedible', (req, res) => {
    res.sendFile(path.join(__dirname+ '/views/recipeinput.html'))
    // res.sendFile(process.cwd() + '/views/recipeinput.html')
    // path.join(__dirname
})

app.get('/main/isedible/:id/nutrition', (req, res) => {
    // check if nbdno already exist in localDB
    option.type = "";
    var ndbObj = {
        ndbno: req.params.id,
        option: option
    }
    // MongoClient.connect(url, (err, client) => {
    //     var db = client.db(dbName);

    //     dbNutrientMethods.findNutrients(db, ndbObj, function(result) {
    //         console.log("results 2nd:", result)
    //         client.close();
    //     })
    // })

    // dbNutrientMethods.findNutrients()
    // else call API
   
    var url = http.getAPIrequest(req.params.id, option)
 
    request.get({url: url}, (err, response, body) => {
        console.log("waiting on request... and", response.headers['x-ratelimit-remaining'] + '/' + response.headers['x-ratelimit-limit'])
        if(!err && response.statusCode === 200 && body) {
            // console.log("nutrient api has responded")
             // organize nutrient
             var result = JSON.parse(response.body)
            //  console.log("result get",result)
             var product = result.foods[0].food
             var d = {
                 label: product.desc,
                 ing: product.ing,
                 nutrients: product.nutrients
             }
            // check and save any unknown nutrients
            //  console.log("nutrients", product.nutrients)
             // send nutrient data and redirect to get request
            //  console.log(d)
             res.render('show', {food: d})
            //  res.end(JSON.stringify({label: label, ing: ingredients, nutrients: nutrients}))
        }
    })

})

app.get('/api/search/:query', (req, res) => {
    console.log("req" ,req.query, req.params, req.body)
    var foodGroup = req.params.query;

    // const url = http.requestNDB(foodGroup);
    option.type = 'query';
    option.max = 15;
   
    request.get({url: http.getAPIrequest(foodGroup, option)}, function(err, response, body) {
        if(err) {
            console.log(err)
        }
        if(response.statusCode === 200 && body.errors) {
            res.json({errors: body.errors.error})
        }
        if(!err && response.statusCode === 200) {
            var data = JSON.parse(body)

            // var ndbList = data.list.item.map((brand) => {
            //     // separate name from UPC code
            //     var name = brand.name.split(", UPC:")[0]
            //     var upc = brand.name.split(", UPC:")[1]
            //     return { name: name, ndbno: brand.ndbno, upc: upc }
            // })
            res.json(data)          
        }
    }) 
 
})

// app.post('/main/isedible/nutrition', (req, res) => {
//     if(!req.body['item-1']) {
//         res.redirect('/main/isedible')
//     }
//     var foodGroup = req.body;
//     // lookup NDB number
//     const option = {
//         ndbAPIkey: process.env.ndbAPIkey,
//         type: 'query'
//     }
    
//     const url = http.getAPIrequest(foodGroup['item-1'], option);
//     console.log("url post", url)
//     var results = [];
    
   
//         request.get({url: url}, function(err, response, body) {
//             if(err) {
//                 console.log(err)
//             }
//             if(response.statusCode !== 200) {
//                 // console.log(body, response)
//                 console.log("Response Error:", res.statusCode)
//             }
//             if(response.statusCode === 200 && response.body) {
//                 console.log("status code 200", response.body)
//                 var data = JSON.parse(response.body)
//                 var responseList = data.list.item, ndbList = [];
//                 var fd = responseList[0]
//                 // MongoClient.connect(dbURL, function(err, client){
//                 //     console.log("Connected correctly with server.")
//                 //     const db = client.db(dbName)
//                 //     dbFoodHandler.findFood(db, fd, function(result) {
//                 //         console.log("result:", result)
//                 //         if(!result) {
//                 //             dbFoodHandler.addOneFood(db, fd, function() {
//                 //                 console.log("Success")
//                 //                 client.close()
//                 //             })
//                 //         }
//                 //         client.close()
//                 //     })
//                 // })
//                 // loop through array create food Obj
//                 for(let j = 0; j < responseList.length; j++) {
//                     // console.log("responseList", responseList[j])
//                     var name = responseList[j].name.split(", UPC:")[0]
//                     var upc = responseList[j].name.split(", UPC:")[1]
//                     var fd = new dbFoodHandler.foodClass(name, responseList[j].ndbno, upc)
//                     // find and add to DB if does not exist
//                     MongoClient.connect(dbURL, function(err, client){
//                         console.log("Connected correctly with server.", j)
//                         const db = client.db(dbName)
//                         dbFoodHandler.findFood(db, fd, function(result) {
//                             console.log("result:", result)
//                             if(result.length < 1) {
//                                 dbFoodHandler.addOneFood(db, fd, function() {
//                                     console.log("Success")
//                                     client.close()
//                                 })
//                             }
//                             client.close()
//                         })
//                     })
//                     console.log("after mongoclient")
//                     ndbList.push(fd);
//                 }
//                 // var ndbList = data.list.item.map((brand) => {
//                 //     // separate name from UPC code
//                 //     var name = brand.name.split(", UPC:")[0]
//                 //     var upc = brand.name.split(", UPC:")[1]
//                 //     return { name: name, ndbno: brand.ndbno, upc: upc }
//                 // })
                

//                 // if not in system add to system

                
//                 // console.log("redirect...now", ndbList)
//                 // var urls = [];
//                 // option.type = "";
              
//                 // fetchAll(urls, se)
//                 // console.log("food array", foodArr)
//                 // seed(MongoClient, dbURL, ndbList)
//                 res.redirect('/main/isedible/' + ndbList[0].ndbno+ '/nutrition')

//             }
//         })

// })


var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Now running on port:", port)
});

async function logDataSearch(db, arr) {
    let promises = [];
    for (let i = 0; i < arr.length; i++) {
        promises[i] = dbFoodHandler.findFoodPromise(db, arr[i])
    }
    
    return Promise.all(promises)
    .then(http.getManyNutrientURL(arr, option))
    .then(function(urls) {
        console.log(urls)
    })
    // .then(fetchAll)
    // .then(async function(data) {
    //     console.log("here's the data to save to db", data)
    // })
    .catch(function(err) {
        console.log(err)
    })
}