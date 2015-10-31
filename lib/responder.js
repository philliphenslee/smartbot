"use strict";

var _ = require('lodash');
var bole = require('bole');

var events = require('events');
var path = require('path');
var util = require('util');

var Responder = function Responder(options) {
    this.log = bole('Responder');
    this.opts = options;
    this.plugins = {};
    this.init();
};

util.inherits(Responder, events.EventEmitter);

Responder.prototype.processMessage = function (message) {

    var done = false;
    _.each(this.plugins, function (p) {

        if (p.matches(message.text)) {
            console.log(message.text);
            p.respond(message);
            done = true;
        }
    });
    if (done) {
        return;
    }
};

Responder.prototype.init = function () {
    var _this = this;
    _.each(_this.opts.plugins, function (plugOptions, k) {
        var plugin;

        try {
            plugin = require(path.join('..', 'plugins', k));
        }
        catch (err) {
        }

        if (!plugin) {
            try {
                plugin = require(k);
            }
            catch (err) {
            }
        }
        if (!plugin) {
            _this.log.debug('could not load plugin ' + k);
            return;
        }
        var p = new plugin(plugOptions);
        if (p) {
            _this.log.debug('loaded plugin ' + p.name);
        }
        _this.plugins[k] = p;
    });
};
module.exports = Responder;
