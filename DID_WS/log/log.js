var log4js = require('log4js');
var path = require('path');

/**
 * 获取一个logger
 * @param  {[string]} category logger的名字
 */
function getLogger(category) {
	var confPath = path.join(__dirname, '/settings.json');
	log4js.configure(confPath);

	if (category && typeof category == 'string') {
		return log4js.getLogger(category);
	} else {
		return log4js.getLogger('default');
	}
}

module.exports = getLogger;