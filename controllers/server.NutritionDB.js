module.exports = {
    create: function(nutritionObj = {}) {
        // add to DB
    },

    read: function(nutritionObj = {}) {
        // looks up ndno and pulls nutrtion info from db
    }
    update: function(nutritionObj = {}) {
        // update exist 
    },
    delete: function () {

    },

    checkDB(req, res, next) {
        // check if ndb number alreay exist in db
        var newObj = new Obj(res.body.response)
        var result = checkNDBno(newObj);
        if(!result) { // if result does not exist in database
            // return callback to query NDB database
            return next();
            
        }
        // else..
        // query database and...
        return // results from personal databas
    }
}

