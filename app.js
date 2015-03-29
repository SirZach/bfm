var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var cors = require('cors');
var RSVP = require('rsvp');
var server = '';
var CardsRoute = require('./routes/cards');
var ImagesRoute = require('./routes/images');
var PricesRoute = require('./routes/prices');
var StaticRoute = require('./routes/static');
var httpClient = require('./utils/http-client');


app.use(cors());

retrieveCards().then(
  function (cards) {
    CardsRoute(app, cards);
    ImagesRoute(app);
    PricesRoute(app);
    StaticRoute(app);
    server = startApp(app);
  },
  function (err) {
    console.error('Error retrieving cards: ' + err);
    process.exit(1);
  });

function startApp (app) {
  return app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('BFM listening at http://' + host + ':' + port);
  });
}

/**
 * Get the list of cards from mtgjson.com (production) or local file (dev).
 *
 * @return {Promise}  Resolves with the array of cards, rejects with an error.
 */
function retrieveCards() {
  if (process.env.DEV_MODE) {
    console.log('in development mode');
    var deferred = RSVP.defer();
    // Read from the local card stub.
    fs.readFile(__dirname + '/stubs/AllCards-x.json', function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(JSON.parse(data));
      }
    });
    return deferred.promise;
  } else {
    // Reach out to the mtgjson server.
    return httpClient.getJSON('http://mtgjson.com/json/AllCards-x.json');
  }
}
