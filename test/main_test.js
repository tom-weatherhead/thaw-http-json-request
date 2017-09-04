// thaw-http-json-request/test/main_test.js

'use strict';

const httpJsonRequest = require('..');

const chai = require('chai');
const expect = chai.expect;

describe('App', function () {
	describe('ip.jsontest.com Success', function () {
		it('Rocks!', function (done) {
			const descriptor = {
				noHttps: true,
				host: 'ip.jsontest.com',
				path: '/?callback=showMyIP',
				preprocessRawResponseData: /^showMyIP\(([\s\S]*)\)\;\n$/
			};

			httpJsonRequest
				.get(descriptor)
				.then(jsonResult => {
					expect(jsonResult.ip).to.be.not.null;				// eslint-disable-line no-unused-expressions
					done();
				})
				.fail(error => {
					expect(error).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				})
				.done();
		});
	});

	// Or use https://httpbin.org/ ; e.g. https://httpbin.org/status/404 or https://httpbin.org/status/418
	describe('www.jsontest.com/foo Failure', function () {
		it('Rocks!', function (done) {
			const descriptor = {
				noHttps: true,
				host: 'www.jsontest.com',
				path: '/foo'
			};

			httpJsonRequest
				.get(descriptor)
				.then(jsonResult => {
					expect(jsonResult).to.be.not.null;					// eslint-disable-line no-unused-expressions
					expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				})
				.fail(error => {
					expect(error).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(error.statusCode).to.be.equal(404);
					expect(error.statusMessage).to.be.equal('Not Found');
					done();
				})
				.done();
		});
	});
});
