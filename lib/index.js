'use strict';
var bole = require('bole');
var _ = require('lodash');
var SmartSlack = require('smartslack');

var util = require('util');

var Responder = require('./responder');
var Message = require('./message');

var SmartBot = function Constructor(options) {
    this.opts = _.defaults(options);
    this.log = bole('SmartBot');
    this.responder = new Responder(options);
};

// Inherits methods and properties from SmartSlack
util.inherits(SmartBot, SmartSlack);

SmartBot.prototype.run = function () {
    SmartBot.super_.call(this, this.opts);
    this.on('connected', this.onConnectedHandler);
    this.on('message', this.onMessageHandler);
    this.on('error', this.onErrorHandler);
    this.start();
};

SmartBot.prototype.onConnectedHandler = function () {

};

SmartBot.prototype.onErrorHandler = function (error) {
    this.log.error(error);
};

SmartBot.prototype.onMessageHandler = function (msg) {

    var _this = this;
    // Don't respond to self
    if (msg.user !== this.id) {
        var message = new Message(msg);
        message.on('reply', function (reply) {
            _this._send(reply.channel, reply.text);
        });
        this.responder.processMessage(message);
    }
};
module.exports = SmartBot;