const axlModule = require('../main.js')

var settings = {
    version: '12.0',
    cucmip: '170.2.96.92',
    cucmuser: 'wordenj',
    cucmpass: 'Timbers2019!'
}


var service = axlModule(settings.version, settings.cucmip, settings.cucmuser, settings.cucmpass);
// Promise.map awaits for returned promises as well.
// var ciscoSipCounters = service.getPerfmonCounterData('170.2.96.92','Cisco SIP').catch(err => {
//     console.log(err)
// });

// ciscoSipCounters.then(function(result) {
//     console.log(result) // "Some User token"
// })

// var ciscoPerfmonSession = service.getPerfmonSession().catch(err => {
//     console.log(err)
// });

// ciscoPerfmonSession.then(function(result) {
//     console.log(result) // "Some User token"
// })

// var ciscoPerfmonListInstance = service.listPerfmonInstance('170.2.96.92','Cisco SIP').catch(err => {
//     console.log(err)
// });

// ciscoPerfmonListInstance.then(function(result) {
//     console.log(result) // "Some User token"
// })

// str = String.raw`\\170.2.96.93\Cisco SIP(MEX-SME-TRK1)\CallsActive` // "\\170.2.96.93\Cisco SIP(MEX-SME-TRK1)\CallsActive"

// var ciscoPerfmonAddCounter = service.addPerfmonCounter('e26cc072-de45-11e9-8000-005056a365be', str).catch(err => {
//     console.log(err)
// });

// ciscoPerfmonAddCounter.then(function(result) {
//     console.log(result) // "Some User token"
// })

// var ciscoPerfmonSessionData = service.getPerfmonSessionData('e26cc072-de45-11e9-8000-005056a365be').catch(err => {
//     console.log(err)
// });

// ciscoPerfmonSessionData.then(function(result) {
//     console.log(result)
// })

function getSessionData(){
    var ciscoSipCounters = service.getPerfmonCounterData('170.2.96.92','Cisco SIP').catch(err => {
        console.log(err)
    });

    ciscoSipCounters.then(function(result) {
        console.log(result) // "Some User token"
    })

    // call this function again in 10000ms
    setInterval(getSessionData, 15000);
}

getSessionData()