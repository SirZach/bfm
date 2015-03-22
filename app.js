var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var cors = require('cors');
var server = '';
var CardsRoute = require('./routes/cards');
var PricesRoute = require('./routes/prices');
var httpResponseHandler = require('./utils/http-response');

app.use(cors());

if (process.env.DEV_MODE) {
  console.log('in development mode');
  useMtgJsonStub(function (cards) {
    CardsRoute(app, cards);
    PricesRoute(app);
    server = startApp(app);
  });
} else {
  contactMtgJson(function (cards) {
    CardsRoute(app, cards);
    PricesRoute(app);
    server = startApp(app);
  });
}

function startApp (app) {
  return app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('BFM listening at http://' + host + ':' + port);
  });
}

function contactMtgJson (cb) {
  http.get({
    host: "mtgjson.com",
    path: "/json/AllCards-x.json"
  }, httpResponseHandler.bind(this, cb))
  .on('error', function (err) {
    console.error('Error with request: ' + err.message);
  });
}

function useMtgJsonStub (cb) {
  fs.readFile(__dirname + '/stubs/AllCards-x.json', function (err, data) {
    if (err) throw err;
    var parsed = JSON.parse(data);
    cb(parsed);
  });
}
