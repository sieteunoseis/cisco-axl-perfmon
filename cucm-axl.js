var util = require("util");
var https = require("https");
var parseString = require('xml2js').parseString;

// Excel Formula to create XML
// JSON name in A1
// XML tab in B1
//=CONCATENATE("(!jsonDATA.",SUBSTITUTE(LOWER(A1)," ","")," ? '' : '<",SUBSTITUTE(LOWER(B1)," ",""),">' + jsonDATA.",SUBSTITUTE(LOWER(A1)," ","")," + '</",SUBSTITUTE(LOWER(B1)," ",""),">') +")

function CucmSQLSession(cucmVersion, cucmServerUrl, cucmUser, cucmPassword) {
	this._version = {version:cucmVersion},
	this._OPTIONS =  {
	host: cucmServerUrl, // The IP Address of the Communications Manager Server
	port: 8443,          // Clearly port 8443 for AXL -- I think it's the default so could be removed
	path: '/axl/',       // This is the URL for accessing axl on the server
	method: 'POST',      // AXL Requires POST messages
	headers: {
		'SOAPAction': 'CUCM:DB ver=' + cucmVersion,
			'Authorization': 'Basic ' + Buffer.from(cucmUser + ":" + cucmPassword).toString('base64'), 
		'Content-Type': 'text/xml; charset=utf-8'
	},
	rejectUnauthorized: false          // required to accept self-signed certificate
	}
}

CucmSQLSession.prototype.query = function(SQL, callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:executeSQLQuery><sql>%s</sql></ns:executeSQLQuery></soapenv:Body></soapenv:Envelope>';
	var XML = util.format(XML_ENVELOPE, SQL);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']['ns:executeSQLQueryResponse']['return']['row']);    	
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addPhone = function(jsonDATA, callback) {
	// The user needs to make sure they are sending safe SQL to the communications manager.
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addPhone><phone>%s</phone></ns:addPhone></soapenv:Body></soapenv:Envelope>';
	
	var XML_BODY = (!jsonDATA.devicename ? '' : '<name>' + jsonDATA.devicename + '</name>' +
	(!jsonDATA.description ? '' : '<description>' + jsonDATA.description + '</description>') +
	(!jsonDATA.devicetype ? '' : '<product>' + jsonDATA.devicetype + '</product>') +
	'<class>Phone</class>' +
	(!jsonDATA.deviceprotocol ? '' : '<protocol>' + jsonDATA.deviceprotocol + '</protocol>') +
	'<protocolSide>User</protocolSide>' +
	'<callingSearchSpaceName>' + jsonDATA.css + '</callingSearchSpaceName>' +
	'<devicePoolName>' + jsonDATA.devicepool + '</devicePoolName>' +
	'<commonDeviceConfigName>' + jsonDATA.commondeviceconfiguration + '</commonDeviceConfigName>' +
	(!jsonDATA.commonphoneprofile ? '' : '<commonPhoneConfigName>' + jsonDATA.commonphoneprofile + '</commonPhoneConfigName>') +
	(!jsonDATA.location ? '' : '<locationName>' + jsonDATA.location + '</locationName>') +
	'<mediaResourceListName>' + jsonDATA.mediaresourcegrouplist + '</mediaResourceListName>' +
	'<networkHoldMohAudioSourceId>' + jsonDATA.networkholdmohaudiosource+ '</networkHoldMohAudioSourceId>' +
	'<userHoldMohAudioSourceId>' + jsonDATA.userholdmohaudiosource + '</userHoldMohAudioSourceId>' +
	'<automatedAlternateRoutingCssName>' + jsonDATA.aarcss + '</automatedAlternateRoutingCssName>' +
	(!jsonDATA.xml ? '' : '<vendorConfig>' + jsonDATA.xml + '</vendorConfig>') +
	'<mlppDomainId>' + jsonDATA.mlppdomain + '</mlppDomainId>' +
	(!jsonDATA.mlppindication ? '' : '<mlppIndicationStatus>' + jsonDATA.mlppindication + '</mlppIndicationStatus>') + 	
	(!jsonDATA.mlpppreemption ? '' : '<preemption>' + jsonDATA.mlpppreemption + '</preemption>') + 
	(!jsonDATA.usetrustedrelaypoint ? '' : '<useTrustedRelayPoint>' + jsonDATA.usetrustedrelaypoint + '</useTrustedRelayPoint>') +
	(!jsonDATA.retryvideocallasaudio  ? '' : '<retryVideoCallAsAudio>' + jsonDATA.retryvideocallasaudio + '</retryVideoCallAsAudio>') +
	'<securityProfileName>' + jsonDATA.devicesecurityprofile + '</securityProfileName>' +
	'<sipProfileName>' + jsonDATA.sipprofile + '</sipProfileName>' +
	'<cgpnTransformationCssName>'+jsonDATA.calleridcallingpartytransformationcss+'</cgpnTransformationCssName>' +
	(!jsonDATA.calleridusedevicepoolcallingpartytransformationcss ? '' :'<useDevicePoolCgpnTransformCss>'+jsonDATA.calleridusedevicepoolcallingpartytransformationcss+'</useDevicePoolCgpnTransformCss>') +
	(!jsonDATA.geolocation ? '' : '<geoLocationName>'+jsonDATA.geolocation+'</geoLocationName>') +
	'<aarNeighborhoodName>'+jsonDATA.aargroup+'</aarNeighborhoodName>' +
	'<phoneTemplateName>'+jsonDATA.phonebuttontemplate+'</phoneTemplateName>' +
	(!jsonDATA.deviceuserlocale ? '' : '<userLocale>'+jsonDATA.deviceuserlocale+'</userLocale>') +
	(!jsonDATA.networklocale ? '' : '<networkLocale>'+jsonDATA.networklocale+'</networkLocale>') +
	'<idleTimeout>'+jsonDATA.idletimer+'</idleTimeout>' +
	(!jsonDATA.authenticationserver ? '' : '<authenticationUrl>'+jsonDATA.authenticationserver+'</authenticationUrl>') +
	(!jsonDATA.directory ? '' : '<directoryUrl>'+jsonDATA.directory+'</directoryUrl>') +
	(!jsonDATA.idle ? '' : '<idleUrl>'+jsonDATA.idle+'</idleUrl>') +
	(!jsonDATA.information ? '' : '<informationUrl>'+jsonDATA.information+'</informationUrl>') +
	(!jsonDATA.messages ? '' : '<messagesUrl>'+jsonDATA.messages+'</messagesUrl>') +
	(!jsonDATA.proxyserver ? '' : '<proxyServerUrl>'+jsonDATA.proxyserver+'</proxyServerUrl>') +
	(!jsonDATA.services ? '' : '<servicesUrl>'+jsonDATA.services+'</servicesUrl>') +
	'<softkeyTemplateName>'+jsonDATA.softkeytemplate+'</softkeyTemplateName>' +
	(!jsonDATA.module1 ? '' : '<addOnModules>') +
	(!jsonDATA.module1 ? '' : '<addOnModule><loadInformation></loadInformation><model>'+ jsonDATA.module1 +'</model><index>1</index></addOnModule>') +
	(!jsonDATA.module2 ? '' : '<addOnModule><loadInformation></loadInformation><model>'+ jsonDATA.module2 +'</model><index>2</index></addOnModule>') +
	(!jsonDATA.module1 ? '' : '</addOnModules>') +
	(!jsonDATA.extensionmobility ? '' : '<enableExtensionMobility>'+jsonDATA.extensionmobility+'</enableExtensionMobility>') +
	(!jsonDATA.builtinbridge ? '' : '<builtInBridgeStatus>'+jsonDATA.builtinbridge+'</builtInBridgeStatus>') +
	(!jsonDATA.privacy ? '' : '<callInfoPrivacyStatus>'+jsonDATA.privacy+'</callInfoPrivacyStatus>') + 
	'<ownerUserName>'+jsonDATA.owneruserid+'</ownerUserName>' +
	(!jsonDATA.ignorepresentationindicators ? '' : '<ignorePresentationIndicators>'+jsonDATA.ignorepresentationindicators+'</ignorePresentationIndicators>') +
	(!jsonDATA.packetcapturemode ? '' : '<packetCaptureMode>'+jsonDATA.packetcapturemode+'</packetCaptureMode>') +
	(!jsonDATA.packetcaptureduration ? '' : '<packetCaptureDuration>'+jsonDATA.packetcaptureduration+'</packetCaptureDuration>') +
	'<subscribeCallingSearchSpaceName>'+jsonDATA.devicesubscribecss+'</subscribeCallingSearchSpaceName>' +
	'<rerouteCallingSearchSpaceName>'+jsonDATA.reroutingcallingsearchspace+'</rerouteCallingSearchSpaceName>' +
	(!jsonDATA.allowcticontrolflag ? '' : '<allowCtiControlFlag>'+jsonDATA.allowcticontrolflag+'</allowCtiControlFlag>') +
	(!jsonDATA.devicepresencegroup ? '' : '<presenceGroupName>'+jsonDATA.devicepresencegroup+'</presenceGroupName>') +
	(!jsonDATA.unattendedport ? '' : '<unattendedPort>'+jsonDATA.unattendedport+'</unattendedPort>') +
	(!jsonDATA.requiredtmfreception ? '' : '<requireDtmfReception>'+jsonDATA.requiredtmfreception+'</requireDtmfReception>') +
	(!jsonDATA.rfc2833disabled ? '' : '<rfc2833Disabled>'+jsonDATA.rfc2833disabled+'</rfc2833Disabled>') + 
	(!jsonDATA.devicemobilitymode ? '' : '<deviceMobilityMode>'+jsonDATA.devicemobilitymode+'</deviceMobilityMode>') +
	(!jsonDATA.remotedevice ? '' : '<remoteDevice>'+jsonDATA.remotedevice+'</remoteDevice>') +
	(!jsonDATA.dndoption ? '' : '<dndOption>'+jsonDATA.dndoption+'</dndOption>') +
	'<dndRingSetting>'+jsonDATA.dndincomingcallalert+'</dndRingSetting>' +
	(!jsonDATA.donotdisturb ? '' : '<dndStatus>'+jsonDATA.donotdisturb+'</dndStatus>') +
	(!jsonDATA.blfaudiblealertsettingphonebusy ? '' : '<ringSettingBusyBlfAudibleAlert>'+jsonDATA.blfaudiblealertsettingphonebusy+'</ringSettingBusyBlfAudibleAlert>') +
	(!jsonDATA.blfaudiblealertsettingphoneidle ? '' : '<ringSettingIdleBlfAudibleAlert>'+jsonDATA.blfaudiblealertsettingphoneidle+'</ringSettingIdleBlfAudibleAlert>') +
	(!jsonDATA.protecteddevice ? '' : '<isProtected>'+jsonDATA.protecteddevice+'</isProtected>')+
	(!jsonDATA.phonepersonalization ? '' : '<phoneSuite>'+jsonDATA.phonepersonalization+'</phoneSuite>') +
	(!jsonDATA.servicesprovisioning ? '' : '<phoneServiceDisplay>'+jsonDATA.servicesprovisioning+'</phoneServiceDisplay>') +
	'<mobilityUserIdName>'+jsonDATA.mobilityuserid+'</mobilityUserIdName>' +
	(!jsonDATA.mtprequired ? '' : '<mtpRequired>'+jsonDATA.mtprequired+'</mtpRequired>') +
	(!jsonDATA.mtppreferredoriginatingcodec ? '' : '<mtpPreferedCodec>'+jsonDATA.mtppreferredoriginatingcodec+'</mtpPreferedCodec>') +
	(!jsonDATA.secureshelluser ? '' :  '<sshUserId>'+jsonDATA.secureshelluser+'</sshUserId>') +
	(!jsonDATA.secureshellpassword ? '' : '<sshPwd>'+jsonDATA.secureshellpassword+'</sshPwd>') +
	'<dialRulesName>'+jsonDATA.dialrules+'</dialRulesName>' +
	(!jsonDATA.digestuser ? '' : '<digestUser>'+jsonDATA.digestuser+'</digestUser>') +
	(!jsonDATA.outboundcallrollover ? '' : '<outboundCallRollover>'+jsonDATA.outboundcallrollover+'</outboundCallRollover>') +
	(!jsonDATA.hotlinedevice ? '' : '<hotlineDevice>'+jsonDATA.hotlinedevice+'</hotlineDevice>') +
	(!jsonDATA.secureinformationurl ? '' : '<secureInformationUrl>'+jsonDATA.secureinformationurl+'</secureInformationUrl>') +
	(!jsonDATA.securedirectoryurl ? '': '<secureDirectoryUrl>'+jsonDATA.securedirectoryurl+'</secureDirectoryUrl>') +
	(!jsonDATA.securemessageurl ? '' : '<secureMessageUrl>'+jsonDATA.securemessageurl+'</secureMessageUrl>') +
	(!jsonDATA.secureservicesurl ? '' : '<secureServicesUrl>'+jsonDATA.secureservicesurl+'</secureServicesUrl>') +
	(!jsonDATA.secureauthenticationurl ? '' : '<secureAuthenticationUrl>'+jsonDATA.secureauthenticationurl+'</secureAuthenticationUrl>') +
	(!jsonDATA.secureidleurl ? '' : '<secureIdleUrl>'+jsonDATA.secureidleurl+'</secureIdleUrl>') +
	(!jsonDATA.alwaysuseprimeline ? '' : '<alwaysUsePrimeLine>'+jsonDATA.alwaysuseprimeline+'</alwaysUsePrimeLine>') +
	(!jsonDATA.alwaysuseprimelineforvoicemessage ? '' : '<alwaysUsePrimeLineForVoiceMessage>'+jsonDATA.alwaysuseprimelineforvoicemessage+'</alwaysUsePrimeLineForVoiceMessage>') +
	'<featureControlPolicy>'+jsonDATA.featurecontrolpolicy+'</featureControlPolicy>' +
	(!jsonDATA.thirdpartyregistrationrequired ? '' : '<requireThirdPartyRegistration>'+jsonDATA.thirdpartyregistrationrequired+'</requireThirdPartyRegistration>') +
	(!jsonDATA.blockincomingcallswhileroaming ? '' : '<blockIncomingCallsWhenRoaming>'+jsonDATA.blockincomingcallswhileroaming+'</blockIncomingCallsWhenRoaming>') +
	(!jsonDATA.homenetworkid ? '' : '<homeNetworkId>'+jsonDATA.homenetworkid+'</homeNetworkId>') +
	(!jsonDATA.allowpresentationsharingusingbfcp ? '' : '<AllowPresentationSharingUsingBfcp>'+jsonDATA.allowpresentationsharingusingbfcp+'</AllowPresentationSharingUsingBfcp>') +	
	(!jsonDATA.confidentialaccessmode  ?  ''  : '<confidentialAccess><confidentialAccessLevel>'+jsonDATA.confidentialaccesslevel +'</confidentialAccessLevel><confidentialAccessMode>' + jsonDATA.confidentialaccessmode + '</confidentialAccessMode></confidentialAccess>') +
	(!jsonDATA.requireoffpremiselocation ? '' : '<requireOffPremiseLocation>'+jsonDATA.requireoffpremiselocation+'</requireOffPremiseLocation>') +
	(!jsonDATA.allowixapplicablemedia ? '' : '<allowiXApplicableMedia>'+jsonDATA.allowixapplicablemedia+'</allowiXApplicableMedia>') +
	'<wifiHotspotProfile>'+jsonDATA.wifihotspotprofile+'</wifiHotspotProfile>' +
	'<wirelessLanProfileGroup>'+jsonDATA.wirelesslanprofilegroup+'</wirelessLanProfileGroup>')
	
	var XML_SPEEDDIAL_ENVELOPE = '<speeddials>%s</speeddials>';
	var XML_SPEEDDIAL_BODY = '';
	
	for (i = 1; i <= supportedSpeedDials; i++) {
		XML_SPEEDDIAL_BODY += (!jsonDATA['speeddialnumber' + i] && !jsonDATA['speeddiallabel' + i] ? '' : '<speeddial>' +
				'<dirn>'+jsonDATA['speeddialnumber' + i]+'</dirn>' +
				'<label>'+jsonDATA['speeddiallabel' + i]+'</label>' +
				'<index>'+i+'</index>' +
				'</speeddial>')
	}
	
	var XML_SPEEDDIAL = util.format(XML_SPEEDDIAL_ENVELOPE, XML_SPEEDDIAL_BODY);
	
	var XML_LINES_ENVELOPE = '<lines>%s</lines>';
	var XML_LINES_BODY = '';
		
	for (i = 1; i <= supportedLines; i++) {
		XML_LINES_BODY += (!jsonDATA['directorynumber' + i] ? '' : '<line ctiid="?">' +
			'<index>'+i+'</index>' +
			'<label>'+jsonDATA['linetextlabel' + i]+'</label>' +
			'<display>'+jsonDATA['display' + i]+'</display>' +
			'<dirn ctiid="?">' +
				'<pattern>'+jsonDATA['directorynumber' + i]+'</pattern>' +
				(!jsonDATA['routepartition' + i] ? '' : '<routePartitionName uuid="?">'+jsonDATA['routepartition' + i]+'</routePartitionName>') +
			'</dirn>' +
			'<ringSetting>'+jsonDATA['ringsettingphoneidle' + i]+'</ringSetting>' +
			'<consecutiveRingSetting>'+jsonDATA['ringsettingphoneactive' + i]+'</consecutiveRingSetting>' +
			'<ringSettingIdlePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneidle' + i]+'</ringSettingIdlePickupAlert>' +
			'<ringSettingActivePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneactive' + i]+'</ringSettingActivePickupAlert>' +
			'<displayAscii>'+jsonDATA['asciidisplay' + i]+'</displayAscii>' +
			'<e164Mask>'+jsonDATA['externalphonenumbermask' + i]+'</e164Mask>' +
			'<mwlPolicy>'+jsonDATA['visualmessagewaitingindicatorpolicy' + i]+'</mwlPolicy>' +
			'<maxNumCalls>'+jsonDATA['maximumnumberofcalls' + i]+'</maxNumCalls>' +
			'<busyTrigger>'+jsonDATA['busytrigger' + i]+'</busyTrigger>' +
			'<callInfoDisplay>' +
				'<callerName>'+jsonDATA['callername' + i]+'</callerName>' +
				'<callerNumber>'+jsonDATA['callernumber' + i]+'</callerNumber>' +
				'<redirectedNumber>'+jsonDATA['redirectednumber' + i]+'</redirectedNumber>' +
				'<dialedNumber>'+jsonDATA['dialednumber' + i]+'</dialedNumber>' +
			'</callInfoDisplay>' +
			'<recordingProfileName>'+jsonDATA['recordingprofile' + i]+'</recordingProfileName>' +
			'<monitoringCssName>'+jsonDATA['monitoringcallingsearchspace' + i]+'</monitoringCssName>' +
			'<recordingFlag>'+jsonDATA['recordingoption' + i]+'</recordingFlag>' +
			'<audibleMwi>'+jsonDATA['audiblemessagewaitingindicatorpolicy' + i]+'</audibleMwi>' +
			'<speedDial></speedDial>' +
			'<partitionUsage>General</partitionUsage>' +
			'<associatedEndusers></associatedEndusers>' +
			(!jsonDATA['logmissedcalls' + i] ? '' : '<missedCallLogging>'+jsonDATA['logmissedcalls' + i]+'</missedCallLogging>') +
			'<recordingMediaSource>'+jsonDATA['recordingmediasource' + i]+'</recordingMediaSource>' +
			'</line>')
	}
		
	var XML_LINES = util.format(XML_LINES_ENVELOPE, XML_LINES_BODY);
	
	XML_BODY += XML_LINES + XML_SPEEDDIAL

	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addPhone'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					
					try {
						callback(null, result['soapenv:Body']);  	
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addLine = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addLine><line>%s</line></ns:addLine></soapenv:Body></soapenv:Envelope>';
	
	var XML_BODY = (!jsonDATA.directorynumber ? '' : '<active>true</active>' +
	'<pattern>'+jsonDATA.directorynumber+'</pattern>' +
	'<routePartitionName>'+jsonDATA.routepartition+'</routePartitionName>' +
	'<shareLineAppearanceCssName>'+jsonDATA.linecss+'</shareLineAppearanceCssName>' +
	'<voiceMailProfileName>'+jsonDATA.voicemailprofile+'</voiceMailProfileName>' +
	'<aarDestinationMask>'+jsonDATA.aardestinationmask+'</aarDestinationMask>' +
	(!jsonDATA.retainthisdestinationincallforwardinghistory ? '' : '<aarKeepCallHistory>'+jsonDATA.retainthisdestinationincallforwardinghistory+'</aarKeepCallHistory>') +
	'<aarNeighborhoodName>'+jsonDATA.aargroupline+'</aarNeighborhoodName>' +
	(!jsonDATA.aarvoicemail ? '' : '<aarVoiceMailEnabled>'+jsonDATA.aarvoicemail+'</aarVoiceMailEnabled>') +
	(!jsonDATA.alertingname ? '' : '<alertingName>'+jsonDATA.alertingname+'</alertingName>') +
	(!jsonDATA.allowcontrolofdevicefromcti ? '' : '<allowCtiControlFlag>'+jsonDATA.allowcontrolofdevicefromcti+'</allowCtiControlFlag>') +
	(!jsonDATA.asciialertingname ? '' : '<asciiAlertingName>'+jsonDATA.asciialertingname+'</asciiAlertingName>') +
	(!jsonDATA.autoanswer ? '' : '<autoAnswer>'+jsonDATA.autoanswer+'</autoAnswer>') +
	(!jsonDATA.callcontrolagentprofile ? '' : '<callControlAgentProfile>'+jsonDATA.callcontrolagentprofile+'</callControlAgentProfile>') +
	'<callForwardAll>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardallcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardalldestination+'</destination>' +
		(!jsonDATA.forwardallvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardallvoicemail+'</forwardToVoiceMail>') +
		'<secondaryCallingSearchSpaceName>'+jsonDATA.secondarycssforforwardall+'</secondaryCallingSearchSpaceName>' +
	'</callForwardAll>' +
		'<callForwardAlternateParty>' +
		'<callingSearchSpaceName></callingSearchSpaceName>' +
		'<destination />' +
		'<duration />' +
		'<forwardToVoiceMail />' +
	'</callForwardAlternateParty>' +
	'<callForwardBusy>' +
		(!jsonDATA.forwardbusyexternalcss ? '' : '<callingSearchSpaceName>'+jsonDATA.forwardbusyexternalcss+'</callingSearchSpaceName>') +
		(!jsonDATA.forwardbusyexternaldestination ? '' : '<destination>'+jsonDATA.forwardbusyexternaldestination+'</destination>') +
		(!jsonDATA.forwardbusyexternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardbusyexternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardBusy>' +
	'<callForwardBusyInt>' +
		(!jsonDATA.forwardbusyinternalcss ? '' : '<callingSearchSpaceName>'+jsonDATA.forwardbusyinternalcss+'</callingSearchSpaceName>') +
		(!jsonDATA.forwardbusyinternaldestination ? '' : '<destination>'+jsonDATA.forwardbusyinternaldestination+'</destination>') +
		(!jsonDATA.forwardbusyinternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardbusyinternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardBusyInt>' +
	'<callForwardNoAnswer>' +
		(!jsonDATA.forwardnoanswerexternalcss ? '' : '<callingSearchSpaceName>'+jsonDATA.forwardnoanswerexternalcss+'</callingSearchSpaceName>') +
		(!jsonDATA.forwardnoanswerexternaldestination ? '' : '<destination>'+jsonDATA.forwardnoanswerexternaldestination+'</destination>') +
		(!jsonDATA.forwardnoanswerringduration ? '' : '<duration>'+jsonDATA.forwardnoanswerringduration+'</duration>') +
		(!jsonDATA.forwardnoanswerexternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardnoanswerexternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardNoAnswer>' +
		'<callForwardNoAnswerInt>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardnoanswerinternalcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardnoanswerinternaldestination+'</destination>' +
		'<duration>'+jsonDATA.forwardnoanswerringduration+'</duration>' +
		(!jsonDATA.forwardnoanswerinternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardnoanswerinternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardNoAnswerInt>' +
	'<callForwardNoCoverage>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardnocoverageexternalcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardnocoverageexternaldestination+'</destination>' +
		(!jsonDATA.forwardnocoverageexternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardnocoverageexternalvoicemail+'</forwardToVoiceMail>')+
	'</callForwardNoCoverage>' +
	'<callForwardNoCoverageInt>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardnocoverageinternalcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardnocoverageinternaldestination+'</destination>' +
		(!jsonDATA.forwardnocoverageinternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardnocoverageinternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardNoCoverageInt>' +
	'<callForwardNotRegistered>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardunregisteredexternalcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardunregisteredexternaldestination+'</destination>' +
		(!jsonDATA.forwardunregisteredexternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardunregisteredexternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardNotRegistered>' +
	'<callForwardNotRegisteredInt>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardunregisteredinternalcss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardunregisteredinternaldestination+'</destination>' +
		(!jsonDATA.forwardunregisteredinternalvoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardunregisteredinternalvoicemail+'</forwardToVoiceMail>') +
	'</callForwardNotRegisteredInt>' +
		'<callForwardOnFailure>' +
		'<callingSearchSpaceName>'+jsonDATA.forwardonctifailurecss+'</callingSearchSpaceName>' +
		'<destination>'+jsonDATA.forwardonctifailuredestination+'</destination>' +
		(!jsonDATA.forwardonctifailurevoicemail ? '' : '<forwardToVoiceMail>'+jsonDATA.forwardonctifailurevoicemail+'</forwardToVoiceMail>') +
	'</callForwardOnFailure>' +
	(!jsonDATA.callpickupgroup ? '' : '<callPickupGroupName>'+jsonDATA.callpickupgroup+'</callPickupGroupName>') +
	(!jsonDATA.callingsearchspaceactivationpolicy ? '' : '<cfaCssPolicy>'+jsonDATA.callingsearchspaceactivationpolicy+'</cfaCssPolicy>') +
	( !jsonDATA.lineconfidentialaccessmode  ?  ''  : '<confidentialAccess><confidentialAccessLevel>'+jsonDATA.lineconfidentialaccesslevel +'</confidentialAccessLevel><confidentialAccessMode>' + jsonDATA.lineconfidentialaccessmode + '</confidentialAccessMode></confidentialAccess>') +
	'<defaultActivatedDeviceName></defaultActivatedDeviceName>' +
	(!jsonDATA.linedescription ? '' : '<description>'+jsonDATA.linedescription+'</description>') +
	'<directoryURIs>' +
	(!jsonDATA.uri1ondirectorynumber ? '' : '<directoryUri>' +
		'<advertiseGloballyViaIls>'+jsonDATA.uri1advertisegloballyviails+'</advertiseGloballyViaIls>' +
		'<isPrimary>'+jsonDATA.uri1isprimaryondirectorynumber+'</isPrimary>' +
		'<partition>'+jsonDATA.uri1routepartitionondirectorynumber+'</partition>' +
		'<uri>'+jsonDATA.uri1ondirectorynumber+'</uri>' +
		'</directoryUri>') +
	(!jsonDATA.uri2ondirectorynumber ? '' : '<directoryUri>' +
		'<advertiseGloballyViaIls>'+jsonDATA.uri2advertisegloballyviails+'</advertiseGloballyViaIls>' +
		'<isPrimary>'+jsonDATA.uri2isprimaryondirectorynumber+'</isPrimary>' +
		'<partition>'+jsonDATA.uri2routepartitionondirectorynumber+'</partition>' +
		'<uri>'+jsonDATA.uri2ondirectorynumber+'</uri>' +
		'</directoryUri>') +
	(!jsonDATA.uri3ondirectorynumber ? '' : '<directoryUri>' +
		'<advertiseGloballyViaIls>'+jsonDATA.uri3advertisegloballyviails+'</advertiseGloballyViaIls>' +
		'<isPrimary>'+jsonDATA.uri3isprimaryondirectorynumber+'</isPrimary>' +
		'<partition>'+jsonDATA.uri3routepartitionondirectorynumber+'</partition>' +
		'<uri>'+jsonDATA.uri3ondirectorynumber+'</uri>' +
		'</directoryUri>') +	
	(!jsonDATA.uri4ondirectorynumber ? '' : '<directoryUri>' +
		'<advertiseGloballyViaIls>'+jsonDATA.uri4advertisegloballyviails+'</advertiseGloballyViaIls>' +
		'<isPrimary>'+jsonDATA.uri4isprimaryondirectorynumber+'</isPrimary>' +
		'<partition>'+jsonDATA.uri4routepartitionondirectorynumber+'</partition>' +
		'<uri>'+jsonDATA.uri4ondirectorynumber+'</uri>' +
		'</directoryUri>') +
	(!jsonDATA.uri5ondirectorynumber ? '' : '<directoryUri>' +
		'<advertiseGloballyViaIls>'+jsonDATA.uri5advertisegloballyviails+'</advertiseGloballyViaIls>' +
		'<isPrimary>'+jsonDATA.uri5isprimaryondirectorynumber+'</isPrimary>' +
		'<partition>'+jsonDATA.uri5routepartitionondirectorynumber+'</partition>' +
		'<uri>'+jsonDATA.uri5ondirectorynumber+'</uri>' +
		'</directoryUri>') +
	'</directoryURIs>' +
	'<e164AltNum>' +
		(!jsonDATA.e164addtolocalroutepartition ? '' : '<addLocalRoutePartition>'+jsonDATA.e164addtolocalroutepartition+'</addLocalRoutePartition>') +
		(!jsonDATA.e164advertiseviaglobally ? '' : '<advertiseGloballyIls>'+jsonDATA.e164advertiseviaglobally+'</advertiseGloballyIls>') +
		(!jsonDATA.e164isurgent ? '' : '<isUrgent>'+jsonDATA.e164isurgent+'</isUrgent>') +
		'<numMask>'+jsonDATA.e164numbermask+'</numMask>' +
		'<routePartition>'+jsonDATA.e164routepartition+'</routePartition>' +
	'</e164AltNum>' +
	'<enterpriseAltNum>' +
		(!jsonDATA.enterpriseaddtolocalroutepartition ? '' : '<addLocalRoutePartition>'+jsonDATA.enterpriseaddtolocalroutepartition+'</addLocalRoutePartition>') +
		(!jsonDATA.enterpriseadvertiseviaglobally ? '' : '<advertiseGloballyIls>'+jsonDATA.enterpriseadvertiseviaglobally+'</advertiseGloballyIls>') +
		(!jsonDATA.enterpriseisurgent ? '' : '<isUrgent>'+jsonDATA.enterpriseisurgent+'</isUrgent>') +
		'<numMask>'+jsonDATA.enterprisenumbermask+'</numMask>' +
		'<routePartition>'+jsonDATA.enterpriseroutepartition+'</routePartition>' +
	'</enterpriseAltNum>' +
	'<externalCallControlProfile>'+jsonDATA.externalcallcontrolprofile+'</externalCallControlProfile>' +
	'<hrDuration>'+jsonDATA.holdreversionringduration+'</hrDuration>' +
	'<hrInterval>'+jsonDATA.holdreversionnotificationinterval+'</hrInterval>' +
	'<networkHoldMohAudioSourceId>'+jsonDATA.linenetworkholdmohaudiosource+'</networkHoldMohAudioSourceId>' +
	'<parkMonForwardNoRetrieveCssName>'+jsonDATA.parkmonitorforwardnoretrieveextcss+'</parkMonForwardNoRetrieveCssName>' +
	'<parkMonForwardNoRetrieveDn>'+jsonDATA.parkmonitorforwardnoretrieveextdestination+'</parkMonForwardNoRetrieveDn>' +
	'<parkMonForwardNoRetrieveIntCssName>'+jsonDATA.parkmonitorforwardnoretrieveintcss+'</parkMonForwardNoRetrieveIntCssName>' +
	'<parkMonForwardNoRetrieveIntDn>'+jsonDATA.parkmonitorforwardnoretrieveintdestination+'</parkMonForwardNoRetrieveIntDn>' +
	(!jsonDATA.parkmonitorforwardnoretrieveintvoicemail ? '' : '<parkMonForwardNoRetrieveIntVmEnabled>'+jsonDATA.parkmonitorforwardnoretrieveintvoicemail+'</parkMonForwardNoRetrieveIntVmEnabled>') +
	(!jsonDATA.parkmonitorforwardnoretrieveintvoicemail ? '' : '<parkMonForwardNoRetrieveVmEnabled>'+jsonDATA.parkmonitorforwardnoretrieveextvoicemail+'</parkMonForwardNoRetrieveVmEnabled>') +
	'<parkMonReversionTimer>'+jsonDATA.parkmonitoringreversiontimer+'</parkMonReversionTimer>' +
	(!jsonDATA.partyentrancetone ? '' : '<partyEntranceTone>'+jsonDATA.partyentrancetone+'</partyEntranceTone>') +
	'<patternPrecedence>Default</patternPrecedence>' +
	'<patternUrgency>'+jsonDATA.urgentpriority+'</patternUrgency>' +
	(!jsonDATA.linepresencegroup ? '' : '<presenceGroupName>'+jsonDATA.linepresencegroup+'</presenceGroupName>') +
	'<pstnFailover />' +
	(!jsonDATA.rejectanonymouscalls ? '' : '<rejectAnonymousCall>'+jsonDATA.rejectanonymouscalls+'</rejectAnonymousCall>') +
	'<releaseClause>No Error</releaseClause>' +
	'<usage>Device</usage>' +
	'<useE164AltNum>'+jsonDATA.ise164advertisedfailovernumber+'</useE164AltNum>' +
	'<useEnterpriseAltNum>'+jsonDATA.isenterpriseadvertisedfailovernumber+'</useEnterpriseAltNum>' +
	'<userHoldMohAudioSourceId>'+jsonDATA.lineuserholdmohaudiosource+'</userHoldMohAudioSourceId>')
	
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addLine'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addUser = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addUser><user>%s</user></ns:addUser></soapenv:Body></soapenv:Envelope>'

	var XML_BODY = (!jsonDATA.userid ? '' : '<userid>' + jsonDATA.userid + '</userid>' +
	(!jsonDATA.firstname ? '' : '<firstName>' + jsonDATA.firstname + '</firstName>') +
	(!jsonDATA.displayname ? '' : '<displayName>' + jsonDATA.displayname + '</displayName>') +
	(!jsonDATA.middlename ? '' : '<middleName>' + jsonDATA.middlename + '</middleName>') +
	(!jsonDATA.lastname ? '' : '<lastName>' + jsonDATA.lastname + '</lastName>') +
	(!jsonDATA.password ? '' : '<password>' + jsonDATA.password  + '</password>') +
	(!jsonDATA.pin ? '' : '<pin>' + jsonDATA.pin + '</pin>') +
	(!jsonDATA.mailid ? '' : '<mailid>' + jsonDATA.mailid  + '</mailid>') +
	(!jsonDATA.department ? '' : '<department>' + jsonDATA.department + '</department>') +
	(!jsonDATA.manageruserid ? '' : '<manager>' + jsonDATA.manageruserid + '</manager>') +
	(!jsonDATA.userlocale ? '' : '<userLocale>' + jsonDATA.userlocale  + '</userLocale>') +
	(!jsonDATA.controlleddevice1 ? '' : '<associatedDevices>') +
	(!jsonDATA.controlleddevice1 ? '' : '<device>' + jsonDATA.controlleddevice1 + '</device>') +
	(!jsonDATA.controlleddevice1 ? '' : '</associatedDevices>') +
	(!jsonDATA.primaryextension ? '' : '<primaryExtension>') +
	(!jsonDATA.primaryextension ? '' : '<pattern>' + jsonDATA.primaryextension.split(" ")[0] + '</pattern>') +
	(!jsonDATA.primaryextension ? '' : '<routePartitionName>' + jsonDATA.primaryextension.split(" ")[2] + '</routePartitionName>') +
	(!jsonDATA.primaryextension ? '' : '</primaryExtension>') +
	(!jsonDATA.associatedpc ? '' : '<associatedPc>' + jsonDATA.associatedpc + '</associatedPc>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<associatedGroups>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<userGroup>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<name>' + jsonDATA.accesscontrolgroup1 + '</name>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '</userGroup>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '</associatedGroups>') +
	(!jsonDATA.controlledprofile1 ? '' : '<associatedRemoteDestinationProfiles>') +
	(!jsonDATA.controlledprofile1 ? '' : '<remoteDestinationProfile>' + jsonDATA.controlledprofile1 + '</remoteDestinationProfile>') +
	(!jsonDATA.controlledprofile1 ? '' : '</associatedRemoteDestinationProfiles>') +
	(!jsonDATA.allowcontrolofdevicefromcti ? '' : '<enableCti>' + jsonDATA.allowcontrolofdevicefromcti + '</enableCti>') +
	(!jsonDATA.digestcredentials ? '' : '<digestCredentials>' + jsonDATA.digestcredentials + '</digestCredentials>') +
	(!jsonDATA.defaultprofile ? '' : '<phoneProfiles><profileName>' + jsonDATA.defaultprofile + '</profileName></phoneProfiles>') +
	(!jsonDATA.defaultprofile ? '' : '<defaultProfile>' + jsonDATA.defaultprofile + '</defaultProfile>') +
	(!jsonDATA.presencegroup ? '' : '<presenceGroupName>' + jsonDATA.presencegroup + '</presenceGroupName>') +
	(!jsonDATA.subscribecallingsearchspace ? '' : '<subscribeCallingSearchSpaceName>' + jsonDATA.subscribecallingsearchspace + '</subscribeCallingSearchSpaceName>') +
	(!jsonDATA.enablemobility ? '' : '<enableMobility>'+jsonDATA.enablemobility+'</enableMobility>') +
	(!jsonDATA.enablemobilevoiceaccess ? '' : '<enableMobileVoiceAccess>'+jsonDATA.enablemobilevoiceaccess+'</enableMobileVoiceAccess>') +
	(!jsonDATA.maximumwaittimefordeskpickup ? '' : '<maxDeskPickupWaitTime>' + jsonDATA.maximumwaittimefordeskpickup + '</maxDeskPickupWaitTime>') +
	(!jsonDATA.remotedestinationlimit ? '' : '<remoteDestinationLimit>'+jsonDATA.remotedestinationlimit+'</remoteDestinationLimit>') +
	'<passwordCredentials>' +
	(!jsonDATA.passwordauthenticationrule ? '' : '<pwdCredPolicyName>' + jsonDATA.passwordauthenticationrule + '</pwdCredPolicyName>') +
	(!jsonDATA.passwordcantchange ? '' : '<pwdCredUserCantChange>' + jsonDATA.passwordcantchange + '</pwdCredUserCantChange>') +
	(!jsonDATA.passwordmustchangeatnextlogin ? '' : '<pwdCredUserMustChange>' + jsonDATA.passwordmustchangeatnextlogin + '</pwdCredUserMustChange>') +
	(!jsonDATA.passworddoesnotexpire ? '' : '<pwdCredDoesNotExpire>' + jsonDATA.passworddoesnotexpire + '</pwdCredDoesNotExpire>') +
	(!jsonDATA.passwordlockedbyadmin ? '' : '<pwdCredLockedByAdministrator>' + jsonDATA.passwordlockedbyadmin + '</pwdCredLockedByAdministrator>') +
	'</passwordCredentials>' +
	'<pinCredentials>' +
	(!jsonDATA.pinauthenticationrule ? '' : '<pinCredPolicyName>' + jsonDATA.pinauthenticationrule + '</pinCredPolicyName>') +
	(!jsonDATA.pincantchange ? '' : '<pinCredUserCantChange>' + jsonDATA.pincantchange + '</pinCredUserCantChange>') +
	(!jsonDATA.pinmustchangeatnextlogin ? '' : '<pinCredUserMustChange>' + jsonDATA.pinmustchangeatnextlogin + '</pinCredUserMustChange>') +
	(!jsonDATA.pindoesnotexpire ? '' : '<pinCredDoesNotExpire>' + jsonDATA.pindoesnotexpire + '</pinCredDoesNotExpire>') +
	(!jsonDATA.pinlockedbyadmin ? '' : '<pinCredLockedByAdministrator>' + jsonDATA.pinlockedbyadmin + '</pinCredLockedByAdministrator>') +
	'</pinCredentials>' +
	(!jsonDATA.enableemcc ? '' : '<enableEmcc>' + jsonDATA.enableemcc + '</enableEmcc>') +
	(!jsonDATA.mlpppassword ? '' : '<mlppPassword>' + jsonDATA.mlpppassword + '</mlppPassword>') +
	(!jsonDATA.homecluster ? '' : '<homeCluster>'+jsonDATA.homecluster+'</homeCluster>') +
	(!jsonDATA.enableuserforunifiedcmimandpresence ? '' : '<imAndPresenceEnable>' + jsonDATA.enableuserforunifiedcmimandpresence + '</imAndPresenceEnable>') +
	(!jsonDATA.ucserviceprofile ? '' : '<serviceProfile>' + jsonDATA.ucserviceprofile + '</serviceProfile>') +
	(!jsonDATA.directoryuri ? '' : '<directoryUri>' + jsonDATA.directoryuri + '</directoryUri>') +
	(!jsonDATA.telephonenumber ? '' : '<telephoneNumber>' + jsonDATA.telephonenumber  + '</telephoneNumber>') +
	(!jsonDATA.title ? '' : '<title>' + jsonDATA.title + '</title>') +
	(!jsonDATA.mobilenumber ? '' : '<mobileNumber>' + jsonDATA.mobilenumber + '</mobileNumber>') +
	(!jsonDATA.homenumber ? '' : '<homeNumber>' + jsonDATA.homenumber + '</homeNumber>') +
	(!jsonDATA.pagernumber ? '' : '<pagerNumber>' + jsonDATA.pagernumber + '</pagerNumber>') +
	(!jsonDATA.userprofile ? '' : '<userProfile>' + jsonDATA.userprofile  + '</userProfile>'))
	//LDAP
	//(!jsonDATA.userid ? '' : '<ldapDirectoryName>' + jsonDATA.userid + '</ldapDirectoryName>') +
	// 12.X
	//(!jsonDATA.enableusertohostconferencenow ? '' : '<enableUserToHostConferenceNow>false</enableUserToHostConferenceNow>') +
	//(!jsonDATA.attendeesaccesscode ? '' : '<attendeesAccessCode>' +  + '</attendeesAccessCode>') +
	
	// <calendarPresence>false</calendarPresence>
	// Include meeting information in presence(Requires Exchange Presence Gateway to be configured on CUCM IM and Presence server)
	
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addUser'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.updateUser = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:updateUser>%s</ns:updateUser></soapenv:Body></soapenv:Envelope>'

	var XML_BODY = (!jsonDATA.userid ? '' : '<userid>' + jsonDATA.userid + '</userid>' +
	(!jsonDATA.firstname ? '' : '<firstName>' + jsonDATA.firstname + '</firstName>') +
	(!jsonDATA.displayname ? '' : '<displayName>' + jsonDATA.displayname + '</displayName>') +
	(!jsonDATA.middlename ? '' : '<middleName>' + jsonDATA.middlename + '</middleName>') +
	(!jsonDATA.lastname ? '' : '<lastName>' + jsonDATA.lastname + '</lastName>') +
	(!jsonDATA.password ? '' : '<password>' + jsonDATA.password  + '</password>') +
	(!jsonDATA.pin ? '' : '<pin>' + jsonDATA.pin + '</pin>') +
	(!jsonDATA.mailid ? '' : '<mailid>' + jsonDATA.mailid  + '</mailid>') +
	(!jsonDATA.department ? '' : '<department>' + jsonDATA.department + '</department>') +
	(!jsonDATA.manageruserid ? '' : '<manager>' + jsonDATA.manageruserid + '</manager>') +
	(!jsonDATA.userlocale ? '' : '<userLocale>' + jsonDATA.userlocale  + '</userLocale>') +
	(!jsonDATA.controlleddevice1 ? '' : '<associatedDevices>') +
	(!jsonDATA.controlleddevice1 ? '' : '<device>' + jsonDATA.controlleddevice1 + '</device>') +
	(!jsonDATA.controlleddevice1 ? '' : '</associatedDevices>') +
	(!jsonDATA.primaryextension ? '' : '<primaryExtension>') +
	(!jsonDATA.primaryextension ? '' : '<pattern>' + jsonDATA.primaryextension.split(" ")[0] + '</pattern>') +
	(!jsonDATA.primaryextension ? '' : '<routePartitionName>' + jsonDATA.primaryextension.split(" ")[2] + '</routePartitionName>') +
	(!jsonDATA.primaryextension ? '' : '</primaryExtension>') +
	(!jsonDATA.associatedpc ? '' : '<associatedPc>' + jsonDATA.associatedpc + '</associatedPc>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<associatedGroups>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<userGroup>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '<name>' + jsonDATA.accesscontrolgroup1 + '</name>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '</userGroup>') +
	(!jsonDATA.accesscontrolgroup1 ? '' : '</associatedGroups>') +	
	(!jsonDATA.controlledprofile1 ? '' : '<associatedRemoteDestinationProfiles>') +
	(!jsonDATA.controlledprofile1 ? '' : '<remoteDestinationProfile>' + jsonDATA.controlledprofile1 + '</remoteDestinationProfile>') +
	(!jsonDATA.controlledprofile1 ? '' : '</associatedRemoteDestinationProfiles>') +
	(!jsonDATA.allowcontrolofdevicefromcti ? '' : '<enableCti>' + jsonDATA.allowcontrolofdevicefromcti + '</enableCti>') +
	(!jsonDATA.digestcredentials ? '' : '<digestCredentials>' + jsonDATA.digestcredentials + '</digestCredentials>') +
	(!jsonDATA.defaultprofile ? '' : '<phoneProfiles><profileName>' + jsonDATA.defaultprofile + '</profileName></phoneProfiles>') +
	(!jsonDATA.defaultprofile ? '' : '<defaultProfile>' + jsonDATA.defaultprofile + '</defaultProfile>') +
	(!jsonDATA.presencegroup ? '' : '<presenceGroupName>' + jsonDATA.presencegroup + '</presenceGroupName>') +
	(!jsonDATA.subscribecallingsearchspace ? '' : '<subscribeCallingSearchSpaceName>' + jsonDATA.subscribecallingsearchspace + '</subscribeCallingSearchSpaceName>') +
	(!jsonDATA.enablemobility ? '' : '<enableMobility>'+jsonDATA.enablemobility+'</enableMobility>') +
	(!jsonDATA.enablemobilevoiceaccess ? '' : '<enableMobileVoiceAccess>'+jsonDATA.enablemobilevoiceaccess+'</enableMobileVoiceAccess>') +
	(!jsonDATA.maximumwaittimefordeskpickup ? '' : '<maxDeskPickupWaitTime>' + jsonDATA.maximumwaittimefordeskpickup + '</maxDeskPickupWaitTime>') +
	(!jsonDATA.remotedestinationlimit ? '' : '<remoteDestinationLimit>'+jsonDATA.remotedestinationlimit+'</remoteDestinationLimit>') +
	'<passwordCredentials>' +
	(!jsonDATA.passwordauthenticationrule ? '' : '<pwdCredPolicyName>' + jsonDATA.passwordauthenticationrule + '</pwdCredPolicyName>') +
	(!jsonDATA.passwordcantchange ? '' : '<pwdCredUserCantChange>' + jsonDATA.passwordcantchange + '</pwdCredUserCantChange>') +
	(!jsonDATA.passwordmustchangeatnextlogin ? '' : '<pwdCredUserMustChange>' + jsonDATA.passwordmustchangeatnextlogin + '</pwdCredUserMustChange>') +
	(!jsonDATA.passworddoesnotexpire ? '' : '<pwdCredDoesNotExpire>' + jsonDATA.passworddoesnotexpire + '</pwdCredDoesNotExpire>') +
	(!jsonDATA.passwordlockedbyadmin ? '' : '<pwdCredLockedByAdministrator>' + jsonDATA.passwordlockedbyadmin + '</pwdCredLockedByAdministrator>') +
	'</passwordCredentials>' +
	'<pinCredentials>' +
	(!jsonDATA.pinauthenticationrule ? '' : '<pinCredPolicyName>' + jsonDATA.pinauthenticationrule + '</pinCredPolicyName>') +
	(!jsonDATA.pincantchange ? '' : '<pinCredUserCantChange>' + jsonDATA.pincantchange + '</pinCredUserCantChange>') +
	(!jsonDATA.pinmustchangeatnextlogin ? '' : '<pinCredUserMustChange>' + jsonDATA.pinmustchangeatnextlogin + '</pinCredUserMustChange>') +
	(!jsonDATA.pindoesnotexpire ? '' : '<pinCredDoesNotExpire>' + jsonDATA.pindoesnotexpire + '</pinCredDoesNotExpire>') +
	(!jsonDATA.pinlockedbyadmin ? '' : '<pinCredLockedByAdministrator>' + jsonDATA.pinlockedbyadmin + '</pinCredLockedByAdministrator>') +
	'</pinCredentials>' +
	(!jsonDATA.enableemcc ? '' : '<enableEmcc>' + jsonDATA.enableemcc + '</enableEmcc>') +
	(!jsonDATA.mlpppassword ? '' : '<mlppPassword>' + jsonDATA.mlpppassword + '</mlppPassword>') +
	(!jsonDATA.homecluster ? '' : '<homeCluster>'+jsonDATA.homecluster+'</homeCluster>') +
	(!jsonDATA.enableuserforunifiedcmimandpresence ? '' : '<imAndPresenceEnable>' + jsonDATA.enableuserforunifiedcmimandpresence + '</imAndPresenceEnable>') +
	(!jsonDATA.ucserviceprofile ? '' : '<serviceProfile>' + jsonDATA.ucserviceprofile + '</serviceProfile>') +
	(!jsonDATA.directoryuri ? '' : '<directoryUri>' + jsonDATA.directoryuri + '</directoryUri>') +
	(!jsonDATA.telephonenumber ? '' : '<telephoneNumber>' + jsonDATA.telephonenumber  + '</telephoneNumber>') +
	(!jsonDATA.title ? '' : '<title>' + jsonDATA.title + '</title>') +
	(!jsonDATA.mobilenumber ? '' : '<mobileNumber>' + jsonDATA.mobilenumber + '</mobileNumber>') +
	(!jsonDATA.homenumber ? '' : '<homeNumber>' + jsonDATA.homenumber + '</homeNumber>') +
	(!jsonDATA.pagernumber ? '' : '<pagerNumber>' + jsonDATA.pagernumber + '</pagerNumber>') +
	(!jsonDATA.userprofile ? '' : '<userProfile>' + jsonDATA.userprofile  + '</userProfile>'))
	//LDAP
	//(!jsonDATA.userid ? '' : '<ldapDirectoryName>' + jsonDATA.userid + '</ldapDirectoryName>') +
	// 12.X
	//(!jsonDATA.enableusertohostconferencenow ? '' : '<enableUserToHostConferenceNow>false</enableUserToHostConferenceNow>') +
	//(!jsonDATA.attendeesaccesscode ? '' : '<attendeesAccessCode>' +  + '</attendeesAccessCode>') +
	
	// <calendarPresence>false</calendarPresence>
	// Include meeting information in presence(Requires Exchange Presence Gateway to be configured on CUCM IM and Presence server)
	
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' updateUser'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addDeviceProfile = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addDeviceProfile><deviceProfile>%s</deviceProfile></ns:addDeviceProfile></soapenv:Body></soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.deviceprofilename ? '' : '<name>' + jsonDATA.deviceprofilename + '</name>' +
	(!jsonDATA.description ? '' : '<description>' + jsonDATA.description + '</description>') +
	(!jsonDATA.devicetype ? '' : '<product>' + jsonDATA.devicetype + '</product>') +
	'<class>Device Profile</class>' +
	(!jsonDATA.deviceprotocol ? '' : '<protocol>' + jsonDATA.deviceprotocol + '</protocol>') +
	'<protocolSide>User</protocolSide>' +
	'<userHoldMohAudioSourceId>' + jsonDATA.userholdmohaudiosource + '</userHoldMohAudioSourceId>' +
	(!jsonDATA.xml ? '' : '<vendorConfig>' + jsonDATA.xml + '</vendorConfig>') +
	(!jsonDATA.mlppdomain ? '' : '<mlppDomainId>' + jsonDATA.mlppdomain + '</mlppDomainId>') +
	(!jsonDATA.mlppindication ? '' : '<mlppIndicationStatus>' + jsonDATA.mlppindication + '</mlppIndicationStatus>') + 	
	(!jsonDATA.mlpppreemption ? '' : '<preemption>' + jsonDATA.mlpppreemption + '</preemption>') + 
	'<phoneTemplateName>'+jsonDATA.phonebuttontemplate+'</phoneTemplateName>' +
	'<userLocale>'+jsonDATA.deviceuserlocale+'</userLocale>' +
	'<loginUserId>'+jsonDATA.loginuserid+'</loginUserId>' + 
	(!jsonDATA.ignorepresentationindicators ? '' : '<ignorePresentationIndicators>'+jsonDATA.ignorepresentationindicators+'</ignorePresentationIndicators>') +
	(!jsonDATA.dndoption ? '' : '<dndOption>'+jsonDATA.dndoption+'</dndOption>') +
	'<dndRingSetting>'+jsonDATA.dndincomingcallalert+'</dndRingSetting>' +
	(!jsonDATA.donotdisturb ? '' : '<dndStatus>'+jsonDATA.donotdisturb+'</dndStatus>') +
	(!jsonDATA.alwaysuseprimeline ? '' : '<alwaysUsePrimeLine>'+jsonDATA.alwaysuseprimeline+'</alwaysUsePrimeLine>') +
	(!jsonDATA.alwaysuseprimelineforvoicemessage ? '' : '<alwaysUsePrimeLineForVoiceMessage>'+jsonDATA.alwaysuseprimelineforvoicemessage+'</alwaysUsePrimeLineForVoiceMessage>') +
	'<softkeyTemplateName>'+jsonDATA.softkeytemplate+'</softkeyTemplateName>' +
	(!jsonDATA.privacy ? '' : '<callInfoPrivacyStatus>'+jsonDATA.privacy+'</callInfoPrivacyStatus>') +
	'<featureControlPolicy>'+jsonDATA.featurecontrolpolicy+'</featureControlPolicy>')
	
	var XML_SPEEDDIAL_ENVELOPE = '<speeddials>%s</speeddials>';
	var XML_SPEEDDIAL_BODY = '';
		
	for (i = 1; i <= supportedSpeedDials; i++) {
		XML_SPEEDDIAL_BODY += (!jsonDATA['speeddialnumber' + i] && !jsonDATA['speeddiallabel' + i] ? '' : '<speeddial>' +
				'<dirn>'+jsonDATA['speeddialnumber' + i]+'</dirn>' +
				'<label>'+jsonDATA['speeddiallabel' + i]+'</label>' +
				'<index>'+i+'</index>' +
				'</speeddial>')
	}
		
	var XML_SPEEDDIAL = util.format(XML_SPEEDDIAL_ENVELOPE, XML_SPEEDDIAL_BODY);
		
	var XML_LINES_ENVELOPE = '<lines>%s</lines>';
	var XML_LINES_BODY = '';
		
	for (i = 1; i <= supportedLines; i++) {
		XML_LINES_BODY += (!jsonDATA['directorynumber' + i] ? '' : '<line ctiid="?">' +
			'<index>'+i+'</index>' +
			'<label>'+jsonDATA['linetextlabel' + i]+'</label>' +
			'<display>'+jsonDATA['display' + i]+'</display>' +
			'<dirn ctiid="?">' +
				'<pattern>'+jsonDATA['directorynumber' + i]+'</pattern>' +
				(!jsonDATA['routepartition' + i] ? '' : '<routePartitionName uuid="?">'+jsonDATA['routepartition' + i]+'</routePartitionName>') +
			'</dirn>' +
			'<ringSetting>'+jsonDATA['ringsettingphoneidle' + i]+'</ringSetting>' +
			'<consecutiveRingSetting>'+jsonDATA['ringsettingphoneactive' + i]+'</consecutiveRingSetting>' +
			'<ringSettingIdlePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneidle' + i]+'</ringSettingIdlePickupAlert>' +
			'<ringSettingActivePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneactive' + i]+'</ringSettingActivePickupAlert>' +
			'<displayAscii>'+jsonDATA['asciidisplay' + i]+'</displayAscii>' +
			'<e164Mask>'+jsonDATA['externalphonenumbermask' + i]+'</e164Mask>' +
			'<mwlPolicy>'+jsonDATA['visualmessagewaitingindicatorpolicy' + i]+'</mwlPolicy>' +
			'<maxNumCalls>'+jsonDATA['maximumnumberofcalls' + i]+'</maxNumCalls>' +
			'<busyTrigger>'+jsonDATA['busytrigger' + i]+'</busyTrigger>' +
			'<callInfoDisplay>' +
				'<callerName>'+jsonDATA['callername' + i]+'</callerName>' +
				'<callerNumber>'+jsonDATA['callernumber' + i]+'</callerNumber>' +
				'<redirectedNumber>'+jsonDATA['redirectednumber' + i]+'</redirectedNumber>' +
				'<dialedNumber>'+jsonDATA['dialednumber' + i]+'</dialedNumber>' +
			'</callInfoDisplay>' +
			'<recordingProfileName>'+jsonDATA['recordingprofile' + i]+'</recordingProfileName>' +
			'<monitoringCssName>'+jsonDATA['monitoringcallingsearchspace' + i]+'</monitoringCssName>' +
			'<recordingFlag>'+jsonDATA['recordingoption' + i]+'</recordingFlag>' +
			'<audibleMwi>'+jsonDATA['audiblemessagewaitingindicatorpolicy' + i]+'</audibleMwi>' +
			'<speedDial></speedDial>' +
			'<partitionUsage>General</partitionUsage>' +
			'<associatedEndusers></associatedEndusers>' +
			(!jsonDATA['logmissedcalls' + i] ? '' : '<missedCallLogging>'+jsonDATA['logmissedcalls' + i]+'</missedCallLogging>') +
			'<recordingMediaSource>'+jsonDATA['recordingmediasource' + i]+'</recordingMediaSource>' +
			'</line>')
	}
		
	var XML_LINES = util.format(XML_LINES_ENVELOPE, XML_LINES_BODY);
		
	XML_BODY += XML_LINES + XML_SPEEDDIAL
	
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addDeviceProfile'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addRDP = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addRemoteDestinationProfile><remoteDestinationProfile>%s</remoteDestinationProfile></ns:addRemoteDestinationProfile></soapenv:Body></soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.remotedestinationprofilename ? '' : '<name>' + jsonDATA.remotedestinationprofilename + '</name>' +
	(!jsonDATA.description ? '' : '<description>' + jsonDATA.description + '</description>') +
	'<product>Remote Destination Profile</product>' +
	'<model>Remote Destination Profile</model>' +
	'<class>Remote Destination Profile</class>' +
	'<protocol>Remote Destination</protocol>' +
	'<protocolSide>User</protocolSide>' +
	'<callingSearchSpaceName>' + jsonDATA.css + '</callingSearchSpaceName>' +
	'<devicePoolName>' + jsonDATA.devicepool + '</devicePoolName>' +
	'<networkHoldMohAudioSourceId>' + jsonDATA.networkholdmohaudiosource+ '</networkHoldMohAudioSourceId>' +
	'<userHoldMohAudioSourceId>' + jsonDATA.userholdmohaudiosource + '</userHoldMohAudioSourceId>' +
	(!jsonDATA.privacy ? '' : '<callInfoPrivacyStatus>'+jsonDATA.privacy+'</callInfoPrivacyStatus>') + 
	(!jsonDATA.mobilityuserid ? '' : '<userId>' + jsonDATA.mobilityuserid + '</userId>') +
	(!jsonDATA.ignorepresentationindicators ? '' : '<ignorePresentationIndicators>'+jsonDATA.ignorepresentationindicators+'</ignorePresentationIndicators>') +
	'<rerouteCallingSearchSpaceName>'+jsonDATA.reroutingcallingsearchspace+'</rerouteCallingSearchSpaceName>' +
	'<cgpnTransformationCssName>'+jsonDATA.calleridcallingpartytransformationcss+'</cgpnTransformationCssName>' +
	'<automatedAlternateRoutingCssName>' + jsonDATA.aarcss + '</automatedAlternateRoutingCssName>' +
	'<userLocale>'+jsonDATA.deviceuserlocale+'</userLocale>' +
	'<networkLocale>'+jsonDATA.networklocale+'</networkLocale>' +
	(!jsonDATA.dndoption ? '' : '<dndOption>'+jsonDATA.dndoption+'</dndOption>') +
	(!jsonDATA.donotdisturb ? '' : '<dndStatus>'+jsonDATA.donotdisturb+'</dndStatus>'))
		
	var XML_LINES_ENVELOPE = '<lines>%s</lines>';
	var XML_LINES_BODY = '';
		
	for (i = 1; i <= supportedLines; i++) {
		XML_LINES_BODY += (!jsonDATA['directorynumber' + i] ? '' : '<line ctiid="?">' +
			'<index>'+i+'</index>' +
			'<label>'+jsonDATA['linetextlabel' + i]+'</label>' +
			'<display>'+jsonDATA['display' + i]+'</display>' +
			'<dirn ctiid="?">' +
				'<pattern>'+jsonDATA['directorynumber' + i]+'</pattern>' +
				(!jsonDATA['routepartition' + i] ? '' : '<routePartitionName uuid="?">'+jsonDATA['routepartition' + i]+'</routePartitionName>') +
			'</dirn>' +
			'<ringSetting>'+jsonDATA['ringsettingphoneidle' + i]+'</ringSetting>' +
			'<consecutiveRingSetting>'+jsonDATA['ringsettingphoneactive' + i]+'</consecutiveRingSetting>' +
			'<ringSettingIdlePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneidle' + i]+'</ringSettingIdlePickupAlert>' +
			'<ringSettingActivePickupAlert>'+jsonDATA['cpgaudioalertsettingphoneactive' + i]+'</ringSettingActivePickupAlert>' +
			'<displayAscii>'+jsonDATA['asciidisplay' + i]+'</displayAscii>' +
			'<e164Mask>'+jsonDATA['externalphonenumbermask' + i]+'</e164Mask>' +
			'<mwlPolicy>'+jsonDATA['visualmessagewaitingindicatorpolicy' + i]+'</mwlPolicy>' +
			'<maxNumCalls>'+jsonDATA['maximumnumberofcalls' + i]+'</maxNumCalls>' +
			'<busyTrigger>'+jsonDATA['busytrigger' + i]+'</busyTrigger>' +
			'<callInfoDisplay>' +
				'<callerName>'+jsonDATA['callername' + i]+'</callerName>' +
				'<callerNumber>'+jsonDATA['callernumber' + i]+'</callerNumber>' +
				'<redirectedNumber>'+jsonDATA['redirectednumber' + i]+'</redirectedNumber>' +
				'<dialedNumber>'+jsonDATA['dialednumber' + i]+'</dialedNumber>' +
			'</callInfoDisplay>' +
			'<recordingProfileName>'+jsonDATA['recordingprofile' + i]+'</recordingProfileName>' +
			'<monitoringCssName>'+jsonDATA['monitoringcallingsearchspace' + i]+'</monitoringCssName>' +
			'<recordingFlag>'+jsonDATA['recordingoption' + i]+'</recordingFlag>' +
			'<audibleMwi>'+jsonDATA['audiblemessagewaitingindicatorpolicy' + i]+'</audibleMwi>' +
			'<speedDial></speedDial>' +
			'<partitionUsage>General</partitionUsage>' +
			'<associatedEndusers></associatedEndusers>' +
			(!jsonDATA['logmissedcalls' + i] ? '' : '<missedCallLogging>'+jsonDATA['logmissedcalls' + i]+'</missedCallLogging>') +
			'<recordingMediaSource>'+jsonDATA['recordingmediasource' + i]+'</recordingMediaSource>' +
			'</line>')
	}
		
	var XML_LINES = util.format(XML_LINES_ENVELOPE, XML_LINES_BODY);
		
	XML_BODY += XML_LINES

	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addRemoteDestinationProfile'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);

};

CucmSQLSession.prototype.addRDI = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addRemoteDestination><remoteDestination>%s</remoteDestination></ns:addRemoteDestination></soapenv:Body></soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.name ? '' : '<name>' + jsonDATA.name + '</name>' +
		(!jsonDATA.destination1 ? '' : '<destination>' + jsonDATA.destination1 + '</destination>') +
		(!jsonDATA.answertoosoontimer1 ? '' : '<answerTooSoonTimer>' + jsonDATA.answertoosoontimer1 + '</answerTooSoonTimer>') +
		(!jsonDATA.answertoolatetimer1 ? '' : '<answerTooLateTimer>' + jsonDATA.answertoolatetimer1 + '</answerTooLateTimer>') +
		(!jsonDATA.delaybeforeringingtimer1 ? '' : '<delayBeforeRingingCell>' + jsonDATA.delaybeforeringingtimer1 + '</delayBeforeRingingCell>') +
		'<ownerUserId>'+ jsonDATA.owneruserid +'</ownerUserId>' + 
		'<enableUnifiedMobility>true</enableUnifiedMobility>' +
		(!jsonDATA.remotedestinationprofile ? '' : '<remoteDestinationProfileName>' + jsonDATA.remotedestinationprofile + '</remoteDestinationProfileName>') +
		'<enableExtendAndConnect>false</enableExtendAndConnect>' +
		(!jsonDATA.ctiremotedevice ? '' : '<ctiRemoteDeviceName>' + jsonDATA.ctiremotedevice + '</ctiRemoteDeviceName>') +
		(!jsonDATA.dualmodedevice ? '' : '<dualModeDeviceName>' + jsonDATA.dualmodedevice + '</dualModeDeviceName>') +
		(!jsonDATA.ismobilephone ? '' : '<isMobilePhone>' + jsonDATA.ismobilephone + '</isMobilePhone>') +
		(!jsonDATA.enablemobileconnect1 ? '' : '<enableMobileConnect>' + jsonDATA.enablemobileconnect1 + '</enableMobileConnect>') +
		(!jsonDATA.timezone ? '' : '<timeZone>' + jsonDATA.timezone + '</timeZone>') +
		(!jsonDATA.mobilesmartclient ? '' : '<mobileSmartClientName>' + jsonDATA.mobilesmartclient + '</mobileSmartClientName>') +
		(!jsonDATA.mobilityprofile ? '' : '<mobilityProfileName>' + jsonDATA.mobilityprofile + '</mobilityProfileName>') +
		(!jsonDATA.singlenumberreachvoicemailpolicy ? '' : '<singleNumberReachVoicemail>' + jsonDATA.singlenumberreachvoicemailpolicy + '</singleNumberReachVoicemail>') +
		(!jsonDATA.dialviaofficereversevoicemailpolicy ? '' : '<dialViaOfficeReverseVoicemail>' + jsonDATA.dialviaofficereversevoicemailpolicy + '</dialViaOfficeReverseVoicemail>'))
		
		
	var XML_LINES_ENVELOPE = '<lineAssociations>%s</lineAssociations>';
	var XML_LINES_BODY = '';
		
	for (i = 1; i <= supportedLines; i++) {
		XML_LINES_BODY += (!jsonDATA['associatedlinenumber' + i] ? '' : '<lineAssociation>' +
			'<pattern>' + jsonDATA['associatedlinenumber' + i] + '</pattern>' +
			(!jsonDATA['routepartition' + i] ? '' : '<routePartitionName>'+jsonDATA['routepartition' + i]+'</routePartitionName>') +
			'</lineAssociation>')
	}
		
	var XML_LINES = util.format(XML_LINES_ENVELOPE, XML_LINES_BODY);
		
	XML_BODY += XML_LINES
			
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addRemoteDestination'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);
};


CucmSQLSession.prototype.addAdvertisedPattern = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addAdvertisedPatterns><advertisedPatterns>%s</advertisedPatterns></ns:addAdvertisedPatterns></soapenv:Body></soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.advertisedpattern ? '' : '<pattern>' + jsonDATA.advertisedpattern + '</pattern>' +
		(!jsonDATA.advertiseddescription ? '' : '<description>' + jsonDATA.advertiseddescription + '</description>') +
		(!jsonDATA.patterntype ? '' : '<patternType>' + jsonDATA.patterntype + '</patternType>') +
		(!jsonDATA.hostedroutepstnrule ? '' : '<hostedRoutePSTNRule>' + jsonDATA.hostedroutepstnrule + '</hostedRoutePSTNRule>') +
		(!jsonDATA.pstnfailstrip ? '' : '<pstnFailStrip>' + jsonDATA.pstnfailstrip + '</pstnFailStrip>') +
		(!jsonDATA.pstnfailprepend ? '' : '<pstnFailPrepend>' + jsonDATA.pstnfailprepend + '</pstnFailPrepend>'))
			
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addAdvertisedPatterns'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);
};

CucmSQLSession.prototype.addFacInfo = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '"><soapenv:Header/><soapenv:Body><ns:addFacInfo><facInfo>%s</facInfo></ns:addFacInfo></soapenv:Body></soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.authorizationcodename ? '' : '<name>' + jsonDATA.authorizationcodename + '</name>' +
		(!jsonDATA.authorizationcode ? '' : '<code>' + jsonDATA.authorizationcode + '</code>') +
		(!jsonDATA.authorizationlevel ? '' : '<authorizationLevel>' + jsonDATA.authorizationlevel + '</authorizationLevel>'))
			
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addFacInfo'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);
};

CucmSQLSession.prototype.addSipTrunk = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '">\
		<soapenv:Header/>\
		<soapenv:Body>\
			<ns:addSipTrunk>\
				<sipTrunk>%s</sipTrunk>\
			</ns:addSipTrunk>\
		</soapenv:Body>\
		</soapenv:Envelope>'
	
	var XML_BODY = (!jsonDATA.devicename ? '' : '<name>' + jsonDATA.devicename + '</name>' +
		(!jsonDATA.description ? '' : '<description>' + jsonDATA.description + '</description>') +
		(!jsonDATA.trunktype ? '' : '<product>' + jsonDATA.trunktype + '</product>') +
		(!jsonDATA.trunktype ? '' : '<model>' + jsonDATA.trunktype + '</model>') +
		'<class>Trunk</class>' +
		(!jsonDATA.deviceprotocol ? '' : '<protocol>' + jsonDATA.deviceprotocol + '</protocol>') +
		'<protocolSide>Network</protocolSide>' +
		(!jsonDATA.callingsearchspacename ? '' : '<callingSearchSpaceName>' + jsonDATA.callingsearchspacename + '</callingSearchSpaceName>') +
		(!jsonDATA.devicepool ? '' : '<devicePoolName>' + jsonDATA.devicepool + '</devicePoolName>') +
		(!jsonDATA.commondeviceconfig ? '' : '<commonDeviceConfigName>' + jsonDATA.commondeviceconfig + '</commonDeviceConfigName>') +
		(!jsonDATA.location ? '' : '<locationName>' + jsonDATA.location + '</locationName>') +
		(!jsonDATA.mediaresourcelist ? '' : '<mediaResourceListName>' + jsonDATA.mediaresourcelist + '</mediaResourceListName>') +
		(!jsonDATA.automatedalternateroutingcss ? '' : '<automatedAlternateRoutingCssName>' + jsonDATA.automatedalternateroutingcss + '</automatedAlternateRoutingCssName>') +
		(!jsonDATA.aargroup ? '' : '<aarNeighborhoodName>' + jsonDATA.aargroup + '</aarNeighborhoodName>') +
		(!jsonDATA.packetcapturemode ? '' : '<packetCaptureMode>' + jsonDATA.packetcapturemode + '</packetCaptureMode>') +
		(!jsonDATA.packetcaptureduration ? '' : '<packetCaptureDuration>' + jsonDATA.packetcaptureduration + '</packetCaptureDuration>') +
		'<traceFlag>false</traceFlag>' +
		(!jsonDATA.mlppdomainid ? '' : '<mlppDomainId>' + jsonDATA.mlppdomainid + '</mlppDomainId>') +
		(!jsonDATA.mlppindication ? '' : '<mlppIndicationStatus>' + jsonDATA.mlppindication + '</mlppIndicationStatus>') +
		(!jsonDATA.mlpppreemption ? '' : '<preemption>' + jsonDATA.mlpppreemption + '</preemption>') +
		(!jsonDATA.usetrustedrelaypoint ? '' : '<useTrustedRelayPoint>' + jsonDATA.usetrustedrelaypoint + '</useTrustedRelayPoint>') +
		(!jsonDATA.retryvideocallasaudio ? '' : '<retryVideoCallAsAudio>' + jsonDATA.retryvideocallasaudio + '</retryVideoCallAsAudio>') +
		(!jsonDATA.siptrunksecurityprofile ? '' : '<securityProfileName>' + jsonDATA.siptrunksecurityprofile + '</securityProfileName>') +
		(!jsonDATA.sipprofile ? '' : '<sipProfileName>' + jsonDATA.sipprofile + '</sipProfileName>') +
		(!jsonDATA.usedevicepoolcallingpartytransformationcss ? '' : '<useDevicePoolCgpnTransformCss>' + jsonDATA.usedevicepoolcallingpartytransformationcss + '</useDevicePoolCgpnTransformCss>') +
		(!jsonDATA.geolocation ? '' : '<geoLocationName>' + jsonDATA.geolocation + '</geoLocationName>') +
		(!jsonDATA.geolocationfilter ? '' : '<geoLocationFilterName>' + jsonDATA.geolocationfilter + '</geoLocationFilterName>') +
		(!jsonDATA.sendgeolocationinformation ? '' : '<sendGeoLocation>' + jsonDATA.sendgeolocationinformation + '</sendGeoLocation>') +
		(!jsonDATA.usedevicepoolcalledpartytransformationcss ? '' : '<useDevicePoolCdpnTransformCss>' + jsonDATA.usedevicepoolcalledpartytransformationcss + '</useDevicePoolCdpnTransformCss>') +
		(!jsonDATA.unattendedport ? '' : '<unattendedPort>' + jsonDATA.unattendedport + '</unattendedPort>') +
		(!jsonDATA.transmitutf8forcallingpartyname ? '' : '<transmitUtf8>' + jsonDATA.transmitutf8forcallingpartyname + '</transmitUtf8>') +
		(!jsonDATA.subscribecallingsearchspace ? '' : '<subscribeCallingSearchSpaceName>' + jsonDATA.subscribecallingsearchspace + '</subscribeCallingSearchSpaceName>') +
		(!jsonDATA.reroutingcallingsearchspace ? '' : '<rerouteCallingSearchSpaceName>' + jsonDATA.reroutingcallingsearchspace + '</rerouteCallingSearchSpaceName>') +
		(!jsonDATA.outofdialogrefercallingsearchspace ? '' : '<referCallingSearchSpaceName>' + jsonDATA.outofdialogrefercallingsearchspace + '</referCallingSearchSpaceName>') +
		(!jsonDATA.mediaterminationpointrequired ? '' : '<mtpRequired>' + jsonDATA.mediaterminationpointrequired + '</mtpRequired>') +
		(!jsonDATA.presencegroup ? '' : '<presenceGroupName>' + jsonDATA.presencegroup + '</presenceGroupName>') +
		(!jsonDATA.incomingcallingpartyunknownnumberprefix ? '' : '<unknownPrefix>' + jsonDATA.incomingcallingpartyunknownnumberprefix + '</unknownPrefix>') +
//		(!jsonDATA.destaddrissrv ? '' : '<destAddrIsSrv>' + jsonDATA.destaddrissrv + '</destAddrIsSrv>') +
		(!jsonDATA.mtppreferredoriginatingcodec ? '' : '<tkSipCodec>' + jsonDATA.mtppreferredoriginatingcodec + '</tkSipCodec>') +
		(!jsonDATA.significantdigitssipdevice ? '' : '<sigDigits>' + jsonDATA.significantdigitssipdevice + '</sigDigits>') +
		(!jsonDATA.connectednamepresentation ? '' : '<connectedNamePresentation>' + jsonDATA.connectednamepresentation + '</connectedNamePresentation>') +
		(!jsonDATA.connectedlineidpresentation ? '' : '<connectedPartyIdPresentation>' + jsonDATA.connectedlineidpresentation + '</connectedPartyIdPresentation>') +
		(!jsonDATA.callingpartyselectionsipdevice ? '' : '<callingPartySelection>' + jsonDATA.callingpartyselectionsipdevice + '</callingPartySelection>') +
		(!jsonDATA.callingnamepresentation ? '' : '<callingname>' + jsonDATA.callingnamepresentation + '</callingname>') +
		(!jsonDATA.callinglineidpresentationsipdevice ? '' : '<callingLineIdPresentation>' + jsonDATA.callinglineidpresentationsipdevice + '</callingLineIdPresentation>') +
		(!jsonDATA.prefixdnsipdevice ? '' : '<prefixDn>' + jsonDATA.prefixdnsipdevice + '</prefixDn>') +
		(!jsonDATA.callername ? '' : '<callerName>' + jsonDATA.callername + '</callerName>') +
		(!jsonDATA.calleriddnsipdevice ? '' : '<callerIdDn>' + jsonDATA.calleriddnsipdevice + '</callerIdDn>') +
		(!jsonDATA.redirectingdiversionheaderdeliveryinbound ? '' : '<acceptInboundRdnis>' + jsonDATA.redirectingdiversionheaderdeliveryinbound + '</acceptInboundRdnis>') +
		(!jsonDATA.redirectingdiversionheaderdeliveryoutbound ? '' : '<acceptOutboundRdnis>' + jsonDATA.redirectingdiversionheaderdeliveryoutbound + '</acceptOutboundRdnis>') +
		(!jsonDATA.srtpallowed ? '' : '<srtpAllowed>' + jsonDATA.srtpallowed + '</srtpAllowed>') +
		// H.323 Settings?
//		(!jsonDATA.srtpfallbackallowed ? '' : '<srtpFallbackAllowed>' + jsonDATA.srtpfallbackallowed + '</srtpFallbackAllowed>') +
		(!jsonDATA.assertedidentity ? '' : '<isPaiEnabled>' + jsonDATA.assertedidentity + '</isPaiEnabled>') +
		(!jsonDATA.sipprivacy ? '' : '<sipPrivacy>' + jsonDATA.sipprivacy + '</sipPrivacy>') +
		(!jsonDATA.remotepartyid ? '' : '<isRpidEnabled>' + jsonDATA.remotepartyid + '</isRpidEnabled>') +
		(!jsonDATA.assertedtype ? '' : '<sipAssertedType>' + jsonDATA.assertedtype + '</sipAssertedType>') +
		(!jsonDATA.trustreceivedidentity ? '' : '<trustReceivedIdentity>' + jsonDATA.trustreceivedidentity + '</trustReceivedIdentity>') +
		(!jsonDATA.dtmfsignalingmethod ? '' : '<dtmfSignalingMethod>' + jsonDATA.dtmfsignalingmethod + '</dtmfSignalingMethod>') +
		(!jsonDATA.routeclasssignalingenabled ? '' : '<routeClassSignalling>' + jsonDATA.routeclasssignalingenabled + '</routeClassSignalling>') +
		'<sipTrunkType>None(Default)</sipTrunkType>' +
		(!jsonDATA.pstnaccess ? '' : '<pstnAccess>' + jsonDATA.pstnaccess + '</pstnAccess>') +
//		(!jsonDATA.imee164transformationname ? '' : '<imeE164TransformationName>' + jsonDATA.imee164transformationname + '</imeE164TransformationName>') +
//		(!jsonDATA.useimepublicipport ? '' : '<useImePublicIpPort>' + jsonDATA.useimepublicipport + '</useImePublicIpPort>') +
		(!jsonDATA.usedevpoolcalledpartytransformationcss ? '' : '<useDevicePoolCntdPnTransformationCss>' + jsonDATA.usedevpoolcalledpartytransformationcss + '</useDevicePoolCntdPnTransformationCss>') +
		(!jsonDATA.connectedpartytransformationcss ? '' : '<cntdPnTransformationCssName>' + jsonDATA.connectedpartytransformationcss + '</cntdPnTransformationCssName>') +
		(!jsonDATA.usedevpoolcalledpartytransformcssunknown ? '' : '<useDevicePoolCgpnTransformCssUnkn>' + jsonDATA.usedevpoolcalledpartytransformcssunknown + '</useDevicePoolCgpnTransformCssUnkn>') +
		(!jsonDATA.normalizationscriptname ? '' : '<sipNormalizationScriptName>' + jsonDATA.normalizationscriptname + '</sipNormalizationScriptName>') +
		(!jsonDATA.runonallactiveunifiedcmnodes ? '' : '<runOnEveryNode>' + jsonDATA.runonallactiveunifiedcmnodes + '</runOnEveryNode>') +
		(!jsonDATA.incomingcalledpartyunknownstripdigits ? '' : '<unknownStripDigits>' + jsonDATA.incomingcalledpartyunknownstripdigits + '</unknownStripDigits>') +
		(!jsonDATA.callingpartytransformationcss ? '' : '<cgpnTransformationUnknownCssName>' + jsonDATA.callingpartytransformationcss + '</cgpnTransformationUnknownCssName>') +
		(!jsonDATA.tunneledprotocolsipdevice ? '' : '<tunneledProtocol>' + jsonDATA.tunneledprotocolsipdevice + '</tunneledProtocol>') +
		(!jsonDATA.asn1roseoidencodingsipdevice ? '' : '<asn1RoseOidEncoding>' + jsonDATA.asn1roseoidencodingsipdevice + '</asn1RoseOidEncoding>') +
		(!jsonDATA.qsigvariantsipdevice ? '' : '<qsigVariant>' + jsonDATA.qsigvariantsipdevice + '</qsigVariant>') +
		(!jsonDATA.pathreplacementsupportsipdevice ? '' : '<pathReplacementSupport>' + jsonDATA.pathreplacementsupportsipdevice + '</pathReplacementSupport>') +
		(!jsonDATA.transmitutf8namesinqsigapdusipdevice ? '' : '<enableQsigUtf8>' + jsonDATA.transmitutf8namesinqsigapdusipdevice + '</enableQsigUtf8>') +
		(!jsonDATA.normalizationscriptparameters ? '' : '<scriptParameters>' + jsonDATA.normalizationscriptparameters + '</scriptParameters>') +
		(!jsonDATA.normalizationscripttrace ? '' : '<scriptTraceEnabled>' + jsonDATA.normalizationscripttrace + '</scriptTraceEnabled>') +
		(!jsonDATA.considertrafficonthistrunksecure ? '' : '<trunkTrafficSecure>' + jsonDATA.considertrafficonthistrunksecure + '</trunkTrafficSecure>') +
		(!jsonDATA.callingandconnectedpartyinfoformat ? '' : '<callingAndCalledPartyInfoFormat>' + jsonDATA.callingandconnectedpartyinfoformat + '</callingAndCalledPartyInfoFormat>') +
		(!jsonDATA.maintainoriginalcalleriddnandcallernameinidentityheaders ? '' : '<useCallerIdCallerNameinUriOutgoingRequest>' + jsonDATA.maintainoriginalcalleriddnandcallernameinidentityheaders + '</useCallerIdCallerNameinUriOutgoingRequest>') +
		(!jsonDATA.incomingcalledpartytranscssunknownnum ? '' : '<calledPartyUnknownTransformationCssName>' + jsonDATA.incomingcalledpartytranscssunknownnum + '</calledPartyUnknownTransformationCssName>') +
		(!jsonDATA.incomingcalledpartyunknownprefix ? '' : '<calledPartyUnknownPrefix>' + jsonDATA.incomingcalledpartyunknownprefix + '</calledPartyUnknownPrefix>') +
		(!jsonDATA.incomingcalledpartyunknownstripdigits ? '' : '<calledPartyUnknownStripDigits>' + jsonDATA.incomingcalledpartyunknownstripdigits + '</calledPartyUnknownStripDigits>') +
		(!jsonDATA.usedevpoolcalledpartytransformcssunknown ? '' : '<useDevicePoolCalledCssUnkn>' + jsonDATA.usedevpoolcalledpartytransformcssunknown + '</useDevicePoolCalledCssUnkn>'))
		
		XML_BODY += '<destinations>'
		
		for (i = 1; i <= 8; i++) {
			XML_BODY += (!jsonDATA['destinationaddress' + i] ? '' : '<destination>' +
				'<addressIpv4>' + jsonDATA['destinationaddress' + i] + '</addressIpv4>' +
				'<addressIpv6>' + jsonDATA['destinationaddressipv61' + i] + '</addressIpv6>' +
				(!jsonDATA['destinationport' + i] ? '' : '<port>'+jsonDATA['destinationport' + i]+'</port>') +
				'<sortOrder>' + i + '</sortOrder>' +
				'</destination>')
		}
		
		XML_BODY += '</destinations>'
		
	// FIND undefined VALUES		
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addSipTrunk'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);
};

CucmSQLSession.prototype.addTranslationPatterns = function(jsonDATA, callback) {
	var XML_ENVELOPE = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cisco.com/AXL/API/' + this._version.version + '">\
		<soapenv:Header/>\
		<soapenv:Body>\
			<ns:addTransPattern>\
				<transPattern>%s</transPattern>\
			</ns:addTransPattern>\
		</soapenv:Body>\
		</soapenv:Envelope>'
	
	var XML_BODY = ((!jsonDATA.translationpattern ? '' : '<pattern>' + jsonDATA.translationpattern + '</pattern>') +
	(!jsonDATA.routepartition ? '' : '<routepartitionname>' + jsonDATA.routepartition + '</routepartitionname>') +
	'<usage>Translation</usage>' +
	(!jsonDATA.description ? '' : '<description>' + jsonDATA.description + '</description>') +
	(!jsonDATA.numberingplan ? '' : '<dialplanname>' + jsonDATA.numberingplan + '</dialplanname>') +
	(!jsonDATA.routefilter ? '' : '<routefiltername>' + jsonDATA.routefilter + '</routefiltername>') +
	(!jsonDATA.mlppprecedence ? '' : '<patternprecedence>' + jsonDATA.mlppprecedence + '</patternprecedence>') +
	(!jsonDATA.callingsearchspace ? '' : '<callingsearchspacename>' + jsonDATA.callingsearchspace + '</callingsearchspacename>') +
	(!jsonDATA.routeoption ? '' : '<blockenabled>' + jsonDATA.routeoption + '</blockenabled>') +
	(!jsonDATA.outsidedialtone ? '' : '<provideoutsidedialtone>' + jsonDATA.outsidedialtone + '</provideoutsidedialtone>') +
	(!jsonDATA.urgentpriority ? '' : '<patternurgency>' + jsonDATA.urgentpriority + '</patternurgency>') +
	(!jsonDATA.callingpartytransformationmask ? '' : '<callingpartytransformationmask>' + jsonDATA.callingpartytransformationmask + '</callingpartytransformationmask>') +
	(!jsonDATA.callingpartyprefixdigits(outgoingcalls) ? '' : '<callingpartyprefixdigits>' + jsonDATA.callingpartyprefixdigits(outgoingcalls) + '</callingpartyprefixdigits>') +
	(!jsonDATA.callinglineidpresentation ? '' : '<callinglinepresentationbit>' + jsonDATA.callinglineidpresentation + '</callinglinepresentationbit>') +
	(!jsonDATA.callingnamepresentation ? '' : '<callingnamepresentationbit>' + jsonDATA.callingnamepresentation + '</callingnamepresentationbit>') +
	(!jsonDATA.connectedlineidpresentation ? '' : '<connectedlinepresentationbit>' + jsonDATA.connectedlineidpresentation + '</connectedlinepresentationbit>') +
	(!jsonDATA.connectednamepresentation ? '' : '<connectednamepresentationbit>' + jsonDATA.connectednamepresentation + '</connectednamepresentationbit>') +
	(!jsonDATA.discarddigits ? '' : '<digitdiscardinstructionname>' + jsonDATA.discarddigits + '</digitdiscardinstructionname>') +
	(!jsonDATA.calledpartytransformmask ? '' : '<calledpartytransformmask>' + jsonDATA.calledpartytransformmask + '</calledpartytransformmask>') +
	(!jsonDATA.calledpartyprefixdigits(outgoingcalls) ? '' : '<prefixdigitsout>' + jsonDATA.calledpartyprefixdigits(outgoingcalls) + '</prefixdigitsout>') +
	(!jsonDATA.blockthispatternoption ? '' : '<releaseclause>' + jsonDATA.blockthispatternoption + '</releaseclause>') +
	(!jsonDATA.callingpartyienumbertype ? '' : '<callingpartynumbertype>' + jsonDATA.callingpartyienumbertype + '</callingpartynumbertype>') +
	(!jsonDATA.callingpartynumberingplan ? '' : '<callingpartynumberingplan>' + jsonDATA.callingpartynumberingplan + '</callingpartynumberingplan>') +
	(!jsonDATA.calledpartyienumbertype ? '' : '<calledpartynumbertype>' + jsonDATA.calledpartyienumbertype + '</calledpartynumbertype>') +
	(!jsonDATA.calledpartynumberingplan ? '' : '<calledpartynumberingplan>' + jsonDATA.calledpartynumberingplan + '</calledpartynumberingplan>') +
	(!jsonDATA.usecallingpartysexternalphonenumbermask ? '' : '<usecallingpartyphonemask>' + jsonDATA.usecallingpartysexternalphonenumbermask + '</usecallingpartyphonemask>') +
	(!jsonDATA.resourceprioritynamespacenetworkdomain ? '' : '<resourceprioritynamespacename>' + jsonDATA.resourceprioritynamespacenetworkdomain + '</resourceprioritynamespacename>') +
	(!jsonDATA.routeclass ? '' : '<routeclass>' + jsonDATA.routeclass + '</routeclass>') +
	(!jsonDATA.routenexthopbycallingpartynumber ? '' : '<routenexthopbycgpn>' + jsonDATA.routenexthopbycallingpartynumber + '</routenexthopbycgpn>') +
	(!jsonDATA.externalcallcontrolprofile ? '' : '<callinterceptprofilename>' + jsonDATA.externalcallcontrolprofile + '</callinterceptprofilename>') +
	(!jsonDATA.useoriginatorscallingsearchspace ? '' : '<useoriginatorcss>' + jsonDATA.useoriginatorscallingsearchspace + '</useoriginatorcss>') +
	(!jsonDATA.donotwaitforinterdigittimeoutonsubsequenthops ? '' : '<dontwaitforidtonsubsequenthops>' + jsonDATA.donotwaitforinterdigittimeoutonsubsequenthops + '</dontwaitforidtonsubsequenthops>') +
	(!jsonDATA.usecallingpartyphonemask ? '' : '<usecallingpartyphonemask>' + jsonDATA.usecallingpartyphonemask + '</usecallingpartyphonemask>'))
		
		
	// FIND undefined VALUES		
	var find = 'undefined';
	var re = new RegExp(find, 'g');
	XML_BODY = XML_BODY.replace(re, '');
	
	// Find NULL VALUES
	var findNULL = 'NULL';
	re = new RegExp(findNULL, 'g');
	XML_BODY = XML_BODY.replace(re, '');
		
	var XML = util.format(XML_ENVELOPE, XML_BODY);
	var soapBody = Buffer.from(XML);
	var output = "";
	var options = this._OPTIONS;
	options.agent = new https.Agent({ keepAlive: false });
	
	options.headers.SOAPAction += ' addTransPattern'
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			output = output + d;
			if (output.length == res.headers['content-length']) {
				parseString(output, { explicitArray: false, explicitRoot: false }, function (err, result) {
					try {
						callback(null, result['soapenv:Body']);  
					} catch(ex) {
						callback(ex)
					}
				});
			}
		});
		req.on('error', function(e) {
			callback(e);
		});
	});
	req.end(soapBody);
};

module.exports = function(cucmVersion, cucmServerUrl, cucmUser, cucmPassword) {
	return new CucmSQLSession(cucmVersion, cucmServerUrl, cucmUser, cucmPassword);
}