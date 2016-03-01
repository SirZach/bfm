var path = require('path');

var express = require('express');
var httpClient = require('../utils/http-client');

var BASE_QUERY_URL = 'http://magiccards.info/query?q=%21';
var DEFAULT_CARD_PATH = path.join(__dirname, '../static/default-card.jpg');
var srcRegex = /http:\/\/magiccards\.info\/scans.*\.jpg/;

module.exports = function (app) {
  var router = express.Router();

  // Handler for /images/:name
  router.get('/:name', function (req, res) {
    //short-circuting for development mode to always use the default card
    if (process.env.DEV_MODE) {
      return res.sendFile(DEFAULT_CARD_PATH);
    }

    var cardName = encodeURIComponent(req.params.name);
    console.log('fetching image for ' + cardName);
    httpClient.get(BASE_QUERY_URL + cardName).then(
      function (body) {
        var src = (srcRegex.exec(body) || [])[0];
        if (!src) {
          res.sendFile(DEFAULT_CARD_PATH);
        } else {
          httpClient.request(src).pipe(res);
        }
      },
      function (err) {
        console.error('Error retrieving image: ' + err);
        res.status(500).send(err);
      }
    );
  });

  // Middleware cheat to force browser cache usage on subsequent requests.
  app.use('/images', function (req, res, next) {
    // Use cache if they've already seen this.
    if (req.get('If-Modified-Since')) {
      res.status(304).end();
    } else {
      next();
    }
  });
  app.use('/images', router);
};
