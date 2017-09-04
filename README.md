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

Note: The command "grunt" runs lint, unit tests, and security tests.

API:

- get(descriptor = {})

	- Parameter "descriptor":

		- host: The hostname of the Web server to which to send the request. Defaults to 'localhost'.
		- port: The TCP/IP port of the Web server to which to send the request. No default value.
		- path: The path on the Web server to which to send the request. Defaults to '/'.
		- noHttps: Set to true if you wish to send the request via HTTP rather than HTTPS. Defaults to false.
		- headers: Additional key/value pairs to send as part of the HTTP[S] GET request. No default value.
		- verbose: If true, log informational messages via console.log(). Defaults to false.
		- preprocessRawResponseData(rawData) : A function that transforms the body of the HTTP[S] response as text, before it is parsed as JSON. No default value.
		- preprocessJsonResponseData(jsonData) : A function that transforms the JSON value after parsing and before it is returned. No default value.

	- Returns: A promise from the npm package "q" :
		- See https://www.npmjs.com/package/q
		- See https://github.com/kriskowal/q

Sample usage of the npm package:

	let httpJsonRequest = require('thaw-http-json-request');
	let descriptor = {
		noHttps: true,
		host: 'ip.jsontest.com',
		path: '/?callback=showMyIP',
		preprocessRawResponseData: /^showMyIP\(([\s\S]*)\)\;\n$/
	};

	httpJsonRequest
		.get(descriptor)
		.then(jsonResult => {
			console.error('httpJsonRequest.get() succeeded! Returned JSON data is:\n\n', jsonResult);
		})
		.fail(error => {
			console.error('httpJsonRequest.get() returned an error:\n\n', error);

			if (error.statusCode) {
				console.error('HTTP status code is', error.statusCode, error.statusMessage);
			}
		})
		.done();

Output:

	httpJsonRequest.get() succeeded! Returned JSON data is:

	{ ip: '100.150.200.250' }
