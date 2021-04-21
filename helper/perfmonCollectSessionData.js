// https://community.cisco.com/t5/management/perfmon-cpu/td-p/3520648

const axlModule = require("../main.js");
const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

var settings = {
  version: "12.5",
  cucmip: "10.10.10.10",
  cucmuser: "administrator",
  cucmpass: "password",
};

var perfmonObject = "Processor";
var perfmonSessionID;
var perfmonCounterArr = [];

var service = axlModule(
  settings.version,
  settings.cucmip,
  settings.cucmuser,
  settings.cucmpass
);

  // BUILD ARRAY FOR COLLECT SESSION DATA
  var perfmonCounterData = service
    .getPerfmonCounterData(settings.cucmip, perfmonObject)
    .catch((err) => {
      console.log("perfmonCounterData: " + err);
    });

  perfmonCounterData.then(function (results) {
    // console.log("perfmonCounterData: " + JSON.stringify(results));
    results.forEach((element) => {
      perfmonCounterArr.push(
        element["NS1:NAME"].replace(/\\\\/g, "\\").replace(/^/, "\\")
      ); // Replace double backslash with single
    });
  });

  // OPEN SESSION

  var ciscoPerfmonSession = service.getPerfmonSession().catch((err) => {
    console.log("ciscoPerfmonSession: " + err);
  });

  ciscoPerfmonSession.then(function (result) {
    console.log("ciscoPerfmonSession: " + result);
    perfmonSessionID = result;

    // ADD COUNTERS

    var ciscoPerfmonAddCounter = service
      .addPerfmonCounter(perfmonSessionID, perfmonCounterArr)
      .catch((err) => {
        console.log("ciscoPerfmonAddCounterError: " + err);
        // Close session
        var ciscoClosePerfmonSession = service
          .closePerfmonSessionData(perfmonSessionID)
          .catch((err) => {
            console.log("ciscoClosePerfmonSessionError: " + err);
          });

        ciscoClosePerfmonSession.then(function (result) {
          console.log("ciscoClosePerfmonSession: " + JSON.stringify(result));
          process.exit(1);
        });
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

        console.log("Sleeping for 15000");
        sleep(15000).then(() => {
          // This will execute 15 seconds from now
          var ciscoPerfmonSessionData = service
            .getPerfmonSessionData(perfmonSessionID)
            .catch((err) => {
              console.log("ciscoPerfmonSessionErr: " + err);
            });

          ciscoPerfmonSessionData.then(function (result) {
            console.log("ciscoPerfmonSessionData: " + JSON.stringify(result));

            // Close session
            var ciscoClosePerfmonSession = service
              .closePerfmonSessionData(perfmonSessionID)
              .catch((err) => {
                console.log("ciscoClosePerfmonSessionError: " + err);
              });

            ciscoClosePerfmonSession.then(function (result) {
              console.log(
                "ciscoClosePerfmonSession: " + JSON.stringify(result)
              );
            });
          });
        });
      });
    });
  });

// // Run every 5 mins
// setInterval(function () {
//   // BUILD ARRAY FOR COLLECT SESSION DATA
//   var perfmonCounterData = service
//     .getPerfmonCounterData(settings.cucmip, perfmonObject)
//     .catch((err) => {
//       console.log("perfmonCounterData: " + err);
//     });

//   perfmonCounterData.then(function (results) {
//     // console.log("perfmonCounterData: " + JSON.stringify(results));
//     results.forEach((element) => {
//       perfmonCounterArr.push(
//         element["NS1:NAME"].replace(/\\\\/g, "\\").replace(/^/, "\\")
//       ); // Replace double backslash with single
//     });
//   });

//   // OPEN SESSION

//   var ciscoPerfmonSession = service.getPerfmonSession().catch((err) => {
//     console.log("ciscoPerfmonSession: " + err);
//   });

//   ciscoPerfmonSession.then(function (result) {
//     console.log("ciscoPerfmonSession: " + result);
//     perfmonSessionID = result;

//     // ADD COUNTERS

//     var ciscoPerfmonAddCounter = service
//       .addPerfmonCounter(perfmonSessionID, perfmonCounterArr)
//       .catch((err) => {
//         console.log("ciscoPerfmonAddCounterError: " + err);
//         // Close session
//         var ciscoClosePerfmonSession = service
//           .closePerfmonSessionData(perfmonSessionID)
//           .catch((err) => {
//             console.log("ciscoClosePerfmonSessionError: " + err);
//           });

//         ciscoClosePerfmonSession.then(function (result) {
//           console.log("ciscoClosePerfmonSession: " + JSON.stringify(result));
//           process.exit(1);
//         });
//       });

//     ciscoPerfmonAddCounter.then(function (result) {
//       console.log("ciscoPerfmonAddCounter: " + JSON.stringify(result));

//       var ciscoPerfmonSessionData = service
//         .getPerfmonSessionData(perfmonSessionID)
//         .catch((err) => {
//           console.log("ciscoPerfmonSessionErr: " + err);
//         });

//       ciscoPerfmonSessionData.then(function (result) {
//         console.log("ciscoPerfmonSessionData: " + JSON.stringify(result));

//         console.log("Sleeping for 15000");
//         sleep(15000).then(() => {
//           // This will execute 15 seconds from now
//           var ciscoPerfmonSessionData = service
//             .getPerfmonSessionData(perfmonSessionID)
//             .catch((err) => {
//               console.log("ciscoPerfmonSessionErr: " + err);
//             });

//           ciscoPerfmonSessionData.then(function (result) {
//             console.log("ciscoPerfmonSessionData: " + JSON.stringify(result));

//             // Close session
//             var ciscoClosePerfmonSession = service
//               .closePerfmonSessionData(perfmonSessionID)
//               .catch((err) => {
//                 console.log("ciscoClosePerfmonSessionError: " + err);
//               });

//             ciscoClosePerfmonSession.then(function (result) {
//               console.log(
//                 "ciscoClosePerfmonSession: " + JSON.stringify(result)
//               );
//             });
//           });
//         });
//       });
//     });
//   });
// }, 300000);
