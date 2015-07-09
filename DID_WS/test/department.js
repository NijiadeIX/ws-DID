var expect    = require('expect.js');
var httpAgent = require('../core/httpAgent.js');

describe('Department', function() {
	it('/service_number/get_department 1', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{"callee_id" : "10000"}', 
			function(err, res) {
				try {
					var _body = JSON.parse(res.body);
				} catch(err) {
					throw err;
					done();
				}

				expect(_body.department_id).to.eql(1);
				expect(_body.service_type).to.eql('customer');
				done();
			});
	});

	it('/service_number/get_department 2', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{"callee_id" : "10001"}', 
			function(err, res) {
				try {
					var _body = JSON.parse(res.body);
				} catch(err) {
					throw err;
					done();
				}

				expect(_body.department_id).to.eql(1);
				expect(_body.service_type).to.eql('supplier');
				done();
			});
	});

	it('/service_number/get_department 3', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{"callee_id" : "1000"}', 
			function(err, res) {
				expect(res.statusCode).to.eql(404);
				done();
			});
	});

	it('/service_number/get_department 4', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'{}', 
			function(err, res) {
				expect(res.statusCode).to.eql(400);
				done();
			});
	});

	it('/service_number/get_department 5', function(done){
		httpAgent.post(
			'http://127.0.0.1:8888/service_number/get_department', 
			'application/json', 
			'', 
			function(err, res) {
				expect(res.statusCode).to.eql(400);
				done();
			});
	});
});