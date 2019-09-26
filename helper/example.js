const axlModule = require('../main.js')

var settings = {
    version: '10.5',
    cucmip: '10.10.10.10',
    cucmuser: 'axluser',
    cucmpass: 'password'
}

var perfmonObject = 'Cisco SIP'
var perfmonSessionID;


var service = axlModule(settings.version, settings.cucmip, settings.cucmuser, settings.cucmpass);

var ciscoSipCounters = service.getPerfmonCounterData(settings.cucmip,perfmonObject).catch(err => {
    console.log('ciscoSipCounters: ' + err)
});

ciscoSipCounters.then(function(result) {
    console.log('ciscoSipCounters: ' + result) // "Some User token"
})

var ciscoPerfmonSession = service.getPerfmonSession().catch(err => {
    console.log('ciscoPerfmonSession: ' + err)
});

ciscoPerfmonSession.then(function(result) {
    console.log('ciscoPerfmonSession: ' + result) // "Some User token"
    perfmonSessionID = result
})

var ciscoPerfmonListInstance = service.listPerfmonInstance(settings.cucmip,perfmonObject).catch(err => {
    console.log('ciscoPerfmonListInstance: ' + err)
});

ciscoPerfmonListInstance.then(function(result) {
    console.log('ciscoPerfmonListInstance: ' + result) // "Some User token"
})

str = String.raw`\\10.10.10.10\Cisco CallManager\CallsActive` //

var ciscoPerfmonAddCounter = service.addPerfmonCounter('perfmonSessionID', str).catch(err => {
    console.log('ciscoPerfmonAddCounter: ' + err)
});

ciscoPerfmonAddCounter.then(function(result) {
    console.log('ciscoPerfmonAddCounter: ' + result) // "Some User token"
})

var ciscoPerfmonSessionData = service.getPerfmonSessionData(perfmonSessionID).catch(err => {
    console.log('ciscoPerfmonSessionData: ' + err)
});

ciscoPerfmonSessionData.then(function(result) {
    console.log('ciscoPerfmonSessionData: ' + result)
})