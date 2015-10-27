'use strict';
var YQL = require('yql');

var pattern = /^\\stock\s([A-Za-z]+)$/;

var StockQuote = function (options) {


};
StockQuote.prototype.matches = function matches(msg) {
    return (/^\\stock/).test(msg);
};

StockQuote.prototype.respond = function respond(message) {
    if (message.data.channel.match(/^D0/)) {
        var msg = message.data.text;
        var matches = pattern.exec(msg);
        var symbol = matches[1];
        var query = new YQL('SELECT * FROM yahoo.finance.quote WHERE symbol = "' + symbol + '"');
        query.exec(function (error, response) {
            message.done('$' + response.query.results.quote.LastTradePriceOnly);
        });
    }

};
StockQuote.prototype.help = function help(msg) {
    return 'I will respond with stock quote help\n';
};
module.exports = StockQuote;

