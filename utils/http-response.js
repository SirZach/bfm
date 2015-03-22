module.exports = function (cb, res) {
  res.setEncoding('utf8');

  var body = '';
  res.on('data', function (d) {
    body += d;
  });

  res.on('end', function () {
    var parsed = JSON.parse(body);
    cb(parsed);
  });
}
