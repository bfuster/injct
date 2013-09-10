var _ = require('underscore');

var injections = {};

var handlers = {

    _prototype: function(prop) {
        var obj = createInstance(injections[prop].clazz, prop);
        delete injections[prop].creating;
        return obj;
    },

    _unique: function(prop) {
        if (!injections[prop].obj) {
            injections[prop].obj = createInstance(injections[prop].clazz, prop);
            delete injections[prop].creating;
        }
        return injections[prop].obj;
    },

    _static: function(prop) {
        return injections[prop].clazz;
    }
};

/**
 * Unregisters all classes
 */
exports.unregisterAll = function() {

    injections = {}
}

/**
 * Returns all registered injections
 *
 */
exports.injections = function() {
    return injections;
}

/**
 * Registers a new class with prototype scope (always create a new instance)
 *
 * @param {Object} obj
 */
exports.register = map('_prototype');

/**
 * Registers a new class with unique scope (creates just one instance which will be shared)
 *
 * @param {Object} obj
 */
exports.unique = map('_unique');

/**
 * Registers static classes (e.g.: files that only use exports.function with no objects/prototype)
 * @param {Object} obj
 */
exports.static = map('_static');

/**
 * Applies the injections into the object based on properties
 *
 * @param {Object} object
 */
exports.apply = function(object) {

    for (var prop in object) {

        if (shouldInject(object, prop)) {

            if (injections[prop].creating) {
                throw new Error("Circular reference is not supported.");
            }

            object[prop] = getInstance(prop);
        }
    }
}

function shouldInject(object, prop) {
    return object.hasOwnProperty(prop) && !object[prop] && injections[prop];
}

/**
 * Get a specific instance
 *
 * @param {String} property
 */
exports.getInstance = getInstance;

function getInstance(prop) {

    var handler = handlers[injections[prop].type];
    return handler(prop);
}

/**
 * Create an instance from the specified object
 * @param {Object} obj
 * @param {Object} property
 *
 */
function createInstance(obj, property) {

    try {

        injections[property].creating = true;
        return new obj();

    } catch (e) {

        console.error("Property %s could not be instantiated. Is it an object? "+
            "If its not a prototype object, use injct.static() instead. More info -> \n %j", property, obj);
        console.error("Error: ", e);

        throw e;
    }
}

/**
 * Iterate through properties and saves in the proper injection
 *
 * @param {Object} reference
 * @returns {Function}
 */
function map(reference) {
    return function(obj) {
        for (var o in obj) {

            var clazz = obj[o];

            injections[o] = {
                clazz: clazz,
                type: reference
            }
        }
    }
}