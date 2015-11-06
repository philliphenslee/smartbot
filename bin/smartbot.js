"use strict";
var path = require('path');
var SmartBot = require('../lib/');

try {
    var configPath = path.resolve(process.cwd(), 'config.js');
    console.log(configPath);
    var config = require(configPath);

} catch (e) {
    console.log(e);
}

if (!config) {
    config = {};
    config.token = process.env.SLACK_API_TOKEN;
    config.plugins= {
        greet: {}
    };
}
var smartBot = new SmartBot(config);

smartBot.run();
