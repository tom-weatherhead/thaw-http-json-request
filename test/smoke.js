// thaw-http-json-request/test/smoke.js

// Run this script via:
// $ npm run smoke

const httpJsonRequest = require('..');

function runTest (descriptor) {
	console.log('\nrunTest() : descriptor is', descriptor);

	httpJsonRequest
		.get(descriptor)
		.then(jsonResult => {
			console.error('httpJsonRequest.get() succeeded! Returned JSON data is:', jsonResult);
		})
		.fail(error => {
			console.error('httpJsonRequest.get() returned an error:', error);
		})
		.done();
}

runTest({
	noHttps: true,
	host: 'localhost',
	port: 3000,
	path: '/tictactoe/EEEEXEEEO/6'
});
