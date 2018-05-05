var MongoClient = require('mongodb'),MongoClient;

var _dir;

module.exports = {
    connectToServer: function(url, dbName, callback) {
        MongoClient.connect(url, function(err, client) {
            _db = client.db(dbName);
            return callback( err );
        })
    },

    getDB: function() {
        return _db;
    }
}