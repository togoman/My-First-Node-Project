const express = require('express');
const app = express();
app.set('view engine','ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
    res.render('pages/login');
});

app.post('/home', function(req, res){
    var userId = req.body.userId;
    var password = req.body.password;
    findAuthentication(userId, password, res, loginAfterAuth);
    
});

function loginAfterAuth(validationResult, res){
    console.log("loginAfterAuth start");
    if(validationResult != null){
        res.render('pages/home', {userName : validationResult.name});
    }else{
        res.render('pages/login', {errMsg : 'Login Credential is wrong !!!'});
    }
}

function findAuthentication(userId, password, res, callback){
    console.log("findAuthentication start");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/DbForMyFirstNodeApp";
    var name;
    MongoClient.connect(url, function(err, db) {
        if (err){
            console.log("DB Connection not created : "+err);
            throw err;
        }else{
            console.log("DB Connection created!");
            var dbo = db.db("DbForMyFirstNodeApp");
            dbo.collection("UserDetails").findOne({"id" : userId, "password" : password}, function(err, result) {
                if (err){
                    console.log("Data retrieval error : "+err);
                    throw err;
                }else{
                    console.log(result);
                    console.log(result != null);
                    db.close();
                    console.log("findAuthentication end");
                    callback(result, res);
                }
            });
        }
    });
}

var port = 8080;
app.listen(8080, function(err){
    if(typeof(err) == "undefined"){
        console.log("Your application is up and running on port number "+port);
    }else{
        console.log("Your application is down due to : "+err);
    }
});