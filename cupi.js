var util = require("util");
var cucRest = require('./cuc-rest');

module.exports = (cucip, cucuser, cucpassword, method) => {
	const service = {};
	service.cucget = cucRest.get(cucip, cucuser, cucpassword, method);
	service.cucput = cucRest.put(cucip, cucuser, cucpassword, method);
	
	
	service.getCucGet = () => {
		return new Promise((resolve, reject) => {
			service.cucget.getCucGet(function (err, response) {
				if (Array.isArray(response)){
					resolve(response)
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
	
	service.addCucPut = (jsonData) => {
		return new Promise((resolve, reject) => {
			service.cucput.addCucPut(jsonData,function (err,response) {
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