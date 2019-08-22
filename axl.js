var util = require("util");
var cucmsql = require('./cucm-axl');

module.exports = (version, cucmip, cucmuser, cucmpassword) => {
	const service = {};
	service.cucm = cucmsql(version, cucmip, cucmuser, cucmpassword);
	
	service.getVersion = () => {
		return new Promise((resolve, reject) => {
			SQL = "select version from componentversion where softwarecomponent = 'master'"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err)	
				}	
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});
		});
	};

	service.getSystables = (table) => {
		return new Promise((resolve, reject) => {
			SQL = "select nrows,version,ustlowts from systables where tabname='" + table + "'"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err)	
				}	
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});
		});
	};
	
	service.getDevicePool = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from devicepool"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});
		});    
	};

	service.getPhoneTemplate = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name as device, pt.name as template from phonetemplate as pt, typemodel as model where pt.tkmodel = model.enum"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});
		});
	};

	service.getCSS = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from callingsearchspace"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getEndUsers = (userArr) => {
		return new Promise((resolve, reject) => {
			SQL = "select userid from enduser where userid in ('" + userArr.toString().replace(/,/g,"','") + "')"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['userid']; }));
				}else if(response){
					resolve([response.userid])
				}else{
					reject(err);	
				}
			});

			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDeviceName = (mac) => {
		return new Promise((resolve, reject) => {
			SQL = "select name from device where name='" + mac + "'"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getLocation = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from location"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	service.getMRGL = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from mediaresourcelist"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getSoftKeyTemplate = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from softkeytemplate"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getCommonPhoneConfig = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from commonphoneconfig"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getCommonDeviceConfig = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from commondeviceconfig"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDeviceType = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from typemodel where tkclass = '1' order by name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getSecurityProfile = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name as device, sp.name as profile from securityprofile sp left outer join typemodel as model on sp.tkmodel = model.enum where (sp.tksecuritypolicy = 4 or sp.tksecuritypolicy = 99) order by model.name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDialRules = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from dialrules"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.getSIPProfile = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from sipprofile"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDNDOption = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from typedndoption"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getRoutePartition = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from routepartition"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getVMProfile = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name from voicemessagingprofile"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
				}else if(response){
					resolve([response.name])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getMLPP = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name, dp.name as protocol from typemodel as model, typedeviceprotocol as dp, ProductSupportsFeature as p where p.tkmodel = model.enum and p.tkSupportsFeature = (select enum from typesupportsfeature where name = 'Call Precedence (for MLPP)') and p.tkdeviceprotocol = dp.enum and model.tkclass = (select enum from typeclass where name = 'Phone') order by model.name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getRecording = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name, dp.name as protocol from typemodel as model, typedeviceprotocol as dp, ProductSupportsFeature as p where p.tkmodel = model.enum and p.tkSupportsFeature = (select enum from typesupportsfeature where name = 'Record') and p.tkdeviceprotocol = dp.enum and model.tkclass = (select enum from typeclass where name = 'Phone') order by model.name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getMaxBusy = () => {
		return new Promise((resolve, reject) => {
			SQL = "select name,param from typemodel as model, ProductSupportsFeature as p where p.tkmodel = model.enum and p.tkSupportsFeature = (select enum from typesupportsfeature where name = 'Multiple Call Display') and model.tkclass = (select enum from typeclass where name = 'Phone')"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.getEMPhones = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name, dp.name as protocol from typemodel as model, typedeviceprotocol as dp, ProductSupportsFeature as p where p.tkmodel = model.enum and p.tkSupportsFeature = (select enum from typesupportsfeature where name = 'Extension Mobility') and p.tkdeviceprotocol = dp.enum and model.tkclass = (select enum from typeclass where name = 'Phone') order by model.name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDNDPhones = () => {
		return new Promise((resolve, reject) => {
			SQL = "select model.name, dp.name as protocol from typemodel as model, typedeviceprotocol as dp, ProductSupportsFeature as p where p.tkmodel = model.enum and p.tkSupportsFeature = (select enum from typesupportsfeature where name = 'Do Not Disturb') and p.tkdeviceprotocol = dp.enum and model.tkclass = (select enum from typeclass where name = 'Phone') order by model.name"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getPhoneTemplateConfig = () => {
		return new Promise((resolve, reject) => {
			SQL = 'select model.name as device, pt.name as template,p.buttonnum,tf.name as feature,dp.name as protocol from phonetemplate as pt, phonebutton as p, typemodel as model,typefeature as tf, typedeviceprotocol as dp where pt.pkid = p.fkphonetemplate and pt.tkmodel = model.enum and pt.tkdeviceprotocol = dp.enum and p.tkfeature = tf.enum'
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getRdpUserId = (remotedestinationprofilename) => {
		return new Promise((resolve, reject) => {
			SQL = "select eu.userid from enduser eu inner join device d on eu.pkid = d.fkenduser_mobility where d.name = '" + remotedestinationprofilename + "' and d.tkmodel = 134"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['userid']; }));
				}else if(response){
					resolve([response.userid])
				}else{
					reject(err);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};	
	
	service.addPhone = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addPhone(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addLine = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addLine(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addAdvertisedPattern = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addAdvertisedPattern(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addFacInfo = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addFacInfo(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addSipTrunk = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addSipTrunk(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	
	service.addUser = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addUser(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.updateUser = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.updateUser(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addDeviceProfile = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addDeviceProfile(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addRDP = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addRDP(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addRDI = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addRDI(jsonDATA, function (err, response) {
				if(response['soapenv:Fault']){
					reject(response['soapenv:Fault']['faultstring'])
				}else {
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	return service;
};