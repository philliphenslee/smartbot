"use strict";
var path = require('path');
var SmartBot = require('../lib/');

var path = path.resolve(process.cwd(), 'config.js');
var config = require(path);

var smartBot = new SmartBot(config);

smartBot.run();
