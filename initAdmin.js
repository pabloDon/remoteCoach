var mongo = require('mongodb');                     // mongoose for mongodb
var getCrypted = require('./utils/utils.js').getCrypted;

mongo.connect('mongodb://localhost/remoteCoach', function(err, db) {
	var session = db.collection('users');
	session.insert({name: "Admin", email:"admin@admin.com", pass: getCrypted("admin@admin.com"), role:'admin'}, function(err, result) {
        if (err) throw err;
        
        console.log(result);
        db.close();
    });
});