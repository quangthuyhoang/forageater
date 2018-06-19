'use strict';
const MongoClient = require('mongodb').MongoClient;

var _client;

module.exports = {
    connectToServer: function (url, dbName, callback) {
        MongoClient.connect(url, function (err, client) {
            _client = client;
            return callback(err);
        })
    },

    getDB: function () {
        return _client;
    }
}