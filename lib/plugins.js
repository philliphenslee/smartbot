'use strict';
var _ = require('lodash');
var bole = require('bole');

var path = require('path');

var log = bole('Plugins');

function loadPlugins(options, callback) {
    var plugins = {};
    _.each(options, function (plugOptions, k) {
        var plugin;

        // Load default plugins
        try {
            plugin = require(path.join('..', 'plugins', k));
        }
        catch (err) {
        }

        // Load user plugin scripts
        if (!plugin) {
            try {
                plugin = require(path.join('../../../', 'plugins', k));
            }
            catch (err) {
            }
        }

        // Load packaged module plugins
        if (!plugin) {
            try {
                plugin = require(k);
            }
            catch (err) {
            }
        }

        if (!plugin) {
            log.debug('could not load plugin ' + k);
            return;
        }

        var p = new plugin(plugOptions);
        if (p) {
            log.debug('loaded plugin ' + p.name);
        }
        plugins[k] = p;
    });
    return callback(null, plugins);
}

module.exports = {
    load: loadPlugins
};