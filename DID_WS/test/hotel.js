var expect    = require('expect.js');
var httpAgent = require('../core/httpAgent.js');


describe('hotel', function() {
	it('/access/get', function(done) {
		var body = '{"department_id" : 1}'
		httpAgent.post('http://192.168.231.1:8888/access/get', 'application/json', body, function(res) {
			try {
				var _body = JSON.parse(res.body);
			} catch(err) {
				throw(err);
				done();
			}

			var date = new Date();
			var hours = date.getHours();
			if (hours < 8 || hours > 23) {
				expect(_body.response_code).to.eql('hotel_customer_rest');
			} else {
				expect(_body.response_code).to.eql('hotel_success');
			}
			done();
		});
	});


	it('/callid/get 1', function(done) {
		var body = '{"department_id" : 1, "call_in_caller_id" : "1000", "call_in_callee_id" : "10000", "dtmf" : "10086","call_id" : "12314"}';

		httpAgent.post('http://192.168.231.1:8888/callid/get', 'application/json', body, function(res) {
			try {
				var _body = JSON.parse(res.body);
			} catch(err) {
				throw(err);
				done();
			}

			expect(_body.response_code).to.eql('hotel_success');
			expect(_body.call_out_caller_id).to.eql('20000');
			expect(_body.call_out_callee_id).to.eql('1001');
			done();
		});	
	});

	it('/callid/get 2', function(done) {
		var body = '{"department_id" : 1, "call_in_caller_id" : "1000", "call_in_callee_id" : "10002", "dtmf" : "10086","call_id" : "12314"}';

		httpAgent.post('http://192.168.231.1:8888/callid/get', 'application/json', body, function(res) {
			try {
				var _body = JSON.parse(res.body);
			} catch(err) {
				throw(err);
				done();
			}

			expect(_body.response_code).to.eql('failure');
			done();
		});	
	});

	it('/callid/get 3', function(done) {
		var body = '{"department_id" : 1, "call_in_caller_id" : "1000", "call_in_callee_id" : "10000", "dtmf" : "106","call_id" : "12314"}';

		httpAgent.post('http://192.168.231.1:8888/callid/get', 'application/json', body, function(res) {
			try {
				var _body = JSON.parse(res.body);
			} catch(err) {
				throw(err);
				done();
			}

			expect(_body.response_code).to.eql('hotel_call_number_expired');
			done();
		});	
	});

	it('/callid/get 4', function(done) {
		var body = '{"department_id" : 2, "call_in_caller_id" : "1000", "call_in_callee_id" : "10000", "dtmf" : "106","call_id" : "12314"}';

		httpAgent.post('http://192.168.231.1:8888/callid/get', 'application/json', body, function(res) {
			try {
				var _body = JSON.parse(res.body);
			} catch(err) {
				throw(err);
				done();
			}

			expect(_body.response_code).to.eql('failure');
			done();
		});	
	});
});

