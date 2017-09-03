# thaw-http-json-request
A library for sending requests to Web services and handling JSON responses.

Git installation instructions:

	$ git clone https://github.com/tom-weatherhead/thaw-http-json-request.git
	$ cd thaw-http-json-request
	$ npm install -g grunt
	$ npm install
	$ grunt

npm Installation Instructions:

	$ npm install [--save] thaw-http-json-request

Note: The command "grunt" runs lint and security tests.

API:

- get(descriptor = {})

	- Parameter "descriptor":

		- host: The hostname of the Web server to which to send the request. Defaults to 'localhost'.
		- port: The TCP/IP port of the Web server to which to send the request. No default value.
		- path: The path on the Web server to which to send the request. Defaults to '/'.
		- noHttps: Set to true if you wish to send the request via HTTP rather than HTTPS. Defaults to false.
		- verbose: If true, log informational messages via console.log(). Defaults to false.
		- preprocessRawResponseData(rawData) : 
		- preprocessJsonResponseData(jsonData) : 

	- Returns: A promise from the npm package "q" :
		- See https://www.npmjs.com/package/q
		- See https://github.com/kriskowal/q

Sample usage of the npm package:

	let httpJsonRequest = require('thaw-http-json-request');
	let descriptor = {
		noHttps: true,
		host: 'localhost',
		port: 3000,
		path: '/tictactoe/EEEEXEEEO/6'
	};

	httpJsonRequest
		.get(descriptor)
		.then(jsonResult => {
			console.error('httpJsonRequest.get() succeeded! Returned JSON data is:\n\n', jsonResult);
		})
		.fail(error => {
			console.error('httpJsonRequest.get() returned an error:\n', error);
		})
		.done();

Output:

	httpJsonRequest.get() succeeded! Returned JSON data is:

	{ bestRow: 0,
	  bestColumn: 1,
	  bestMoveList: [ { row: 0, column: 1 } ],
	  bestScore: 1,
	  player: 'O' }
