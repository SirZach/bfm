var express = require('express');

module.exports = function (app) {
  app.use('/static', express.static('static', {
    maxAge: '30 days'
  }));
};
