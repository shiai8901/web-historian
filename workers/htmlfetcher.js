// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('http');
var path = require('path');


exports.fetchHTML = function(url) {
  console.log('fetchHTML url: ', url);
  request('http://' + url).pipe(fs.createWriteStream(archive.paths.archivedSites + '/' + url));
    // var file = fs.createWriteStream(archive.paths.archivedSites + '/' + url);
    // var request = http.get('http://' + url, function(response) {
    //     response.pipe(file);
    //     file.on('finish', function() {
    //         file.close();
    //     });
    // }).on('error', function(err) {
    //     fs.unlink(archive.paths.archivedSites + url);
    // });     
};