process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const restModule = require("../cupiRest.js");
const settings = {
    cucip: "10.10.20.18",
    cucuser: "administrator",
    cucpass: "ciscopsdt",
    greetingType: "Alternate",
    greetingName: "Opening Greeting",
    template: "voicemailusertemplate"
  };

const restObject = {
    "Alias": "wordenj",
    "FirstName": "Jeremy",
    "LastName": "Worden",
    "DisplayName": "Worden, Jeremy",
    "MailName": "wordenj",
    "DtmfAccessId": "1002"
}

restModule
  .fetchRest(
    settings.cucip,
    settings.cucuser,
    settings.cucpass,
    "POST",
    "application/json",
    `/vmrest/users?templateAlias=${settings.template}`,
    restObject
  )
  .catch((err) => {
    console.log(err)
  })
  .then(function (result) {
    console.log(result)
  });