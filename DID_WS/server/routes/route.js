var express    = require('express');
var log        = require('../../core/log.js')('route');
var department = require('./department.js');
var custom     = require('./custom.js');
var router     = express.Router();

router.post('/service_number/get_department', department.postGetdepart);
router.post('/access/get', custom.postCustom);
router.post('/callid/get', custom.postCustom);

module.exports = router;