'use strict';

var _ = require('lodash');
var events = require('events');
var util = require('util');

var Message = function Message(options) {
    console.log(options);
    events.EventEmitter.call(this);
    _.defaults(this, options);
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
    if (data.attachments) {
        this.emit('reply', data);
        return;
    }
    if (_.isString(data)) {
        data = {text: data};
    }
    var reply = _.extend(
        {
            channel: this.channel
        }, data);
    this.emit('reply', reply);
};

module.exports = Message;