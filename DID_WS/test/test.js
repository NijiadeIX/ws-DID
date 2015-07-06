console.log('require the function');

var a = 0;

function set(num) {
	a = num;
}

function get() {
	return a;
}
module.exports.set = set;
module.exports.get = get;