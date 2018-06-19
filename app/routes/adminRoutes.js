'use strict'
const express = require('express');
const adminRouter = express.Router();
const mongoClient = require('mongodb').MongoClient;
// const { connectToServer }
const debug = require('debug')('server:adminRouter');

function router(app) {
  adminRouter.route('/')
    .get((req, res) => {
      (async function mongo() {
        const url = 'mongodb://localhost:27017/forageat';
        const dbName = 'forageat';
        let client;
        try {
          client = await mongoClient.connect(url);
          const  db = client.db(dbName);
          const result = await db.collection('stuff').find()
          .toArray();
          debug(result);
          res.json(result)
        } catch(err) {
          console.log(err.stack);
        }
        if (client) {
          client.close();
        }
      }())
    })
    return adminRouter;
}

module.exports = router;