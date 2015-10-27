'use strict';
var _ = require('lodash');
var SmartSlack = require('smartslack');

var util = require('util');

var Responder = require('./responder');
var Message = require('./message');

var SmartBot = function Constructor(options) {
    this.settings = _.defaults(options);
    this.responder = new Responder();
};

// Inherits methods and properties from SmartSlack
util.inherits(SmartBot, SmartSlack);

SmartBot.prototype.run = function () {
    SmartBot.super_.call(this, this.settings);
    this.on('connected', this.handleOnConnected);
    this.on('message', this.handleOnMessage);
    this.on('error', this.handleOnError);
    this.start();
};

SmartBot.prototype.handleOnConnected = function () {
    //console.log(this.responder.patterns);
    //this.postMessage('general', 'Hey Channel!');
    //this.postDirectMessage('ph2@ph2.us','Hey Phillip!');
};

SmartBot.prototype.handleOnMessage = function (message) {
    var _this = this;
    if (message.user !== 'U0BN3JFH7') {
        var msg = new Message(message);
        msg.on('reply', function (reply) {
            _this._send(reply.channel, reply.text);
        });
        this.responder.handleMessage(msg);
    }
};
SmartBot.prototype.handleOnError = function (err) {
    console.log(err);
};

module.exports = SmartBot;


