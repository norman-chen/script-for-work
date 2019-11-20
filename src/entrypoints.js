'use strict';

/**
 * EntryPoints into the Plugin.
 * These can be URI's or Bus Messages.
 *
 * @param {Object} server - Hapi Server Object
 * @param {Object} plugin - Instance of the Implementation
 */
const entryPoints = function(server, plugin) {
    server.bind(plugin);

    server.route({
        method : 'GET',
        path   : '/plugin/say-hey',
        handler: plugin.sayHey,
        config : {
            //Support for swagger, look at the hapi-swagger documentation for more options
            //When params/query/payload joi validation are used, model contract will generate
            //into swagger documentation
            tags       : ['api'],
            description: 'say-hey'
        }
    });
};
/**
 * Export the Instance to the World
 */
module.exports = entryPoints;
