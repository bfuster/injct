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

    map(injections, obj);
}

/**
 * Registers a new class with unique scope (creates just one instance which will be shared)
 *
 * @param {Object} obj
 */
exports.unique = function(obj) {

    map(unique, obj, createInstance);
}

/**
 * Registers static classes (e.g.: files that only use exports.function with no objects/prototype)
 * @param {Object} obj
 */
exports.static = function(obj) {

    map(unique, obj);
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
                object[prop] = unique[prop];
            }

            if (injections[prop]) {
                object[prop] = createInstance(injections[prop], prop);
            }

        }

    }
}

/**
 * Create an instance from the specified object
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

/*
 * Iterate through properties and apply a function 
 * if necessary
 */
function map(reference, obj, func) {
    for (var o in obj) {
        reference[o] = (func) ? func(obj[o], o) : obj[o];
    }
}