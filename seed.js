'use strict';

var MongoClient = require('mongodb').MongoClient,
    dbMethods = require('./controllers/server.NutritionDB');
	// assert = require('assert');
var url = 'mongodb://localhost:27017/forageDB';


var food = {
    ndbno: 12345,
	name : 'foodnumber1',
	manu: "Manufacturing",
    desc : 'Description',
    nutrients: [1,2,3,4]
};

module.exports = function(MongoClient, url ) {

	function Food(ndbno, name, manu, desc, nutr){
        // function splits name and upc
        this.ndbno = ndbno
        this.name = name
		this.manu = manu
        this.desc = desc
        this.nutrients = nutr
	}	

	// Connect to DB
	MongoClient.connect(url, function(err, db){
        if(err) {
            console.log(err)
        }
		// assert.equal(err, null); // checks for errors
		var foodObjArray = []; // initialize user arrays

		// create 10 users
		for(var i = 0; i < 10; i++){
            // cycle through 10 different user with unique name, industry, and positions
            var ndbno = i;
			var name = 'foodname' + i;
			var manu = 'manufacture ' + i;
            var desc = 'desc' + i;
            var nutr = [i, 2*i, 3*i, 4*i]
			var objFood = new Food(ndbno, name, manu, desc, nutr);
			foodObjArray.push(objFood);
		};
		console.log("before adding:", foodObjArray);
        //add to database
        dbMethods.insertDocuments(db, function(result) {
            console.log("New foods have been added to database: " + result)
        })
        db.close();
		// dbMethods.createManyUser(db, userObjArray, function() {
		// 	console.log("Users creation is complete");
		// 	db.close();
		// });
	})
}



	