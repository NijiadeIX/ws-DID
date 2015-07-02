
function postAccess(req, res) {
	var resBody;

	var now = new Date();
	var hours = now.getHours();
	if (hours < 8 || hours > 23) {
		resBody = { response_code : 'hotel_customer_rest' };
	} else {
		resBody = { response_code : 'hotel_success' };
	}

	res.status(200).json(resBody);
}

module.exports.postAccess = postAccess;