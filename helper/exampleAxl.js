const axlModule = require('../main.js')
const flatten = require('flat').flatten

var settings = {
    version: '12.0',
    cucmip: '10.10.10.10',
    cucmuser: 'admin',
    cucmpass: 'password'
}

var dataObject = []

var service = axlModule(settings.version, settings.cucmip, settings.cucmuser, settings.cucmpass);
//SEP081735D5EFC0
service.getPhone('SEP112233445566').catch(err => {
    console.log(err)
}).then(function(result) {
    data = flatten(result['ns:getPhoneResponse']['return'])
    const return_json = Object.entries(data).reduce((obj, [ key, value ]) => {
        
        // Let check if multiple lines were returned
        if ('phone.lines.line.0.$.uuid' in data){
            sanitizedKey = key.replace(/[|_&;$%@%"<>+]/g, '').replace(/(phone)/g,'').replace(/(confidentialAccess.confidentialAccess)/g,'confidentialAccess').replace(/(lines.line)/g,'line_').replace(/\./g,'');
        }else{
            sanitizedKey = key.replace(/[|_&;$%@%"<>+]/g, '').replace(/(phone)/g,'').replace(/(confidentialAccess.confidentialAccess)/g,'confidentialAccess').replace(/(lines.line)/g,'line_0').replace(/\./g,'');
        }
        const objValue = obj[ sanitizedKey ]
        
        /* 
        Account for conflicting keys after santizing by grouping
        values in a nested array
        */
        if(objValue) {
          obj[ sanitizedKey ] = [value].concat(objValue)
        }
        else {
          obj[ sanitizedKey ] = value
        }
        
        return obj;
        
    }, {});

	
	var phone_json = require("/Users/jeremy/Documents/GitHub/betterbat/app/json/phonestructure.json")
	var line_json = require("/Users/jeremy/Documents/GitHub/betterbat/app/json/linestructure.json")

    var json_test = {}

    // Add the phone structure to a dataObject
    for (var prop in return_json) {
        for(var prop2 of phone_json){
            if (prop2['axlname'] == prop) {
				var key = prop2['data']
				json_test[key] = return_json[prop]
            }
        }
    }

    // Add the line structure to a dataObject
    for (var prop in return_json) {
        for(var prop2 of line_json){
            for (var i = 8; i >= 0; i--) {
                tmpKey = prop.replace('line_' + i,'line_')
                if (prop2['axlname'] == tmpKey) {
                    index = return_json['line_' + i + 'index']
                    var key = prop2['data']
                    if (index){
                        json_test[key + index] = return_json[prop]
                    }
                }
				
			}
        }
	}
	
	console.log(json_test)
})




