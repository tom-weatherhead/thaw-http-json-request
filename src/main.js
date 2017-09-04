// thaw-http-json-request/src/main.js

'use strict';

const Q = require('q');	// Promises for JavaScript. See https://www.npmjs.com/package/q and https://github.com/kriskowal/q

function createError (errorMessage, statusCode, statusMessage) {

	if (statusCode) {
		errorMessage = errorMessage + '\nHTTP[S] status: ' + statusCode;

		if (statusMessage) {
			errorMessage = errorMessage + ' ' + statusMessage;
		}
	}

	statusCode = statusCode || 0;
	statusMessage = statusMessage || 'Unspecified';

	let error = new Error(errorMessage);

	error.statusCode = statusCode;
	error.statusMessage = statusMessage;

	return error;
}

module.exports = {

	get: (descriptor = {}) => {
		let deferred = Q.defer();

		let logFunction;
		let errorFunction;

		if (descriptor.verbose) {
			logFunction = console.log;
			errorFunction = console.error;
		} else {
			logFunction = () => {};
			errorFunction = () => {};
		}

		logFunction('descriptor is', descriptor);

		let requestParameters = {
			host: descriptor.host || 'localhost',
			path: descriptor.path || '/'
		};

		if (descriptor.port) {
			requestParameters.port = descriptor.port;
		}

		if (descriptor.headers) {
			requestParameters.headers = descriptor.headers;
		}

		logFunction('requestParameters is', requestParameters);

		let http_or_https;

		if (descriptor.noHttps) {
			http_or_https = require('http');		// See https://nodejs.org/api/http.html
		} else {
			http_or_https = require('https');		// See https://nodejs.org/api/https.html
		}

		/* let request = */ http_or_https.get(requestParameters, response => {
			logFunction('The response from the Web service is:', response);

			let statusCode = response.statusCode;
			let statusMessage = response.statusMessage;
			let contentType = response.headers['content-type'];

			logFunction('Response: Status code:', statusCode, statusMessage);
			logFunction('Response: Content type:', contentType);

			let error;

			if (statusCode !== 200) {
				error = createError('HTTP[S] request to Web service failed.', statusCode, statusMessage);
			// } else if (!/^application\/json/.test(contentType)) {
				// error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
			}

			if (error) {
				errorFunction(error);
				response.resume();				// Consume the response data to free up memory.
				deferred.reject(error);

				return;
			}

			response.setEncoding('utf8');

			let rawData = '';

			response.on('data', chunk => {
				rawData += chunk;
			});

			response.on('end', () => {
				try {
					logFunction('The raw data from the Web service response is:', rawData);

					// See https://stackoverflow.com/questions/4339288/typeof-for-regexp :

					if (descriptor.preprocessRawResponseData instanceof RegExp) {
						var rawDataRexExMatch = descriptor.preprocessRawResponseData.exec(rawData);

						if (rawDataRexExMatch !== null && rawDataRexExMatch.length === 2) {
							rawData = rawDataRexExMatch[1];
							logFunction('rawData is now', rawData);
						}
					} else if (typeof descriptor.preprocessRawResponseData === 'function') {
						rawData = descriptor.preprocessRawResponseData(rawData);
						logFunction('The raw data from the Web service response after preprocessing is:', rawData);
					}

					let jsonData = JSON.parse(rawData);

					if (descriptor.preprocessJsonResponseData) {
						jsonData = descriptor.preprocessJsonResponseData(jsonData);
						logFunction('The JSON data parsed from the Web service response after preprocessing is:', jsonData);
					}

					logFunction('The JSON data parsed from the Web service response is:', jsonData);

					deferred.resolve(jsonData);
				} catch (jsonParseError) {
					let jsonParseErrorMessage = 'JSON.parse error: ' + jsonParseError.message;

					error = new Error(jsonParseErrorMessage);
					errorFunction(jsonParseErrorMessage);
					errorFunction(error);
					response.resume();				// Consume the response data to free up memory.
					deferred.reject(error);
				}
			});
		}).on('error', error => {
			let errorMessage = 'Error in thaw-http-json-request inside on(error) : ' + error.message;

			error = new Error(errorMessage);
			errorFunction(errorMessage);
			errorFunction(error);
			deferred.reject(error);
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
