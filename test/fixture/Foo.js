var injct = require('../../lib/injct.js');

var Foo = function(bar, unique) {

    this.bar = bar;
    this.unique = unique ;

    injct.apply(this);
}
module.exports = Foo;