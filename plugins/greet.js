'use strict';
var _ = require('lodash');

var Greet = function (options) {
    this.name = 'Greet';
};

Greet.prototype.pattern = /^(Hello|Hi|Hey|Hola|Aloha)$/i;
Greet.prototype.greetings = ['Hello', 'Hi', 'Hey', 'Hola', 'Aloha'];

Greet.prototype.matches = function matches(msg) {
    return this.pattern.test(msg);
};
Greet.prototype.respond = function respond(message) {
    if (message.isDirectMessage()) {
        var greeting = _.sample(this.greetings);
        message.done(greeting + ', ' + message.user.profile.first_name);
    }
};
Greet.prototype.help = function help(message) {
    return 'Say hello, and I will say hello back...';
};
module.exports = Greet;
