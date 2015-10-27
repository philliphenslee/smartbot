'use strict';

var _ = require('lodash');
var events = require('events');
var util = require('util');

var Message = function Message(options) {
    events.EventEmitter.call(this);
    this.data = {};
    _.defaults(this.data, options);
};
util.inherits(Message, events.EventEmitter);

Message.prototype.send = function send(data) {
    var reply;
    this.data.text = data;
    reply = this.data;
    this.emit('reply', reply);
};

Message.prototype.done = function done(reply) {
    if (reply) {
        this.send(reply);
    }
    this.removeAllListeners('reply');
};
module.exports = Message;