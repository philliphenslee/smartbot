'use strict';
var YQL = require('yql');
var _ = require('lodash');

var pattern = /^([a-zA-Z]+,?\s*)+$/;

var StockQuotePlugin = function (options) {
    this.name = 'StockQuotes';
};
StockQuotePlugin.prototype.matches = function matches(message) {
    return (/^-stock/).test(message);
};

StockQuotePlugin.prototype.respond = function respond(message) {
    var match = false;

    // Only response to direct message
    if (!message.channel.match(/^D0/)) {
        return;
    }
    var input = message.text.replace('-stock', '').trim();

    if (input !== 'help') {
        match = pattern.test(input);
    }

    if (!match) {
        var helpMessage = this.help(message);
        message.done(helpMessage);
        return;
    }

    var query = new YQL('SELECT * FROM yahoo.finance.quote WHERE symbol = "' + input + '"');
    query.exec(function (error, data) {
        if (error) {
            message.done('Service unavailable.');
            return;
        }

        var quotes = data.query.results.quote;

        if (!_.isArray(quotes)) {
            quotes = [data.query.results.quote];
        }
        message.attachments = [];
        message.text = '';

        _.each(quotes, function (quote) {
            if (_.isString(quote.Name)) {
                var attachment = {};
                attachment.text = quote.Name;
                attachment.fallback = attachment.text;
                attachment.fields = [];
                if (quote.Change !== null) {
                    if (quote.Change[0] === '-') {
                        attachment.color = 'danger';
                    }
                    if (quote.Change[0] === '+') {
                        if (quote.Change !== '+0.00') {
                            attachment.color = 'good';
                        }
                    }
                    attachment.fields.push({
                        title: 'change',
                        value: quote.Change,
                        short: true
                    });
                }
                if (quote.DaysHigh !== null) {
                    attachment.fields.push({
                        title: 'high',
                        value: quote.DaysHigh,
                        short: true
                    });
                }
                attachment.fields.push({
                    title: 'last price',
                    value: quote.LastTradePriceOnly,
                    short: true
                });
                if (quote.DaysLow !== null) {
                    attachment.fields.push({
                        title: 'low',
                        value: quote.DaysLow,
                        short: true
                    });
                }
                message.attachments.push(attachment);
            } else {

            }
        });
        message.done(message);

    });
};
StockQuotePlugin.prototype.help = function help(message) {
    var text = [];
    text.push('*Stock Quote Help*');
    text.push('The -stock command accepts a single stock ticker symbol, or separated list of symbols');
    text.push('```-stock AAPL```');
    text.push('```-stock VTI, VEA, VWO, MUB```');
    text.push('```-stock VTI VEA VWO MUB```');
    message.text = text.join('\n');
    return message;
};
module.exports = StockQuotePlugin;
