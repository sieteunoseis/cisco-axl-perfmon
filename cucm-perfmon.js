var util = require("util");
var https = require("https");
var parseString = require('xml2js').parseString;

function CucmPerfmonSession(cucmServerUrl, cucmUser, cucmPassword) {
	this._OPTIONS =  {
	host: cucmServerUrl, // The IP Address of the Communications Manager Server
	port: 8443,          // Clearly port 8443 for AXL -- I think it's the default so could be removed
	path: '/perfmonservice2/services/PerfmonService/',       // This is the URL for accessing axl on the server
	method: 'POST',      // AXL Requires POST messages
	headers: {
		'SOAPAction': '',
			'Authorization': 'Basic ' + Buffer.from(cucmUser + ":" + cucmPassword).toString('base64'), 
		'Content-Type': 'text/xml; charset=utf-8'
	},
	timeout: 120000, // Default: 120000 (2 minutes)
	rejectUnauthorized: false          // required to accept self-signed certificate
	}
}

CucmPerfmonSession.prototype.perfmonCollectCounterData = function(host,object,callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.cisco.com/ast/soap">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
	   	'<soap:perfmonCollectCounterData>' +
		'<soap:Host>%s</soap:Host>' +
		'<soap:Object>%s</soap:Object>' +
	   	'</soap:perfmonCollectCounterData>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>'
		 
	var XML = util.format(XML_ENVELOPE, host, object);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.headers.SOAPAction = "perfmonCollectCounterData"
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		if (res.statusCode == 200){
			res.setEncoding('utf8');
			res.on('data', function(d) {
				output = output + d;
			});
			res.on('end', function() {
				parseString(output, { explicitArray: false, explicitRoot: false, strict: false }, function (err, result) {
					try {
						if (result['SOAPENV:BODY']['NS1:PERFMONCOLLECTCOUNTERDATARESPONSE']['NS1:PERFMONCOLLECTCOUNTERDATARETURN']){
							callback(null, result['SOAPENV:BODY']['NS1:PERFMONCOLLECTCOUNTERDATARESPONSE']['NS1:PERFMONCOLLECTCOUNTERDATARETURN'])    	
						}else{
							callback('No results found')
						}
					} catch(ex) {
						callback(ex)
					}
				});
			});
		}else{
			callback('Status Code: ' + res.statusCode)
		}
		req.on('error', function(e) {
			callback(e);
		});
	});
	
	// use its "timeout" event to abort the request
	req.on('timeout', () => {
		req.abort();
	});

	req.end(soapBody);

};


CucmPerfmonSession.prototype.perfmonOpenSession = function(callback) {
	var XML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.cisco.com/ast/soap">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
	   	'<soap:perfmonOpenSession/>' +
		'</soapenv:Body>' +
 		'</soapenv:Envelope>'
	
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.headers.SOAPAction = "perfmonOpenSession"
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		if (res.statusCode == 200){
			res.setEncoding('utf8');
			res.on('data', function(d) {
				output = output + d;
			});
			res.on('end', function() {
				parseString(output, { explicitArray: false, explicitRoot: false, strict: false }, function (err, result) {
					try {
						callback(null, result['SOAPENV:BODY']['NS1:PERFMONOPENSESSIONRESPONSE']['NS1:PERFMONOPENSESSIONRETURN'])    	
					} catch(ex) {
						callback(ex)
					}
				});
			});
		}else{
			callback('Status Code: ' + res.statusCode)
		}
		req.on('error', function(e) {
			callback(e);
		});
	});
	
	// use its "timeout" event to abort the request
	req.on('timeout', () => {
		req.abort();
	});

	req.end(soapBody);

};

CucmPerfmonSession.prototype.perfmonListInstance = function(host,object,callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.cisco.com/ast/soap">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
	   	'<soap:perfmonListInstance>' +
		'<soap:Host>%s</soap:Host>' +
		'<soap:Object>%s</soap:Object>' +
	   	'</soap:perfmonListInstance>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>'
		 
	var XML = util.format(XML_ENVELOPE, host, object);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.headers.SOAPAction = "perfmonListInstance"
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		if (res.statusCode == 200){
			res.setEncoding('utf8');
			res.on('data', function(d) {
				output = output + d;
			});
			res.on('end', function() {
				parseString(output, { explicitArray: false, explicitRoot: false, strict: false }, function (err, result) {
					try {
						callback(null, result['SOAPENV:BODY']['NS1:PERFMONLISTINSTANCERESPONSE']['NS1:PERFMONLISTINSTANCERETURN'])    	
					} catch(ex) {
						callback(ex)
					}
				});
			});
		}else{
			callback('Status Code: ' + res.statusCode)
		}
		req.on('error', function(e) {
			callback(e);
		});
	});
	
	// use its "timeout" event to abort the request
	req.on('timeout', () => {
		req.abort();
	});

	req.end(soapBody);

};

CucmPerfmonSession.prototype.perfmonAddCounter = function(sessionHandle,counterName,callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.cisco.com/ast/soap">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
	   	'<soap:perfmonAddCounter>' +
		  '<soap:SessionHandle>%s</soap:SessionHandle>' +
		  '<soap:ArrayOfCounter>' +
			 '<soap:Counter>' +
				'<soap:Name>%s</soap:Name>' +
			 '</soap:Counter>' +
		  '</soap:ArrayOfCounter>' +
	   	'</soap:perfmonAddCounter>' +
		'</soapenv:Body>' +
 		'</soapenv:Envelope>'
		 
	var XML = util.format(XML_ENVELOPE, sessionHandle, counterName);

	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.headers.SOAPAction = "perfmonAddCounter"
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		if (res.statusCode == 200){
			res.setEncoding('utf8');
			res.on('data', function(d) {
				output = output + d;
			});
			res.on('end', function() {
				parseString(output, { explicitArray: false, explicitRoot: false, strict: false }, function (err, result) {
					try {
						callback(null, result)    	
					} catch(ex) {
						callback(ex)
					}
				});
			});
		}else{
			callback('Status Code: ' + res.statusCode)
		}
		req.on('error', function(e) {
			callback(e);
		});
	});
	
	// use its "timeout" event to abort the request
	req.on('timeout', () => {
		req.abort();
	});

	req.end(soapBody);

};

CucmPerfmonSession.prototype.perfmonCollectSessionData = function(sessionHandle, callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://schemas.cisco.com/ast/soap">' +
		'<soapenv:Header/>' +
		'<soapenv:Body>' +
	   	'<soap:perfmonCollectSessionData>' +
		  '<soap:SessionHandle>%s</soap:SessionHandle>' +
	   	'</soap:perfmonCollectSessionData>' +
		'</soapenv:Body>' +
 		'</soapenv:Envelope>'
		 
	var XML = util.format(XML_ENVELOPE, sessionHandle);

	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.headers.SOAPAction = "perfmonCollectSessionData"
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		if (res.statusCode == 200){
			res.setEncoding('utf8');
			res.on('data', function(d) {
				output = output + d;
			});
			res.on('end', function() {
				parseString(output, { explicitArray: false, explicitRoot: false, strict: false }, function (err, result) {
					try {
						callback(null, result['SOAPENV:BODY']['NS1:PERFMONCOLLECTSESSIONDATARESPONSE']['NS1:PERFMONCOLLECTSESSIONDATARETURN'])    	
					} catch(ex) {
						callback(ex)
					}
				});
			});
		}else{
			callback('Status Code: ' + res.statusCode)
		}
		req.on('error', function(e) {
			callback(e);
		});
	});
	
	// use its "timeout" event to abort the request
	req.on('timeout', () => {
		req.abort();
	});

	req.end(soapBody);

};

module.exports = function(cucmVersion, cucmServerUrl, cucmUser, cucmPassword) {
	return new CucmPerfmonSession(cucmVersion, cucmServerUrl, cucmUser, cucmPassword);
}