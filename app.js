var express = require('express');
var app = express();
var http = require('http');

app.get('/prices/:name', function (req, res) {
  var price = contactMtgPrices(req.params.name, function (response) {
    res.send(response[0]);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('BFM listening at http://' + host + ':' + port);
});

function contactMtgPrices (cardName, cb) {
  http.get({
    host: "magictcgprices.appspot.com",
    path: "/api/cfb/price.json?cardname=" + cardName,
    //headers: {
    //  'Content-Type': 'application/json'
    //}
  }, function (res) {
    res.setEncoding('utf8');

    var body = '';
    res.on('data', function (d) {
      body += d;
    });

    res.on('end', function () {
      console.log(body);
      var parsed = JSON.parse(body);
      cb(parsed);
    });

  }).on('error', function (err) {
    console.error('Error with request: ' + err.message);
  });
}
