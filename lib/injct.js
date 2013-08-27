var injections = {}
  , unique = {};

/**
 * Unregisters all classes
 */
exports.unregisterAll = function() {
    injections = {};
    unique = {};
}

/**
 * Registers a new class with prototype scope (always create a new instance)
 *
 * @param {Object} obj
 */
exports.register = function(obj) {

    for (var o in obj) {
        injections[o] = obj[o];
    }
}

/**
 * Registers a new class with unique scope (creates just one instance which will be shared)
 *
 * @param {Object} obj
 */
exports.unique = function(obj) {

    for (var o in obj) {
        unique[o] = new obj[o];
    }
}

/**
 * Applies the injections into the object based on properties
 *
 * @param {Object} object
 */
exports.apply = function(object) {

    for (var prop in object) {

        if (object.hasOwnProperty(prop) && !object[prop]) {

            if (unique[prop]) {
                object[prop] = unique[prop]
            }

            if (injections[prop]) {
                object[prop] = new injections[prop]();
            }

        }

    }
}