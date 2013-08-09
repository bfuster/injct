var injct = require('../../lib/injct.js');

var Bar = function() {}
module.exports = Bar;

injct.register('bar', Bar);