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
    if(!_.isObject(options)) {
        throw new Error('missing required argument object options');
    }
    this.options = _.defaults(options);
    this.log = bole('SmartBot');
    this.responder = new Responder(options);
    this.startTime = null;
};

// Inherits SmartSlack
util.inherits(SmartBot, SmartSlack);

SmartBot.prototype.responder = null;

/**
 * Run the bot and initialize base class
 */
SmartBot.prototype.run = function () {
    SmartBot.super_.call(this, this.options);
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

SmartBot.prototype.onMessageHandler = function (msg) {
    var _this = this;

    if (msg.text) {
        msg.text = msg.text.replace(this.namePattern, '').trim();
    }

    // Builtin in commands only via direct message to bot
    if (msg.channel[0] === 'D') {
        switch (msg.text) {
            case 'uptime':
                var uptime = this.uptime();
                this.send(msg.channel, this.uptime());
                return;
            case 'status':
                var status = this.statusMessage();
                this.postDirectMessage(msg.channel, '', status);
                return;
        }
    }

    // Don't respond to self
    if (msg.user !== this.id) {

        var message = new Message(msg);
        _this.users.getUser(msg.user, function (err, result) {
            message.user = result;
        });

        message.on('send', function (reply) {
            if (reply.attachments || reply.as_user === false) {
                _this.postMessage(reply.channel, reply.text, reply);
            } else {
                _this.send(reply.channel, reply.text);
            }
        });
        this.responder.match(message);
    }
};

/**
*  Return the bots status message
*/
SmartBot.prototype.statusMessage = function () {
    var message = {};
    var attachment = {};
    message.attachments = [];
    message.text = 'Carla this is my status...';
    attachment.text = 'Uptime: ' + moment.duration(_.now() - this.startTime).humanize();
    attachment.text += '\nLoaded Plugins: ';
    _.each(this.responder.plugins, function (p) {
        attachment.text += p.name + '  ';
    });
    message.attachments.push(attachment);
    return message;
};

/**
 * Calculate bot uptime
 */
SmartBot.prototype.uptime = function () {
    return moment.duration(_.now() - this.startTime).humanize();
};

module.exports = SmartBot;