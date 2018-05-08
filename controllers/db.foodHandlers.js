'use strict';

var dbControllers = {};
// INSERTING A DOCUMENT
// dbControllers.insertDocuments = function(db, callback){
// 	// get stuff from db
// 	var collection = db.collection('Food');
// 	// insert some things into stuff
// 	collection.insertMany([
// 		{a : 1},{a : 2},{a : 3}
// 	], function(err, results) {
// 		console.log('results:', results)
// 		assert.equal(err, null); //same as if(err !== null) then throw err
// 		assert.equal(3, results.result.n);
// 		assert.equal(3, results.ops.length);
// 		console.log("Inserted 3 things into stuff");
// 		callback(results);
// 	})
// }
dbControllers.foodClass = function(name, ndbno, upc) {
    var self = this;
    self.name = name;
    self.ndbno = ndbno;
    self.upc = upc.replace(" ","");
    self.desc =  "";
    self.nutrients = [];
}

// CREATE ONE USER DOCUMENT
dbControllers.addOneFood = function(db, FoodObj, callback){
	// get stuff from db
	var collection = db.collection('Food');
	// insert some things into stuff
	collection.insertOne(FoodObj, function(err, results) {
        console.log("Successfully added new food item to FoodCollections")
		callback(results);
	})
}

// CREATE MULTIPLE USER DOCUMENTS
dbControllers.addManyFood = function(db, FoodObjArray, callback){
	// get stuff from db
	var collection = db.collection('Food');
	// insert some things into stuff
	collection.insertMany(FoodObjArray, function(err, results) {

		callback(results);
	})
}

// UPDATING A DOCUMENT

dbControllers.updateFood = function(db, prevNutrObj, newNutrObj , callback){
	// get stuff from db
	var collection = db.collection('Food');
	// update stuff with more stuff
	collection.update(prevNutrObj,
		{$set: newNutrObj}, function(err, result){
			// assert.equal(err, null);
			// assert.equal(1,result.result.n);
			// console.log("Updated document with the field a = 2");
			callback(result);
		})
}

// DELETE a DOCUMENT

dbControllers.deleteFood = function(db, nutrObj, callback){
	// go to collection called 'stuff'
	var collection = db.collection('Food');
	// delete things inside stuff
	collection.deleteOne(nutrObj, function(err, result) {
		// assert.equal(err, null);
		// assert.equal(1, result.result.n);
		// console.log("Removed the document with the field a = 3");
		callback(result);
	});
}

// FIND A DOCUMENT
dbControllers.findFood = function(db, filterObj, callback){
	// go to stuff document
	var collection = db.collection('Food');
	// find things inside stuff
	collection.find({'ndbno': filterObj.ndbno}).toArray(function(err, documents){
        if(err) {
            console.log(err)
        }
		// assert.equal(err, null);
		// assert.equal(2, documents.length);
		console.log("Found the following stuff");
		callback(documents);
	})
}

// ASYNC FIND A DOCUMENT METHOD
dbControllers.findFoodPromise = function(db, filterObj) {
	var collection = db.collection('Food');

	return new Promise(function(resolve, reject) {
		var collection = db.collection('Food');

		collection.find({'ndbno' : filterObj.ndbno}).toArray( function( err, documents) {

			if(err) {
				reject(new Error(err))
			} 
			if(!documents[0]) {
				resolve(filterObj);
			} else {
				resolve(documents[0])
			}
		})
	})
}


module.exports = dbControllers;