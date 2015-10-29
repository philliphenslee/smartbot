'use strict';
var YQL = require('yql');

var pattern = /^\\stock\s([A-Za-z]+)$/;

var StockQuote = function (options) {
    this.name = 'StockQuotes';
};
StockQuote.prototype.matches = function matches(msg) {
    return (/^\\stock/).test(msg);
};

StockQuote.prototype.respond = function respond(message) {
    if (message.channel.match(/^D0/)) {
        var msg = message.text;
        var matches = pattern.exec(msg);
        var symbol = matches[1];
        var query = new YQL('SELECT * FROM yahoo.finance.quote WHERE symbol = "' + symbol + '"');
        query.exec(function (error, data) {
            message.done('$' + data.query.results.quote.LastTradePriceOnly);
        });
    }

};
StockQuote.prototype.help = function help(msg) {
    return 'I will respond with stock quote help\n';
};
module.exports = StockQuote;

