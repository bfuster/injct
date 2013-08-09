var injections = {}
  , unique = {};

/**
 * Registers a new class with prototype scope (always create a new instance)
 *
 * @param {String} argument
 * @param {Function} clazz
 */
exports.register = function(argument, clazz) {
    injections[argument] = clazz;
}

/**
 * Registers a new class with unique scope (creates just one instance which will be shared)
 *
 * @param {String} argument
 * @param {Function} clazz
 */
exports.unique = function(argument, clazz) {
    unique[argument] = new clazz();
}

/**
 * Applies the injections into the object based on properties
 *
 * @param {Object} object
 */
exports.apply = function(object) {

    for (var prop in object) {

        if (object.hasOwnProperty(prop)) {

            if (unique[prop])
                object[prop] = unique[prop]

            if (injections[prop])
                object[prop] = new injections[prop]();

        }

    }
}