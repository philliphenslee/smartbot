'use strict';
var _ = require('lodash');

var pattern = /^(Hello|Hi|Hey|Hola|Aloha)$/i;
var greetings = ['Hello', 'Hi', 'Hey', 'Hola', 'Aloha'];

var Greet = function (options) {
    this.name = 'Greet';
};
Greet.prototype.matches = function matches(msg) {
    return pattern.test(msg);
};
Greet.prototype.respond = function respond(message) {
    if (message.isDirectMessage()) {
        var greeting = _.sample(greetings);
        message.done(greeting + ', ' + message.user.profile.first_name);
    }
};
Greet.prototype.help = function help(msg) {
    return 'Say hello, and I will say hello back...';
};
module.exports = Greet;
