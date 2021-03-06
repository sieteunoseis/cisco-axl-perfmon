var util = require("util");
var cucmsql = require('./cucm-axl');
var cucmPerfmon = require('./cucm-perfmon');

module.exports = (version, ipaddress, username, password) => {
	const service = {};
	service.cucm = cucmsql(version, ipaddress, username, password);
	service.cucmperfmon = cucmPerfmon(ipaddress,username,password)
	
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

	service.getSqlOutput = (SQL) => {
		return new Promise((resolve, reject) => {
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

	service.getServers = () => {
		return new Promise((resolve, reject) => {
			SQL = "select distinct ipv4address from certificateprocessnodemap"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['ipv4address']; }));
				}else if(response){
					resolve([response.ipv4address])
				}else{
					reject(err);	
				}	
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});
		});
	};

	service.getSipTrunksbyName = () => {
		return new Promise((resolve, reject) => {
			SQL = "select device.name from device left join typeclass on device.tkclass=typeclass.enum left join typemodel on device.tkmodel=typemodel.enum where typemodel.name = 'SIP Trunk'"
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
			SQL = "select userid from enduser where upper(userid) in ('" + userArr.toString().toUpperCase().replace(/,/g,"','") + "')"
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

	service.getDNandPartitions = (dnArr) => {
		return new Promise((resolve, reject) => {
			SQL = "select n.dnorpattern as DN, rp.name as partition from numplan as n, outer routepartition as rp where rp.pkid = n.fkroutepartition and n.dnorpattern in ('" + dnArr.toString().toUpperCase().replace(/,/g,"','") + "')"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]; }));
				}else if(response){
					resolve([response])
				}else{
					reject(err);	
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.getDeviceName = (deviceArr) => {
		return new Promise((resolve, reject) => {
			SQL = "select name from device where upper(name) in ('" + deviceArr.toString().toUpperCase().replace(/,/g,"','") + "')"
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

	service.getRemoteDestination = (rdiArr) => {
		return new Promise((resolve, reject) => {
			SQL = "select destination from remotedestinationdynamic where upper(destination) in ('" + rdiArr.toString().toUpperCase().replace(/,/g,"','") + "')"
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

	service.getFacCodes = (facCodeArr) => {
		return new Promise((resolve, reject) => {
			SQL = "select code from facinfo where code in ('" + facCodeArr.toString().replace(/,/g,"','") + "')"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['code']; }));
				}else if(response){
					resolve([response.code])
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

	service.getActivationIdPhones = () => {
		return new Promise((resolve, reject) => {
			SQL = "select p.name from defaults as d,typemodel as p where d.tkmodel = p.enum and d.preferactcodeoverautoreg = 't'"
			SQL = util.format(SQL);
			service.cucm.query(SQL, function (err, response) {
				if(response){
					resolve(Object.keys(response).map(function(_) { return response[_]['name']; }));
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};
	
	service.addTranslationPattern = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addTranslationPattern(jsonDATA, function (err, response) {
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.addRoutePattern = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addRoutePattern(jsonDATA, function (err, response) {
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.addSipRoutePattern = (jsonDATA) => {
		return new Promise((resolve, reject) => {
			service.cucm.addSipRoutePattern(jsonDATA, function (err, response) {
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.getUser = (userid) => {
		return new Promise((resolve, reject) => {
			service.cucm.getUser(userid, function (err, response) {
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.getPhone = (name) => {
		return new Promise((resolve, reject) => {
			service.cucm.getPhone(name, function (err, response) {
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.listPhoneActivationCode = (phoneName) => {
		return new Promise((resolve, reject) => {
			service.cucm.listPhoneActivationCode(phoneName, function (err, response) {
				if (err){
					reject(err)
				}else{
					resolve(response['ns:listPhoneActivationCodeResponse']['return']['phoneActivationCode']['activationCode']);
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
				if (err){
					reject(err['soapenv:Fault']['faultstring'])
				}else{
					resolve(response);
				}
			});
			process.on('uncaughtException', function (err) {
				reject(err);
			});		
		});
	};

	service.getPerfmonCounterData = (host,object) => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonCollectCounterData(host,object,function (err,response) {
				if (response){
					resolve(response)
				}else{
					reject(err)
				}
			});	
			process.on('uncaughtException', function (err) {
				// Set up the timeout
				setTimeout(function() {
					reject(err);
				}, 120000);	
			});
			process.on('ECONNRESET', function (err) {
				// Set up the timeout
				setTimeout(function() {
					reject(err);
				}, 120000);	
			});	
		});
	};

	service.getPerfmonSession = () => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonOpenSession(function (err,response) {
				if (response){
					resolve(response)
				}else{
					reject(err);	
				}
			});	
			process.on('uncaughtException', function (err) {
				reject(err);
			});	
		});
	};

	service.listPerfmonInstance = (host,object) => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonListInstance(host,object, function (err,response) {
				if (Array.isArray(response)){
					resolve(Object.keys(response).map(function(_) { return response[_]['NS1:NAME']; }));
				}else if(response){
					resolve(response)
				}else{
					reject(err);	
				}	
			});	
			process.on('uncaughtException', function (err) {
				reject(err);
			});	
		});
	};

	service.addPerfmonCounter = (sessionHandle, counterName) => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonAddCounter(sessionHandle, counterName, function (err,response) {
				if (response){
					resolve(response)
				}else{
					reject(err);	
				}	
			});	
			process.on('uncaughtException', function (err) {
				reject(err);
			});	
		});
	};

	service.getPerfmonSessionData = (sessionHandle) => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonCollectSessionData(sessionHandle,function (err,response) {
				if (response){
					resolve(response)
				}else{
					reject(err);	
				}
			});	
			process.on('uncaughtException', function (err) {
				reject(err);
			});	
		});
	};

	service.closePerfmonSessionData = (sessionHandle) => {
		return new Promise((resolve, reject) => {
			service.cucmperfmon.perfmonCloseSession(sessionHandle,function (err,response) {
				if (response){
					resolve(response)
				}else{
					reject(err);	
				}
			});	
			process.on('uncaughtException', function (err) {
				reject(err);
			});	
		});
	};
	
	return service;
};