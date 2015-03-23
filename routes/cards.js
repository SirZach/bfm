var express = require('express');
var _ = require('lodash');
var CARDS = [];

module.exports = function (app, cards) {
  CARDS = _.keys(cards).map(function (key) {
    return massageCard(cards[key]);
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

function massageCard (card) {
  var types = card.types;
  var power = card.power;
  var toughness = card.toughness;
  var legalities = card.legalities || {};

  card.isStandard = legalities.Standard === 'Legal' ? true : false;
  card.isModern = legalities.Modern === 'Legal' ? true : false;
  card.isLegacy = legalities.Legacy === 'Legal' ? true : false;
  card.isVintage = legalities.Vintage === 'Legal' ? true : false;

  if (card.manaCost) {
    card.manaCostFormatted = card.manaCost.split('{').join('').split('}').join('');
  }
  card.recentSet = card.printings[card.printings.length -1];
  card.powerToughnessFormatted = !power && !toughness ? '' : power + '/' + toughness;
  card.mainType = typeof(types) === 'undefined' ? '' : !types.length ? '' : types[0];

   
  return card;
}

