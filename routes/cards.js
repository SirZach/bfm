var express = require('express');
var _ = require('lodash');
var CARDS = [];

module.exports = function (app, cards) {
  CARDS = _.keys(cards).map(function (key) {
    return cards[key];
  });
  var router = express.Router();
  
  router
    .get('/', function (req, res) {
      var query = req.query;
      var page = query.page || 0;
      var nameSearch = query.nameSearch || '';
      
      var matchedCards = _.filter(CARDS, function (card) {
        if (nameSearch) {
          return card.name.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1;
        } else {
          return true;
        }
      });
      
      res.send(matchedCards.slice(page * 20, page * 20 + 20));
    })
    .get('/:name', function (req, res) {
      var cardName = req.params.name;
      var card = _.find(CARDS, 'name', cardName);

      res.send(card);
    });


  app.use('/cards', router);
};
