jQuery.sap.declare("sap.services.IOT");

sap.ui.define(["sap/services/IOT"], function() {
	"use strict";
    
    /**
     * Simplify the consumption of the API functions provided by SAP Internet of Thing service.
     *
     * @namespace
     * @name sap.services.IOT
     * @public
     */

	var _dmsUrl = "/iotrdms/",
		_mmsUrl = "/iotmms/";

	var _showError = function(msg) {
		if(sap.ui.commons && typeof sap.ui.commons.MessageBox.show === "function") {
			sap.ui.commons.MessageBox.show(msg, "ERROR", "Error");
		} else if(sap.m && sap.m.MessageBox && typeof sap.m.MessageBox.error === "function") {
			sap.m.MessageBox.error(msg);
		} else {
			alert(msg);
		}
	};
	var _handleError = function(para) {
		if(para.responseJSON && para.responseJSON.errors) {
			for(var idx in para.responseJSON.errors) {
				var err = para.responseJSON.errors[idx];
				_showError(err.description);
			}
		} else if(para.responseText) {
			_showError(para.responseText);
		} else {
			_showError("Unknown error!");
		}
	};
	var _request = function(method, url, data, callback, failCB, options) {
		var req = {
			method: method,
			url: url,
			contentType: "application/json"
		};
		if(data) {
			req.data = JSON.stringify(data);
		}
		if(options) {
			for(var n in options) {
				req[n] = options[n];
			}
		}
		$.ajax(req).done(function(res) {
			if(typeof callback === "function") {
				callback(res);
			}
		}).fail(function(err) {
			if(typeof failCB === "function") {
				failCB(err);
			} else{
				_handleError(err);
			}
			if(typeof callback === "function") {
				callback();
			}
		});
	};
	var _get = function(url, done, fail, options) {
		_request("GET", url, null, done, fail, options);
	};
	var _delete = function(url, done, fail, options) {
		_request("DELETE", url, null, done, fail, options);
	};
	var _post = function(url, data, done, fail, options) {
		_request("POST", url, data, done, fail, options);
	};
	var _put = function(url, data, done, fail, options) {
		_request("PUT", url, data, done, fail, options);
	};

    /**
     * Set the bas url for the device management and message management services
     * 
     * @param {string} dmsUrl - the base url for the device management service
     * @param {string} mmsUrl - the base url for the message management service
     * @return {undefined} [This is empty return value desc]
     * @function
     * @name sap.services.IOT.setServiceUrl
     * @public
     */
	var setServiceUrl = function(dmsUrl, mmsUrl) {
		if(dmsUrl.substr(dmsUrl.length-1) !== "/") {
			dmsUrl += "/";
		}
		if(mmsUrl.substr(mmsUrl.length-1) !== "/") {
			mmsUrl += "/";
		}
		_dmsUrl = dmsUrl;
		_mmsUrl = mmsUrl;
	};
    /**
     * Get the base url of message management service
     * 
     * @return {string} the base url for the message management service
     * @function
     * @name sap.services.IOT.getMmsUrl
     * @public
     */
	var getMmsUrl = function() {
		return _mmsUrl;
	};
    /**
     * Get the base url of device management service
     * 
     * @return {string} the base url for the device management service
     * @function
     * @name sap.services.IOT.getDmsUrl
     * @public
     */
	var getDmsUrl = function() {
		return _dmsUrl;
	};
    /**
     * Get all supported Data Types
     * 
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getDataTypes
     * @public
     */
	var getDataTypes = function(done, fail, options) {
		_get(_dmsUrl + "datatypes", done, fail, options);
	};
    /**
     * Get all Device Types
     * 
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getDeviceTypes
     * @public
     */
	var getDeviceTypes = function(done, fail, options) {
		_get(_dmsUrl + "devicetypes", done, fail, options);
	};
    /**
     * Get all Message Types
     * 
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getMessageTypes
     * @public
     */
	var getMessageTypes = function(done, fail, options) {
		_get(_dmsUrl + "messagetypes", done, fail, options);
	};
    /**
     * Get all Devices
     * 
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getDevices
     * @public
     */
	var getDevices = function(done, fail, options) {
		_get(_dmsUrl + "devices", done, fail, options);
	};
    /**
     * Delete a Device Type
     * 
     * @param {string} id - The ID of the Device Type to be deleted.
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.deleteDeviceType
     * @public
     */
	var deleteDeviceType = function(id, done, fail, options) {
		_delete(_dmsUrl + "devicetypes/" + id, done, fail, options);
	};
    /**
     * Delete a Message Type
     * 
     * @param {string} id - The ID of the Message Type to be deleted.
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.deleteMessageType
     * @public
     */
	var deleteMessageType = function(id, done, fail, options) {
		_delete(_dmsUrl + "messagetypes/" + id, done, fail, options);
	};
    /**
     * Delete a Device
     * 
     * @param {string} id - The ID of the Device to be deleted.
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.deleteDevice
     * @public
     */
	var deleteDevice = function(id, done, fail, options) {
		_delete(_dmsUrl + "devices/" + id, done, fail, options);
	};
    /**
     * Add a Device Type
     * 
     * @param {string} name - The name of the Device Type to be added.
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.addDeviceType
     * @public
     */
	var addDeviceType = function(name, done, fail, options) {
		_post(_dmsUrl + "devicetypes", {name: name}, done, fail, options);
	};
    /**
     * Add a Message Type
     * 
     * @param {object} data - A message type object to be added
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.addMessageType
     * @public
     */
	var addMessageType = function(data, done, fail, options) {
		data.fields = data.fields || [];
		for(var n=0;n<data.fields.length;n++) {
			data.fields[n].position = n+1;
		}
		_post(_dmsUrl + "messagetypes", data, done, fail, options);
	};
    /**
     * Add a Device
     * 
     * @param {string} name - The name of the Device to be added.
     * @param {string} dtype - The ID of a previously defined device type
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.addDevice
     * @public
     */
	var addDevice = function(name, dtype, done, fail, options) {
		_post(_dmsUrl + "devices", {
			name: name, device_type: dtype
		}, done, fail, options);
	};
    /**
     * to retrieve all properties for the overall Internet of Things service.
     * 
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getConfig
     * @public
     */
	var getConfig = function(done, fail, options) {
		_get(_mmsUrl + "config", done, fail, options);
	};
    /**
     * to set properties for the overall Internet of Things service.
     * 
     * @param {object} config - properties to be configured
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.setConfig
     * @public
     */
	var setConfig = function(config, done, fail, options) {
		_put(_mmsUrl + "config", config, done, fail, options);
	};
    /**
     * to customize database table mapping for messages
     * 
     * @param {string} dtype - The ID of a specific device type
     * @param {string} messageType - Refers to the ID of a message type
     * @param {object} properties - config properties
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.mapTable
     * @public
     */
	var mapTable = function(dtype, messageType, properties, done, fail, options) {
		var config = {
		  "deviceType": dtype,
		  "messageType": messageType,
		  "processingServices": [
		    {
		      "name": "sql",
		      "properties": properties
		    }
		  ]
		};
		_put(_mmsUrl + "processing", config, done, fail, options);
	};
    /**
     * Receiving messages that have been pushed to a specific device.
     * 
     * @param {string} device - ID for the specified device.
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.getData
     * @public
     */
	var getData = function(device,done, fail, options) {
		_get(_mmsUrl + "data/" + device, done, fail, options);
	};
    /**
     * Sending data to an endpoint.
     * 
     * @param {string} device - ID for the specified device.
     * @param {string} mode - An optional field to control the data sending mode: sync, async, async-ack
     * @param {string} messageType - Refers to the ID of the message type
     * @param {object} messages - message object to be sent
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.postData
     * @public
     */
	var postData = function(device, mode, messageType, messages, done, fail, options) {
		_post(_mmsUrl + "data/" + device, {
			mode: mode,
			messageType: messageType,
			messages: messages
		}, done, fail, options);
	};
    /**
     * Pushing messages to devices
     * 
     * @param {string} device - ID for the specified device.
     * @param {string} method - Specify the push method you want to use, either 'http' or 'ws'.
     * @param {string} sender - Sender name
     * @param {string} messageType - Refers to the ID of the message type
     * @param {object} messages - message object to be sent
     * @param {function} done - call back function to be called when the request finishes
     * @param {function} fail - Optional callback function for error handling
     * @param {object} options - Optional properties for the request
     * @function
     * @name sap.services.IOT.pushData
     * @public
     */
	var pushData = function(device, method, sender, messageType, messages, done, fail, options) {
		//var sUrl = "https://iotmmsp651606trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/push/1ac8a403-d4ec-4279-a31e-985127275d8b";
		_post(_mmsUrl + "push/" + device, {
		//_post(sUrl, {
			method: method,
			messageType: messageType,
			sender: sender,
			messages: messages
		}, done, fail, options);
	};
	var oauth = function(id, password, scope, done, fail) {
		///*
		var req = {
			method: "POST",
			url: "/oauth/token",
			contentType: "application/x-www-form-urlencoded",
			headers: {
				'Authorization': "Basic " + btoa(id + ":" + password)
			},
			data: {
				'grant_type': 'client_credentials',
				'scope': scope
			}
		};
		$.ajax(req).done(function(res) {
			done(res);
		}).fail(function(err) {
			if(typeof fail === "function") {
				fail(err);
			} else{
				_handleError(err);
			}
		});
	};
	if(location.protocol !== "https:") {
		setServiceUrl(
			"https://iotrdmsx36737db5-p651606trial.hanatrial.ondemand.com/com.sap.iotservices.dms/v2/api/",
			"https://iotmmsp651606trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http");
	}

	sap.services.IOT = {
		setServiceUrl: setServiceUrl,
		getMmsUrl: getMmsUrl,
		getDmsUrl: getDmsUrl,
		// RDMS api
		getDataTypes: getDataTypes,
		getDeviceTypes: getDeviceTypes,
		getMessageTypes: getMessageTypes,
		getDevices: getDevices,
		deleteDeviceType: deleteDeviceType,
		deleteMessageType: deleteMessageType,
		deleteDevice: deleteDevice,
		addDeviceType: addDeviceType,
		addMessageType: addMessageType,
		addDevice: addDevice,
		// MMS api
		getConfig: getConfig,
		setConfig: setConfig,
		mapTable: mapTable,
		getData: getData,
		postData: postData,
		pushData: pushData,
		//OAuth api
		oauth: oauth
	};

	
	
	return sap.services.IOT;
});