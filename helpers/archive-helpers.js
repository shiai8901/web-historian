var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var fetchHTML = require('../workers/htmlfetcher');
var querystring = require('querystring');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var list = data.split('\n');
    callback(err, list);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var list = data.split('\n');
    var boo = list.indexOf(url);
    callback(err, (boo !== -1));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var list = data.trim().split('\n');
    if (list.indexOf(url) === -1) {
      fs.writeFile(exports.paths.list, url + '\n', function(err) {
        callback(err);
      });
    }
  });  
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    console.log('files', files);
    var boo = files.indexOf(url);
    callback(err, (boo !== -1));
  });
};

exports.downloadUrls = function(urls) {
  console.log(Array.isArray(urls));
  console.log(urls);
  
  for (i = 0; i < urls.length; i++) {
    var url = exports.paths.archivedSites + '/' + urls[i];
    console.log('url', urls[i]);
    fs.createWriteStream(url);
  }
};
