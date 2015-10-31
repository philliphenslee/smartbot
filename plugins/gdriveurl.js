/**
 * Goo URL and Google link utility
 */
'use strict';
var https = require('https');

var pattern = /^-gurl\s+(help|pdf|direct)?\s?(.+)?$/i;

function getGooUrl(token, url, callback) {

    var apiPath = '/urlshortener/v1/url?key=' + token;

    var json = {
        longUrl: url
    };
    var postData = JSON.stringify(json);

    var requestOptions = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: apiPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var request = https.request(requestOptions, function (response) {

        var data = '';
        var result;

        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {

            if (response.statusCode === 200) {
                try {
                    result = JSON.parse(data);
                } catch (error) {
                    return callback(error);
                }
                callback(null, result);

            } else {
                return callback(new Error('http response error ' + ' ' + response.statusCode));
            }
        });
    });

    request.on('error', function (err) {
        return callback(err);
    });
    request.write(postData);
    request.end();
}

var GDriveUrlPlugin = function (options) {
    this.name = 'GooUrl';
    this.token = options.apitoken;
};
GDriveUrlPlugin.prototype.matches = function matches(message) {
    return pattern.test(message);

};

GDriveUrlPlugin.prototype.respond = function respond(message) {
    var action;
    var done = false;
    var fileId;
    var fileType;
    var matches;
    var url;
    var urlParse = /^\w+:\/\/(\w+).+.com\/(\w+)\/d\/(.+)\//i;

    if (message.channel.match(/^D0/)) {

        matches = message.text.match(pattern);
        if (matches) {
            action = matches[1] ? matches[1].trim() : null;
            url = matches[2] ? matches[2].trim() : null;
        }
        if (url) {
            url = url.replace('&lt;', '');
            url = url.replace('&gt;', '');
            url = url.replace('<', '');
            url = url.replace('>', '');
        }

        matches = urlParse.exec(url);
        if (matches) {
            fileId = matches[3];
            fileType = matches[2];
        }

        switch (action) {
            case 'help':
                done = true;
                break;
            case 'pdf':
                url = url.replace('edit?usp=sharing', 'export?format=pdf');
                break;
            case 'direct':
                url = 'https://drive.google.com/uc?export=&id=' + fileId;
                break;
            default:
                if (fileType === 'document' || fileType === 'spreadsheets' || fileType === 'presentation') {
                    switch (fileType) {
                        case 'document':
                            url = url.replace('edit?usp=sharing', 'export?format=doc');
                            break;
                        case 'spreadsheets':
                            url = url.replace('edit?usp=sharing', 'export?format=xlsx');
                            break;
                        case 'presentation':
                            url = url.replace('edit?usp=sharing', 'export?format=pptx');
                            break;
                    }
                } else {
                    if (fileType !== undefined) {
                        url = 'https://drive.google.com/uc?export=download&id=' + fileId;
                    }
                }
        }
        if (done) {
            message.done(this.help(message));
            return;
        }
        getGooUrl(this.token, url, function (err, result) {
            var text;
            if (result) {
                text = "<" + url +">\n" + result.id;
                message.done(text);
            }
        });
    }
};

GDriveUrlPlugin.prototype.help = function help(message) {
    var help;
    help = "I can help you create shortened urls, and convert links to files on Google Drive.\n";
    help += 'If you send me a URL to a Google Apps document, the link I generate will export the equivalent office file.\n';
    help += 'If you use the pdf option I will convert Google Docs links to PDF files\n';
    help += 'I shorten all the urls using goo, and to create a direct link use the `-gurl direct` option.\n\n';
    help += 'Here is an example command that creates a link to convert a spreadsheet to PDF\n';
    help += '`-gurl pdf <https://docs.google.com/spreadsheets/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/edit?usp=sharing>`\n';
    help += 'Enclose the url like this `<url>` so slackbot does not try to help us, and be sure to share the file with the public permissions.\n\n'
    help += 'Here are the examples of Google Docs url conversions I do.\n';
    message.text = help;
    message.attachments = [];
    var attachment = {};
    attachment.color = 'good';
    attachment.text = 'Google Spreadsheets';
    attachment.fields = [];
    attachment.fields.push({
        title: 'Export to XSLT',
        value: '<https://docs.google.com/spreadsheets/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=xlsx>',
        short: false
    });
    attachment.fields.push({
        title: 'Export Spreadsheet to PDF',
        value: '<https://docs.google.com/spreadsheets/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=pdf>',
        short: false
    });
    message.attachments.push(attachment);
    attachment = {};
    attachment.color = '#0066FF';
    attachment.text = 'Google Docs';
    attachment.fields = [];
    attachment.fields.push({
        title: 'Export to DOCX',
        value: '<https://docs.google.com/document/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=doc>',
        short: false
    });
    attachment.fields.push({
        title: 'Export Document to PDF',
        value: '<https://docs.google.com/document/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=pdf>',
        short: false
    });
    message.attachments.push(attachment);
    attachment = {};
    attachment.color = '#FF9900';
    attachment.text = 'Google Slides';
    attachment.fields = [];
    attachment.fields.push({
        title: 'Export to PPTX',
        value: '<https://docs.google.com/presentation/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=pptx>',
        short: false
    });
    attachment.fields.push({
        title: 'Export Presentation to PDF',
        value: '<https://docs.google.com/presentation/d/13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok/export?format=pdf>',
        short: false
    });
    message.attachments.push(attachment);
    attachment = {};
    attachment.text = 'Other Links';
    attachment.fields = [];
    attachment.fields.push({
        title: 'Direct Link',
        value: '<https://drive.google.com/uc?export=&id=13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok>',
        short: false
    });
    attachment.fields.push({
        title: 'Download',
        value: '<https://drive.google.com/uc?export=download&id=13keAVhZPwTH3VEFvT6Sd4Pz-6uP_J6QjXnD2LXhrPok>',
        short: false
    });
    message.attachments.push(attachment);
    return message;
};
module.exports = GDriveUrlPlugin;

