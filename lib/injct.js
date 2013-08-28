var _prototype = {}
  , _unique = {}
  , _static = {};

/**
 * Unregisters all classes
 */
exports.unregisterAll = function() {

    _prototype = {};
    _unique = {};
    _static = {};
}

/**
 * Returns all registered injections
 *
 */
exports.injections = function() {
    return {
        prototype: _prototype,
        unique: _unique,
        static: _static
    }
}

/**
 * Registers a new class with prototype scope (always create a new instance)
 *
 * @param {Object} obj
 */
exports.register = map(_prototype);

/**
 * Registers a new class with unique scope (creates just one instance which will be shared)
 *
 * @param {Object} obj
 */
exports.unique = map(_unique);

/**
 * Registers static classes (e.g.: files that only use exports.function with no objects/prototype)
 * @param {Object} obj
 */
exports.static = map(_static);

/**
 * Applies the injections into the object based on properties
 *
 * @param {Object} object
 */
exports.apply = function(object) {

    for (var prop in object) {

        if (object.hasOwnProperty(prop) && !object[prop]) {

            if (_unique[prop]) {
                if (!_unique[prop].obj) {
                    _unique[prop].obj = createInstance(_unique[prop].clazz, prop);
                }
                object[prop] = _unique[prop].obj;
            }

            if (_prototype[prop]) {
                object[prop] = createInstance(_prototype[prop].clazz, prop);
            }

            if (_static[prop]) {
                object[prop] = _static[prop].clazz;
            }

        }

    }
}

/**
 * Create an instance from the specified object
 * @param {Object} obj
 * @param {Object} property
 *
 */
function createInstance(obj, property) {
    try {
        return new obj();
    } catch (e) {
        console.error("Property %s could not be instantiated. Is it an object? "+
            "If its not a prototype object, use injct.static() instead. More info -> \n %j", property, obj);
        throw e;
    }
}

/**
 * Iterate through properties and apply a function if necessary
 *
 * @param {Object} reference
 * @param {Function} func
 * @returns {Function}
 */
function map(reference, func) {
    return function(obj) {
        for (var o in obj) {

            var clazz = (func) ? func(obj[o], o) : obj[o];
            reference[o] = {
                clazz: clazz
            };
        }
    }
}