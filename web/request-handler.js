var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
// var initialize = require('initialize');
// var httpHelper = require('http-helpers');
var fs = require('fs');


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
    // check if the url is in the sites.txt already
    // if (archive.isUrlInList(url)) {
    //   // yes, get the webpage stored in archieves/sites
    //   response.writeHeader(200, {'Content-type': 'html/text'});
    //   response.end(httpHelper.aserveAssets());
    // } else {
      // no, return the loading.html in /public folder
    var body = '';
    fs.readFile('/Users/aishi/Desktop/Hack Reactor/hrsf53-web-historian/web/public/index.html', function(err, data) {
      if (err) {
        console.error(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        body += data;
        res.end(JSON.stringify(body.toString()));
      }
    });
  } else if (method === 'POST') {
    var list = [];
    var listbody = '';
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      body = body.toString();
      console.log('POST: END', body);
      res.writeHead(200);
      fs.readFile('/Users/aishi/Desktop/Hack Reactor/hrsf53-web-historian/web/archievs/sites.txt', 'utf8', function(err, data) {
        if (err) {
          console.error(err);
        } else {
          listbody += data;
          list = JSON.parse(listbody);   
          console.log(list);
          list.push(body);  
          console.log(list);
        }
      });
      fs.writeFile('/Users/aishi/Desktop/Hack Reactor/hrsf-web-historian/web/archievs/sites.txt', body, function(err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log('new url has been added in the list');
        }
      });
      res.end();
    });
  } else {

    res.end(archive.paths.list);
  }

};
