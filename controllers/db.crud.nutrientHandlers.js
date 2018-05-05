'use strict';

var dbControllers = {};
// INSERTING A DOCUMENT
// dbControllers.insertDocuments = function(db, callback){
// 	// get stuff from db
// 	var collection = db.collection('Nutrients');
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

// CREATE ONE USER DOCUMENT
dbControllers.addOneNutrient = function(db, nutrientObj, callback){
	// get stuff from db
	var collection = db.collection('Nutrients');
	// insert some things into stuff
	collection.insertOne(nutrientObj, function(err, results) {
		callback(results);
	})
}

// CREATE MULTIPLE USER DOCUMENTS
dbControllers.addManyNutrients = function(db, nutrientObjArray, callback){
	// get stuff from db
	var collection = db.collection('Nutrients');
	// insert some things into stuff
	collection.insertMany(nutrientObjArray, function(err, results) {
		callback(results);
	})
}

// UPDATING A DOCUMENT

dbControllers.updateNutrients = function(db, prevNutrObj, newNutrObj , callback){
	// get stuff from db
	var collection = db.collection('Nutrients');
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

dbControllers.deleteNutrients = function(db, nutrObj, callback){
	// go to collection called 'stuff'
	var collection = db.collection('Nutrients');
	// delete things inside stuff
	collection.deleteOne(nutrObj, function(err, result) {
		// assert.equal(err, null);
		// assert.equal(1, result.result.n);
		// console.log("Removed the document with the field a = 3");
		callback(result);
	});
}

// FIND A DOCUMENT
dbControllers.findNutrients = function(db, filterObj, callback){
	// go to stuff document
	var collection = db.collection('Nutrients');
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

module.exports = dbControllers;