var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var express = require('express');
var app = express();

// require more modules/folders here!
var getHtml = function(status, res, path, filename) {
  	var body = '';
  	var filePath = path + filename;
  	fs.readFile(filePath, function(err, data) {
  	  if (err) {
  	    console.log('ERROR IN GET page', err);
  	    res.writeHead(404);
  	    res.end();
  	  } else {
        body += data;
        res.writeHead(status, {'content-type': 'text/html'});
  	    res.end(body);
  	  }
  	});
};

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  if (req.url === '/' && req.method === 'GET') {
  	getHtml(200, res, archive.paths.siteAssets, '/index.html');
  } else if (req.method === 'GET') {
  	getHtml(200, res, archive.paths.archivedSites, req.url);
  } else if (req.method === 'POST') {
  	var url = '';
    req.on('data', function(data) {
  	  url += data.toString();
      url = url.split('=')[1].replace('http://', '');
  	});
  	req.on('end', function(){
  	  archive.isUrlInList(url, function(err, exists) {
  		if (exists) {
  		  // check if the url is archived
  		  archive.isUrlArchived(url, function(err, exists) {
  		  	if (exists) {
   		      getHtml(302, res, archive.paths.archivedSites, '/' + url);  		  	  		  		
  		  	} else {
  		      getHtml(302, res, archive.paths.siteAssets, '/loading.html'); 		  	
          }
  		  });
  		} else {
  		  // if the url is not in list, add it to list	
  		  archive.addUrlToList(url, function() {
  			// and render the loading page
  			archive.downloadUrls([url]);
  		    getHtml(302, res, archive.paths.siteAssets, '/loading.html');
  		  });
  		}
      });
  	});

  }
}; 

