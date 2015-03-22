var express = require('express');
var _ = require('lodash');
var CARDS = [];

module.exports = function (app, cards) {
  CARDS = cards;
  var router = express.Router();
  
  router.get('/', function (req, res) {
    res.send(CARDS);
  });

  app.use('/cards', router);
};
