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
		'SOAPAction': 'perfmonCollectCounterData',
			'Authorization': 'Basic ' + Buffer.from(cucmUser + ":" + cucmPassword).toString('base64'), 
		'Content-Type': 'text/xml; charset=utf-8'
	},
	timeout: 10000, // Default: 120000 (2 minutes)
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
						callback(null, result['SOAPENV:BODY']['NS1:PERFMONCOLLECTCOUNTERDATARESPONSE']['NS1:PERFMONCOLLECTCOUNTERDATARETURN'])    	
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