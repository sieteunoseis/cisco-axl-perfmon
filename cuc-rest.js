var https = require('https');

function CucGETSession(cucServerUrl, cucUser, cucPassword, method) {
	this._OPTIONS =  {
	host: cucServerUrl,
	path : '/vmrest/' + method,
	method: 'GET',
	headers : { 'Content-Type' : 'application/json',
				'Accept' : 'application/json' },
	auth : cucUser+':'+cucPassword,
	rejectUnauthorized: false,
	timeout: 3000
	}
}

function CucPUTSession(cucServerUrl, cucUser, cucPassword, method) {
	this._OPTIONS =  {
	host: cucServerUrl,
	path : '/vmrest/' + method,
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	auth : cucUser+':'+cucPassword,
	rejectUnauthorized: false,
	timeout: 3000
	}
}

CucGETSession.prototype.getCucGet = function(callback) {
	var options = this._OPTIONS;
	var output = ''
	var request = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
		});
		
		res.on('end', function () {
			if (res.statusCode === 200) {
				callback(null, JSON.parse(output));
			}else{
				callback(res.statusCode)
			}
		})
	});
	
	// use its "timeout" event to abort the request
	request.on('timeout', () => {
		request.abort();
	});
	
	request.on('error', function(e) {
		callback('Problem with request: ' + e.message);
	});
	
	request.end();	

};

CucPUTSession.prototype.addCucPut = function(jsonDATA, callback) {
	var options = this._OPTIONS;
	
	var request = https.request(options, function (res) {
		var output = ''
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
		});
		res.on('end', function () {
			if (res.statusCode === 201) {
				callback(null, output);
			}else{
				callback(res.statusCode)
			}
		})
	});


	request.on('error', function(e) {
		callback('Problem with request: ' + e.message);
	});
	
	// use its "timeout" event to abort the request
	request.on('timeout', () => {
		request.abort();
	});

	request.write(JSON.stringify(jsonDATA),'utf8');
	request.end();
	

};

module.exports = {
	get: function(cucServerUrl, cucUser, cucPassword, method) {
		return new CucGETSession(cucServerUrl, cucUser, cucPassword, method);
	},
	put: function(cucServerUrl, cucUser, cucPassword, method) {
		return new CucPUTSession(cucServerUrl, cucUser, cucPassword, method);
	}

}
