// thaw-http-json-request/src/main.js

var Q = require('q');	// Promises for JavaScript. See https://www.npmjs.com/package/q and https://github.com/kriskowal/q

module.exports = {

	get: (descriptor = {}) => {
		let deferred = Q.defer();

		console.log('descriptor is', descriptor);

		let requestParameters = {
			host: descriptor.host || 'localhost',
			path: descriptor.path || '/'
		};

		if (descriptor.port) {
			requestParameters.port = descriptor.port;
		}

		console.log('requestParameters is', requestParameters);

		let http_or_https;

		if (descriptor.noHttps) {
			http_or_https = require('http');		// See https://nodejs.org/api/http.html
		} else {
			http_or_https = require('https');		// See https://nodejs.org/api/https.html
		}

		/* let request = */ http_or_https.get(requestParameters, response => {
			console.log('The response from the Web service is:', response);

			const statusCode = response.statusCode;
			const statusMessage = response.statusMessage;
			const contentType = response.headers['content-type'];

			console.log('Response: Status code:', statusCode, statusMessage);
			// console.log('Response: Headers:', response.headers);
			console.log('Response: Content type:', contentType);

			let error;

			if (statusCode !== 200) {
				// error = new Error(`HTTP request to financial data service failed.\nHTTP status code: ${statusCode}`);
				error = new Error('HTTP[S] request to Web service failed.\nHTTP[S] status: ' + statusCode + ' ' + statusMessage);
			// } else if (!/^application\/json/.test(contentType)) {
				// Google Finance does not respond with application/json.
				// error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
			}

			if (error) {
				var errorMessage = 'Error in https-json-request.service: ' + error.message;

				console.error(errorMessage);
				response.resume();				// Consume the response data to free up memory.
				deferred.reject(errorMessage);
			}

			response.setEncoding('utf8');

			let rawData = '';

			response.on('data', chunk => {
				rawData += chunk;
			});

			response.on('end', () => {
				try {
					// console.log('The raw data from the Web service response is:', rawData);

					let jsonData = JSON.parse(rawData);

					// console.log('The JSON data parsed from the Web service response is:', jsonData);

					deferred.resolve(jsonData);
				} catch (jsonParseError) {
					let jsonParseErrorMessage = 'JSON.parse error: ' + jsonParseError.message;

					console.error(jsonParseErrorMessage);
					deferred.reject(jsonParseErrorMessage);
				}
			});
		}).on('error', error => {
			let errorMessage = 'Inside on(error) : Error in https-json-request.service: ' + error.message;

			// console.error(`Got error: ${error.message}`);
			console.error(error);
			console.error(errorMessage);
			deferred.reject(errorMessage);
		});

		// request.on('socket', function (socket) {
		//	const myTimeout = 5000;
		//	socket.setTimeout(myTimeout);  
		//	socket.on('timeout', function() {
		//		request.abort();
		//	});
		// });

		// request.end();

		return deferred.promise;
	}
};

// **** The end ****
