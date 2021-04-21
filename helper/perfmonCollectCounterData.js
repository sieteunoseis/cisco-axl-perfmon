const axlModule = require("../main.js");

var settings = {
  version: "12.5",
  cucmip: "10.10.10.10",
  cucmuser: "administrator",
  cucmpass: "password",
};

var perfmonObject = 'Process'

var service = axlModule(settings.version, settings.cucmip, settings.cucmuser, settings.cucmpass);

var ciscoPerfmonListInstance = service.listPerfmonInstance(settings.cucmip,perfmonObject).catch(err => {
  console.log('ciscoPerfmonListInstanceErr: ' + err)
});

ciscoPerfmonListInstance.then(function(result) {
  console.log('ciscoPerfmonListInstance: ' + JSON.stringify(result))
})

var perfmonData = service.getPerfmonCounterData(settings.cucmip,perfmonObject).catch(err => {
    console.log('perfmonErr: ' + err)
});

perfmonData.then(function(result) {
    console.log('perfmonData: ' + JSON.stringify(result))
})

