const axlModule = require("../main.js");

var settings = {
  version: "12.5",
  cucmip: "192.168.1.230",
  cucmuser: "administrator",
  cucmpass: "h0mel@b",
};

var perfmonObject = 'Processor'

var service = axlModule(settings.version, settings.cucmip, settings.cucmuser, settings.cucmpass);

var ciscoPerfmonListInstance = service.listPerfmonInstance(settings.cucmip,perfmonObject).catch(err => {
  console.log('ciscoPerfmonListInstanceErr: ' + err)
});

ciscoPerfmonListInstance.then(function(result) {
  console.log('ciscoPerfmonListInstance: ' + result) // "Some User token"
})

var perfmonData = service.getPerfmonCounterData(settings.cucmip,perfmonObject).catch(err => {
    console.log('perfmonErr: ' + err)
});

perfmonData.then(function(result) {
    console.log('perfmonData: ' + JSON.stringify(result)) // "Some User token"
})

