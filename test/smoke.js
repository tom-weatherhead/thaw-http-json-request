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
		})
		.done();
}

// Test 1 : Tic-Tac-Toe

// runTest({
	// noHttps: true,
	// host: 'localhost',
	// port: 3000,
	// path: '/tictactoe/EEEEXEEEO/6'
// });

// Test 2 : Google Finance stock quote information

// let stockSymbols = ['AAPL', 'GOOG', 'MSFT'];

// runTest({
	// verbose: true,
	// host: 'www.google.com',
	// path: '/finance/info?q=NASDAQ%3a' + stockSymbols.join(),
	// preprocessRawResponseData: rawData => {
		// If rawData begins with "\n//\s", then remove it.
		
		// var rawDataGooglePrefixMatch = /^\n\/\/\s(.*)$/.exec(rawData);		// In Perl regular expressions, . does not include newlines...
		// var rawDataGooglePrefixMatch = /^\n\/\/\s([\s\S]*)$/.exec(rawData);		// but [\s\S] (any whitespace or any non-whitespace) does.

		// if (rawDataGooglePrefixMatch != null && rawDataGooglePrefixMatch.length == 2) {
			// rawData = rawDataGooglePrefixMatch[1];
		// }

		// return rawData;
	// }
// });

// Test 3 : 

// http://ip.jsontest.com/?callback=showMyIP

runTest({
	verbose: true,
	noHttps: true,
	host: 'ip.jsontest.com',
	path: '/?callback=showMyIP',
	preprocessRawResponseData: /^showMyIP\(([\s\S]*)\)\;\n$/
});
