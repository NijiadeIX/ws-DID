	var express = require('express');
var log = require('../../log/log.js')('route');

var router = express.Router();

var department = require('./department.js');
var dnisQuery = require('./dnisQuery.js');
var accessQuery = require('./accessQuery.js');

router.post('/service_number/get_department', department.postGetdepart);
router.post('/access/get', accessQuery.postAccess);
router.post('/callid/get', dnisQuery.postGetDnis);

module.exports = router;