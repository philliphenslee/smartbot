'use strict';
/**
 * Represents a Slack message and user data
 * @module message
 */

var _ = require('lodash');
var events = require('events');
var util = require('util');

/**
 * Message A Slack message object
 * @constructor
 * @param {object} message The Slack message
 */
var Message = function Message(message) {
    events.EventEmitter.call(this);
    this.channel = message.channel;
    this.text = message.text;
    this.user = {};
    this.response = {};
    this.response.channel = message.channel;
};

util.inherits(Message, events.EventEmitter);

Message.prototype.channel = null;
Message.prototype.text = null;
Message.prototype.user = null;
Message.prototype.response = null;

Message.prototype.isDirectMessage = function isDirectMessage() {
    if (this.channel[0] === 'D') {
        return true;
    }
};
Message.prototype.send = function send(data) {

    if (typeof data === 'object') {
        this.emit('send', data);
        return;
    }

    if (_.isString(data)) {
        data = {text: data};
    }

    var msg = _.extend(
        {
            channel: this.channel
        }, data);

    this.emit('send', msg);
    this.removeAllListeners('send');
};

module.exports = Message;