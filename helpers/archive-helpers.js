var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

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
  fs.readFile(exports.paths.list, 'utf8', function(err, urls) {
    if (err) {
  	  console.log('Error reading list of urls, ', err);
  	  callback(err, null);
  	} else {
  	  var list = urls.trimRight().split('\n');
  	  callback(null, list);
  	  console.log('list: ', list);
    }
  })
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(err, list) {
  	if (err) {
  	  callback(err, null);
  	} else {
  	  var exists = (list.indexOf(url) !== -1);
  	  callback(null, exists);
  	}
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
	if (err) {
	  console.log('ERROR in addUrlToList');
	  callback(err);
	} else {
	  callback(null);
	}
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, 'utf8', function(err, list) {
  	if (err) {
  		console.log('ERROR in isUrlArchived', err);
  		callback(err, null);
  	} else {
  		var exists = (list.indexOf(url) !== -1);
  		callback(null, exists);
  	}
  })
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
  	request('http://' + urls[i]).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + urls[i]));
  	// don't forget to add '/'
  }
};
