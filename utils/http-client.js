var request = require('request');
var RSVP = require('rsvp');

/**
 * Make an HTTP GET request.
 *
 * @param {String} url  The full url of the request.
 *
 * @return {Promise}  Resolves with the response body, rejects with the error.
 */
function getJSON(url) {
  var deferred = RSVP.defer();
  var parsedJSON;
  request(url, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      try {
        parsedJSON = JSON.parse(body);
        deferred.resolve(parsedJSON);
      } catch (err) {
        deferred.reject(new Error('Error parsing JSON response: ' + body));
      }
    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

module.exports = {
  getJSON: getJSON
};
