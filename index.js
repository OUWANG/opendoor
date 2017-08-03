const express = require('express')
const app = express()
const fs = require('fs')
const parse = require('csv-parse')
const GeoJSON = require('geojson');
const bodyParser = require('body-parser');
var data = [];
var userDB = [];
//============================== Hashing ================================

var bcrypt = require('bcrypt');
const saltRounds = 10;
var someOtherPlaintextPassword = 'MomoGogo';

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.json({
    success: true
  })
  // res.send('Hello World!')
})

//====================== Part I GeoJSON Listings ========================

app.get('/listings/', function (req, res) {
  var min_price = req.query.min_price;
  var max_price = req.query.max_price;
  var min_bed = req.query.min_bed;
  var max_bed = req.query.max_bed;
  var min_bath = req.query.min_bath;
  var max_bath = req.query.max_bath;
  fs.readFile('listing-details.csv', function (err, fileData) {
    parse(fileData, {columns: true, trim: true}, function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        if(rows[i].price
          && (parseInt(rows[i].price) < parseInt(min_price)
          || parseInt(rows[i].price) > parseInt(max_price)))
          {
          continue;
        }
        if(rows[i].bedrooms
          && (parseInt(rows[i].bedrooms) < parseInt(min_bed)
          || parseInt(rows[i].bedrooms) > parseInt(max_bed)))
          {
          continue;
        }
        if(rows[i].bathrooms
          && (parseInt(rows[i].bathrooms) < parseInt(min_bath)
          || parseInt(rows[i].bathrooms) > parseInt(max_bath)))
          {
          continue;
        }
          var geo = GeoJSON.parse(rows[i], {Point: ['lat', 'lng']});
          data.push(geo);
      }
      console.log(data);
      res.send(data);
    })
  })
})

//================ Part II Token-Based Authentication ==================
app.post('/register', function(req, res){
  var user_id = req.body.id;
  for (var i = 0; i < userDB.length; i++) {
    if (userDB[i].id === user_id) {
      res.send('userID already exists')
      break;
    }
  }
  var password = req.body.password;
  var token;
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
          // Store hash in your password DB.
          token = hash;
          userDB.push({id: user_id, password: password, token: token})
          console.log(userDB);
          res.send(user_id + ' ' + password + ' ' + token);
      });
  });
})

app.post('/retrieve_key', function(req, res){
  var user_id = req.body.id;
  var password = req.body.password;
  for (var i = 0; i < userDB.length; i++) {
    if(userDB[i].id === user_id && userDB[i].password === password) {
      res.send(userDB[i].token);
    }
  }
})

app.post('/refresh_key', function(req, res){
  var token = req.body.token;
  var newToken;
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(token, salt, function(err, hash) {
          // Store hash in your password DB.
          newToken = hash;
          console.log('newToken: ',newToken);
          res.send(newToken);
      });
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


module.exports = app;
