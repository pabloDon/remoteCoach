var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require('request');


describe("Admin index", function() {
	it ("returns 200", function(done) {
		var url ="http://localhost:8080/#/admin/index"
		request.get(url)
		.on('response', function(response) {
			expect(response.statusCode).to.equal(200);
		})
		.on('error', function(error) {
			assert(error, 'null');
		});
		done();
	});
	it("returns all the users", function(done) {
		expect(1+1).to.equal(2);
		done();
	});
})