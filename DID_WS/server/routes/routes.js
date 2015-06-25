var express = require('express');
var log = require('../../log/log.js')('route');

var router = express.Router();

router.get('/index', function(req, res) {
	log.info('GET /index');
	res.status(200).json({ "word" : "hello world" });
});

router.post('/demo', function(req, res) {
	log.info('POST /demo');
	res.status(200).json({"result" : "success"});
});
module.exports = router;