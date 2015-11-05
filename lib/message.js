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
};

util.inherits(Message, events.EventEmitter);

Message.prototype.done = function done(reply) {
    if (reply) {
        this.send(reply);
    }
    this.removeAllListeners('reply');
};
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
};

module.exports = Message;