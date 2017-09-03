// thaw-http-json-request/test/smoke.js

// Run this script via:
// $ npm run smoke

const httpJsonRequest = require('..');

function runTest (descriptor) {
	console.log('\nrunTest() : descriptor is', descriptor);

	httpJsonRequest
		.get(descriptor)
		.then(jsonResult => {
			console.log('httpJsonRequest.get() succeeded! Returned JSON data is:\n\n', jsonResult, '\n');
		})
		.fail(error => {
			console.error('httpJsonRequest.get() returned an error:\n\n', error, '\n');
			console.error('error.statusCode:', error.statusCode);
			console.error('error.statusMessage:', error.statusMessage);
		})
		.done();
}

// Test 1 : 

// http://ip.jsontest.com/?callback=showMyIP

runTest({
	// verbose: true,
	noHttps: true,
	host: 'ip.jsontest.com',
	path: '/?callback=showMyIP',
	preprocessRawResponseData: /^showMyIP\(([\s\S]*)\)\;\n$/
});

// Test 2 : 

// http://ip.jsontest.com/?callback=foo

runTest({
	// verbose: true,
	noHttps: true,
	host: 'www.jsontest.com',
	path: '/foo'
});
