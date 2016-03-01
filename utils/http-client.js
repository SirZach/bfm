var RSVP = require('rsvp');
var userAgent = 'request';
var request = require('request').defaults({
  headers: {
    'User-Agent': userAgent
  }
});

/**
 * Make an HTTP GET request.
 *
 * @param {String} url  The full url of the request.
 *
 * @return {Promise}  Resolves with the response body, rejects with the error.
 */
function get(url) {
  var deferred = RSVP.defer();
  request(url, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      deferred.resolve(body);
    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

/**
 * Make an HTTP GET request and parse as JSON.
 *
 * @param {String} url  The full url of the request.
 *
 * @return {Promise}  Resolves with the parsed object, rejects with the error.
 */
function getJSON(url) {
  return get(url).then(function (body) {
    var obj;
    try {
      obj = JSON.parse(body);
    } catch (err) {
      throw new Error('Error parsing JSON response: ' + body);
    }
    return obj;
  });
}

module.exports = {
  get: get,
  getJSON: getJSON,
  request: request
};
