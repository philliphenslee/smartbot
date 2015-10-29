'use strict';
/**
 * SmartBot A flexible and intelligent Slack bot for Node.JS
 * @copyright Phillip J. Henslee II 2015 <ph2@ph2.us>
 * @module smartbot
 */
var bole = require('bole');
var _ = require('lodash');
var moment = require('moment');
var SmartSlack = require('smartslack');

var util = require('util');

var Responder = require('./responder');
var Message = require('./message');

/**
 * SmartBot Slack Bot
 * @constructor
 * @param {object} options required configuration options
 */
var SmartBot = function Constructor(options) {
    this.opts = _.defaults(options);
    this.log = bole('SmartBot');
    this.responder = new Responder(options);
    this.startTime = null;

};

// Inherits SmartSlack
util.inherits(SmartBot, SmartSlack);

/**
 * Run the bot and initialize base class
 */
SmartBot.prototype.run = function () {
    SmartBot.super_.call(this, this.opts);
    this.on('connected', this.onConnectedHandler);
    this.on('message', this.onMessageHandler);
    this.on('error', this.onErrorHandler);
    this.start();
};

SmartBot.prototype.onConnectedHandler = function () {
    this.startTime = _.now();
    this.namePattern = new RegExp('^' + this.name + '[:;]?\\s+');
};

SmartBot.prototype.onErrorHandler = function (error) {
    this.log.error(error);
};

SmartBot.prototype.onMessageHandler = function (m) {
    var _this = this;
    var done = false;

    m.text = m.text.replace(this.namePattern, '').trim();

    // Builtin in commands
    switch (m.text) {
        case '/uptime':
            this._send(m.channel, moment.duration(_.now() - this.startTime).humanize());
            done = true;
            break;
        case '/status':
            this._send(m.channel, 'TODO: include uptime and plugins');
            done = true;
            break;
    }
    if (done) {
        return;
    }

    // Don't respond to self
    if (m.user !== this.id) {
        var message = new Message(m);
        message.on('reply', function (reply) {
            _this._send(reply.channel, reply.text);
        });
        this.responder.processMessage(message);
    }
};

module.exports = SmartBot;