'use strict';

const implementation = require('./implementation');
const entryPoints    = require('./entrypoints');
const plugin         = {};

/**
 * Register the Implementation to act like a Hapi Plugin.
 *
 * @param {Object} server  - Hapi Server Object
 * @param {Object} options - Options passed by the Service
 * @param {Function} next  - Hapi next function
 */
plugin.register = function(server, options, next) {
    const instance = new implementation();

    instance.config(options);
    entryPoints(server, instance);

    //server.dependency('pluginXYZ', ready);

    next();
};

/**
 * Use this if server.dependency is utilized.
 * The plugin.register still needs to be kept, but should
 * be gutted of configuration and entrypoint setups.
 * @param {Object} server - Hapi Server Object
 * @param {Function} next - Hapi next function
 */
// var ready = function(server, next) {
//     var instance = new implementation();
//
//     entryPoints(server, instance);
//     instance.config(options);
//
//     next();
// };

/**
 * Load Package.json.
 *
 * @type {{pkg: *}}
 */
plugin.register.attributes = {
    pkg: require('../package.json')
};

module.exports = plugin;
