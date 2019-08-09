'use strict';
var _ = require('lodash');
var fetch = require('node-fetch');

var DinoPassPlugin = function (options) {
    this.name = 'DinoPass';
    this.url = 'http://www.dinopass.com/password/';
    this.type = 'simple';
    this.numPasswords = 1;
    this.isOracleify = false;

};

DinoPassPlugin.prototype.pattern = /^(dinopass|dino|dp)/ig;

DinoPassPlugin.prototype.matches = function matches(message) {
    return this.pattern.test(message);
};

DinoPassPlugin.prototype.reset = function reset() {
    this.isOracleify = false;
    this.numPasswords = 1;
    this.type = 'simple';
};

DinoPassPlugin.prototype.getDinoPass = function getDinoPass(url) {
    return fetch(url).then(resp => resp.text());
};

DinoPassPlugin.prototype.buildRequest = function buildRequest(n) {
    var arrUrls = [];
    while (n--) {
        arrUrls.push(this.url + this.type);
    }
    return arrUrls;
};

DinoPassPlugin.prototype.transformPassword = function transformPassword(p) {
    if (this.isOracleify) {
        return this.oracleify(p) + '\n';
    } else {
        return p + '\n';
    }
};

DinoPassPlugin.prototype.oracleify = function oracleify(p) {
    var special = '#$!*?@';
    return p.charAt(0).toUpperCase()
        + p.slice(1)
        + special.charAt(Math.floor(Math.random() * special.length));
};

DinoPassPlugin.prototype.respond = function respond(message) {

    // Only response to direct message
    if (!message.channel.match(/^D0/)) {
        return;
    }

    var input = message.text.replace(this.pattern, '').trim();

    if (input === 'help') {
        var helpMessage = this.help(message);
        message.send(helpMessage);
        return;
    }

    if (input.length > 0) {
        input.toLowerCase().split(' ').map((arg) => {
            if (arg === 's' || arg === 'strong') {
                this.type = 'strong';
            }
            if (arg === 'o' || arg === 'oracleify') {
                this.isOracleify = true;
            }
            if (parseInt(arg) && arg <= 10) {
                this.numPasswords = arg;
            }
        });
    }

    var promises = this.buildRequest(this.numPasswords).map(url => this.getDinoPass(url));

    Promise.all(promises).then(resp => {
        var p = [];
        resp.map(pwd => p.push(this.transformPassword(pwd)));
        this.renderMessage(message, p);
    });

};

DinoPassPlugin.prototype.renderMessage = function renderMessage(message, passwords){
    /*var msg = [];
    var sec = {};
    sec.type = "section";
    sec.text = {};
    sec.text.type = "mrkdwn";
    sec.text.text = "Here's the DinoPass passwords I fetched for you!";
    msg.push(sec);
    var div = {};
    div.type = "divider";
    msg.push(div);
    var sec2 = {};
    sec2.type = "section";
    sec2.fields = [];

    var i = passwords.length;

    while(i--){
        sec2.fields.push('{type: "plain_text, text: "' + passwords[i] +'"}');
    }

    sec2.accessory = {};
    sec2.accessory.type = "image";
    sec2.accessory.image_url = "https://ph2-s3.s3.amazonaws.com/public/dinopass-slack.png";
    sec2.accessory.alt_text = "DinoPass";
    msg.push(sec2);*/

    var i = passwords.length;
    var msg ='';

    while(i--){
        msg += passwords[i] + '\n';
    }
    message.send(msg);
    this.reset();
};


DinoPassPlugin.prototype.help = function help(message) {
    var text = [];
    text.push('DinoPass Help');
    text.push('This plugin generates passwords from the DinoPass API.');
    text.push('```dinopass  // will return a single DinoPass```');
    text.push('```dinopass strong 5  // Returns five strong passwords```');
    text.push('```dinopass oraclify 5  // Returns five Oracleified simple passwords```');
    message.text = text.join('\n');
    return message;
};
module.exports = DinoPassPlugin;
