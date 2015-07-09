var app = require('express')();
var jsonParser = require('body-parser').json();

app.use(jsonParser);

app.post('/call_number/customer/get_call_number', function(req, res) {
	var callerId = req.body.call_in_caller_id;
	var calleeId = req.body.call_in_callee_id;
	var dtmf = req.body.dtmf;

	if (callerId == '1000' && calleeId == '10000' && dtmf == '10086') {
		res.status(200).json({ response_code : 'hotel_success', call_out_caller_id : '10001', call_out_callee_id : '1001'});
	} else {
		res.status(200).json({ response_code : 'hotel_orders_error1'});
	}
});


app.post('/call_number/supplier/get_call_number', function(req, res) {
	var callerId = req.body.call_in_caller_id;
	var calleeId = req.body.call_in_callee_id;
	var callId   = req.body.call_id;

	if (callerId == '1001' && calleeId == '10001' && callId == '10086') {
		res.status(200).json({ response_code : 'hotel_success', call_out_callee_id : '1000'});
	} else {
		res.status(200).json({ response_code : 'hotel_call_number_expired'});
	}
});

app.listen(10000);