const express = require('express')
const app = express()
const fs = require('fs')
var parse = require('csv-parse')
var GeoJSON = require('geojson');
var data = [];

app.get('/', function (req, res) {
  res.send('Hello World!')
})
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
