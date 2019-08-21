
function service(request, response)
{
	'use strict';
	try 
	{
		require('SafeAid.bb1.Mi365Alerts.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SafeAid.bb1.Mi365Alerts.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}