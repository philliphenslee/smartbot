'use strict';

var _ = require('lodash');
var events = require('events');
var util = require('util');

var Message = function Message(options) {
    events.EventEmitter.call(this);
    _.defaults(this, options);
};

util.inherits(Message, events.EventEmitter);

Message.prototype.send = function send(data) {
    if (_.isString(data)) {
        data = {text: data};
    }

    var reply = _.extend(
        {
            channel: this.channel
        }, data);
    this.emit('reply', reply);
};
Message.prototype.done = function done(reply) {
    if (reply) {
        this.send(reply);
    }
    this.removeAllListeners('reply');
};
module.exports = Message;