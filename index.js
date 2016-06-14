	// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongo = require('mongodb');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var getCrypted = require('./utils/utils.js').getCrypted;
    var Watcher = require('rss-watcher');

    // configuration =================
    mongo.connect('mongodb://localhost/remoteCoach', function(err, db) {

        app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
        app.use(morgan('dev'));                                         // log every request to the console
        app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                                     // parse application/json
        app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        app.use(methodOverride());

        app.get('/rest/users', function(req, res) {
            var users = db.collection('users');
            users.find({}, {"sort":"surname"}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result});
            });
        });
        app.get('/rest/idAdmin', function(req, res) {
            var users = db.collection('users');
            users.find({"role": "admin"}, {"sort":"surname"}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result[0]._id});
            });
        });
        app.get('/rest/clubs', function(req, res) {
            var users = db.collection('users');
            users.find({"isClub":true}, {"sort":"surname"}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result});
            });
        });
        app.get('/rest/clients', function(req, res) {
            var users = db.collection('users');
            users.find({"$or":[{"isClub": {"$exists": false}}, {"isClub":false}]}, {"sort":"surname"}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result});
            });
        });
        app.get('/rest/users/:idUser', function(req, res) {
            console.log("ID USER:", req.params.idUser)
            var users = db.collection('users');
            users.find({_id: new mongo.ObjectID(req.params.idUser)}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result[0]});
            });
        });
        app.post('/rest/users/new', function(req, res) {
            var users = db.collection('users');
            //Adding password to user:
            req.body.pass = getCrypted(req.body.email);
            //Adding role to user:
            req.body.role = 'user';
            users.insert(req.body, function(err, result) { 
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });
        app.get('/rest/trainings/:user_id/:month/:year', function(req, res) {
            var trainingDay = db.collection('trainingDay');

            var firstDate = new Date(req.params.year, req.params.month, 1);
            var lastDate = new Date(new Date(firstDate).setMonth(firstDate.getMonth()+1));            
            var query = {
                user_id : req.params.user_id, 
                created_at: {
                    $gte: firstDate.toISOString(),
                    $lt: lastDate.toISOString()
                }
            };            

            trainingDay.find(query, {"sort":"created_at"}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result});
            });
        });
        app.get('/rest/trainingsToday/:user_id', function(req, res) {
            var trainingDay = db.collection('trainingDay');

            var timestamp = new Date();  
            var timestampISO = new Date(timestamp.toISOString()); 
            var today = new Date(timestampISO.getFullYear(), timestampISO.getMonth(), timestampISO.getDate());        
            var query = {
                user_id : req.params.user_id, 
                created_at: today.toISOString()
            };            

            trainingDay.find(query, {}).toArray(function(err, result) {
                if (err) throw err; 
                
                res.json({data : result});
            });
        });

        app.post('/rest/saveTrainingDay', function(req, res) {
            var trainingDay = db.collection('trainingDay');
            trainingDay.insert(req.body, function(err, result) {
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });

        app.post('/rest/removeTrainingDay', function(req, res) {
            var trainingDay = db.collection('trainingDay');            
            trainingDay.deleteOne({ _id: new mongo.ObjectID(req.body.idTrainingDay) },function(err, results) {                
                res.json(results);
            });
        });

        app.get('/rest/trainings', function(req, res) {
            var trainings = db.collection('trainings');
            trainings.find({}).toArray(function(err, result) {
                if (err) throw err;              
                res.json({data : result});
            });
        });
        app.post('/rest/trainings/new', function(req, res) {
            var trainings = db.collection('trainings');

            trainings.insert(req.body, function(err, result) {
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });
        app.post('/rest/trainings/update', function(req, res) {
            var trainings = db.collection('trainings');

            trainings.insert(req.body, function(err, result) {
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });
        app.post('/rest/trainings/delete', function(req, res) {
            var trainings = db.collection('trainings');
            trainings.deleteOne({ _id: new mongo.ObjectID(req.body._id) },function(err, results) {                
                res.json(results);
            });
        });
        app.get('/rest/trainings/:idTraining', function(req, res) {
            var trainings = db.collection('trainings');
            trainings.find({_id: req.params.idTraining}).toArray(function(err, result) {
                if (err) throw err;             
                res.json({data : result});
            });
        });    

        app.get('/rest/trainingtypes', function(req, res) {
            var trainingtypes = db.collection('trainingtypes');
            trainingtypes.find({}).toArray(function(err, result) {
                if (err) throw err; 
                res.json({data : result});
            });
        });
        app.post('/rest/trainingtypes/new', function(req, res) {
            var trainingtypes = db.collection('trainingtypes');
            trainingtypes.insert(req.body, function(err, result) {
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });        

        app.post('/rest/loginUser', function(req, res) {
            var users = db.collection('users');
            users.find({email: req.body.email, pass: getCrypted(req.body.password)}).toArray(function(err, result) {
                if (err) throw err;

                if (result.length != 0) {
                    res.json(result[0]);
                } else {
                    res.json({data: []});
                }
            });
        });
        app.post('/rest/loginAdmin', function(req, res) {
            var users = db.collection('users');
            users.find({email: req.body.email, pass: getCrypted(req.body.password)}).toArray(function(err, result) {
                if (err) throw err;
                console.log("RESULT",result);
                if (result.length != 0 && result[0].role == 'admin') {
                    res.json(result[0]);
                } else {
                    res.json({data: []});
                }
            });
        });

        
        app.get('/rest/messages/:userId', function(req, res) {
            var messages = db.collection('messages');
            messages.find({'to':req.params.userId}, {'sort':'created_at'}).toArray(function(err, result) {
                if (err) throw err;

                if (result.length != 0) {
                    res.json({data: result});
                } else {
                    res.json({data: []});
                }
            });
        });
        app.get('/rest/message/:messageId', function(req, res) {
            var messages = db.collection('messages');
            messages.find({'_id':new mongo.ObjectID(req.params.messageId)}, {}).toArray(function(err, result) {
                if (err) throw err;
                console.log("MESSAGE ",result);
                if (result.length != 0) {
                    res.json({data: result});
                } else {
                    res.json({data: []});
                }
            });
        });

        app.post('/rest/messages/new', function(req, res) {
            var messages = db.collection('messages');

            messages.insert(req.body, function(err, result) {
                if (err) throw err;
                res.json(result.ops[0]);
            });
        });

        app.get('/rest/latest10articles', function(req, res) {
            var feed = 'http://antoniopajuelo.wordpress.com/feed/';
            watcher = new Watcher(feed)

            watcher.run(function(err,articles) {
                if (err) throw err;
                articles.reverse();
                res.json({data: articles.slice(0,10)});
            });  
        });        



        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); 
            //load the single view file (angular will handle the page changes on the front-end)
        });


        // listen (start app with node server.js) ======================================
        app.listen(8080);
        console.log("App listening on port 8080");

    });               // connect to mongoDB database on localhost