"use strict";

var _ = require('lodash');
var bole = require('bole');

var events = require('events');
var path = require('path');
var util = require('util');

var pluginManager = require('./pluginmanager');

var Responder = function Responder(options) {
    this.log = bole('Responder');
    this.options = options;
    this.plugins = {};
    this.init();
};

util.inherits(Responder, events.EventEmitter);

Responder.prototype.plugins = null;

Responder.prototype.match = function (message) {
    var _this = this;

    _.each(this.plugins, function (p) {

        if (p.matches(message.text)) {
            _this.log.debug('plugin ' + p.name + ' matched message ' + message.text);
            p.respond(message);
        }
    });
};

Responder.prototype.init = function () {
    var _this = this;

    pluginManager.loadPlugins(this.options.plugins,function(err,plugins) {
        if (err) {
            _this.log.error('Could not load plugins');
            return;
        }
        _this.plugins = plugins;
    });
};
module.exports = Responder;
