var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
// var initialize = require('initialize');
// var httpHelper = require('http-helpers');
var fs = require('fs');
var urlfunc = require('url');

exports.handleRequest = function (req, res) {

  var hearders = req.hearders;
  var method = req.method;
  var url = req.url;
  var statusCode = req.statusCode;
  var body = []; // not sure about this part yet

  var responseBody = {
    hearders: hearders,
    method: method,
    url: url,
    body: body
  };
  // console.log('you are in handleRequest');
  if (method === 'GET') {
    var urlPath = urlfunc.parse(req.url).pathname;
    console.log('urlPath: ', urlPath);
    var body = '';
    url === '/' ? url = archive.paths.siteAssets + '/index.html' : url = archive.paths.archivedSites + url; 
    console.log('handleRequest url:', url);
    fs.readFile(url, function(err, data) {
      if (err) {
        console.error(err);
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        body += data;
        res.end(JSON.stringify(body.toString()));
      }
    });
  } else if (method === 'POST') {
    var body = '';
    var url = '';
    req.on('error', function(err) {
      console.error(err);
    });
    req.on('data', function(data) {
      body += data;
      url = body.toString().slice(4);
      console.log('url:', url);
    });
    req.on('end', function() {    
      fs.writeFile(archive.paths.list, url + '\n', function(err) {
        console.error(err);
      });    
      res.writeHead(302, {'Content-Type': 'text/html'});
      res.end();
    });
    
  } else {

    res.end(archive.paths.list);
  }

};
