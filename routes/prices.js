var express = require('express');
var httpClient = require('../utils/http-client');

var BASE_CARD_URL = 'http://magictcgprices.appspot.com' +
  '/api/cfb/price.json?cardname=';

module.exports = function (app) {
  var router = express.Router();

  router.get('/:name', function (req, res) {
    var cardName = encodeURIComponent(req.params.name);
    console.log('fetching price for ' + cardName);
    httpClient.getJSON(BASE_CARD_URL + cardName).then(
      function (prices) {
        res.send({price: prices[0]});
      },
      function (err) {
        console.error('Error retrieving card price: ' + err);
        res.status(500).send(err);
      });
  });

  app.use('/prices', router);
};
