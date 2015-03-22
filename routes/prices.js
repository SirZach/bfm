var express = require('express');
var httpResponseHandler = require('../utils/http-response');
var http = require('http');

module.exports = function (app) {
  var router = express.Router();

  router.get('/:name', function (req, res) {
    var cardName = encodeURIComponent(req.params.name);
    console.log('fetching price for ' + cardName);
    contactMtgPrices(cardName, function (response) {
      res.send(response[0]);
    });
  });

  app.use('/prices', router);
};

function contactMtgPrices (cardName, cb) {
  http.get({
    host: "magictcgprices.appspot.com",
    path: "/api/cfb/price.json?cardname=" + cardName
  }, httpResponseHandler.bind(this, cb))
  .on('error', function (err) {
    console.error('Error with request: ' + err.message);
  });
}
