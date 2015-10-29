'use strict';
var pg = require('pg');

var pattern = /(^quote|wisdom|wise$)/;

var FamousQuotes = function (options) {
    this.name = 'FamousQuotes';
};
FamousQuotes.prototype.matches = function matches(msg) {
    return pattern.test(msg);
};

FamousQuotes.prototype.respond = function respond(message) {
    var conString = "pg://ph2@localhost:5432/naomi";
    pg.connect(conString, function (err, client) {
        client.query('SELECT * FROM get_quote();', function (err, result) {
            if (err) {
                console.log(err);
            }
            var quote = result.rows[0].quote + '\n~ ' + result.rows[0].author;
            message.done(quote);
            client.end();
        });
    });
};
FamousQuotes.prototype.help = function help(msg) {
    return 'I will respond with a famous quote\n';
};
module.exports = FamousQuotes;