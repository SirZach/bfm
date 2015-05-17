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
      var page = Number(query.page || 1) - 1;
      var perPage = Number(query.per_page || 20);
      var nameSearch = query.nameSearch || '';
      var types = query.types || '';
      var legalities = query.legalities || '';
      var colors = query.colors || '';
      var matchedCards = CARDS;

      if (nameSearch) {
        matchedCards = _.filter(CARDS, function (card) {
          return card.name.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1;
        });
      }

      if (types) {
        if (!_.isArray(types)) {
          types = [types];
        }
        matchedCards = _.filter(matchedCards, function (card) {
          return _.contains(types, card.mainType);
        });
      }

      if (colors) {
        if (!_.isArray(colors)) {
          colors = [colors];
        }
        matchedCards = _.filter(matchedCards, function (card) {
          var found = false;
          var cardColors = card.colors;

          if (!colors) {
            return false;
          }

          return _.intersection(colors, cardColors).length;
        });
      }

      if (legalities) {
        if (!_.isArray(legalities)) {
          legalities = ['is' + legalities];
        } else {
          legalities = legalities.map(function (l) {
            return 'is' + l;
          });
        }

        matchedCards = _.filter(matchedCards, function (card) {
          var isLegal = false;
          legalities.forEach(function (l) {
            if (card[l]) { isLegal = true;}
          });

          return isLegal;
        });
      }

      var totalPages = Math.ceil(matchedCards.length / perPage);
      var payload = {
        cards: matchedCards.slice(page * perPage, page * perPage + perPage),
        meta: {
          total_pages: totalPages
        }
      };
      res.send(payload);
    })
    .get('/:name', function (req, res) {
      var cardName = req.params.name;
      var card = _.find(CARDS, function (card) {
        return card.name.toLowerCase() === cardName.toLowerCase();
      });
      card.id = cardName;

      res.send({"card": card});
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
  } else {
    card.manaCostFormatted = '';
  }
  card.recentSet = card.printings[card.printings.length -1];
  card.powerToughnessFormatted = !power && !toughness ? '' : power + '/' + toughness;
  card.mainType = typeof(types) === 'undefined' ? '' : !types.length ? '' : types[0];

  card.id = card.name;

  return card;
}
