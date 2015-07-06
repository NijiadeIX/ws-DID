var log4js   = require('log4js');
var path     = require('path');
var settings = require('../settings/log.json');
/**
 * 获取一个logger
 * log.trace()
 * log.info()
 * log.warn()
 * log.error()
 * log.fatal()
 * @param  {[string]} category logger的名字
 */
function getLogger(category) {
	if (settings) {
		log4js.configure(settings);
	}

	if (category && typeof category == 'string') {
		return log4js.getLogger(category);
	} else {
		return log4js.getLogger('default');
	}
}

module.exports = getLogger;