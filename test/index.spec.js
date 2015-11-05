'use strict';

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var SmartBot = require('../lib/index.js');

describe('SmartBot', function () {

    describe('constructor', function () {

        var mock_options = {};
        mock_options.token = 'xoxo-01234567890-ABCDEFGHIJKLMNOPQRSTUVWX';

        it('can be constructed', function (done) {
            var smartbot = new SmartBot(mock_options);
            smartbot.should.be.an('object');
            done();
        });

        it('should validate required options arguments', function (done) {
            expect(function () {
                new SmartBot(null);
            }).to.throw('missing required argument object options');
            done();
        });
    });
});

