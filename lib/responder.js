'use strict';

var _ = require('lodash');
var events = require('events');
var fs = require('fs');
var path = require('path');
var util = require('util');

var Responder = function Responder(options) {
    var _this = this;
    this.patternFiles = [];
    this.patterns = {};

    fs.readdir(path.resolve('.', 'patterns'), function (err, files) {
        if (!err) {
            _this.patternFiles = files;
            _this.loadPatterns();
        }
    });
};
util.inherits(Responder, events.EventEmitter);

Responder.prototype.handleMessage = function handleMessage(message) {
    var done = false;
    _.each(this.patterns, function (v, k) {
        if (v.matches(message.data.text)) {
            v.respond(message);
            done = true;
        }
    });
    if (done) {
        return;
    }
};
Responder.prototype.loadPatterns = function () {
    var _this = this;
    _.each(this.patternFiles, function (k) {
        var pattern;

        try {
            pattern = require(path.join('..', 'patterns', k));
        }
        catch (err) {
        }

        if (!pattern) {
            try {
                pattern = require(k);
            }
            catch (ex) {
            }
        }

        if (!pattern) {
            console.log('could not load pattern ' + k);
            return;
        }
        var p = new pattern;
        _this.patterns[k] = p;
    });
}
module.exports = Responder;
