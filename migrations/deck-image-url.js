'use strict';

/**
 * Migration script to update all decks with an image url.
 */

var _ = require('lodash');
var request = require('request');

var config = require('config');
var FIREBASE_URL = config.get('firebase.url');
var IMAGE_URL = config.get('webatrice.imageUrl');

var DECKS_URL = FIREBASE_URL + 'decks.json';

console.log('Downloading decks.');
request.get(DECKS_URL, function (err, res, body) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // `body` is a JSON string that looks like:
  // {
  //   "-JmiiO_NkKCu84FGTjzj": {
  //     "cardGroups": {},
  //     "name": "...",
  //     "owner": "-JmrdwBImvu1AgMsrDuu"
  //   }, ...
  // }

  console.log('Parsing decks.');
  var decks = JSON.parse(body);
  _.forEach(decks, function (deck, id) {
    var cardName = longestCardNameOfGroups(deck.cardGroups);
    var cardImageUrl = encodeURI(IMAGE_URL + cardName);
    deck.imageUrl = cardImageUrl;
  });

  console.log('Updating decks.');
  request({
    method: 'PUT',
    url: DECKS_URL,
    json: true,
    body: decks
  }, function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('Finished.');
  });
});

/**
 * Find the longest card name of all cards in the given card groups.
 *
 * @param {Object} cardGroup  Key/values are 'id': {'card': 'Mountain', ...}
 *
 * @return {String} Card name.
 */
function longestCardNameOfGroups(cardGroup) {
  return _(cardGroup)
    // Extract the card object value. {card: 'Fog', count: 2, board: 'main'}
    .values()
    // Map to the card name value.
    .pluck('card')
    // Sort shortest to longest.
    .sortBy(function (name) {
      return name.length;
    })
    // Get the longest one.
    .last();
}
