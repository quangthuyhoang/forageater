'use strict';
var express     = require('express'),
    bodyparser  = require('body-parser'),
    http = require('./controllers/server.httpRequest'),
    request = require('request');

var app = express();
require('dotenv').load();

app.set("view engine", 'ejs');
app.use('/views', express.static(process.cwd() + '/views'));
app.use(bodyparser.urlencoded({extended:true}));
const option = {
    ndbAPIkey: process.env.ndbAPIkey
}
// ROUTING
app.get('/', (req, res)=> {
    res.send('landing page')
});

app.get('/main', (req, res)=> {
    res.send("Main Page")
});

app.get('/main/isedible', (req, res) => {
    res.sendFile(process.cwd() + '/views/recipeinput.html')
})

app.get('/main/isedible/:id/nutrition', (req, res) => {
    console.log(req.params.id)
    var url = http.getAPIrequest(http.getNutrientURL(req.params.id), option)
    console.log("url",url)
    request.get({url: url}, (err, response, body) => {
        console.log("waiting on request... and", response.headers['x-ratelimit-remaining'] + '/' + response.headers['x-ratelimit-limit'])
        if(!err && response.statusCode === 200 && body) {
            console.log("nutrient api has responded")
             // organize nutrient
             var result = JSON.parse(response.body)
             var product = result.foods[0].food
             var d = {
                 label: product.desc,
                 ing: product.ing,
                 nutrients: product.nutrients
             }
            

             // send nutrient data and redirect to get request
             console.log(d)
             res.render('show', {food: d})
            //  res.end(JSON.stringify({label: label, ing: ingredients, nutrients: nutrients}))
        }
    })

})

app.get('/main/isedible/nutrition', (req, res) => {
    console.log("req" ,req.query, req.params, req.body)
    var foodGroup = req.query;
    const url = http.requestNDB(foodGroup['item-1'], option);
    request.get({url: url}, function(err, response, body) {
        if(!err && response.statusCode === 200) {
            
            var data = JSON.parse(body)
            var ndbList = data.list.item.map((brand) => {
                // separate name from UPC code
                var name = brand.name.split(", UPC:")[0]
                var upc = brand.name.split(", UPC:")[1]
                return { name: name, ndbno: brand.ndbno, upc: upc }
            })
            
             // use NDB number to look up nutrition
             var nutrientURL = 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbList[0].ndbno + '&type=f&format=json&api_key=' + process.env.ndbAPIkey
             request.get({url: nutrientURL}, function(err, response, body) {
                 if(err) {
                     console.log(err)
                 }
                 if(response.statusCode === 200 && body) {
                     console.log("Nutrient Report API has responded:", response.statusCode);

                     // organize nutrient
                     var result = JSON.parse(response.body)
                     var product = result.foods[0].food
                     var label = product.desc;
                     var ingredients = product.ing;
                     var nutrients = product.nutrients;

                     // send nutrient data and redirect to get request
                     res.render('show', {product: product})
                    //  res.end(JSON.stringify({label: label, ing: ingredients, nutrients: nutrients}))
                 }
             })
            
        }
    }) 
    
    // res.send("nutrition page")
})

app.post('/main/isedible/nutrition', (req, res) => {
    if(!req.body['item-1']) {
        res.redirect('/main/isedible')
    }
    var foodGroup = req.body;
    // lookup NDB number
    const option = {
        ndbAPIkey: process.env.ndbAPIkey
    }
    
    const url = http.requestNDB(foodGroup['item-1'], option);
    
    var results = [];
    
   
        request.get({url: url}, function(err, response, body) {
            if(err) {
                console.log(err)
            }
            if(response.statusCode !== 200) {
                console.log("Response Error:", res.statusCode)
            }
            if(response.statusCode === 200 && response.body) {
                console.log("status code 200")
                var data = JSON.parse(response.body)
                var ndbList = data.list.item.map((brand) => {
                    // separate name from UPC code
                    var name = brand.name.split(", UPC:")[0]
                    var upc = brand.name.split(", UPC:")[1]
                    return { name: name, ndbno: brand.ndbno, upc: upc }
                })
                console.log("redirect...now")
                res.redirect('/main/isedible/' + ndbList[0].ndbno+ '/nutrition')

                // use NDB number to look up nutrition
                // var nutrientURL = 'https://api.nal.usda.gov/ndb/V2/reports?ndbno=' + ndbList[0].ndbno + '&type=f&format=json&api_key=' + process.env.ndbAPIkey
                // request.get({url: nutrientURL}, function(err, response, body) {
                //     if(err) {
                //         console.log(err)
                //     }
                //     if(response.statusCode === 200 && body) {
                //         console.log("Nutrient Report API has responded:", response.statusCode);

                //         // organize nutrient
                //         var result = JSON.parse(response.body)
                //         var product = result.foods[0].food
                //         var label = product.desc;
                //         var ingredients = product.ing;
                //         var nutrients = product.nutrients;

                //         // send nutrient data and redirect to get request
                //         res.end(JSON.stringify({label: label, ing: ingredients, nutrients: nutrients}))
                //     }
                // })
            }
           
            // res.end(JSON.stringify({ndbList}))
        });

  
    
    // reqst.end()
    // console.log(obj)
    // var result;
    // var obj = r.get(url, (res) => {
    //     var buf = [];
    //     res.setEncoding("utf8");
    //     res.on('error', (error)=> {console.log(error)})
    //     res.on('data', (data) => {
    //         buf.push(data.toString())
    //     })

    //     res.on("end", ()=> {
    //         if(buf.join("")) {
    //             result = buf.join("");
    //         }
            
    //         console.log("result",result)
    //     })
    // })
    
    
    

    

    
    
    var NDBquery = 'https://api.nal.usda.gov/ndb/search/?format=json&q='

// https://api.nal.usda.gov/ndb/search/?format=json&q=spring%20roll&sort=n&max=25&offset=0&api_key=DEMO_KEY
    
})

var port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log("Server connected to port", port)
})