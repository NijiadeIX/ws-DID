var http = require('http');
var URL = require('url');
var log = require('../log/log.js')('httpAgent');

/**
 * HTTP get method
 * @param  {string}   url      'http://www.example.com/index'
 * @param  {Function} callback function(res) [optional]
 */
function get(url, callback) {
	http.get(url, function(res) {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		});

		res.on('end', function() {
			if (data.length > 0) {
				res.body = data;
			}

			log.trace('body:' + data);
			if (callback) {
				callback(res);
			}
		});
	});
}

/**
 * HTTP post method
 * @param  {string}   url         'http://www.example.com/index'
 * @param  {string}   contentType 'application/json'
 * @param  {string}   body        [description]
 * @param  {Function} callback    function(res) [optional]
 */
function post(url, contentType, body, callback) {
	var _headers = {};
	var urlInfo = URL.parse(url);
	if (urlInfo.port) {
		urlInfo.port = parseInt(urlInfo.port);
	}

	_headers['content-type'] = contentType;
	_headers['content-length'] = body.length;

	var options = {
		hostname : urlInfo.hostname,
		port : urlInfo.port || 80,
		method : 'POST',
		path : urlInfo.path,
		headers : _headers
	}

	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			if (data.length > 0) {
				res.body = data;
			}

			log.trace('body:' + data);
			if (callback) {
				callback(res);
			}
		})
	});

	req.write(body);
	req.end();
}

module.exports.get = get;
module.exports.post = post;