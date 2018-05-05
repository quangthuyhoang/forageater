'use strict';

var dbControllers = {};
// INSERTING A DOCUMENT
dbControllers.insertDocuments = function(db, callback){
	// get stuff from db
	var collection = db.collection('stuff');
	// insert some things into stuff
	collection.insertMany([
		{a : 1},{a : 2},{a : 3}
	], function(err, results) {
		console.log('results:', results)
		assert.equal(err, null); //same as if(err !== null) then throw err
		assert.equal(3, results.result.n);
		assert.equal(3, results.ops.length);
		console.log("Inserted 3 things into stuff");
		callback(results);
	})
}

// CREATE ONE USER DOCUMENT
dbControllers.createOneUser = function(db, userObj, callback){
	// get stuff from db
	var collection = db.collection('Users');
	// insert some things into stuff
	collection.insertOne(userObj, function(err, results) {
		console.log('results:', results.ops)
		assert.equal(err, null); //same as if(err !== null) then throw err
		assert.equal(1, results.result.n);
		assert.equal(1, results.ops.length);
		callback(results);
	})
}

// CREATE MULTIPLE USER DOCUMENTS
dbControllers.createManyUser = function(db, userObjArray, callback){
	// get stuff from db
	var collection = db.collection('Users');
	// insert some things into stuff
	collection.insertMany(userObjArray, function(err, results) {
		console.log('results:', results.ops);
		// assert.equal(err, null);
		// assert.equal(userObjArray.length(), result.ops.length());
		callback(results);
	})
}

// UPDATING A DOCUMENT

dbControllers.updateDocuments = function(db, callback){
	// get stuff from db
	var collection = db.collection('stuff');
	// update stuff with more stuff
	collection.update({ a : 2 },
		{$set: {b: 1}}, function(err, result){
			assert.equal(err, null);
			assert.equal(1,result.result.n);
			console.log("Updated document with the field a = 2");
			callback(result);
		});
}

// DELETE a DOCUMENT

dbControllers.deleteDocuments = function(db, callback){
	// go to collection called 'stuff'
	var collection = db.collection('stuff');
	// delete things inside stuff
	collection.deleteOne({ a : 3}, function(err, result) {
		assert.equal(err, null);
		assert.equal(1, result.result.n);
		console.log("Removed the document with the field a = 3");
		callback(result);
	});
}

// FIND A DOCUMENT
dbControllers.findDocuments = function(db, assert, callback){
	// go to stuff document
	var collection = db.collection('stuff');
	// find things inside stuff
	collection.find({}).toArray(function(err, documents){
		assert.equal(err, null);
		// assert.equal(2, documents.length);
		console.log("Found the following stuff");
		callback(documents);
	})
}

module.exports = dbControllers;