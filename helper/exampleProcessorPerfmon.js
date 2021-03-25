// https://community.cisco.com/t5/management/perfmon-cpu/td-p/3520648

const axlModule = require("../main.js");

const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

var settings = {
  version: "12.5",
  cucmip: "192.168.1.230",
  cucmuser: "administrator",
  cucmpass: "h0mel@b",
};

var perfmonObject = "Processor";
var perfmonSessionID;

var service = axlModule(
  settings.version,
  settings.cucmip,
  settings.cucmuser,
  settings.cucmpass
);

// var perfmonCounterData = service
//   .getPerfmonCounterData(settings.cucmip, perfmonObject)
//   .catch((err) => {
//     console.log("perfmonCounterData: " + err);
//   });

// perfmonCounterData.then(function (result) {
//   console.log("perfmonCounterData: " + JSON.stringify(result)); // "Some User token"
// });

// var ciscoPerfmonListInstance = service
//   .listPerfmonInstance(settings.cucmip, perfmonObject)
//   .catch((err) => {
//     console.log("ciscoPerfmonListInstance: " + err);
//   });

// ciscoPerfmonListInstance.then(function (result) {
//   console.log("ciscoPerfmonListInstance: " + result); // "Some User token"
// });

// OPEN SESSION

var ciscoPerfmonSession = service.getPerfmonSession().catch((err) => {
  console.log("ciscoPerfmonSession: " + err);
});

ciscoPerfmonSession.then(function (result) {
  console.log("ciscoPerfmonSession: " + result); // "Some User token"
  perfmonSessionID = result

  // ADD COUNTER

  str = String.raw`\\192.168.1.230\Processor(_Total)\% CPU Time`; //

  var ciscoPerfmonAddCounter = service
    .addPerfmonCounter(perfmonSessionID, str)
    .catch((err) => {
      console.log("ciscoPerfmonAddCounterError: " + err);
    });

  ciscoPerfmonAddCounter.then(function (result) {
    console.log("ciscoPerfmonAddCounter: " + JSON.stringify(result));

    var ciscoPerfmonSessionData = service
      .getPerfmonSessionData(perfmonSessionID)
      .catch((err) => {
        console.log("ciscoPerfmonSessionErr: " + err);
      });

    ciscoPerfmonSessionData.then(function (result) {
      console.log("ciscoPerfmonSessionData: " + JSON.stringify(result));
    });

    sleep(15000).then(() => {
      // This will execute 15 seconds from now

      var ciscoPerfmonSessionData = service
        .getPerfmonSessionData(perfmonSessionID)
        .catch((err) => {
          console.log("ciscoPerfmonSessionErr: " + err);
        });

      ciscoPerfmonSessionData.then(function (result) {
        console.log("ciscoPerfmonSessionData: " + JSON.stringify(result));
      });
    });
  });
});
