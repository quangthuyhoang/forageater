'use strict';

var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
// var url = 'mongodb://localhost:27017/mongo_prac';

var employee1 = {
	name : 'Mark',
	industry : 'Oil & Gas',
	position : 'Engineer'
};



module.exports = function(MongoClient,dbMethods,url, arr) {

	function User(name, industry, position){
		this.name = name
		this.industry = industry,
		this.position = position
	}	

	// Connect to DB
	MongoClient.connect(url, function(err, client){
		// assert.equal(err, null); // checks for errors
		var userObjArray = []; // initialize user arrays
		var db = client.db('forageat')
		// create 10 users
		for(var i = 0; i < 10; i++){
			// cycle through 10 different user with unique name, industry, and positions
			var name = 'User' + i;
			var industry = 'Industry' + i;
			var position = 'Position' + i;
			var objUser = new User(name, industry, position);
			userObjArray.push(objUser);
		};
		console.log("before adding:", userObjArray);
		//add to database
		dbMethods.createManyUser(db, userObjArray, function() {
			console.log("Users creation is complete");
			client.close();
		});
	})
}

// const createManyUser = function(db, userObjArray, callback){
// 	// get stuff from db
// 	var collection = db.collection('stuff');
// 	// insert some things into stuff
// 	collection.insertMany(userObjArray, function(err, results) {
// 		console.log('results:', results.ops);
// 		assert.equal(err, null);
// 		// assert.equal(userObjArray.length(), result.ops.length());
// 		callback(results);
// 	})
// }


	